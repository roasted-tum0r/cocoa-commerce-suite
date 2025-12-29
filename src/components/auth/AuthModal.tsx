import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuthModal } from "@/context/AuthModalContext";
import { AuthFlow } from "./AuthFlow";

export const AuthModal = () => {
  const { isOpen, closeAuthModal } = useAuthModal();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="sm:max-w-[450px] p-0 gap-0 overflow-hidden border-none shadow-xl outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none">
        <AuthFlow />
      </DialogContent>
    </Dialog>
  );
};
