import { X, Filter, Heart, Clock, Settings, HelpCircle, Star, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const categories = [
    { name: "Fresh Fruits", count: 45 },
    { name: "Organic Vegetables", count: 32 },
    { name: "Dry Fruits & Nuts", count: 28 },
    { name: "Dairy Products", count: 18 },
    { name: "Bakery Items", count: 15 },
  ];

  const priceRange = [0, 1000];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - always hidden, only opens via burger menu */}
      <div
        className={`fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-80 bg-background border-r transform transition-transform duration-300 ease-smooth ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Quick Actions */}
            <div>
              <h3 className="font-medium mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/wishlist">
                    <Heart className="mr-2 h-4 w-4" />
                    Favorites
                    <Badge variant="secondary" className="ml-auto">3</Badge>
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Clock className="mr-2 h-4 w-4" />
                  Order History
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/account">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help & Support
                </Button>
              </div>
            </div>

            <Separator />

            {/* Filters */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-4 w-4" />
                <h3 className="font-medium">Filters</h3>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3">Categories</h4>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category.name} className="flex items-center space-x-2">
                      <Checkbox id={category.name} />
                      <Label
                        htmlFor={category.name}
                        className="flex-1 text-sm cursor-pointer"
                      >
                        {category.name}
                      </Label>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Price Range
                </h4>
                <div className="space-y-3">
                  <Slider
                    defaultValue={[0, 500]}
                    max={1000}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>$0</span>
                    <span>$1000</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Rating
                </h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center space-x-2">
                      <Checkbox id={`rating-${rating}`} />
                      <Label
                        htmlFor={`rating-${rating}`}
                        className="flex items-center gap-1 text-sm cursor-pointer"
                      >
                        <div className="flex">
                          {Array.from({ length: rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-3 w-3 fill-rating text-rating"
                            />
                          ))}
                          {Array.from({ length: 5 - rating }).map((_, i) => (
                            <Star
                              key={i + rating}
                              className="h-3 w-3 text-muted-foreground"
                            />
                          ))}
                        </div>
                        & up
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <Button className="w-full" variant="outline">
              Clear All Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};