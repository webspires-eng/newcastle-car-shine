import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Car,
    Fuel,
    Palette,
    Calendar,
    Search,
    AlertCircle,
    Loader2,
    CheckCircle2,
    ShieldCheck,
    FileText,
    Gauge,
    Cog,
} from "lucide-react";

interface VehicleData {
    vrm: string;
    make: string;
    model: string;
    year: number | null;
    colour: string;
    body: string;
    fuel: string;
    // Extended fields from DVLA
    taxStatus?: string;
    taxDueDate?: string;
    motStatus?: string;
    engineCapacity?: number;
    co2Emissions?: number;
    markedForExport?: boolean;
    typeApproval?: string;
    wheelplan?: string;
    revenueWeight?: number;
    euroStatus?: string;
    monthOfFirstRegistration?: string;
    dateOfLastV5CIssued?: string;
}

const VehicleLookup = () => {
    const [regNumber, setRegNumber] = useState("");
    const [vehicle, setVehicle] = useState<VehicleData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleaned = regNumber.replace(/\s+/g, "").toUpperCase();

        if (!cleaned) {
            setError("Please enter a registration number");
            return;
        }

        setLoading(true);
        setError(null);
        setVehicle(null);
        setSearched(true);

        try {
            const response = await fetch(
                `/api/dvla?vrm=${encodeURIComponent(cleaned)}`
            );

            if (!response.ok) {
                const body = await response.json().catch(() => ({}));
                throw new Error(
                    body.error || `Lookup failed (${response.status})`
                );
            }

            const data: VehicleData = await response.json();
            setVehicle(data);
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const formatRegNumber = (value: string) => {
        // Allow user to type naturally — strip non-alphanumeric for display
        return value.toUpperCase().replace(/[^A-Z0-9 ]/g, "");
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-background py-4 md:py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-7xl mx-auto">
                        <div className="relative rounded-[2rem] md:rounded-[3rem] lg:rounded-[4rem] overflow-hidden bg-hero-yellow px-4 py-10 md:p-12 lg:p-16 xl:p-20">
                            {/* Background decoration */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-black/5 rounded-full blur-3xl" />
                            </div>

                            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 bg-black/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-foreground">
                                    <ShieldCheck className="w-4 h-4" />
                                    DVLA Verified Data
                                </div>

                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                                    Vehicle
                                    <br />
                                    Registration Lookup
                                </h1>
                                <p className="text-base md:text-lg text-foreground/80 max-w-xl mx-auto">
                                    Enter your vehicle registration number below to instantly
                                    retrieve vehicle details directly from the DVLA database.
                                </p>

                                {/* Search Form */}
                                <form
                                    onSubmit={handleLookup}
                                    className="max-w-lg mx-auto pt-4"
                                >
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        {/* UK-style number plate input */}
                                        <div className="relative flex-1">
                                            <div className="absolute left-0 top-0 bottom-0 w-10 bg-[#003DA5] rounded-l-xl flex items-center justify-center z-10">
                                                <span className="text-white text-xs font-bold">
                                                    GB
                                                </span>
                                            </div>
                                            <Input
                                                id="regNumberInput"
                                                type="text"
                                                value={regNumber}
                                                onChange={(e) =>
                                                    setRegNumber(formatRegNumber(e.target.value))
                                                }
                                                placeholder="Enter reg (e.g. AB12 CDE)"
                                                maxLength={10}
                                                className="h-14 pl-14 pr-4 text-lg font-bold tracking-wider bg-white border-2 border-foreground/20 rounded-xl focus:border-foreground/50 focus:ring-foreground/20 placeholder:font-normal placeholder:tracking-normal placeholder:text-foreground/40 uppercase"
                                                autoComplete="off"
                                            />
                                        </div>
                                        <Button
                                            id="lookupButton"
                                            type="submit"
                                            disabled={loading}
                                            size="lg"
                                            className="h-14 px-8 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                    Looking up...
                                                </>
                                            ) : (
                                                <>
                                                    <Search className="w-5 h-5 mr-2" />
                                                    Look Up
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>

                                <p className="text-xs text-foreground/50 pt-1">
                                    Data sourced from the DVLA Vehicle Enquiry Service
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Results Section */}
            <section className="py-10 md:py-16 flex-1">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                    {/* Error State */}
                    {error && (
                        <div className="animate-fade-in bg-destructive/10 border border-destructive/30 rounded-2xl p-6 flex items-start gap-4 mb-8">
                            <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-destructive text-lg">
                                    Lookup Failed
                                </h3>
                                <p className="text-destructive/80 mt-1">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="animate-fade-in text-center py-20">
                            <div className="inline-flex flex-col items-center gap-4">
                                <div className="relative">
                                    <div className="w-16 h-16 border-4 border-hero-yellow/30 rounded-full" />
                                    <div className="absolute inset-0 w-16 h-16 border-4 border-hero-yellow border-t-transparent rounded-full animate-spin" />
                                </div>
                                <p className="text-muted-foreground font-medium">
                                    Querying DVLA database...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Vehicle Result */}
                    {vehicle && !loading && (
                        <div className="animate-fade-in space-y-8">
                            {/* Success Header */}
                            <div className="text-center space-y-2">
                                <div className="inline-flex items-center gap-2 bg-success/10 text-success rounded-full px-4 py-2 text-sm font-medium">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Vehicle Found
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                                    {vehicle.make} {vehicle.model}
                                </h2>
                                <div className="inline-block bg-hero-yellow text-foreground font-bold text-xl md:text-2xl tracking-wider px-6 py-2 rounded-lg border-2 border-foreground/20 shadow-md">
                                    {vehicle.vrm}
                                </div>
                            </div>

                            {/* Main Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <DetailCard
                                    icon={<Car className="w-6 h-6" />}
                                    label="Make"
                                    value={vehicle.make || "—"}
                                    color="bg-blue-50 text-blue-600"
                                />
                                <DetailCard
                                    icon={<Cog className="w-6 h-6" />}
                                    label="Model"
                                    value={vehicle.model || "—"}
                                    color="bg-purple-50 text-purple-600"
                                />
                                <DetailCard
                                    icon={<Calendar className="w-6 h-6" />}
                                    label="Year"
                                    value={vehicle.year?.toString() || "—"}
                                    color="bg-amber-50 text-amber-600"
                                />
                                <DetailCard
                                    icon={<Palette className="w-6 h-6" />}
                                    label="Colour"
                                    value={vehicle.colour || "—"}
                                    color="bg-emerald-50 text-emerald-600"
                                />
                                <DetailCard
                                    icon={<Fuel className="w-6 h-6" />}
                                    label="Fuel Type"
                                    value={vehicle.fuel || "—"}
                                    color="bg-orange-50 text-orange-600"
                                />
                                <DetailCard
                                    icon={<FileText className="w-6 h-6" />}
                                    label="Body Type"
                                    value={vehicle.body || "—"}
                                    color="bg-rose-50 text-rose-600"
                                />
                            </div>

                            {/* Tax & MOT Status */}
                            {(vehicle.taxStatus || vehicle.motStatus) && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {vehicle.taxStatus && (
                                        <StatusCard
                                            label="Tax Status"
                                            value={vehicle.taxStatus}
                                            dueDate={vehicle.taxDueDate}
                                            type={
                                                vehicle.taxStatus.toLowerCase() === "taxed"
                                                    ? "success"
                                                    : "warning"
                                            }
                                        />
                                    )}
                                    {vehicle.motStatus && (
                                        <StatusCard
                                            label="MOT Status"
                                            value={vehicle.motStatus}
                                            type={
                                                vehicle.motStatus.toLowerCase() === "valid"
                                                    ? "success"
                                                    : "warning"
                                            }
                                        />
                                    )}
                                </div>
                            )}

                            {/* Extended Details */}
                            {(vehicle.engineCapacity ||
                                vehicle.co2Emissions ||
                                vehicle.euroStatus) && (
                                    <div className="bg-muted/50 rounded-2xl p-6 space-y-4">
                                        <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                                            <Gauge className="w-5 h-5" />
                                            Technical Details
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            {vehicle.engineCapacity && (
                                                <TechDetail
                                                    label="Engine"
                                                    value={`${vehicle.engineCapacity}cc`}
                                                />
                                            )}
                                            {vehicle.co2Emissions && (
                                                <TechDetail
                                                    label="CO₂ Emissions"
                                                    value={`${vehicle.co2Emissions} g/km`}
                                                />
                                            )}
                                            {vehicle.euroStatus && (
                                                <TechDetail
                                                    label="Euro Status"
                                                    value={vehicle.euroStatus}
                                                />
                                            )}
                                            {vehicle.wheelplan && (
                                                <TechDetail
                                                    label="Wheelplan"
                                                    value={vehicle.wheelplan}
                                                />
                                            )}
                                            {vehicle.typeApproval && (
                                                <TechDetail
                                                    label="Type Approval"
                                                    value={vehicle.typeApproval}
                                                />
                                            )}
                                            {vehicle.revenueWeight && (
                                                <TechDetail
                                                    label="Revenue Weight"
                                                    value={`${vehicle.revenueWeight} kg`}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}

                            {/* CTA */}
                            <div className="text-center pt-4">
                                <p className="text-muted-foreground mb-4">
                                    Want to sell this vehicle? Get an instant valuation now.
                                </p>
                                <Button
                                    onClick={() => (window.location.href = "/")}
                                    size="lg"
                                    className="h-14 px-10 text-base font-semibold rounded-xl shadow-lg"
                                >
                                    Get Instant Valuation
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Empty State  */}
                    {!loading && !vehicle && !error && searched && (
                        <div className="text-center py-20 animate-fade-in">
                            <Search className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                            <p className="text-muted-foreground text-lg">
                                No results found. Try a different registration number.
                            </p>
                        </div>
                    )}

                    {/* Initial State */}
                    {!loading && !vehicle && !error && !searched && (
                        <div className="text-center py-16 space-y-8 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                                <FeatureCard
                                    icon={<ShieldCheck className="w-8 h-8" />}
                                    title="DVLA Verified"
                                    description="Data sourced directly from the official DVLA database"
                                />
                                <FeatureCard
                                    icon={<Search className="w-8 h-8" />}
                                    title="Instant Results"
                                    description="Get vehicle details in seconds with just a reg number"
                                />
                                <FeatureCard
                                    icon={<Car className="w-8 h-8" />}
                                    title="Comprehensive Data"
                                    description="Make, model, colour, fuel type, tax & MOT status"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

/* ---------- Sub-components ---------- */

function DetailCard({
    icon,
    label,
    value,
    color,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: string;
}) {
    return (
        <div className="group bg-white border border-border/60 rounded-2xl p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <div
                className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${color} transition-transform duration-300 group-hover:scale-110`}
            >
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {label}
                </p>
                <p className="text-lg font-bold text-foreground mt-0.5 truncate capitalize">
                    {value.toLowerCase()}
                </p>
            </div>
        </div>
    );
}

function StatusCard({
    label,
    value,
    dueDate,
    type,
}: {
    label: string;
    value: string;
    dueDate?: string;
    type: "success" | "warning";
}) {
    const styles =
        type === "success"
            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
            : "bg-amber-50 border-amber-200 text-amber-700";

    return (
        <div
            className={`rounded-2xl border-2 p-5 ${styles} transition-all duration-300`}
        >
            <div className="flex items-center gap-3">
                {type === "success" ? (
                    <CheckCircle2 className="w-6 h-6" />
                ) : (
                    <AlertCircle className="w-6 h-6" />
                )}
                <div>
                    <p className="text-xs font-medium uppercase tracking-wider opacity-70">
                        {label}
                    </p>
                    <p className="text-lg font-bold">{value}</p>
                    {dueDate && (
                        <p className="text-xs mt-1 opacity-70">Due: {dueDate}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function TechDetail({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {label}
            </p>
            <p className="font-semibold text-foreground mt-0.5">{value}</p>
        </div>
    );
}

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="bg-muted/50 rounded-2xl p-6 text-center space-y-3 hover:bg-muted/80 transition-colors duration-300">
            <div className="w-14 h-14 rounded-xl bg-hero-yellow/20 flex items-center justify-center mx-auto text-hero-yellow">
                {icon}
            </div>
            <h3 className="font-bold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    );
}

export default VehicleLookup;
