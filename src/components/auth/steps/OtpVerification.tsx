import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthModal } from "@/context/AuthModalContext";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { appDispatch } from "@/redux/store";
import { verifyOtp } from "@/redux/thunks/auththunk";
import { useAppSelector } from "@/redux/hooks";

export const OtpVerification = () => {
  const { setStep, setIsLoading, setError } = useAuthModal();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);

  const { hashKey, identifier } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setIsLoading(false);
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    if (!hashKey || !identifier) {
      setIsLoading(false);
      setError("Session expired. Please try again.");
      return;
    }

    try {
      await appDispatch(verifyOtp({
        loginType: "EMAIL", // Assuming EMAIL for now, could check identifier format
        identifier: identifier,
        OTP: otpValue,
        hash_key: hashKey
      })).unwrap();

      setIsLoading(false);
      setStep('Success');
    } catch (err: any) {
      setIsLoading(false);
      setError(typeof err === 'string' ? err : err.message || "Verification failed");
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-4"
          onClick={() => setStep('Registration')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="text-center w-full space-y-2">
          <h3 className="text-2xl font-bold text-primary">Verify OTP</h3>
          <p className="text-muted-foreground">Enter the code sent to {identifier}</p>
          {hashKey && (
            <p className="text-xs text-muted-foreground mt-1">
              Security Key: <span className="font-mono font-medium text-foreground">{hashKey}</span>
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleVerify} className="space-y-8">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <Input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={1}
              value={digit}
              autoFocus={index === 0}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-10 h-12 text-center text-lg font-bold"
            />
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Didn't receive code?
          </p>
          <Button
            variant="link"
            disabled={timer > 0}
            className="text-primary p-0 h-auto"
            onClick={() => setTimer(30)}
          >
            {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
          </Button>
        </div>

        <Button type="submit" className="w-full">
          Verify & Continue
        </Button>
      </form>
    </div>
  );
};
