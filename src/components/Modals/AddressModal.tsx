import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type StateApiObj = {
  name: string;
  state_code: string;
};
type CountryApiObj = {
  name: string;
  iso3: string;
  iso2: string;
  states: StateApiObj[];
};

interface AddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (addressForm: {
    houseNo: string;
    flatNo: string;
    streetName: string;
    landmark: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
  }) => void;
}

const SearchableDropdown = ({ value, onChange, options, placeholder, disabled, loading }: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  disabled?: boolean;
  loading?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-10 font-normal"
          disabled={disabled || loading}
        >
          <span className="truncate">
            {loading ? "Loading..." : value || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      {/* 
        This is a trick to make popover content the same width as the trigger 
        by wrapping it internally but shadcn sets width via css var sometimes. 
        We use w-full and a little inline style trick if needed. 
      */}
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt}
                  value={opt}
                  onSelect={(currentValue) => {
                    const originalOpt = options.find(o => o.toLowerCase() === currentValue) || opt;
                    onChange(originalOpt);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === opt ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {opt}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export const AddressModal = ({ open, onOpenChange, onSave }: AddressModalProps) => {
  const [addressForm, setAddressForm] = useState({
    houseNo: "",
    flatNo: "",
    streetName: "",
    landmark: "",
    city: "",
    state: "",
    country: "",
    zipcode: ""
  });
  const [errorText, setErrorText] = useState("");

  const [countriesData, setCountriesData] = useState<CountryApiObj[]>([]);
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/states")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error && data.data) {
          setCountriesData(data.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const countryOptions = countriesData.map((c) => c.name).sort();
  const selectedCountryObj = countriesData.find((c) => c.name === addressForm.country);
  const stateOptions = selectedCountryObj ? selectedCountryObj.states.map((s) => s.name).sort() : [];

  // Reset state and city when country changes
  useEffect(() => {
    setAddressForm(prev => ({ ...prev, state: "", city: "" }));
  }, [addressForm.country]);

  // Reset city when state changes, and fetch new cities
  useEffect(() => {
    setAddressForm(prev => ({ ...prev, city: "" }));
    
    if (addressForm.country && addressForm.state) {
      setIsLoadingCities(true);
      fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: addressForm.country, state: addressForm.state }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (!data.error && data.data) {
            setCityOptions(data.data);
          } else {
            setCityOptions([]);
          }
        })
        .catch(() => setCityOptions([]))
        .finally(() => setIsLoadingCities(false));
    } else {
      setCityOptions([]);
    }
  }, [addressForm.state, addressForm.country]);

  // Reset form when modal closes/opens
  useEffect(() => {
    if (open) {
      setErrorText("");
    }
  }, [open]);

  const handleSave = () => {
    const { houseNo, streetName, city, state, country, zipcode } = addressForm;
    if (!houseNo.trim() || !streetName.trim() || !city.trim() || !state.trim() || !country.trim() || !zipcode.trim()) {
      setErrorText("Please fill in the compulsory fields");
      return;
    }
    setErrorText("");
    onSave(addressForm);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Shipping Address</DialogTitle>
          <DialogDescription>
            Enter the details of your shipping address below.
          </DialogDescription>
        </DialogHeader>

        {errorText && (
          <div className="bg-destructive/10 text-destructive text-sm font-medium py-2 px-3 rounded-md">
            {errorText}
          </div>
        )}

        <div className="grid gap-5 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">House No. *</label>
              <Input
                placeholder="E.g., 12B"
                value={addressForm.houseNo}
                onChange={(e) => setAddressForm({ ...addressForm, houseNo: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Flat No. (Optional)</label>
              <Input
                placeholder="E.g., Apt 4"
                value={addressForm.flatNo}
                onChange={(e) => setAddressForm({ ...addressForm, flatNo: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Street Name *</label>
            <Input
              placeholder="Enter Street Name"
              value={addressForm.streetName}
              onChange={(e) => setAddressForm({ ...addressForm, streetName: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Landmark (Optional)</label>
            <Input
              placeholder="Nearby famous spot"
              value={addressForm.landmark}
              onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Country *</label>
              <SearchableDropdown
                value={addressForm.country}
                onChange={(v) => setAddressForm({ ...addressForm, country: v })}
                options={countryOptions}
                placeholder="Select Country"
                disabled={countryOptions.length === 0}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">State *</label>
              <SearchableDropdown
                value={addressForm.state}
                onChange={(v) => setAddressForm({ ...addressForm, state: v })}
                options={stateOptions}
                placeholder="Select State"
                disabled={!addressForm.country || stateOptions.length === 0}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">City *</label>
              <SearchableDropdown
                value={addressForm.city}
                onChange={(v) => setAddressForm({ ...addressForm, city: v })}
                options={cityOptions}
                placeholder="Select City"
                disabled={!addressForm.state || cityOptions.length === 0}
                loading={isLoadingCities}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Zipcode *</label>
              <Input
                placeholder="Postal Code"
                value={addressForm.zipcode}
                onChange={(e) => setAddressForm({ ...addressForm, zipcode: e.target.value })}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Address</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
