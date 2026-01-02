import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, User, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { subscribeNewsletter, unsubscribeNewsletter } from "@/redux/thunks/newsletterthunk";
import { clearNewsletterMessage } from "@/redux/reducers/newsletterreducer";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SubscriptionModal = ({ open, onOpenChange }: SubscriptionModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { loading, error, subscribed, message } = useSelector((state: RootState) => state.newsletter);

  // Autofill when user is logged in
  useEffect(() => {
    if (user) {
      setName(user.name || `${user.firstname} ${user.lastname}` || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // Handle success/error messages
  useEffect(() => {
    if (message) {
      toast({
        title: "Success",
        description: message,
      });
      dispatch(clearNewsletterMessage());
    }
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      dispatch(clearNewsletterMessage());
    }
  }, [message, error, toast, dispatch]);

  const handleSubscribe = async () => {
    if (!name || !email) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      email,
      name,
      phone: user?.phone || "0000000000", // Default phone if not provided, as API curl had phone
      source: "POPUP", // Changed source to indicate modal
      tags: ["general"]
    };

    await dispatch(subscribeNewsletter(payload));
  };

  const handleUnsubscribe = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Email is required to unsubscribe",
        variant: "destructive",
      });
      return;
    }
    await dispatch(unsubscribeNewsletter(email));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{subscribed ? "Manage Subscription" : "Join Our Community"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-center text-muted-foreground">
            {subscribed
              ? "You are currently subscribed to our newsletter."
              : "Get exclusive access to new arrivals, special offers, and member-only discounts."}
          </p>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  disabled={loading || (!!user && !!user.name)} // Disable if loading or autofilled from user
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={loading || (!!user && !!user.email)} // Disable if loading or autofilled
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Close
            </Button>
            {subscribed ? (
              <Button
                className="flex-1"
                onClick={handleUnsubscribe}
                disabled={loading}
                variant="destructive"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Unsubscribe
              </Button>
            ) : (
              <Button
                className="flex-1"
                onClick={handleSubscribe}
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Subscribe
              </Button>
            )}

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};