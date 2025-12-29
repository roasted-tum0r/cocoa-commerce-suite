import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/context/AuthModalContext";
import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Success = () => {
  const { closeAuthModal } = useAuthModal();
  const navigate = useNavigate();

  const handleSuccess = () => {
    closeAuthModal();
    navigate("/");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSuccess();
    }, 2000);
    return () => clearTimeout(timer);
  }, [closeAuthModal, navigate]);

  return (
    <div className="space-y-6 py-8 text-center">
      <div className="flex justify-center">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center animate-in zoom-in duration-300">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-primary">Success!</h3>
        <p className="text-muted-foreground">You have successfully logged in.</p>
      </div>

      <Button onClick={handleSuccess} className="w-full mt-4">
        Continue Shopping
      </Button>
    </div>
  );
};
