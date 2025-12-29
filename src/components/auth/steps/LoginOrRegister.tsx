import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthModal } from "@/context/AuthModalContext";
import { useState } from "react";
import { ArrowRight, Mail, Lock, Github } from "lucide-react";
import { appDispatch } from "@/redux/store";
import { loginUser } from "@/redux/thunks/auththunk";

export const LoginOrRegister = () => {
  const { setStep, setIsLoading, setError } = useAuthModal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await appDispatch(loginUser({
        loginType: "EMAIL",
        identifier: email,
        password: password
      }));

      setIsLoading(false);
      setStep('OtpVerification');
    } catch (err: any) {
      setIsLoading(false);
      setError(typeof err === 'string' ? err : err.message || "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulate Google Login
    setTimeout(() => {
      setIsLoading(false);
      setStep('Success');
    }, 1500);
  };

  const handleGithubLogin = () => {
    setIsLoading(true);
    // Simulate GitHub Login
    setTimeout(() => {
      setIsLoading(false);
      setStep('Success');
    }, 1500);
  };

  return (
    <div className="space-y-6 py-4">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-primary">Welcome Back</h3>
        <p className="text-muted-foreground">Enter your credentials to access your account</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email or Phone</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Button variant="link" className="p-0 h-auto font-normal text-xs">
              Forgot password?
            </Button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          Sign In <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" onClick={handleGoogleLogin} className="w-full">
          <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
          </svg>
          Google
        </Button>
        <Button variant="outline" onClick={handleGithubLogin} className="w-full">
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>
      </div>

      <div className="text-center text-sm">
        Don't have an account?{" "}
        <Button
          variant="link"
          className="p-0 h-auto font-semibold text-primary"
          onClick={() => setStep('Registration')}
        >
          Sign up
        </Button>
      </div>
    </div>
  );
};
