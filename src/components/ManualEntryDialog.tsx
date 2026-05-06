"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, Gauge, ChevronRight, Loader2 } from "lucide-react";

interface ManualEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}

export const ManualEntryDialog = ({
  open,
  onOpenChange,
  onSubmit
}: ManualEntryDialogProps) => {
  const router = useRouter();
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [mileage, setMileage] = useState("");
  const [errors, setErrors] = useState<{ reg?: string; mileage?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { reg?: string; mileage?: string } = {};

    const cleanedReg = registrationNumber.trim().toUpperCase();
    if (!cleanedReg) {
      newErrors.reg = "Registration number is required";
    }

    const cleanedMileage = mileage.trim();
    if (!cleanedMileage) {
      newErrors.mileage = "Mileage is required";
    } else if (!/^\d+(,\d+)*$/.test(cleanedMileage)) {
      newErrors.mileage = "Invalid mileage format";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    // Lookup DVLA
    let dvlaData = null;
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
            year: data.year || null,
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

    setIsLoading(false);
    onOpenChange(false);

    // Navigate to valuation page with data
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "valuationState",
        JSON.stringify({
          registrationNumber: cleanedReg,
          mileage: cleanedMileage,
          dvlaData,
        })
      );
    }
    router.push("/valuation");
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
                setErrors(prev => ({ ...prev, reg: "" }));
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
    </DialogContent>
  </Dialog>;
};

export default ManualEntryDialog;