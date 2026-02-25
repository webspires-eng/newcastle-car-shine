import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Car, Mail, Phone, MapPin, User, Gauge, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

const ThankYou = () => {
    const location = useLocation();
    const navigate = useNavigate();
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
        // Celebrate on mount
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };
        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
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
                    <div className="text-center space-y-4 p-8">
                        <h2 className="text-2xl font-bold">Page not found</h2>
                        <Button onClick={() => navigate("/")}>Go to Homepage</Button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const dvla = state.dvlaData;

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-10 sm:py-16">
                {/* Success Header */}
                <div className="text-center mb-10">
                    <div className="w-20 h-20 mx-auto bg-[#00b67a]/10 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-10 h-10 text-[#00b67a]" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                        Thank you, {state.name.split(" ")[0]}!
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Your valuation request has been submitted successfully.
                    </p>
                    <p className="text-muted-foreground text-sm mt-1">
                        We'll be in touch shortly with your car valuation.
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="space-y-6">

                    {/* Vehicle Details Card */}
                    <div className="bg-card border border-border rounded-2xl overflow-hidden">
                        <div className="bg-primary px-6 py-3">
                            <h2 className="text-primary-foreground font-semibold flex items-center gap-2">
                                <Car className="w-5 h-5" />
                                Vehicle Details
                            </h2>
                        </div>
                        <div className="p-6 space-y-3">
                            {/* Registration Plate */}
                            <div className="flex items-stretch rounded-md border-2 border-foreground overflow-hidden mx-auto max-w-[220px] mb-4">
                                <div className="bg-[#003DA5] flex items-center justify-center px-1.5">
                                    <div className="text-center">
                                        <span className="text-[7px] text-white block leading-none">🇬🇧</span>
                                        <span className="text-[9px] font-bold text-white leading-none">UK</span>
                                    </div>
                                </div>
                                <div className="bg-amber-400 flex-1 py-1.5 text-center">
                                    <span className="text-base font-black tracking-wider">{state.registrationNumber}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                {state.make && (
                                    <div>
                                        <span className="text-muted-foreground">Make</span>
                                        <p className="font-medium">{state.make}</p>
                                    </div>
                                )}
                                {state.model && (
                                    <div>
                                        <span className="text-muted-foreground">Model</span>
                                        <p className="font-medium">{state.model}</p>
                                    </div>
                                )}
                                {dvla?.year && (
                                    <div>
                                        <span className="text-muted-foreground">Year</span>
                                        <p className="font-medium">{dvla.year}</p>
                                    </div>
                                )}
                                {dvla?.colour && (
                                    <div>
                                        <span className="text-muted-foreground">Colour</span>
                                        <p className="font-medium">{dvla.colour}</p>
                                    </div>
                                )}
                                {dvla?.fuelType && (
                                    <div>
                                        <span className="text-muted-foreground">Fuel Type</span>
                                        <p className="font-medium">{dvla.fuelType}</p>
                                    </div>
                                )}
                                {dvla?.engineCapacity && (
                                    <div>
                                        <span className="text-muted-foreground">Engine</span>
                                        <p className="font-medium">{dvla.engineCapacity}cc</p>
                                    </div>
                                )}
                                <div>
                                    <span className="text-muted-foreground">Mileage</span>
                                    <p className="font-medium">{state.mileage}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Transmission</span>
                                    <p className="font-medium capitalize">{state.transmission}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Condition</span>
                                    <p className="font-medium capitalize">{state.condition}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">HPI Clear</span>
                                    <p className="font-medium capitalize">{state.hpiClear}</p>
                                </div>
                                {dvla?.taxStatus && (
                                    <div>
                                        <span className="text-muted-foreground">Tax Status</span>
                                        <p className="font-medium">{dvla.taxStatus}</p>
                                    </div>
                                )}
                                {dvla?.motStatus && (
                                    <div>
                                        <span className="text-muted-foreground">MOT Status</span>
                                        <p className="font-medium">{dvla.motStatus}</p>
                                    </div>
                                )}
                            </div>

                            {state.notes && (
                                <div className="pt-3 border-t border-border">
                                    <span className="text-muted-foreground text-sm">Notes</span>
                                    <p className="text-sm font-medium mt-1">{state.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contact Details Card */}
                    <div className="bg-card border border-border rounded-2xl overflow-hidden">
                        <div className="bg-secondary px-6 py-3">
                            <h2 className="text-secondary-foreground font-semibold flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Your Contact Details
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3">
                                    <User className="w-4 h-4 text-muted-foreground shrink-0" />
                                    <span className="font-medium">{state.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                                    <span className="font-medium break-all">{state.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                                    <span className="font-medium">{state.phone}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                                    <span className="font-medium">{state.postcode}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* What happens next */}
                    <div className="bg-muted/30 border border-border rounded-2xl p-6">
                        <h3 className="font-semibold text-foreground mb-3">What happens next?</h3>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                                <p>We'll review your vehicle details and prepare your valuation.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                                <p>You'll receive your valuation via email at <strong className="text-foreground">{state.email}</strong>.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                                <p>If you're happy with the offer, we'll arrange a convenient time for collection.</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center pt-4">
                        <Button
                            onClick={() => navigate("/")}
                            className="h-12 px-8 text-base font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground"
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
