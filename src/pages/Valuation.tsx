import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Car, Mail, Phone, MapPin, User, Gauge, ChevronLeft, ChevronRight, Loader2, HelpCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { ManualEntryDialog } from "@/components/ManualEntryDialog";

const contactSchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(100),
    email: z.string().trim().email("Invalid email address").max(255),
    phone: z.string().trim().min(10, "Phone must be at least 10 characters").max(20).regex(/^[\d\s+()-]+$/, "Invalid phone format"),
    postcode: z.string().trim().min(1, "Postcode is required").max(10),
    condition: z.enum(["excellent", "good", "bad"], {
        required_error: "Please select a condition"
    }),
    hpiClear: z.enum(["yes", "no", "unsure"], {
        required_error: "Please select an option"
    }),
    transmission: z.enum(["automatic", "manual"], {
        required_error: "Please select transmission type"
    }),
});

const Valuation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as {
        registrationNumber: string;
        mileage: string;
        dvlaData: any;
    } | null;

    if (!state) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-4 p-8">
                        <Car className="w-16 h-16 mx-auto text-muted-foreground" />
                        <h2 className="text-2xl font-bold">No vehicle data found</h2>
                        <p className="text-muted-foreground">Please start by entering your registration number.</p>
                        <Button onClick={() => navigate("/")} className="mt-4">Go to Homepage</Button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const { registrationNumber, mileage, dvlaData } = state;

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        postcode: "",
        condition: "",
        hpiClear: "",
        transmission: "",
        notes: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [commsOptOut, setCommsOptOut] = useState(false);
    const [showChangeCar, setShowChangeCar] = useState(false);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const celebrate = () => {
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
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            const validated = contactSchema.parse(formData);
            const mileageInt = parseInt(mileage.replace(/,/g, ""), 10);

            const { error } = await supabase.from("vehicle_inquiries").insert({
                name: validated.name,
                email: validated.email,
                phone: validated.phone,
                postcode: validated.postcode,
                registration_number: registrationNumber,
                make: dvlaData?.make || "",
                model: dvlaData?.model || "",
                mileage: mileageInt,
                transmission: validated.transmission,
                hpi_clear: validated.hpiClear === "yes" ? true : validated.hpiClear === "no" ? false : null,
                condition: validated.condition,
                notes: formData.notes || null,
            });
            if (error) {
                console.error("Supabase insert error:", error);
                toast.error(`Database error: ${error.message}`);
                setIsSubmitting(false);
                return;
            }

            try {
                await supabase.functions.invoke("send-inquiry-email", {
                    body: {
                        name: validated.name,
                        email: validated.email,
                        phone: validated.phone,
                        postcode: validated.postcode,
                        registrationNumber,
                        make: dvlaData?.make || "",
                        model: dvlaData?.model || "",
                        mileage: mileageInt,
                        transmission: validated.transmission,
                        hpiClear: validated.hpiClear,
                        condition: validated.condition,
                        notes: formData.notes || undefined,
                        dvlaData: dvlaData ? {
                            year: dvlaData.year || null,
                            colour: dvlaData.colour || null,
                            fuelType: dvlaData.fuelType || null,
                            engineCapacity: dvlaData.engineCapacity || null,
                            bodyType: dvlaData.bodyType || null,
                            taxStatus: dvlaData.taxStatus || null,
                            taxDueDate: dvlaData.taxDueDate || null,
                            motStatus: dvlaData.motStatus || null,
                            co2Emissions: dvlaData.co2Emissions || null,
                            euroStatus: dvlaData.euroStatus || null,
                        } : null,
                    },
                });
            } catch (emailError) {
                console.error("Email notification error:", emailError);
            }

            // Navigate to thank you page with all details
            navigate("/thank-you", {
                state: {
                    name: validated.name,
                    email: validated.email,
                    phone: validated.phone,
                    postcode: validated.postcode,
                    registrationNumber,
                    mileage,
                    make: dvlaData?.make || "",
                    model: dvlaData?.model || "",
                    condition: validated.condition,
                    hpiClear: validated.hpiClear,
                    transmission: validated.transmission,
                    notes: formData.notes || "",
                    dvlaData,
                },
            });
        } catch (err: any) {
            if (err?.issues) {
                const formatted: Record<string, string> = {};
                for (const issue of err.issues) {
                    formatted[issue.path[0]] = issue.message;
                }
                setErrors(formatted);
            } else {
                console.error("Submission error:", err);
                toast.error(err?.message || "Failed to submit inquiry. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Build vehicle description line
    const vehicleDesc = [
        dvlaData?.make,
        dvlaData?.model,
        dvlaData?.bodyType,
    ].filter(Boolean).join(" ");

    const vehicleMeta = [
        dvlaData?.year,
        dvlaData?.colour,
        dvlaData?.fuelType,
    ].filter(Boolean).join(" • ");

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            {/* Progress Bar */}
            <div className="w-full bg-muted h-1.5">
                <div className="bg-primary h-1.5 w-full transition-all duration-500" />
            </div>

            <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 sm:py-12">
                {/* Back button */}
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

                    {/* Left: Form */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Your details</h1>
                            <p className="text-sm text-muted-foreground mt-1">Step 2 of 2</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Mileage (confirmed from step 1) */}
                            <div>
                                <Label htmlFor="mileage-confirm" className="text-sm font-medium">Mileage</Label>
                                <div className="flex items-stretch rounded-lg border-2 border-primary overflow-hidden mt-1.5">
                                    <div className="bg-primary/5 flex items-center justify-center px-3">
                                        <Gauge className="w-5 h-5 text-primary" />
                                    </div>
                                    <Input
                                        id="mileage-confirm"
                                        value={mileage}
                                        readOnly
                                        className="border-0 h-12 text-lg font-semibold focus-visible:ring-0 bg-background text-foreground"
                                    />
                                    <div className="flex items-center pr-3 text-primary">
                                        <span className="text-xl">✓</span>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1.5">Please ensure accurate mileage</p>
                            </div>

                            {/* Email */}
                            <div>
                                <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1">
                                    Email address
                                    <span className="text-muted-foreground text-xs">(So we can send your valuation)</span>
                                    <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                                </Label>
                                <div className="flex items-stretch rounded-lg border-2 border-border overflow-hidden mt-1.5 focus-within:border-primary transition-colors">
                                    <div className="bg-muted/30 flex items-center justify-center px-3">
                                        <Mail className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={e => handleChange("email", e.target.value)}
                                        placeholder="e.g. name@email.com"
                                        className="border-0 h-12 text-base focus-visible:ring-0 bg-background text-foreground"
                                    />
                                </div>
                                {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                            </div>

                            {/* Postcode */}
                            <div>
                                <Label htmlFor="postcode" className="text-sm font-medium flex items-center gap-1">
                                    Postcode
                                    <span className="text-muted-foreground text-xs">(To find local branch)</span>
                                    <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                                </Label>
                                <div className="flex items-stretch rounded-lg border-2 border-border overflow-hidden mt-1.5 focus-within:border-primary transition-colors">
                                    <div className="bg-muted/30 flex items-center justify-center px-3">
                                        <MapPin className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <Input
                                        id="postcode"
                                        value={formData.postcode}
                                        onChange={e => handleChange("postcode", e.target.value.toUpperCase())}
                                        placeholder="e.g. NE1 4LP"
                                        className="border-0 h-12 text-base focus-visible:ring-0 bg-background text-foreground"
                                    />
                                </div>
                                {errors.postcode && <p className="text-destructive text-sm mt-1">{errors.postcode}</p>}
                            </div>

                            {/* Phone */}
                            <div>
                                <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-1">
                                    Mobile
                                    <span className="text-muted-foreground text-xs">(To send your valuation by SMS, WhatsApp or RCS)</span>
                                    <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                                </Label>
                                <div className="flex items-stretch rounded-lg border-2 border-border overflow-hidden mt-1.5 focus-within:border-primary transition-colors">
                                    <div className="bg-muted/30 flex items-center justify-center px-3">
                                        <Phone className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={e => handleChange("phone", e.target.value)}
                                        placeholder="e.g. 07000 000000"
                                        className="border-0 h-12 text-base focus-visible:ring-0 bg-background text-foreground"
                                    />
                                </div>
                                {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
                            </div>

                            {/* Full Name */}
                            <div>
                                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                                <div className="flex items-stretch rounded-lg border-2 border-border overflow-hidden mt-1.5 focus-within:border-primary transition-colors">
                                    <div className="bg-muted/30 flex items-center justify-center px-3">
                                        <User className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={e => handleChange("name", e.target.value)}
                                        placeholder="John Doe"
                                        className="border-0 h-12 text-base focus-visible:ring-0 bg-background text-foreground"
                                    />
                                </div>
                                {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                            </div>

                            {/* Condition */}
                            <div>
                                <Label className="text-sm font-medium">What's the condition?</Label>
                                <div className="mt-2 flex gap-2">
                                    {[
                                        { value: "excellent", label: "⭐ Excellent" },
                                        { value: "good", label: "👍 Good" },
                                        { value: "bad", label: "⚠️ Bad" }
                                    ].map(option => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => handleChange("condition", option.value)}
                                            className={`flex-1 py-3 rounded-lg border-2 text-center transition-all text-sm font-medium ${formData.condition === option.value
                                                ? "border-primary bg-primary/5 text-foreground"
                                                : "border-border bg-background hover:border-primary/50"
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                                {errors.condition && <p className="text-destructive text-sm mt-1">{errors.condition}</p>}
                            </div>

                            {/* HPI Clear */}
                            <div>
                                <Label className="text-sm font-medium">Is the car HPI Clear?</Label>
                                <div className="mt-2 flex gap-2">
                                    {[
                                        { value: "yes", label: "Yes" },
                                        { value: "no", label: "No" },
                                        { value: "unsure", label: "Not Sure" }
                                    ].map(option => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => handleChange("hpiClear", option.value)}
                                            className={`flex-1 py-3 rounded-lg border-2 text-center transition-all text-sm font-medium ${formData.hpiClear === option.value
                                                ? "border-primary bg-primary/5 text-foreground"
                                                : "border-border bg-background hover:border-primary/50"
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                                {errors.hpiClear && <p className="text-destructive text-sm mt-1">{errors.hpiClear}</p>}
                            </div>

                            {/* Transmission */}
                            <div>
                                <Label className="text-sm font-medium">Transmission</Label>
                                <div className="mt-2 flex gap-2">
                                    {[
                                        { value: "automatic", label: "Automatic" },
                                        { value: "manual", label: "Manual" }
                                    ].map(option => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => handleChange("transmission", option.value)}
                                            className={`flex-1 py-3 rounded-lg border-2 text-center transition-all text-sm font-medium ${formData.transmission === option.value
                                                ? "border-primary bg-primary/5 text-foreground"
                                                : "border-border bg-background hover:border-primary/50"
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                                {errors.transmission && <p className="text-destructive text-sm mt-1">{errors.transmission}</p>}
                            </div>

                            {/* Notes */}
                            <div>
                                <Label htmlFor="notes" className="text-sm font-medium">
                                    Additional Notes <span className="text-muted-foreground text-xs">(Optional)</span>
                                </Label>
                                <Textarea
                                    id="notes"
                                    value={formData.notes}
                                    onChange={e => handleChange("notes", e.target.value)}
                                    placeholder="Service history, recent repairs, modifications..."
                                    className="mt-1.5 min-h-[80px] text-base border-2 focus:border-primary"
                                />
                            </div>

                            {/* Terms & Conditions */}
                            <div className="border-t border-border pt-6 space-y-4">
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    By using our service you agree to our{" "}
                                    <a href="/terms" className="underline hover:text-foreground">terms and conditions</a> and{" "}
                                    <a href="/privacy" className="underline hover:text-foreground">privacy policy</a>. Key valuation terms:
                                </p>
                                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                                    <li>Valuation based on the information you provide.</li>
                                    <li>Final offer subject to vehicle inspection and condition.</li>
                                    <li>We may contact you regarding your valuation.</li>
                                </ul>

                                <label className="flex items-start gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={commsOptOut}
                                        onChange={e => setCommsOptOut(e.target.checked)}
                                        className="mt-0.5 w-4 h-4 rounded border-border"
                                    />
                                    <span className="text-xs text-muted-foreground">
                                        I do not want to receive communications including updates, price changes and seasonal offers.
                                    </span>
                                </label>
                            </div>

                            {/* Trustpilot */}
                            <div className="flex items-center justify-center gap-2 py-2">
                                <span className="text-sm font-semibold">Excellent</span>
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="w-6 h-6 bg-[#00b67a] flex items-center justify-center">
                                            <span className="text-white text-xs">★</span>
                                        </div>
                                    ))}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    10,000+ reviews on
                                </span>
                                <span className="text-sm font-bold">★ Trustpilot</span>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-14 text-lg font-bold rounded-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg hover:shadow-xl transition-all"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Get my valuation
                                        <ChevronRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Right: Vehicle Summary Sidebar */}
                    <div className="lg:col-span-1 order-first lg:order-last">
                        <div className="sticky top-24">
                            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">

                                {/* Registration Plate */}
                                <div className="flex items-stretch rounded-md border-2 border-foreground overflow-hidden mb-4 mx-auto max-w-[200px]">
                                    <div className="bg-[#003DA5] flex items-center justify-center px-1.5">
                                        <div className="text-center">
                                            <span className="text-[7px] text-white block leading-none">🇬🇧</span>
                                            <span className="text-[9px] font-bold text-white leading-none">UK</span>
                                        </div>
                                    </div>
                                    <div className="bg-amber-400 flex-1 py-1.5 text-center">
                                        <span className="text-base font-black tracking-wider">{registrationNumber}</span>
                                    </div>
                                </div>

                                {/* Vehicle Description */}
                                {dvlaData && (
                                    <div className="text-center space-y-1">
                                        <p className="font-bold text-sm leading-snug">
                                            {vehicleDesc.toUpperCase()}
                                        </p>
                                        {vehicleMeta && (
                                            <p className="text-xs text-muted-foreground">{vehicleMeta}</p>
                                        )}

                                        {/* Detailed specs */}
                                        <div className="mt-4 pt-3 border-t border-border space-y-1.5 text-left">
                                            {dvlaData.engineCapacity && (
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-muted-foreground">Engine</span>
                                                    <span className="font-medium">{dvlaData.engineCapacity}cc</span>
                                                </div>
                                            )}
                                            {dvlaData.taxStatus && (
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-muted-foreground">Tax</span>
                                                    <span className="font-medium">{dvlaData.taxStatus}</span>
                                                </div>
                                            )}
                                            {dvlaData.motStatus && (
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-muted-foreground">MOT</span>
                                                    <span className="font-medium">{dvlaData.motStatus}</span>
                                                </div>
                                            )}
                                            {dvlaData.co2Emissions && (
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-muted-foreground">CO₂</span>
                                                    <span className="font-medium">{dvlaData.co2Emissions} g/km</span>
                                                </div>
                                            )}
                                            {dvlaData.euroStatus && (
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-muted-foreground">Euro</span>
                                                    <span className="font-medium">{dvlaData.euroStatus}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {!dvlaData && (
                                    <div className="text-center text-sm text-muted-foreground py-2">
                                        <p>Vehicle details not available</p>
                                    </div>
                                )}

                                {/* Change car */}
                                <button
                                    onClick={() => setShowChangeCar(true)}
                                    className="w-full mt-4 py-2 text-sm font-medium bg-foreground text-background rounded-md hover:opacity-90 transition-opacity"
                                >
                                    Change car
                                </button>
                            </div>

                            <ManualEntryDialog
                                open={showChangeCar}
                                onOpenChange={setShowChangeCar}
                                onSubmit={() => { }}
                            />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Valuation;
