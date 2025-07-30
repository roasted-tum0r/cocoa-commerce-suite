import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Layout/Navbar";
import { Sidebar } from "@/components/Layout/Sidebar";
import { Footer } from "@/components/Layout/Footer";
import { ProductCard } from "@/components/Product/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

// Mock search results data
const searchResults = [
  {
    id: "1",
    name: "Fresh Organic Apples",
    price: 4.99,
    image: "/src/assets/product-headphones.jpg",
    rating: 4.5,
    reviewCount: 124,
    category: "Fresh Fruits"
  },
  {
    id: "2",
    name: "Premium Almonds",
    price: 12.99,
    image: "/src/assets/product-watch.jpg",
    rating: 4.8,
    reviewCount: 89,
    category: "Dry Fruits"
  },
  {
    id: "3",
    name: "Organic Bananas",
    price: 2.99,
    image: "/src/assets/product-mug.jpg",
    rating: 4.3,
    reviewCount: 156,
    category: "Fresh Fruits"
  },
  {
    id: "4",
    name: "Mixed Nuts",
    price: 8.99,
    image: "/src/assets/product-headphones.jpg",
    rating: 4.6,
    reviewCount: 67,
    category: "Dry Fruits"
  },
  {
    id: "5",
    name: "Fresh Strawberries",
    price: 6.99,
    image: "/src/assets/product-watch.jpg",
    rating: 4.7,
    reviewCount: 203,
    category: "Fresh Fruits"
  },
  {
    id: "6",
    name: "Cashew Nuts",
    price: 15.99,
    image: "/src/assets/product-mug.jpg",
    rating: 4.9,
    reviewCount: 45,
    category: "Dry Fruits"
  }
];

const categories = ["All", "Fresh Fruits", "Dry Fruits", "Vegetables", "Grains"];

export const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filteredResults, setFilteredResults] = useState(searchResults);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [minRating, setMinRating] = useState(0);
  
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    let filtered = searchResults;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filter by rating
    filtered = filtered.filter(product => product.rating >= minRating);

    setFilteredResults(filtered);
  }, [searchQuery, selectedCategory, priceRange, minRating]);

  const clearFilters = () => {
    setSelectedCategory("All");
    setPriceRange([0, 50]);
    setMinRating(0);
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="hidden lg:block w-80">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Filters</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-muted-foreground"
                  >
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Filter */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Category</Label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "ghost"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Rating Filter */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Minimum Rating: {minRating} stars
                  </Label>
                  <Slider
                    value={[minRating]}
                    onValueChange={(value) => setMinRating(value[0])}
                    max={5}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {searchQuery ? `Search results for "${searchQuery}"` : 'All Products'}
              </h1>
              <p className="text-muted-foreground">
                {filteredResults.length} products found
              </p>
              
              {/* Active Filters */}
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedCategory !== "All" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {selectedCategory}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setSelectedCategory("All")}
                    />
                  </Badge>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 50) && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    ${priceRange[0]} - ${priceRange[1]}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setPriceRange([0, 50])}
                    />
                  </Badge>
                )}
                {minRating > 0 && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {minRating}+ stars
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setMinRating(0)}
                    />
                  </Badge>
                )}
              </div>
            </div>

            {/* Products Grid */}
            {filteredResults.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};