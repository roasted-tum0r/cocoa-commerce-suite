import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthModal } from "@/context/AuthModalContext";
import { useState } from "react";
import { ArrowLeft, User, Mail, Phone, Lock } from "lucide-react";
import { appDispatch } from "@/redux/store";
import { registerUser } from "@/redux/thunks/auththunk";

export const Registration = () => {
  const { setStep, setIsLoading, setError } = useAuthModal();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setIsLoading(false);
      setError("Passwords do not match");
      return;
    }

    const nameParts = formData.fullName.split(" ");
    const firstname = nameParts[0];
    const lastname = nameParts.slice(1).join(" ") || "";

    try {
      await appDispatch(registerUser({
        registrationPurpose: "CUSTOMER",
        firstname,
        lastname,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "CUSTOMER"
      })).unwrap();

      setIsLoading(false);
      setStep('OtpVerification');
    } catch (err: any) {
      setIsLoading(false);
      setError(typeof err === 'string' ? err : err.message || "Registration failed");
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-4"
          onClick={() => setStep('LoginOrRegister')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="text-center w-full space-y-2">
          <h3 className="text-2xl font-bold text-primary">Create Account</h3>
          <p className="text-muted-foreground">Join our community of chocolate lovers</p>
        </div>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="pl-10"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10"
                placeholder="m@example.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className="pl-10"
                placeholder="+1 234..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="pl-10"
            />
          </div>
        </div>

        <Button type="submit" className="w-full mt-2">
          Create Account
        </Button>
      </form>
    </div>
  );
};
