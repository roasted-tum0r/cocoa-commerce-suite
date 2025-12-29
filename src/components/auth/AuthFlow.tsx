import { useAuthModal } from "@/context/AuthModalContext";
import { LoginOrRegister } from "./steps/LoginOrRegister";
import { Registration } from "./steps/Registration";
import { OtpVerification } from "./steps/OtpVerification";
import { Success } from "./steps/Success";
import { Loader2 } from "lucide-react";

export const AuthFlow = () => {
    const { currentStep, isLoading, error } = useAuthModal();

    const renderStep = () => {
        switch (currentStep) {
            case 'LoginOrRegister':
                return <LoginOrRegister />;
            case 'Registration':
                return <Registration />;
            case 'OtpVerification':
                return <OtpVerification />;
            case 'Success':
                return <Success />;
            default:
                return <LoginOrRegister />;
        }
    };

    // Calculate progress
    let progress = 0;
    switch (currentStep) {
        case 'LoginOrRegister':
        case 'Registration':
            progress = 50;
            break;
        case 'OtpVerification':
            progress = 75;
            break;
        case 'Success':
            progress = 100;
            break;
        default:
            progress = 50;
    }

    return (
        <>
            {/* Progress Bar */}
            <div className="h-1 w-full bg-muted">
                <div
                    className="h-full bg-primary transition-all duration-500 ease-in-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="p-6 relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
                        {error}
                    </div>
                )}

                {renderStep()}
            </div>
        </>
    );
};
