"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import {
  Car,
  Mail,
  Phone,
  MapPin,
  User,
  Gauge,
  ChevronLeft,
  ChevronRight,
  Loader2,
  HelpCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { ManualEntryDialog } from "@/components/ManualEntryDialog";

interface DvlaData {
  make?: string;
  model?: string;
  year?: number | string;
  colour?: string;
  bodyType?: string;
  fuelType?: string;
  engineCapacity?: number;
  taxStatus?: string;
  motStatus?: string;
  co2Emissions?: number;
  euroStatus?: string;
}

interface ValuationState {
  registrationNumber: string;
  mileage: string;
  dvlaData: DvlaData | null;
}

const COMMON_DOMAINS = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com",
  "live.com", "me.com", "googlemail.com", "yahoo.co.uk", "hotmail.co.uk",
  "btinternet.com", "sky.com", "talktalk.net",
];

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[a.length][b.length];
}

function suggestEmailDomain(email: string): string | null {
  const atIdx = email.lastIndexOf("@");
  if (atIdx < 1) return null;
  const typed = email.slice(atIdx + 1).toLowerCase();
  if (!typed || COMMON_DOMAINS.includes(typed)) return null;
  let best: string | null = null;
  let bestDist = 3;
  for (const domain of COMMON_DOMAINS) {
    const dist = levenshtein(typed, domain);
    if (dist < bestDist) {
      bestDist = dist;
      best = domain;
    }
  }
  return best ? `${email.slice(0, atIdx + 1)}${best}` : null;
}

function formatUKPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("44")) {
    const num = digits.slice(2);
    if (num.length <= 4) return `+44 ${num}`;
    if (num.length <= 7) return `+44 ${num.slice(0, 4)} ${num.slice(4)}`;
    return `+44 ${num.slice(0, 4)} ${num.slice(4, 7)} ${num.slice(7, 10)}`;
  }
  if (digits.startsWith("07") || digits.startsWith("7")) {
    const num = digits.startsWith("7") ? "0" + digits : digits;
    if (num.length <= 5) return num;
    if (num.length <= 8) return `${num.slice(0, 5)} ${num.slice(5)}`;
    return `${num.slice(0, 5)} ${num.slice(5, 8)} ${num.slice(8, 11)}`;
  }
  return value;
}

const UK_PHONE_RE = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z
    .string()
    .trim()
    .regex(UK_PHONE_RE, "Enter a valid UK mobile number (e.g. 07700 900000)"),
  postcode: z.string().trim().min(1, "Postcode is required").max(10),
  condition: z.enum(["excellent", "good", "bad"]),
  hpiClear: z.enum(["yes", "no", "unsure"]),
  transmission: z.enum(["automatic", "manual"]),
});

