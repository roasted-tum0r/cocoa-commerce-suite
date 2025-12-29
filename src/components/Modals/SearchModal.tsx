import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

interface SearchModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const dummySuggestions = [
    "Dark Chocolate",
    "Truffles",
    "Gift Box",
    "Vegan Chocolate",
    "Hot Cocoa",
];

export const SearchModal = ({ open, onOpenChange }: SearchModalProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            onOpenChange(false);
            setSearchQuery("");
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setSearchQuery(suggestion);
        navigate(`/search?q=${encodeURIComponent(suggestion)}`);
        onOpenChange(false);
        setSearchQuery("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl p-6">
                <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                        autoFocus
                        placeholder="Search for chocolates, gifts, and more..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-12 text-lg bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all rounded-lg"
                    />
                </form>

                <div className="mt-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                        Popular Searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {dummySuggestions.map((suggestion) => (
                            <Badge
                                key={suggestion}
                                variant="secondary"
                                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors py-1 px-3"
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                {suggestion}
                            </Badge>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
