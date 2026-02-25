import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
    CheckCircle2, Car, Mail, Phone, MapPin, User,
    ArrowRight, Fuel, Calendar, Palette, Cog, Shield,
    FileCheck, Clock, Sparkles
} from "lucide-react";
import confetti from "canvas-confetti";

const ThankYou = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [animateIn, setAnimateIn] = useState(false);

    const state = location.state as {
        name: string;
        email: string;
        phone: string;
        postcode: string;
        registrationNumber: string;
        mileage: string;
        make: string;
        model: string;
        condition: string;
        hpiClear: string;
        transmission: string;
        notes: string;
        dvlaData: any;
    } | null;

    useEffect(() => {
        // Trigger entrance animation
        setTimeout(() => setAnimateIn(true), 100);

        // Confetti celebration
        const duration = 4000;
        const animationEnd = Date.now() + duration;
        const colors = ["#f5c518", "#000000", "#ffffff", "#00b67a"];
        const defaults = { startVelocity: 30, spread: 360, ticks: 80, zIndex: 9999, colors };
        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 60 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
        return () => clearInterval(interval);
    }, []);

    if (!state) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-6 p-8">
                        <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
                            <Car className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-bold">No submission found</h2>
                        <p className="text-muted-foreground">It looks like you haven't submitted a valuation request yet.</p>
                        <Button onClick={() => navigate("/")} className="h-12 px-8 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                            Get Your Valuation
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const dvla = state.dvlaData;
    const vehicleTitle = [state.make, state.model].filter(Boolean).join(" ") || "Your Vehicle";

    const vehicleSpecs = [
        dvla?.year && { icon: Calendar, label: "Year", value: dvla.year },
        dvla?.colour && { icon: Palette, label: "Colour", value: dvla.colour },
        dvla?.fuelType && { icon: Fuel, label: "Fuel", value: dvla.fuelType },
        dvla?.engineCapacity && { icon: Cog, label: "Engine", value: `${dvla.engineCapacity}cc` },
        { icon: Cog, label: "Mileage", value: state.mileage },
        { icon: Cog, label: "Transmission", value: state.transmission },
        { icon: Shield, label: "Condition", value: state.condition },
        { icon: FileCheck, label: "HPI Clear", value: state.hpiClear },
        dvla?.taxStatus && { icon: FileCheck, label: "Tax", value: dvla.taxStatus },
        dvla?.motStatus && { icon: FileCheck, label: "MOT", value: dvla.motStatus },
    ].filter(Boolean) as { icon: any; label: string; value: string }[];

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1">
                {/* Hero Banner */}
                <div className="relative bg-foreground overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-10 left-10 w-40 h-40 rounded-full border-2 border-white" />
                        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full border-2 border-white" />
                        <div className="absolute top-1/2 left-1/2 w-80 h-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white" />
                    </div>

                    <div className={`relative max-w-3xl mx-auto px-4 py-12 sm:py-16 text-center transition-all duration-700 ${animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                        {/* Animated check */}
                        <div className="relative inline-block mb-6">
                            <div className="w-24 h-24 rounded-full bg-[#00b67a] flex items-center justify-center shadow-[0_0_40px_rgba(0,182,122,0.3)]">
                                <CheckCircle2 className="w-12 h-12 text-white" />
                            </div>
                            <div className="absolute -inset-2 rounded-full border-2 border-[#00b67a]/30 animate-ping" style={{ animationDuration: "2s" }} />
                        </div>

                        <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3">
                            Thank you, {state.name.split(" ")[0]}!
                        </h1>
                        <p className="text-white/70 text-lg sm:text-xl max-w-md mx-auto">
                            Your valuation request has been submitted successfully
                        </p>

                        {/* Confirmation badge */}
                        <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                            <Mail className="w-4 h-4 text-secondary" />
                            <span className="text-white/80 text-sm">
                                Confirmation sent to <span className="text-white font-medium">{state.email}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className={`max-w-3xl mx-auto px-4 -mt-6 pb-12 transition-all duration-700 delay-300 ${animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>

                    {/* Vehicle Card */}
                    <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden mb-6">
                        <div className="p-6 sm:p-8">
                            {/* Reg plate + Vehicle name */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                                <div className="flex items-stretch rounded-md border-2 border-foreground overflow-hidden shrink-0">
                                    <div className="bg-[#003DA5] flex items-center justify-center px-1.5">
                                        <div className="text-center">
                                            <span className="text-[7px] text-white block leading-none">🇬🇧</span>
                                            <span className="text-[9px] font-bold text-white leading-none">UK</span>
                                        </div>
                                    </div>
                                    <div className="bg-amber-400 py-1.5 px-4 text-center">
                                        <span className="text-lg font-black tracking-wider">{state.registrationNumber}</span>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">{vehicleTitle}</h2>
                                    {dvla?.year && <p className="text-muted-foreground text-sm">{dvla.year} · {dvla?.fuelType || "N/A"} · {state.mileage} miles</p>}
                                </div>
                            </div>

                            {/* Specs Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {vehicleSpecs.map((spec, i) => (
                                    <div key={i} className="bg-muted/50 rounded-xl p-3 text-center">
                                        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-1">{spec.label}</p>
                                        <p className="text-sm font-semibold text-foreground capitalize">{spec.value}</p>
                                    </div>
                                ))}
                            </div>

                            {state.notes && (
                                <div className="mt-4 p-3 bg-muted/30 rounded-xl border border-border">
                                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Notes</p>
                                    <p className="text-sm text-foreground">{state.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Two Column: Contact + Next Steps */}
                    <div className="grid sm:grid-cols-2 gap-6 mb-8">
                        {/* Contact Card */}
                        <div className="bg-card border border-border rounded-2xl p-6">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Contact Details
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Name</p>
                                        <p className="text-sm font-medium">{state.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Email</p>
                                        <p className="text-sm font-medium break-all">{state.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Phone</p>
                                        <p className="text-sm font-medium">{state.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Postcode</p>
                                        <p className="text-sm font-medium">{state.postcode}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Next Steps Card */}
                        <div className="bg-card border border-border rounded-2xl p-6">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                What Happens Next
                            </h3>
                            <div className="space-y-5">
                                <div className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold shrink-0">1</div>
                                        <div className="w-px flex-1 bg-border mt-1" />
                                    </div>
                                    <div className="pb-4">
                                        <p className="text-sm font-medium text-foreground">Review</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">We'll review your vehicle details and prepare your valuation.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold shrink-0">2</div>
                                        <div className="w-px flex-1 bg-border mt-1" />
                                    </div>
                                    <div className="pb-4">
                                        <p className="text-sm font-medium text-foreground">Valuation</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">You'll receive your valuation via email within 24 hours.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold shrink-0">3</div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Collection</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">If you're happy, we'll arrange a convenient time for collection.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Banner */}
                    <div className="bg-secondary rounded-2xl p-6 sm:p-8 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Clock className="w-5 h-5 text-secondary-foreground" />
                            <p className="text-secondary-foreground font-semibold">
                                Expect to hear from us within 24 hours
                            </p>
                        </div>
                        <p className="text-secondary-foreground/70 text-sm mb-6">
                            In the meantime, feel free to browse our services
                        </p>
                        <Button
                            onClick={() => navigate("/")}
                            className="h-12 px-8 text-base font-semibold bg-foreground text-background hover:opacity-90"
                        >
                            Back to Homepage
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ThankYou;
