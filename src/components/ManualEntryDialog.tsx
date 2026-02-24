import { useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { ChevronLeft, ChevronRight, Car, User, Mail, Phone, Gauge, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";
import { useSwipeable } from "react-swipeable";
import { supabase as supabaseClient } from "@/integrations/supabase/client";

// Initialize Supabase client with safe fallbacks
const FALLBACK_URL = "https://ggarxjzwywppoqtehvhb.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnYXJ4anp3eXdwcG9xdGVodmhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MDE2MTUsImV4cCI6MjA3ODQ3NzYxNX0.uT-aCK6STBoJpaMYWJGEbLxhqnDCEBGJYaIczAM1LhU";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || FALLBACK_KEY;
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
  console.warn("Supabase env variables missing; using safe fallbacks.");
}
const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
const vehicleInquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(10, "Phone must be at least 10 characters").max(20).regex(/^[\d\s+()-]+$/, "Invalid phone format"),
  postcode: z.string().trim().min(1, "Postcode is required").max(10),
  registrationNumber: z.string().trim().min(1, "Registration number is required").max(20),
  make: z.string().trim().min(1, "Make is required").max(50),
  model: z.string().trim().min(1, "Model is required").max(50),
  mileage: z.string().trim().min(1, "Mileage is required").regex(/^\d+(,\d+)*$/, "Invalid mileage format"),
  transmission: z.enum(["automatic", "manual"], {
    required_error: "Please select transmission type"
  }),
  hpiClear: z.enum(["yes", "no", "unsure"], {
    required_error: "Please select an option"
  }),
  condition: z.enum(["excellent", "good", "bad"], {
    required_error: "Please select a condition"
  }),
  notes: z.string().trim().max(1000).optional()
});
interface ManualEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}
export interface ManualVehicleData {
  name: string;
  email: string;
  phone: string;
  postcode: string;
  registrationNumber: string;
  make: string;
  model: string;
  mileage: string;
  transmission: string;
  hpiClear: string;
  condition: string;
  notes: string;
}
export const ManualEntryDialog = ({
  open,
  onOpenChange,
  onSubmit
}: ManualEntryDialogProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ManualVehicleData>({
    name: "",
    email: "",
    phone: "",
    postcode: "",
    registrationNumber: "",
    make: "",
    model: "",
    mileage: "",
    transmission: "",
    hpiClear: "",
    condition: "",
    notes: ""
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ManualVehicleData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [dvlaData, setDvlaData] = useState<any>(null);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const totalSteps = 4;

  // Confetti celebration
  const celebrate = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 9999
    };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2
        }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2
        }
      });
    }, 250);
  };
  const handleChange = (field: keyof ManualVehicleData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setErrors(prev => ({
      ...prev,
      [field]: ""
    }));
  };
  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof ManualVehicleData, string>> = {};
    let fieldsToValidate: (keyof ManualVehicleData)[] = [];
    if (step === 1) fieldsToValidate = ["registrationNumber"]; else if (step === 2) fieldsToValidate = ["make", "model", "mileage", "transmission", "hpiClear", "condition"]; else if (step === 3) fieldsToValidate = ["name", "email", "phone", "postcode"];
    const partialSchema = z.object(fieldsToValidate.reduce((acc, field) => {
      acc[field] = vehicleInquirySchema.shape[field];
      return acc;
    }, {} as any));
    try {
      const dataToValidate = fieldsToValidate.reduce((acc, field) => {
        acc[field] = formData[field];
        return acc;
      }, {} as any);
      partialSchema.parse(dataToValidate);
      return true;
    } catch (err: any) {
      if (err?.issues) {
        for (const issue of err.issues as Array<{
          path: (keyof ManualVehicleData)[];
          message: string;
        }>) {
          newErrors[issue.path[0]] = issue.message;
        }
        setErrors(newErrors);
      }
      return false;
    }
  };
  const lookupDvla = async (reg: string) => {
    setIsLookingUp(true);
    setDvlaData(null);
    try {
      const { data, error } = await supabaseClient.functions.invoke("dvla-lookup", {
        body: { registrationNumber: reg },
      });
      if (error) throw error;
      if (data && !data.error) {
        setDvlaData(data);
        // Auto-fill make and model
        if (data.make) handleChange("make", data.make);
        if (data.model) handleChange("model", data.model);
      }
    } catch (err) {
      console.error("DVLA lookup failed:", err);
      // Silent fail — user can still enter manually
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 1) {
        lookupDvla(formData.registrationNumber);
      }
      setSlideDirection("right");
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };
  const handleBack = () => {
    setSlideDirection("left");
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentStep < totalSteps && !isSubmitting) handleNext();
    },
    onSwipedRight: () => {
      if (currentStep > 1 && !isSubmitting) handleBack();
    },
    trackMouse: false,
    trackTouch: true,
    delta: 50
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < totalSteps) {
      handleNext();
      return;
    }
    setIsSubmitting(true);
    setErrors({});
    try {
      const validatedData = vehicleInquirySchema.parse(formData);
      const mileageInt = parseInt(validatedData.mileage.replace(/,/g, ""), 10);
      const {
        error
      } = await supabase.from("vehicle_inquiries").insert({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        postcode: validatedData.postcode,
        registration_number: validatedData.registrationNumber,
        make: validatedData.make,
        model: validatedData.model,
        mileage: mileageInt,
        transmission: validatedData.transmission,
        hpi_clear: validatedData.hpiClear === "yes" ? true : validatedData.hpiClear === "no" ? false : null,
        condition: validatedData.condition,
        notes: validatedData.notes || null
      });
      if (error) throw error;
      try {
        await supabase.functions.invoke("send-inquiry-email", {
          body: {
            name: validatedData.name,
            email: validatedData.email,
            phone: validatedData.phone,
            postcode: validatedData.postcode,
            registrationNumber: validatedData.registrationNumber,
            make: validatedData.make,
            model: validatedData.model,
            mileage: mileageInt,
            transmission: validatedData.transmission,
            hpiClear: validatedData.hpiClear,
            condition: validatedData.condition,
            notes: validatedData.notes || undefined
          }
        });
      } catch (emailError) {
        console.error("Email notification error:", emailError);
      }
      toast.success("Inquiry submitted successfully!");
      celebrate();
      onSubmit();
      onOpenChange(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        postcode: "",
        registrationNumber: "",
        make: "",
        model: "",
        mileage: "",
        transmission: "",
        hpiClear: "",
        condition: "",
        notes: ""
      });
      setDvlaData(null);
      setCurrentStep(1);
    } catch (err: any) {
      if (err?.issues) {
        const formattedErrors: Partial<Record<keyof ManualVehicleData, string>> = {};
        for (const issue of err.issues as Array<{
          path: (keyof ManualVehicleData)[];
          message: string;
        }>) {
          formattedErrors[issue.path[0]] = issue.message;
        }
        setErrors(formattedErrors);
      } else {
        console.error(err);
        toast.error("Failed to submit inquiry. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const getAnimationClass = () => {
    return slideDirection === "right" ? "animate-[slideInRight_0.3s_ease-out]" : "animate-[slideInLeft_0.3s_ease-out]";
  };
  const renderStepContent = () => {
    const animClass = getAnimationClass();
    switch (currentStep) {
      case 1:
        return <div className={`space-y-4 ${animClass}`}>
          <div className="text-center mb-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 animate-scale-in">
              <Car className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground">What's Your Registration?</h3>
            <p className="text-sm text-muted-foreground mt-1">Enter your UK vehicle registration number</p>
          </div>
          <div>
            <Label htmlFor="registrationNumber" className="text-sm font-medium">Registration Number</Label>
            <Input id="registrationNumber" value={formData.registrationNumber} onChange={e => handleChange("registrationNumber", e.target.value.toUpperCase())} placeholder="AB12 CDE" className="mt-2 h-11 text-base text-center font-semibold tracking-wider" autoFocus />
            {errors.registrationNumber && <p className="text-destructive text-sm mt-1 animate-fade-in">{errors.registrationNumber}</p>}
          </div>
          <p className="text-xs text-center text-muted-foreground">💡 Swipe left or tap Next to continue</p>
        </div>;
      case 2:
        return <div className={`space-y-3 ${animClass}`}>
          <div className="text-center mb-3">
            <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 animate-scale-in">
              <Gauge className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Tell Us About Your Car</h3>
            <p className="text-sm text-muted-foreground mt-1">Vehicle specifications</p>
          </div>

          {/* DVLA Data Banner */}
          {isLookingUp && (
            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20 animate-fade-in">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Looking up vehicle details...</span>
            </div>
          )}
          {dvlaData && !isLookingUp && (
            <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800 animate-fade-in">
              <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">✅ DVLA Data Found</p>
              <div className="grid grid-cols-2 gap-1 text-xs text-green-800 dark:text-green-300">
                {dvlaData.colour && <span>Colour: <strong>{dvlaData.colour}</strong></span>}
                {dvlaData.fuelType && <span>Fuel: <strong>{dvlaData.fuelType}</strong></span>}
                {dvlaData.year && <span>Year: <strong>{dvlaData.year}</strong></span>}
                {dvlaData.taxStatus && <span>Tax: <strong>{dvlaData.taxStatus}</strong></span>}
                {dvlaData.motStatus && <span>MOT: <strong>{dvlaData.motStatus}</strong></span>}
                {dvlaData.engineCapacity && <span>Engine: <strong>{dvlaData.engineCapacity}cc</strong></span>}
              </div>
            </div>
          )}

          <div>
            <Label className="text-sm font-medium">What's the condition of the car?</Label>
            <div className="mt-1.5 flex gap-2">
              {[{ value: "excellent", label: "Excellent" }, { value: "good", label: "Good" }, { value: "bad", label: "Bad" }].map(option => (
                <button key={option.value} type="button" onClick={() => handleChange("condition", option.value)} className={`flex-1 py-2 rounded-lg border-2 text-center transition-all text-sm font-medium ${formData.condition === option.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-background hover:border-primary/50"}`}>
                  {option.label}
                </button>
              ))}
            </div>
            {errors.condition && <p className="text-destructive text-xs mt-1 animate-fade-in">{errors.condition}</p>}
          </div>

          <div>
            <Label className="text-sm font-medium">Is the car HPI Clear?</Label>
            <div className="mt-1.5 flex gap-2">
              {[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Not Sure" }].map(option => (
                <button key={option.value} type="button" onClick={() => handleChange("hpiClear", option.value)} className={`flex-1 py-2 border-2 rounded-lg text-sm font-medium transition-all ${formData.hpiClear === option.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-background hover:border-primary/50"}`}>
                  {option.label}
                </button>
              ))}
            </div>
            {errors.hpiClear && <p className="text-destructive text-xs mt-1 animate-fade-in">{errors.hpiClear}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="make" className="text-sm font-medium">Make</Label>
              <Input id="make" value={formData.make} onChange={e => handleChange("make", e.target.value)} placeholder="e.g., BMW" className="mt-1 h-10 text-sm" />
              {errors.make && <p className="text-destructive text-xs mt-1 animate-fade-in">{errors.make}</p>}
            </div>
            <div>
              <Label htmlFor="model" className="text-sm font-medium">Model</Label>
              <Input id="model" value={formData.model} onChange={e => handleChange("model", e.target.value)} placeholder="e.g., 3 Series" className="mt-1 h-10 text-sm" />
              {errors.model && <p className="text-destructive text-xs mt-1 animate-fade-in">{errors.model}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="mileage" className="text-sm font-medium">Mileage</Label>
            <Input id="mileage" value={formData.mileage} onChange={e => handleChange("mileage", e.target.value)} placeholder="e.g., 45,000" className="mt-1 h-10 text-sm" />
            {errors.mileage && <p className="text-destructive text-xs mt-1 animate-fade-in">{errors.mileage}</p>}
          </div>

          <div>
            <Label className="text-sm font-medium">Transmission</Label>
            <div className="mt-1.5 flex gap-2">
              {[{ value: "automatic", label: "Automatic" }, { value: "manual", label: "Manual" }].map(option => (
                <button key={option.value} type="button" onClick={() => handleChange("transmission", option.value)} className={`flex-1 py-2 rounded-lg border-2 text-center transition-all text-sm font-medium ${formData.transmission === option.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-background hover:border-primary/50"}`}>
                  {option.label}
                </button>
              ))}
            </div>
            {errors.transmission && <p className="text-destructive text-xs mt-1 animate-fade-in">{errors.transmission}</p>}
          </div>
        </div>;
      case 3:
        return <div className={`space-y-3 ${animClass}`}>
          <div className="text-center mb-3">
            <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 animate-scale-in">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Your Contact Details</h3>
            <p className="text-sm text-muted-foreground mt-1">So we can send you the valuation</p>
          </div>

          <div>
            <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
            <Input id="name" value={formData.name} onChange={e => handleChange("name", e.target.value)} placeholder="John Doe" className="mt-1 h-10 text-sm" />
            {errors.name && <p className="text-destructive text-xs mt-1 animate-fade-in">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
            <Input id="email" type="email" value={formData.email} onChange={e => handleChange("email", e.target.value)} placeholder="john@example.com" className="mt-1 h-10 text-sm" />
            {errors.email && <p className="text-destructive text-xs mt-1 animate-fade-in">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
            <Input id="phone" value={formData.phone} onChange={e => handleChange("phone", e.target.value)} placeholder="+44 20 7946 0958" className="mt-1 h-10 text-sm" />
            {errors.phone && <p className="text-destructive text-xs mt-1 animate-fade-in">{errors.phone}</p>}
          </div>

          <div>
            <Label htmlFor="postcode" className="text-sm font-medium">Postcode</Label>
            <Input id="postcode" value={formData.postcode} onChange={e => handleChange("postcode", e.target.value.toUpperCase())} placeholder="e.g., NE1 4LP" className="mt-1 h-10 text-sm" />
            {errors.postcode && <p className="text-destructive text-xs mt-1 animate-fade-in">{errors.postcode}</p>}
          </div>
        </div>;
      case 4:
        return <div className={`space-y-3 ${animClass}`}>
          <div className="text-center mb-2">
            <h3 className="text-lg font-bold text-foreground">Almost Done!</h3>
            <p className="text-sm text-muted-foreground mt-1">Add any extra details (optional)</p>
          </div>

          <div>
            <Label htmlFor="notes" className="text-sm font-medium">Additional Notes</Label>
            <Textarea id="notes" value={formData.notes} onChange={e => handleChange("notes", e.target.value)} placeholder="Service history, recent repairs..." className="mt-1 min-h-[70px] text-sm" />
            {errors.notes && <p className="text-destructive text-xs mt-1 animate-fade-in">{errors.notes}</p>}
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-3 border border-primary/20 animate-fade-in">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Car className="w-4 h-4" />
              Summary
            </h4>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between items-center gap-2">
                <span className="text-muted-foreground">Registration:</span>
                <span className="font-bold text-primary">{formData.registrationNumber}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-muted-foreground">Vehicle:</span>
                <span className="font-semibold">{formData.make} {formData.model}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-muted-foreground">Mileage:</span>
                <span className="font-semibold">{formData.mileage}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-muted-foreground">Transmission:</span>
                <span className="font-semibold capitalize">{formData.transmission}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-muted-foreground">Contact:</span>
                <span className="font-semibold">{formData.name}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-muted-foreground">Postcode:</span>
                <span className="font-semibold">{formData.postcode}</span>
              </div>
            </div>
          </div>
        </div>;
      default:
        return null;
    }
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="w-[92vw] max-w-[500px] max-h-[85vh] overflow-y-auto p-4 sm:p-6 rounded-2xl" {...swipeHandlers}>
      <DialogHeader className="space-y-1 pb-0">
        <DialogTitle className="text-lg">Get Your Free Valuation</DialogTitle>
        <DialogDescription className="text-xs">
          Step {currentStep} of {totalSteps}
        </DialogDescription>
      </DialogHeader>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-1.5 mb-2 overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/70 h-1.5 rounded-full transition-all duration-500 ease-out" style={{
          width: `${currentStep / totalSteps * 100}%`
        }} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="min-h-[100px]">{renderStepContent()}</div>

        <div className="flex justify-between gap-3 pt-3 border-t">
          {currentStep > 1 && (
            <Button type="button" variant="outline" onClick={handleBack} className="flex-1 h-10 text-sm touch-manipulation">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}

          <Button type="submit" disabled={isSubmitting} className={`${currentStep === 1 ? 'w-full' : 'flex-1'} h-10 text-sm font-semibold touch-manipulation`}>
            {isSubmitting ? "Submitting..." : currentStep === totalSteps ? "Submit Inquiry" : <>
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </>}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>;
};
export default ManualEntryDialog;