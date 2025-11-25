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
import { ChevronLeft, ChevronRight, Car, User, Mail, Phone, Gauge } from "lucide-react";
import confetti from "canvas-confetti";
import { useSwipeable } from "react-swipeable";

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
  registrationNumber: z.string().trim().min(1, "Registration number is required").max(20),
  make: z.string().trim().min(1, "Make is required").max(50),
  model: z.string().trim().min(1, "Model is required").max(50),
  mileage: z.string().trim().min(1, "Mileage is required").regex(/^\d+(,\d+)*$/, "Invalid mileage format"),
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
  registrationNumber: string;
  make: string;
  model: string;
  mileage: string;
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
    registrationNumber: "",
    make: "",
    model: "",
    mileage: "",
    hpiClear: "",
    condition: "",
    notes: ""
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ManualVehicleData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (step === 1) fieldsToValidate = ["registrationNumber"];else if (step === 2) fieldsToValidate = ["make", "model", "mileage", "hpiClear", "condition"];else if (step === 3) fieldsToValidate = ["name", "email", "phone"];
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
  const handleNext = () => {
    if (validateStep(currentStep)) {
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
        registration_number: validatedData.registrationNumber,
        make: validatedData.make,
        model: validatedData.model,
        mileage: mileageInt,
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
            registrationNumber: validatedData.registrationNumber,
            make: validatedData.make,
            model: validatedData.model,
            mileage: mileageInt,
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
        registrationNumber: "",
        make: "",
        model: "",
        mileage: "",
        hpiClear: "",
        condition: "",
        notes: ""
      });
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
        return <div className={`space-y-6 ${animClass}`}>
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-scale-in">
                <Car className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl md:text-xl font-bold text-foreground">What's Your Registration?</h3>
              <p className="text-base md:text-sm text-muted-foreground mt-3">Enter your UK vehicle registration number</p>
            </div>
            <div>
              <Label htmlFor="registrationNumber" className="text-lg md:text-base font-medium">Registration Number</Label>
              <Input id="registrationNumber" value={formData.registrationNumber} onChange={e => handleChange("registrationNumber", e.target.value.toUpperCase())} placeholder="AB12 CDE" className="mt-3 h-14 md:h-12 text-lg text-center font-semibold tracking-wider" autoFocus />
              {errors.registrationNumber && <p className="text-destructive text-sm mt-2 animate-fade-in">{errors.registrationNumber}</p>}
            </div>
            <p className="text-xs text-center text-muted-foreground">💡 Swipe left or tap Next to continue</p>
          </div>;
      case 2:
        return <div className={`space-y-6 md:space-y-5 ${animClass}`}>
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-scale-in">
                <Gauge className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl md:text-xl font-bold text-foreground">Tell Us About Your Car</h3>
              <p className="text-base md:text-sm text-muted-foreground mt-3">Vehicle specifications</p>
            </div>

            <div>
              <Label className="text-base md:text-sm font-medium">What's the condition of the car?</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {[{
                value: "excellent",
                label: "Excellent",
                desc: "Perfect condition"
              }, {
                value: "good",
                label: "Good",
                desc: "Few scratches"
              }, {
                value: "bad",
                label: "Bad",
                desc: "Multiple scratches"
              }].map(option => <button key={option.value} type="button" onClick={() => handleChange("condition", option.value)} className={`flex-1 min-w-[120px] p-3 md:p-2.5 rounded-lg border-2 text-center transition-all ${formData.condition === option.value ? "border-primary bg-primary/10" : "border-border bg-background hover:border-primary/50"}`}>
                    <div className={`font-semibold text-sm md:text-sm ${formData.condition === option.value ? "text-primary" : "text-foreground"}`}>
                      {option.label}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{option.desc}</div>
                  </button>)}
              </div>
              {errors.condition && <p className="text-destructive text-sm mt-1 animate-fade-in">{errors.condition}</p>}
            </div>

            <div>
              <Label className="text-base md:text-sm font-medium">Is the car HPI Clear?</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {[{
                value: "yes",
                label: "Yes"
              }, {
                value: "no",
                label: "No"
              }, {
                value: "unsure",
                label: "Not Sure"
              }].map(option => <button key={option.value} type="button" onClick={() => handleChange("hpiClear", option.value)} className={`flex-1 min-w-[100px] px-4 py-2.5 border-2 rounded-lg text-sm font-medium transition-all ${formData.hpiClear === option.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-background hover:border-primary/50"}`}>
                    {option.label}
                  </button>)}
              </div>
              {errors.hpiClear && <p className="text-destructive text-sm mt-1 animate-fade-in">{errors.hpiClear}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-4">
              <div>
                <Label htmlFor="make" className="text-base md:text-sm font-medium">Make</Label>
                <Input id="make" value={formData.make} onChange={e => handleChange("make", e.target.value)} placeholder="e.g., BMW" className="mt-2 h-12 md:h-10 text-base" />
                {errors.make && <p className="text-destructive text-sm mt-1 animate-fade-in">{errors.make}</p>}
              </div>

              <div>
                <Label htmlFor="model" className="text-base md:text-sm font-medium">Model</Label>
                <Input id="model" value={formData.model} onChange={e => handleChange("model", e.target.value)} placeholder="e.g., 3 Series" className="mt-2 h-12 md:h-10 text-base" />
                {errors.model && <p className="text-destructive text-sm mt-1 animate-fade-in">{errors.model}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="mileage" className="text-base md:text-sm font-medium">Mileage</Label>
              <Input id="mileage" value={formData.mileage} onChange={e => handleChange("mileage", e.target.value)} placeholder="e.g., 45,000" className="mt-2 h-12 md:h-10 text-base" />
              {errors.mileage && <p className="text-destructive text-sm mt-1 animate-fade-in">{errors.mileage}</p>}
            </div>
          </div>;
      case 3:
        return <div className={`space-y-6 md:space-y-5 ${animClass}`}>
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-scale-in">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl md:text-xl font-bold text-foreground">Your Contact Details</h3>
              <p className="text-base md:text-sm text-muted-foreground mt-3">So we can send you the valuation</p>
            </div>

            <div>
              <Label htmlFor="name" className="text-base md:text-sm font-medium">Full Name</Label>
              <Input id="name" value={formData.name} onChange={e => handleChange("name", e.target.value)} placeholder="John Doe" className="mt-2 h-12 md:h-10 text-base" />
              {errors.name && <p className="text-destructive text-sm mt-1 animate-fade-in">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="email" className="text-base md:text-sm font-medium">Email Address</Label>
              <Input id="email" type="email" value={formData.email} onChange={e => handleChange("email", e.target.value)} placeholder="john@example.com" className="mt-2 h-12 md:h-10 text-base" />
              {errors.email && <p className="text-destructive text-sm mt-1 animate-fade-in">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="phone" className="text-base md:text-sm font-medium">Phone Number</Label>
              <Input id="phone" value={formData.phone} onChange={e => handleChange("phone", e.target.value)} placeholder="+44 20 7946 0958" className="mt-2 h-12 md:h-10 text-base" />
              {errors.phone && <p className="text-destructive text-sm mt-1 animate-fade-in">{errors.phone}</p>}
            </div>
          </div>;
      case 4:
        return <div className={`space-y-6 md:space-y-5 ${animClass}`}>
            <div className="text-center mb-6">
              <h3 className="text-2xl md:text-xl font-bold text-foreground">Almost Done!</h3>
              <p className="text-base md:text-sm text-muted-foreground mt-3">Add any extra details (optional)</p>
            </div>

            <div>
              <Label htmlFor="notes" className="text-base md:text-sm font-medium">Additional Notes</Label>
              <Textarea id="notes" value={formData.notes} onChange={e => handleChange("notes", e.target.value)} placeholder="Service history, recent repairs, condition notes..." className="mt-2 min-h-[100px] text-base" />
              {errors.notes && <p className="text-destructive text-sm mt-1 animate-fade-in">{errors.notes}</p>}
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 md:p-5 border border-primary/20 animate-fade-in">
              <h4 className="font-semibold text-lg md:text-base mb-4 flex items-center gap-2">
                <Car className="w-5 h-5" />
                Summary
              </h4>
              <div className="space-y-3 text-base md:text-sm">
                <div className="flex justify-between items-center gap-4 pb-2 border-b border-primary/10">
                  <span className="text-muted-foreground">Registration:</span>
                  <span className="font-bold text-primary">{formData.registrationNumber}</span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-muted-foreground">Vehicle:</span>
                  <span className="font-semibold">{formData.make} {formData.model}</span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-muted-foreground">Mileage:</span>
                  <span className="font-semibold">{formData.mileage}</span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-muted-foreground">Contact:</span>
                  <span className="font-semibold">{formData.name}</span>
                </div>
              </div>
            </div>
          </div>;
      default:
        return null;
    }
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="w-full max-w-xs sm:max-w-[550px] max-h-[90vh] overflow-y-auto px-1 sm:px-6 py-1 sm:py-6 rounded-xl sm:rounded-2xl" {...swipeHandlers}>
        <DialogHeader className="space-y-2 pb-1">
          <DialogTitle className="text-lg md:text-xl">Get Your Free Valuation</DialogTitle>
          <DialogDescription className="text-xs md:text-sm">
            Step {currentStep} of {totalSteps}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-1.5 mb-4 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary/70 h-1.5 rounded-full transition-all duration-500 ease-out" style={{
          width: `${currentStep / totalSteps * 100}%`
        }} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="min-h-[120px] flex flex-col justify-center">{renderStepContent()}</div>

          <div className="flex flex-col sm:flex-row justify-between gap-2 pt-4 border-t">
            {currentStep > 1 ? <Button type="button" variant="outline" onClick={handleBack} className="w-full sm:flex-1 h-10 md:h-11 text-sm md:text-sm touch-manipulation">
                <ChevronLeft className="w-5 h-5 md:w-4 md:h-4 mr-2" />
                Back
              </Button> : <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:flex-1 h-10 md:h-11 text-sm md:text-sm touch-manipulation">
                Cancel
              </Button>}

            <Button type="submit" disabled={isSubmitting} className="w-full sm:flex-1 h-10 md:h-11 text-sm md:text-sm font-semibold touch-manipulation">
              {isSubmitting ? "Submitting..." : currentStep === totalSteps ? "Submit Inquiry" : <>
                  Next
                  <ChevronRight className="w-5 h-5 md:w-4 md:h-4 ml-2" />
                </>}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>;
};
export default ManualEntryDialog;