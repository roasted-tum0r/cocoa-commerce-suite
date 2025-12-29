import { Card } from "@/components/ui/card";
import { AuthFlow } from "@/components/auth/AuthFlow";

const Login = () => {
  return (
    <div className="min-h-screen w-full flex">
      {/* Left Side - Hero Image/Gradient */}
      <div className="hidden lg:flex w-1/2 bg-gradient-hero relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1481391319762-47dff72954d9?q=80&w=2831&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10 text-primary-foreground max-w-lg text-center p-12">
          <h1 className="text-5xl font-bold mb-6 tracking-tight">Cocoa Commerce</h1>
          <p className="text-xl opacity-90 leading-relaxed">
            Experience the finest artisanal chocolates, crafted with passion and precision. Join our community of chocolate connoisseurs.
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background relative">
        {/* Mobile background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 lg:hidden pointer-events-none"></div>

        <Card className="w-full max-w-md border-none shadow-floating bg-card/50 backdrop-blur-sm overflow-hidden">
          <AuthFlow />
        </Card>
      </div>
    </div>
  );
};

export default Login;
