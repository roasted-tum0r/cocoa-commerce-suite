import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie, Settings } from "lucide-react";

export const CookieModal = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookiePreference = localStorage.getItem("cookiePreference");
    if (!cookiePreference) {
      // Show modal after a brief delay
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookiePreference", "all");
    setShowModal(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem("cookiePreference", "essential");
    setShowModal(false);
  };

  const handleCustomize = () => {
    localStorage.setItem("cookiePreference", "custom");
    setShowModal(false);
    // Here you could open a detailed cookie settings modal
  };

  if (!showModal) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <Card className="border-2 border-primary shadow-floating">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Cookie className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Cookie Preferences</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We use cookies to enhance your browsing experience and provide personalized content. 
                Choose your preferences below.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={handleAcceptAll}
                >
                  Accept All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={handleCustomize}
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Customize
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1"
                  onClick={handleRejectAll}
                >
                  Reject All
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};