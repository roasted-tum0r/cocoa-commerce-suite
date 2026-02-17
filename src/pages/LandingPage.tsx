import React from "react";
import { Navbar } from "@/components/Layout/Navbar";
import { Footer } from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Star, Globe, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { ModernImage } from "@/components/ui/ModernImage";

// Local Assets
import overallBanner from "@/assets/exotica_overall_banner.png";
import royalNuts from "@/assets/exotica_nuts_luxury.png";
import exoticFruits from "@/assets/exotica_fruits_west.png";
import dragonFruit from "@/assets/exotica_premium_dragonfruits.png";
import macadamia from "@/assets/exotica_premium_macademia.png";
import premiumMix from "@/assets/exotica_premium_mix.png";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar onMenuClick={() => { }} />

            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center overflow-hidden">
                <ModernImage
                    src={overallBanner}
                    alt="Anandini's Exotica Hero"
                    containerClassName="absolute inset-0"
                    className="scale-105 hover:scale-100"
                />
                <div className="absolute inset-0 bg-black/40 bg-gradient-to-r from-black/60 to-transparent z-[1]" />

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <Badge className="mb-6 bg-accent text-accent-foreground px-4 py-1 text-sm uppercase tracking-widest font-semibold border-none">
                            Premium Collection
                        </Badge>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                            Anandini's <span className="text-accent italic">Exotica</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-xl leading-relaxed">
                            Discover the rare, the refined, and the extraordinary. Sourced from the West's finest harvests, specifically for the connoisseur.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground text-lg px-8 py-7 rounded-full transition-transform hover:scale-105" asChild>
                                <Link to="/shop">
                                    Explore Collection <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="border-white hover:bg-white text-white hover:text-primary text-lg px-8 py-7 rounded-full transition-all duration-300 hover:scale-105 bg-transparent">
                                Our Story
                            </Button>
                        </div>
                    </motion.div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                        <div className="w-1 h-2 bg-white/50 rounded-full mt-2" />
                    </div>
                </div>
            </section>

            {/* Brand Values */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        {[
                            { icon: Globe, title: "Global Sourcing", desc: "Handpicked from the West and the finest Dubai orchards." },
                            { icon: Leaf, title: "Purest Quality", desc: "No additives, just nature's own exotic sweetness." },
                            { icon: ShieldCheck, title: "Triple Inspected", desc: "Each item passes rigorous quality benchmarks." },
                            { icon: Star, title: "Royal Experience", desc: "Treat yourself to the luxury your palate deserves." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center group"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <item.icon className="h-8 w-8 text-primary group-hover:text-white" />
                                </div>
                                <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                                <p className="text-muted-foreground">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div>
                            <h2 className="text-4xl font-bold mb-4">The Royal Harvest</h2>
                            <p className="text-muted-foreground text-lg max-w-2xl">
                                Explore our curated selection of Earth's most exquisite gifts. From the legendary Dubai dates to the rarest nuts of the West.
                            </p>
                        </div>
                        <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5" asChild>
                            <Link to="/shop">View All Collections <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="relative aspect-[16/10] rounded-3xl overflow-hidden group cursor-pointer"
                        >
                            <ModernImage src={royalNuts} alt="Royal Nuts" className="group-hover:scale-110" containerClassName="absolute inset-0 w-full h-full" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-[1] transition-opacity duration-500 group-hover:opacity-100" />
                            <div className="absolute bottom-8 left-8 z-10 transition-all duration-500 group-hover:translate-y-[-10px]">
                                <h3 className="text-4xl font-extrabold text-white mb-2 drop-shadow-xl tracking-tight uppercase">
                                    Imperial <span className="text-accent underline decoration-accent/50 underline-offset-8">Nuts</span>
                                </h3>
                                <p className="text-white/90 mb-6 max-w-xs font-medium drop-shadow-lg text-lg">
                                    Hand-selected Macadamias, Pecans & more.
                                </p>
                                <Button variant="secondary" size="lg" className="rounded-full font-bold px-8 shadow-lg hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                                    Discover <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="relative aspect-[16/10] rounded-3xl overflow-hidden group cursor-pointer"
                        >
                            <ModernImage src={exoticFruits} alt="Exotic Fruits" className="group-hover:scale-110" containerClassName="absolute inset-0 w-full h-full" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-[1] transition-opacity duration-500 group-hover:opacity-100" />
                            <div className="absolute bottom-8 left-8 z-10 transition-all duration-500 group-hover:translate-y-[-10px]">
                                <h3 className="text-4xl font-extrabold text-white mb-2 drop-shadow-xl tracking-tight uppercase">
                                    Western <span className="text-accent underline decoration-accent/50 underline-offset-8">Delicacies</span>
                                </h3>
                                <p className="text-white/90 mb-6 max-w-xs font-medium drop-shadow-lg text-lg">
                                    Exotic fruits flown in for peak freshness.
                                </p>
                                <Button variant="secondary" size="lg" className="rounded-full font-bold px-8 shadow-lg hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                                    Discover <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Connoisseur's Choice */}
            <section className="py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <Badge variant="outline" className="mb-4 border-primary text-primary">Limited Harvest</Badge>
                        <h2 className="text-4xl font-bold">Connoisseur's Choice</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Royal Dragon Fruit", origin: "West", img: dragonFruit, price: "From $24" },
                            { name: "Velvet Macadamias", origin: "Premium", img: macadamia, price: "From $32" },
                            { name: "The Exotica Mix", origin: "Curated", img: premiumMix, price: "From $45" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-3xl overflow-hidden shadow-sm group border border-transparent hover:border-primary/20 transition-all"
                            >
                                <div className="aspect-square overflow-hidden relative">
                                    <ModernImage src={item.img} alt={item.name} className="group-hover:scale-110" />
                                    <div className="absolute top-4 right-4 z-[1]">
                                        <Badge className="bg-white/90 text-primary backdrop-blur-sm border-none">{item.price}</Badge>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-bold text-lg">{item.name}</h4>
                                        <span className="text-xs uppercase tracking-widest text-muted-foreground">{item.origin}</span>
                                    </div>
                                    <Button variant="ghost" className="w-full justify-between text-primary font-bold group/btn" asChild>
                                        <Link to="/shop">Reserve Now <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" /></Link>
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Royal Testimonials */}
            <section className="py-24 bg-muted/10">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Voices of Excellence</h2>
                        <div className="w-24 h-1 bg-accent mx-auto" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { name: "Sarah J.", role: "Gourmet Chef", content: "The quality of the Dubai dates is simply unmatched. They are the centerpiece of my dessert menus." },
                            { name: "David L.", role: "Health Enthusiast", content: "I've never tasted nuts this fresh. The Macadamias are buttery and perfect. Truly a premium experience." },
                            { name: "Elena R.", role: "Luxury Gift Designer", content: "Anandini's Exotica is my go-to for corporate gifting. The presentation and quality always impress my clients." }
                        ].map((testimonial, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                className="bg-white p-8 rounded-3xl shadow-sm border border-muted"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-rating text-rating" />)}
                                </div>
                                <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                                <div>
                                    <h4 className="font-bold">{testimonial.name}</h4>
                                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-primary text-primary-foreground overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/10 -skew-x-12 translate-x-1/2" />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to Taste the Extraordinary?</h2>
                    <p className="text-xl md:text-2xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Join our exclusive circle of gourmets and get early access to our limited seasonal harvests.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Button size="lg" variant="secondary" className="text-lg px-10 py-7 rounded-full font-bold shadow-lg" asChild>
                            <Link to="/shop">Shop the Collection</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary text-lg px-10 py-7 rounded-full transition-all duration-300 bg-transparent shadow-lg">
                            Contact Concierge
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
