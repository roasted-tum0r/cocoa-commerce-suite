import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";

export const ContactPage = () => {
    return (
        <div className="container mx-auto px-4 py-10 animate-in fade-in duration-500">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Contact Us</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                            <p className="text-muted-foreground">support@cocoacommerce.com</p>
                            <p className="text-muted-foreground">sales@cocoacommerce.com</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-1">Call Us</h3>
                            <p className="text-muted-foreground">+1 (555) 123-4567</p>
                            <p className="text-muted-foreground">Mon-Fri from 8am to 5pm</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-1">Visit Us</h3>
                            <p className="text-muted-foreground">123 Chocolate Lane</p>
                            <p className="text-muted-foreground">Sweet City, SC 12345</p>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-card border rounded-2xl p-6 shadow-sm">
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="first-name" className="text-sm font-medium">First name</label>
                                <Input id="first-name" placeholder="John" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="last-name" className="text-sm font-medium">Last name</label>
                                <Input id="last-name" placeholder="Doe" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                            <Input id="email" type="email" placeholder="john@example.com" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium">Message</label>
                            <Textarea id="message" placeholder="How can we help you?" className="min-h-[120px]" />
                        </div>
                        <Button type="submit" className="w-full">Send Message</Button>
                    </form>
                </div>
            </div>
        </div>
    );
};
