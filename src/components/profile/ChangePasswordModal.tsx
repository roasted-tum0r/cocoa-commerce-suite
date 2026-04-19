import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldAlert, KeyRound, CheckCircle2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch } from "@/redux/hooks";
import { requestPasswordOtp, updatePassword } from "@/redux/thunks/auththunk";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal = ({
  isOpen,
  onClose,
}: ChangePasswordModalProps) => {
  const [step, setStep] = useState<"NEW_PASSWORD" | "OTP" | "SUCCESS">("NEW_PASSWORD");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [hashKey, setHashKey] = useState("");
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const dispatch = useAppDispatch();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep("NEW_PASSWORD");
      setNewPassword("");
      setConfirmPassword("");
      setOtp("");
      setHashKey("");
      setTimer(0);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleRequestOtp = async () => {
    if (!newPassword || newPassword.length < 8) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your new passwords match.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const res = await dispatch(requestPasswordOtp()).unwrap();
      if (res?.hash_key) {
        setHashKey(res.hash_key);
        setStep("OTP");
        setTimer(30);
        toast({
          title: "OTP Sent",
          description: "Please check your email/phone for the verification code.",
        });
      } else {
         // fallback if hash key isn't returned for some reason
        setStep("OTP");
        setTimer(30);
      }
    } catch (error: any) {
      toast({
        title: "Failed to request OTP",
        description: error?.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!otp || otp.length < 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await dispatch(
        updatePassword({
          OTP: otp,
          hash_key: hashKey,
          newPassword,
        })
      ).unwrap();

      setStep("SUCCESS");
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error?.message || "Invalid or expired OTP.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {step === "NEW_PASSWORD" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-primary" />
                Change Password
              </DialogTitle>
              <DialogDescription>
                Enter your new password below. You'll need to verify this change with
                an OTP.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleRequestOtp} disabled={isLoading}>
                {isLoading ? "Please wait..." : "Continue"}
              </Button>
            </div>
          </>
        )}

        {step === "OTP" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-primary" />
                Verify It's You
              </DialogTitle>
              <DialogDescription>
                We've sent a 6-digit code to your registered contact method. Enter it
                below to confirm your password change.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center justify-center space-y-6 py-6 border-b border-t my-4">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                disabled={isLoading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              <div className="text-sm text-center">
                <p className="text-muted-foreground mb-1">Didn't receive code?</p>
                <Button
                  variant="link"
                  disabled={timer > 0 || isLoading}
                  className="text-primary p-0 h-auto"
                  onClick={handleRequestOtp}
                >
                  {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center w-full">
              <Button
                variant="ghost"
                onClick={() => setStep("NEW_PASSWORD")}
                disabled={isLoading}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading || otp.length < 6}>
                {isLoading ? "Verifying..." : "Verify & Submit"}
              </Button>
            </div>
          </>
        )}

        {step === "SUCCESS" && (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Password Updated!
            </h3>
            <p className="text-muted-foreground max-w-[250px] mb-6">
              Your account password has been changed successfully. You can now use your new password next time you login.
            </p>
            <Button onClick={onClose} className="w-full max-w-[200px]">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
