import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthModal } from "@/context/AuthModalContext";
import { useState, useRef } from "react";
import { ArrowLeft, User, Mail, Phone, Lock, Camera } from "lucide-react";
import { appDispatch } from "@/redux/store";
import { registerUser } from "@/redux/thunks/auththunk";
import { uploadMedia } from "@/redux/thunks/productthunk";
import { ImageCropperModal } from "@/components/ui/image-cropper";

export const Registration = () => {
  const { setStep, setIsLoading, setError } = useAuthModal();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [croppedAvatarFile, setCroppedAvatarFile] = useState<File | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result?.toString() || "");
        setIsCropperOpen(true);
      });
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropComplete = (croppedFile: File) => {
    setCroppedAvatarFile(croppedFile);
    setIsCropperOpen(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setIsLoading(false);
      setError("Passwords do not match");
      return;
    }

    const nameParts = formData.fullName.split(" ");
    const firstname = nameParts[0];
    const lastname = nameParts.slice(1).join(" ") || "";

    try {
      let uploadedImage = undefined;
      
      if (croppedAvatarFile) {
        const uploadResult = await appDispatch(
          uploadMedia({ files: [croppedAvatarFile], ownerType: "USER" })
        ).unwrap();
        
        if (uploadResult && uploadResult.length > 0) {
           uploadedImage = {
             publicId: uploadResult[0].publicId,
             url: uploadResult[0].url
           };
        }
      }

      await appDispatch(registerUser({
        registrationPurpose: "CUSTOMER",
        firstname,
        lastname,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "CUSTOMER",
        image: uploadedImage
      })).unwrap();

      setIsLoading(false);
      setStep('OtpVerification');
    } catch (err: any) {
      setIsLoading(false);
      setError(typeof err === 'string' ? err : err.message || "Registration failed");
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-4"
          onClick={() => setStep('LoginOrRegister')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="text-center w-full space-y-2">
          <h3 className="text-2xl font-bold text-primary">Create Account</h3>
          <p className="text-muted-foreground">Join our community of chocolate lovers</p>
        </div>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Avatar Upload */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <div 
              className="h-24 w-24 rounded-full border-2 border-primary/20 overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {croppedAvatarFile ? (
                <img 
                  src={URL.createObjectURL(croppedAvatarFile)} 
                  alt="Avatar" 
                  className="h-full w-full object-cover" 
                />
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-muted/80 transition-colors">
                  <Camera className="h-8 w-8" />
                </div>
              )}
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="pl-10"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10"
                placeholder="m@example.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className="pl-10"
                placeholder="+1 234..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="pl-10"
            />
          </div>
        </div>

        <Button type="submit" className="w-full mt-2">
          Create Account
        </Button>
      </form>
      
      <ImageCropperModal
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        imageSrc={imageSrc}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
};
