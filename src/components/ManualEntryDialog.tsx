"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, Calendar, Gauge, ChevronRight, Loader2 } from "lucide-react";

interface ManualEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}

// Lead qualification thresholds.
// Accept ONLY IF mileage < MAX_MILEAGE AND year <= MAX_YEAR.
const MAX_MILEAGE = 100000;
const MAX_YEAR = 2017;

interface DvlaData {
  registrationNumber: string;
  make: string;
  model: string;
  year: number | null;
  colour: string;
  fuelType: string;
  engineCapacity: number | null;
  bodyType: string;
  taxStatus: string;
  taxDueDate: string;
  motStatus: string;
  co2Emissions: number | null;
  euroStatus: string;
  wheelplan: string;
  monthOfFirstRegistration: string;
}

export const ManualEntryDialog = ({
  open,
  onOpenChange,
  onSubmit
}: ManualEntryDialogProps) => {
  const router = useRouter();
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [mileage, setMileage] = useState("");
  const [manualYear, setManualYear] = useState("");
  const [errors, setErrors] = useState<{ reg?: string; mileage?: string; year?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Qualification flow state
  const [needsYear, setNeedsYear] = useState(false); // DVLA couldn't determine year -> ask manually
  const [rejected, setRejected] = useState(false); // vehicle does not qualify
  const [cachedDvla, setCachedDvla] = useState<DvlaData | null>(null);
  const [lookupAttempted, setLookupAttempted] = useState(false);

  // Reset transient state each time the dialog is opened so a fresh entry
  // (e.g. via "Change car") doesn't inherit a previous rejection/year prompt.
  useEffect(() => {
    if (open) {
      setRegistrationNumber("");
      setMileage("");
      setManualYear("");
      setErrors({});
      setIsLoading(false);
      setNeedsYear(false);
      setRejected(false);
      setCachedDvla(null);
      setLookupAttempted(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { reg?: string; mileage?: string; year?: string } = {};

    const cleanedReg = registrationNumber.trim().toUpperCase();
    if (!cleanedReg) {
      newErrors.reg = "Registration number is required";
    }

    // Validate mileage is a positive integer (commas allowed as separators).
    const cleanedMileage = mileage.trim();
    const mileageInt = parseInt(cleanedMileage.replace(/,/g, ""), 10);
    if (!cleanedMileage) {
      newErrors.mileage = "Mileage is required";
    } else if (!/^\d+(,\d+)*$/.test(cleanedMileage)) {
      newErrors.mileage = "Invalid mileage format";
    } else if (!Number.isInteger(mileageInt) || mileageInt <= 0) {
      newErrors.mileage = "Enter a valid mileage";
    }

    // If we've already asked for the year manually, validate that input now.
    const thisYear = new Date().getFullYear();
    let manualYearInt: number | null = null;
    if (needsYear) {
      const trimmedYear = manualYear.trim();
      manualYearInt = parseInt(trimmedYear, 10);
      if (!trimmedYear) {
        newErrors.year = "Year of manufacture is required";
      } else if (
        !/^\d{4}$/.test(trimmedYear) ||
        !Number.isInteger(manualYearInt) ||
        manualYearInt < 1900 ||
        manualYearInt > thisYear + 1
      ) {
        newErrors.year = "Enter a valid 4-digit year";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    setRejected(false);

    // Lookup DVLA (only once per registration — reuse cached result on resubmit).
    let dvlaData: DvlaData | null = cachedDvla;
    if (!dvlaData && !lookupAttempted) {
      try {
        const vrm = cleanedReg.replace(/\s+/g, "").toUpperCase();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        const response = await fetch(`/api/dvla?vrm=${encodeURIComponent(vrm)}`, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (response.ok) {
          const data = await response.json();
          if (data && !data.error) {
            dvlaData = {
              registrationNumber: data.vrm || cleanedReg,
              make: data.make || "",
              model: data.model || "",
              year: data.year ?? null,
              colour: data.colour || "",
              fuelType: data.fuel || "",
              engineCapacity: data.engineCapacity || null,
              bodyType: data.body || "",
              taxStatus: data.taxStatus || "",
              taxDueDate: data.taxDueDate || "",
              motStatus: data.motStatus || "",
              co2Emissions: data.co2Emissions || null,
              euroStatus: data.euroStatus || "",
              wheelplan: data.wheelplan || "",
              monthOfFirstRegistration: data.monthOfFirstRegistration || "",
            };
          }
        }
      } catch (err) {
        console.error("DVLA lookup failed:", err);
      }
      setCachedDvla(dvlaData);
      setLookupAttempted(true);
    }

    // Determine the year of manufacture from the lookup, falling back to manual entry.
    const dvlaYear = dvlaData?.year ? Number(dvlaData.year) : null;
    let year: number;
    if (dvlaYear && Number.isFinite(dvlaYear)) {
      year = dvlaYear;
    } else if (needsYear && manualYearInt) {
      year = manualYearInt;
    } else {
      // Lookup couldn't determine a year — ask the user to enter it manually.
      setNeedsYear(true);
      setIsLoading(false);
      return;
    }

    // ---- Lead qualification gate ----
    // Accept ONLY IF mileage < 100,000 AND year <= 2017.
    const qualifies = mileageInt < MAX_MILEAGE && year <= MAX_YEAR;
    if (!qualifies) {
      // Disqualified: do NOT capture as a lead. Just show a polite message.
      setRejected(true);
      setIsLoading(false);
      return;
    }

    // Qualified — proceed to the valuation / lead-capture step as normal.
    onSubmit();
    setIsLoading(false);
    onOpenChange(false);

    if (typeof window !== "undefined") {
      // Ensure the resolved year (DVLA or manual) is carried through to capture.
      const carriedDvla: DvlaData = dvlaData
        ? { ...dvlaData, year }
        : {
            registrationNumber: cleanedReg,
            make: "",
            model: "",
            year,
            colour: "",
            fuelType: "",
            engineCapacity: null,
            bodyType: "",
            taxStatus: "",
            taxDueDate: "",
            motStatus: "",
            co2Emissions: null,
            euroStatus: "",
            wheelplan: "",
            monthOfFirstRegistration: "",
          };

      sessionStorage.setItem(
        "valuationState",
        JSON.stringify({
          registrationNumber: cleanedReg,
          mileage: cleanedMileage,
          dvlaData: carriedDvla,
        })
      );
    }
    router.push("/valuation");
  };

  const resetAndRetry = () => {
    setRegistrationNumber("");
    setMileage("");
    setManualYear("");
    setErrors({});
    setNeedsYear(false);
    setRejected(false);
    setCachedDvla(null);
    setLookupAttempted(false);
  };

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="w-[calc(100vw-2rem)] max-w-[480px] p-5 sm:p-8 rounded-2xl">
      <DialogHeader className="space-y-1 pb-0">
        <DialogTitle className="text-2xl text-center font-bold text-foreground">
          30 second <span className="text-primary">car valuation</span>
        </DialogTitle>
        <DialogDescription className="text-center text-sm">
          Enter your details to get an instant quote
        </DialogDescription>
      </DialogHeader>

      {rejected ? (
        /* Disqualified view — no lead is captured. */
        <div className="mt-4 text-center space-y-4 py-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Car className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Thanks for your interest
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed px-2">
            Unfortunately we&apos;re not buying vehicles of this age or mileage right now.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={resetAndRetry}
            className="w-full h-12 text-base font-semibold rounded-lg"
          >
            Try another car
          </Button>
        </div>
      ) : (
      <form onSubmit={handleSubmit} className="space-y-5 mt-4">
        {/* Registration Plate Input */}
        <div>
          <div className="flex items-stretch rounded-lg border-2 border-primary overflow-hidden focus-within:ring-2 focus-within:ring-primary/30">
            <div className="bg-[#003DA5] flex items-center justify-center px-3">
              <div className="text-center">
                <span className="text-[10px] text-white block leading-none">🇬🇧</span>
                <span className="text-xs font-bold text-white leading-none">UK</span>
              </div>
            </div>
            <Input
              id="registrationNumber"
              value={registrationNumber}
              onChange={e => {
                setRegistrationNumber(e.target.value.toUpperCase());
                // Registration changed — invalidate any cached lookup / prompts.
                setErrors(prev => ({ ...prev, reg: "" }));
                setNeedsYear(false);
                setManualYear("");
                setCachedDvla(null);
                setLookupAttempted(false);
              }}
              placeholder="Enter reg"
              className="border-0 h-14 text-2xl font-black tracking-widest text-center focus-visible:ring-0 bg-white text-foreground"
              autoFocus
            />
            {registrationNumber && (
              <div className="flex items-center pr-3">
                <span className="text-primary text-xl">✓</span>
              </div>
            )}
          </div>
          {errors.reg && <p className="text-destructive text-sm mt-1 animate-fade-in">{errors.reg}</p>}
        </div>

        {/* Mileage Input */}
        <div>
          <Label htmlFor="mileage" className="text-sm font-medium">Mileage</Label>
          <div className="flex items-stretch rounded-lg border-2 border-primary overflow-hidden mt-1.5 focus-within:ring-2 focus-within:ring-primary/30">
            <div className="bg-secondary/20 flex items-center justify-center px-3">
              <Gauge className="w-5 h-5 text-primary" />
            </div>
            <Input
              id="mileage"
              inputMode="numeric"
              value={mileage}
              onChange={e => {
                setMileage(e.target.value);
                setErrors(prev => ({ ...prev, mileage: "" }));
              }}
              placeholder="10,000"
              className="border-0 h-12 text-lg font-semibold focus-visible:ring-0 bg-white text-foreground"
            />
            {mileage && (
              <div className="flex items-center pr-3">
                <span className="text-primary text-xl">✓</span>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Please ensure accurate mileage</p>
          {errors.mileage && <p className="text-destructive text-sm mt-1 animate-fade-in">{errors.mileage}</p>}
        </div>

        {/* Year of manufacture — only shown when the DVLA lookup can't determine it */}
        {needsYear && (
          <div className="animate-fade-in">
            <Label htmlFor="manualYear" className="text-sm font-medium">Year of manufacture</Label>
            <div className="flex items-stretch rounded-lg border-2 border-primary overflow-hidden mt-1.5 focus-within:ring-2 focus-within:ring-primary/30">
              <div className="bg-secondary/20 flex items-center justify-center px-3">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <Input
                id="manualYear"
                inputMode="numeric"
                maxLength={4}
                value={manualYear}
                onChange={e => {
                  setManualYear(e.target.value.replace(/\D/g, "").slice(0, 4));
                  setErrors(prev => ({ ...prev, year: "" }));
                }}
                placeholder="e.g. 2015"
                className="border-0 h-12 text-lg font-semibold focus-visible:ring-0 bg-white text-foreground"
                autoFocus
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              We couldn&apos;t find your vehicle&apos;s year automatically — please confirm it.
            </p>
            {errors.year && <p className="text-destructive text-sm mt-1 animate-fade-in">{errors.year}</p>}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 text-lg font-bold rounded-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg hover:shadow-xl transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Looking up your vehicle...
            </>
          ) : (
            <>
              Get my car valuation
              <ChevronRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </form>
      )}
    </DialogContent>
  </Dialog>;
};

export default ManualEntryDialog;