export default function ValuationPage() {
  const router = useRouter();
  const [state, setState] = useState<ValuationState | null>(null);
  const [hydrated, setHydrated] = useState(false);

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
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("valuationState");
      if (raw) setState(JSON.parse(raw) as ValuationState);
    } catch {
      // ignore
    } finally {
      setHydrated(true);
    }
  }, []);

  const handleChange = (field: string, value: string) => {
    if (field === "phone") value = formatUKPhone(value);
    if (field === "email") setEmailSuggestion(suggestEmailDomain(value));
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (!state) return;
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    void commsOptOut;

    const { registrationNumber, mileage, dvlaData } = state;

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
        hpi_clear:
          validated.hpiClear === "yes"
            ? true
            : validated.hpiClear === "no"
            ? false
            : null,
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
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
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
            dvlaData: dvlaData || null,
          }),
        });
      } catch (emailError) {
        console.error("Email notification error:", emailError);
      }

      sessionStorage.setItem(
        "thankYouState",
        JSON.stringify({
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
        })
      );
      router.push("/thank-you");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "issues" in err) {
        const formatted: Record<string, string> = {};
        for (const issue of (err as z.ZodError).issues) {
          formatted[issue.path[0] as string] = issue.message;
        }
        setErrors(formatted);
      } else {
        console.error("Submission error:", err);
        const msg = err instanceof Error ? err.message : "Failed to submit inquiry. Please try again.";
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hydrated && !state) {
    return (
      <main className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 p-8">
            <Car className="w-16 h-16 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold">No vehicle data found</h2>
            <p className="text-muted-foreground">
              Please start by entering your registration number.
            </p>
            <Button onClick={() => router.push("/")} className="mt-4">
              Go to Homepage
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (!state) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  const { registrationNumber, mileage, dvlaData } = state;
  const vehicleDesc = [dvlaData?.make, dvlaData?.model, dvlaData?.bodyType]
    .filter(Boolean)
    .join(" ");
  const vehicleMeta = [dvlaData?.year, dvlaData?.colour, dvlaData?.fuelType]
    .filter(Boolean)
    .join(" • ");

  void confetti;

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <div className="w-full bg-muted h-1.5">
        <div className="bg-primary h-1.5 w-full transition-all duration-500" />
      </div>

      <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Your details</h1>
              <p className="text-sm text-muted-foreground mt-1">Step 2 of 2</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div>
                <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1">
                  Email address
                  <span className="text-muted-foreground text-xs">(So we can send your valuation)</span>
                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                </Label>
                <div
                  className={`flex items-stretch rounded-lg border-2 overflow-hidden mt-1.5 transition-colors ${
                    formData.email && EMAIL_RE.test(formData.email.trim()) && !emailSuggestion
                      ? "border-green-500"
                      : errors.email
                      ? "border-destructive"
                      : "border-border focus-within:border-primary"
                  }`}
                >
                  <div className="bg-muted/30 flex items-center justify-center px-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="e.g. name@email.com"
                    className="border-0 h-12 text-base focus-visible:ring-0 bg-background text-foreground"
                  />
                  <div className="flex items-center pr-3">
                    {formData.email && EMAIL_RE.test(formData.email.trim()) && !emailSuggestion && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                    {formData.email && (!EMAIL_RE.test(formData.email.trim()) || emailSuggestion) && (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                </div>
                {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                {emailSuggestion && !errors.email && (
                  <p className="text-sm mt-1 text-amber-600">
                    Did you mean{" "}
                    <button
                      type="button"
                      className="underline font-medium"
                      onClick={() => {
                        handleChange("email", emailSuggestion);
                        setEmailSuggestion(null);
                      }}
                    >
                      {emailSuggestion}
                    </button>
                    ?
                  </p>
                )}
              </div>

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
                    onChange={(e) => handleChange("postcode", e.target.value.toUpperCase())}
                    placeholder="e.g. NE1 4LP"
                    className="border-0 h-12 text-base focus-visible:ring-0 bg-background text-foreground"
                  />
                </div>
                {errors.postcode && <p className="text-destructive text-sm mt-1">{errors.postcode}</p>}
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-1">
                  Mobile
                  <span className="text-muted-foreground text-xs">(To send your valuation)</span>
                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                </Label>
                <div
                  className={`flex items-stretch rounded-lg border-2 overflow-hidden mt-1.5 transition-colors ${
                    formData.phone && UK_PHONE_RE.test(formData.phone.trim())
                      ? "border-green-500"
                      : errors.phone
                      ? "border-destructive"
                      : "border-border focus-within:border-primary"
                  }`}
                >
                  <div className="bg-muted/30 flex items-center justify-center px-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="e.g. 07700 900000"
                    className="border-0 h-12 text-base focus-visible:ring-0 bg-background text-foreground"
                  />
                </div>
                {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <div className="flex items-stretch rounded-lg border-2 border-border overflow-hidden mt-1.5 focus-within:border-primary transition-colors">
                  <div className="bg-muted/30 flex items-center justify-center px-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="John Doe"
                    className="border-0 h-12 text-base focus-visible:ring-0 bg-background text-foreground"
                  />
                </div>
                {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label className="text-sm font-medium">What&apos;s the condition?</Label>
                <div className="mt-2 flex gap-2">
                  {[
                    { value: "excellent", label: "⭐ Excellent" },
                    { value: "good", label: "👍 Good" },
                    { value: "bad", label: "⚠️ Bad" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleChange("condition", option.value)}
                      className={`flex-1 py-3 rounded-lg border-2 text-center transition-all text-sm font-medium ${
                        formData.condition === option.value
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

              <div>
                <Label className="text-sm font-medium">Is the car HPI Clear?</Label>
                <div className="mt-2 flex gap-2">
                  {[
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                    { value: "unsure", label: "Not Sure" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleChange("hpiClear", option.value)}
                      className={`flex-1 py-3 rounded-lg border-2 text-center transition-all text-sm font-medium ${
                        formData.hpiClear === option.value
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

              <div>
                <Label className="text-sm font-medium">Transmission</Label>
                <div className="mt-2 flex gap-2">
                  {[
                    { value: "automatic", label: "Automatic" },
                    { value: "manual", label: "Manual" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleChange("transmission", option.value)}
                      className={`flex-1 py-3 rounded-lg border-2 text-center transition-all text-sm font-medium ${
                        formData.transmission === option.value
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border bg-background hover:border-primary/50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {errors.transmission && (
                  <p className="text-destructive text-sm mt-1">{errors.transmission}</p>
                )}
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm font-medium">
                  Additional Notes <span className="text-muted-foreground text-xs">(Optional)</span>
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Service history, recent repairs, modifications..."
                  className="mt-1.5 min-h-[80px] text-base border-2 focus:border-primary"
                />
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  By using our service you agree to our{" "}
                  <a href="/terms" className="underline hover:text-foreground">terms and conditions</a>{" "}
                  and{" "}
                  <a href="/privacy" className="underline hover:text-foreground">privacy policy</a>.
                </p>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={commsOptOut}
                    onChange={(e) => setCommsOptOut(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-border"
                  />
                  <span className="text-xs text-muted-foreground">
                    I do not want to receive communications including updates, price changes and seasonal offers.
                  </span>
                </label>
              </div>

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

          <div className="lg:col-span-1 order-first lg:order-last">
            <div className="sticky top-24">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
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

                {dvlaData ? (
                  <div className="text-center space-y-1">
                    <p className="font-bold text-sm leading-snug">{vehicleDesc.toUpperCase()}</p>
                    {vehicleMeta && <p className="text-xs text-muted-foreground">{vehicleMeta}</p>}
                    <div className="mt-4 pt-3 border-t border-border space-y-1.5 text-left">
                      {dvlaData.engineCapacity && (
                        <Spec label="Engine" value={`${dvlaData.engineCapacity}cc`} />
                      )}
                      {dvlaData.taxStatus && <Spec label="Tax" value={dvlaData.taxStatus} />}
                      {dvlaData.motStatus && <Spec label="MOT" value={dvlaData.motStatus} />}
                      {dvlaData.co2Emissions && (
                        <Spec label="CO₂" value={`${dvlaData.co2Emissions} g/km`} />
                      )}
                      {dvlaData.euroStatus && <Spec label="Euro" value={dvlaData.euroStatus} />}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-sm text-muted-foreground py-2">
                    <p>Vehicle details not available</p>
                  </div>
                )}

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
                onSubmit={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Spec({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
