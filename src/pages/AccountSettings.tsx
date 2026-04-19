import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Layout/Navbar";
import { Sidebar } from "@/components/Layout/Sidebar";
import { Footer } from "@/components/Layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, MapPin, Shield, Calendar, Crown, CheckCircle, Home, Star, Camera, Eye } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchUserDetails, updateAuthUser } from "@/redux/thunks/auththunk";
import { uploadMedia } from "@/redux/thunks/productthunk";
import { ImageViewer } from "@/components/ui/image-viewer";
import { ImageCropperModal } from "@/components/ui/image-cropper";
import { Button } from "@/components/ui/button";
import { ChangePasswordModal } from "@/components/profile/ChangePasswordModal";

export const AccountSettings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useAppDispatch();
  const userdetails = useAppSelector((state) => state.auth.userDetails);
  const isLoading = useAppSelector((state) => state.auth.loading);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUserDetails())
      .unwrap()
      .catch((error: any) => {
        toast({
          title: "Failed to load profile",
          description: error?.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      });
  }, [dispatch, toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
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

  const handleCropComplete = async (croppedFile: File) => {
    try {
      setIsCropperOpen(false);
      setIsUploading(true);

      const resultAction = await dispatch(
        uploadMedia({ files: [croppedFile], ownerType: "USER" })
      );
      if (uploadMedia.fulfilled.match(resultAction)) {
        const uploadedImages = resultAction.payload;
        if (uploadedImages && uploadedImages.length > 0) {
          const newImage = uploadedImages[0];

          const patchPayload = {
            deletedImagePublicId: userdetails.images?.[0]?.publicId,
            image: { publicId: newImage.public_id, url: newImage.url }
          };

          await dispatch(
            updateAuthUser({ id: userdetails.id, payload: patchPayload })
          ).unwrap();

          toast({
            title: "Profile picture updated",
            description: "Your new avatar has been saved successfully.",
          });
        }
      } else {
        throw new Error("Failed to upload image.");
      }
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      dispatch(fetchUserDetails());
    }
  };

  const handleAvatarClick = () => {
    if (userdetails?.images && userdetails.images.length > 0) {
      setIsViewerOpen(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 bg-gradient-to-br from-background via-background/95 to-muted/30">
          <div className="container mx-auto px-4 py-8 lg:px-8 max-w-6xl">
            {/* Header Area */}
            <div className="mb-10 space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                Account Settings
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Manage your personal information, contact details, and saved addresses.
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-8">
                  <Skeleton className="h-[400px] w-full rounded-2xl" />
                </div>
                <div className="lg:col-span-2 space-y-8">
                  <Skeleton className="h-[200px] w-full rounded-2xl" />
                  <Skeleton className="h-[300px] w-full rounded-2xl" />
                </div>
              </div>
            ) : userdetails ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Essential Profile */}
                <div className="lg:col-span-1 space-y-8">
                  <Card className="border-border/50 shadow-lg shadow-black/5 overflow-hidden rounded-2xl relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50"></div>
                    <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
                      <div className="relative mb-6 group transition-transform duration-300">
                        <div
                          className={`relative h-32 w-32 rounded-full cursor-pointer overflow-hidden border-4 border-background shadow-xl ${isUploading ? 'opacity-50' : 'hover:opacity-90'}`}
                          onClick={handleAvatarClick}
                        >
                          <Avatar className="h-full w-full">
                            <AvatarImage src={userdetails.images?.[0]?.imageUrl || ""} alt="Profile" className="object-cover" />
                            <AvatarFallback className="text-3xl bg-primary/10 text-primary font-bold">
                              {getUserInitials(userdetails.firstname, userdetails.lastname)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            {userdetails.images?.[0]?.imageUrl ? (
                              <Eye className="h-8 w-8 text-white" />
                            ) : (
                              <Camera className="h-8 w-8 text-white" />
                            )}
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute bottom-1 right-1 rounded-full h-8 w-8 p-0"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          <Camera className="h-4 w-4" />
                        </Button>

                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                        />

                        {userdetails.isVerified && (
                          <div className="absolute top-1 left-1 p-1 bg-background rounded-full shadow-sm">
                            <CheckCircle className="h-6 w-6 text-green-500 fill-green-500/10" />
                          </div>
                        )}
                      </div>

                      <h2 className="text-2xl font-bold tracking-tight mb-1">
                        {userdetails.firstname} {userdetails.lastname}
                      </h2>
                      <p className="text-muted-foreground font-medium mb-4">{userdetails.role}</p>

                      <div className="flex flex-wrap gap-2 justify-center">
                        {userdetails.isPremium && (
                          <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 text-white border-none gap-1 py-1 shadow-amber-500/20 shadow-md">
                            <Crown className="w-3 h-3" /> Premium
                          </Badge>
                        )}
                        {userdetails.isActive ? (
                          <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-500/20 py-1">
                            Active Account
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="py-1">Inactive</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column: Details & Addresses */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Contact Information */}
                  <Card className="border-border/50 shadow-md rounded-2xl hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-4 border-b border-border/50 bg-muted/20">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mb-1">
                            <Mail className="h-4 w-4" /> Email Address
                          </div>
                          <p className="text-foreground font-medium">{userdetails.email}</p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mb-1">
                            <Phone className="h-4 w-4" /> Phone Number
                          </div>
                          <p className="text-foreground font-medium">{userdetails.phone || "Not provided"}</p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mb-1">
                            <Calendar className="h-4 w-4" /> Member Since
                          </div>
                          <p className="text-foreground font-medium">{formatDate(userdetails.createdAt)}</p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mb-1">
                            <Shield className="h-4 w-4" /> Account Role
                          </div>
                          <p className="text-foreground font-medium capitalize">{String(userdetails.role).toLowerCase()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Addresses */}
                  <Card className="border-border/50 shadow-md rounded-2xl hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-4 border-b border-border/50 bg-muted/20">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Saved Addresses
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {userdetails.addresses && userdetails.addresses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {userdetails.addresses.map((address: any) => (
                            <div
                              key={address.id}
                              className={`relative p-5 rounded-xl border transition-all duration-200 hover:shadow-md ${address.isDefault
                                  ? 'border-primary/40 bg-primary/5 shadow-sm'
                                  : 'border-border/50 bg-card hover:border-primary/30'
                                }`}
                            >
                              {address.isDefault && (
                                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground shadow-sm">
                                  <Star className="w-3 h-3 mr-1 fill-current" /> Default
                                </Badge>
                              )}
                              <div className="flex items-center gap-2 mb-3">
                                <Home className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold text-foreground tracking-tight max-w-[calc(100%-70px)] truncate block">
                                  {address.receiverName}
                                </span>
                              </div>
                              <div className="space-y-1.5 text-sm text-foreground/80">
                                <p className="truncate block">{address.line1}</p>
                                {address.line2 && <p className="truncate block">{address.line2}</p>}
                                <p className="truncate block">
                                  {address.city}, {address.state} {address.postalCode}
                                </p>
                                <p className="font-medium text-muted-foreground">{address.country}</p>
                              </div>
                              <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                                <span className="uppercase tracking-wider font-semibold bg-muted px-2 py-1 rounded-md">{address.type}</span>
                                <span>Added {new Date(address.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 px-4 rounded-xl border border-dashed border-border flex flex-col items-center">
                          <div className="bg-muted p-3 rounded-full mb-4">
                            <MapPin className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <h3 className="text-lg font-semibold mb-1">No addresses found</h3>
                          <p className="text-muted-foreground max-w-sm mb-6">
                            You haven't saved any addresses yet. Add a new address for faster checkout.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Security Settings */}
                  <Card className="border-border/50 shadow-md rounded-2xl hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-4 border-b border-border/50 bg-muted/20">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Security Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between p-4 border rounded-xl hover:border-primary/30 transition-colors">
                        <div>
                          <h3 className="font-semibold mb-1">Account Password</h3>
                          <p className="text-sm text-muted-foreground">Change your password to keep your account secure.</p>
                        </div>
                        <Button variant="outline" onClick={() => setIsPasswordModalOpen(true)}>
                          Change Password
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/20 rounded-2xl border border-border/50">
                <p className="text-muted-foreground">Unable to load user profile.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />

      {userdetails?.images && userdetails.images.length > 0 && (
        <ImageViewer
          images={userdetails.images.map((img: any) => ({ url: img.imageUrl }))}
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
        />
      )}

      <ImageCropperModal
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        imageSrc={imageSrc}
        onCropComplete={handleCropComplete}
      />

      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </div>
  );
};

/* =============== OLD COMMENTED DESIGN ===============
import { useState } from "react";
import { Navbar } from "@/components/Layout/Navbar";
import { Sidebar } from "@/components/Layout/Sidebar";
import { Footer } from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { User, Mail, Phone, MapPin, Bell, Shield, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AccountSettingsOld = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your account settings have been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      
      <div className="flex flex-1">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              {/* Header *\/}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
                <p className="text-muted-foreground mt-2">
                  Manage your account preferences and security settings
                </p>
              </div>

              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="privacy">Privacy</TabsTrigger>
                </TabsList>

                {/* Profile Tab *\/}
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profile Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <Button variant="outline" size="sm">
                            Change Photo
                          </Button>
                          <p className="text-sm text-muted-foreground mt-1">
                            JPG, PNG or GIF. Max size 2MB
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" defaultValue="John" />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" defaultValue="Doe" />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue="john@example.com" />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" defaultValue="+1 (555) 123-4567" />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" defaultValue="123 Main St, City, State 12345" />
                      </div>

                      <Button onClick={handleSave}>Save Changes</Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Security Tab *\/}
                <TabsContent value="security">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Security Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-3">Change Password</h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input id="currentPassword" type="password" />
                          </div>
                          <div>
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input id="newPassword" type="password" />
                          </div>
                          <div>
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input id="confirmPassword" type="password" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">SMS Authentication</p>
                            <p className="text-sm text-muted-foreground">
                              Receive verification codes via SMS
                            </p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email Authentication</p>
                            <p className="text-sm text-muted-foreground">
                              Receive verification codes via email
                            </p>
                          </div>
                          <Switch />
                        </div>
                      </div>

                      <Button onClick={handleSave}>Update Security Settings</Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Notifications Tab *\/}
                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notification Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Order Updates</p>
                            <p className="text-sm text-muted-foreground">
                              Notifications about your order status
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Promotional Emails</p>
                            <p className="text-sm text-muted-foreground">
                              Special offers and new product announcements
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Price Alerts</p>
                            <p className="text-sm text-muted-foreground">
                              Get notified when items in your wishlist go on sale
                            </p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Newsletter</p>
                            <p className="text-sm text-muted-foreground">
                              Weekly newsletter with tips and recommendations
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>

                      <Button onClick={handleSave}>Save Preferences</Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Privacy Tab *\/}
                <TabsContent value="privacy">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Privacy Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Profile Visibility</p>
                            <p className="text-sm text-muted-foreground">
                              Make your profile visible to other users
                            </p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Activity Status</p>
                            <p className="text-sm text-muted-foreground">
                              Show when you're online
                            </p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Data Analytics</p>
                            <p className="text-sm text-muted-foreground">
                              Help improve our service by sharing usage data
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-medium text-destructive">Danger Zone</h3>
                        <div className="border border-destructive/20 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Delete Account</p>
                              <p className="text-sm text-muted-foreground">
                                Permanently delete your account and all data
                              </p>
                            </div>
                            <Button variant="destructive" size="sm">
                              Delete Account
                            </Button>
                          </div>
                        </div>
                      </div>

                      <Button onClick={handleSave}>Save Privacy Settings</Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};
====================================================== */