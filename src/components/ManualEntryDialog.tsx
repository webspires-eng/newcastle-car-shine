import { useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import confetti from "canvas-confetti";

// Initialize Supabase client with safe fallbacks to avoid crashes when envs are missing
const FALLBACK_URL = "https://ggarxjzwywppoqtehvhb.supabase.co";
const FALLBACK_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnYXJ4anp3eXdwcG9xdGVodmhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MDE2MTUsImV4cCI6MjA3ODQ3NzYxNX0.uT-aCK6STBoJpaMYWJGEbLxhqnDCEBGJYaIczAM1LhU";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || FALLBACK_KEY;
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
  console.warn(
    "Supabase env variables missing; using safe fallbacks to keep the app running."
  );
}
const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const vehicleInquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 characters")
    .max(20, "Phone number must be less than 20 characters")
    .regex(/^[\d\s+()-]+$/, "Invalid phone number format"),
  registrationNumber: z
    .string()
    .trim()
    .min(1, "Registration number is required")
    .max(20, "Registration number must be less than 20 characters"),
  make: z
    .string()
    .trim()
    .min(1, "Make is required")
    .max(50, "Make must be less than 50 characters"),
  model: z
    .string()
    .trim()
    .min(1, "Model is required")
    .max(50, "Model must be less than 50 characters"),
  mileage: z
    .string()
    .trim()
    .min(1, "Mileage is required")
    .regex(/^\d+(,\d+)*$/, "Invalid mileage format"),
  notes: z
    .string()
    .trim()
    .max(1000, "Notes must be less than 1000 characters")
    .optional(),
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
  notes: string;
}

export const ManualEntryDialog = ({
  open,
  onOpenChange,
  onSubmit,
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
    notes: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ManualVehicleData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 3;

  // Confetti celebration function
  const celebrate = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const handleChange = (field: keyof ManualVehicleData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof ManualVehicleData, string>> = {};
    let fieldsToValidate: (keyof ManualVehicleData)[] = [];

    if (step === 1) {
      fieldsToValidate = ["name", "email", "phone"];
    } else if (step === 2) {
      fieldsToValidate = ["registrationNumber", "make", "model", "mileage"];
    }

    const partialSchema = z.object(
      fieldsToValidate.reduce((acc, field) => {
        acc[field] = vehicleInquirySchema.shape[field];
        return acc;
      }, {} as any)
    );

    try {
      const dataToValidate = fieldsToValidate.reduce((acc, field) => {
        acc[field] = formData[field];
        return acc;
      }, {} as any);
      
      partialSchema.parse(dataToValidate);
      return true;
    } catch (err: any) {
      if (err?.issues) {
        for (const issue of err.issues as Array<{ path: (keyof ManualVehicleData)[]; message: string }>) {
          const field = issue.path[0];
          newErrors[field] = issue.message;
        }
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

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

      const { error } = await supabase.from("vehicle_inquiries").insert({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        registration_number: validatedData.registrationNumber,
        make: validatedData.make,
        model: validatedData.model,
        mileage: mileageInt,
        notes: validatedData.notes || null,
      });

      if (error) throw error;

      try {
        const { error: emailError } = await supabase.functions.invoke(
          "send-inquiry-email",
          {
            body: {
              name: validatedData.name,
              email: validatedData.email,
              phone: validatedData.phone,
              registrationNumber: validatedData.registrationNumber,
              make: validatedData.make,
              model: validatedData.model,
              mileage: mileageInt,
              notes: validatedData.notes || undefined,
            },
          }
        );

        if (emailError) {
          console.error("Failed to send email notification:", emailError);
        }
      } catch (emailError) {
        console.error("Error sending email notification:", emailError);
      }

      toast.success("Inquiry submitted successfully!");
      celebrate(); // Trigger confetti celebration
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
        notes: "",
      });
      setCurrentStep(1);
    } catch (err: any) {
      if (err?.issues) {
        const formattedErrors: Partial<Record<keyof ManualVehicleData, string>> = {};
        for (const issue of err.issues as Array<{ path: (keyof ManualVehicleData)[]; message: string }>) {
          const field = issue.path[0];
          formattedErrors[field] = issue.message;
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5 md:space-y-4 animate-fade-in">
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-lg font-semibold text-foreground">Your Contact Information</h3>
              <p className="text-base md:text-sm text-muted-foreground mt-2">We'll use this to get back to you</p>
            </div>
            <div>
              <Label htmlFor="name" className="text-base md:text-sm">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="John Doe"
                className="mt-2 h-12 md:h-10 text-base"
              />
              {errors.name && (
                <p className="text-destructive text-sm mt-2">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-base md:text-sm">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="john@example.com"
                className="mt-2 h-12 md:h-10 text-base"
              />
              {errors.email && (
                <p className="text-destructive text-sm mt-2">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone" className="text-base md:text-sm">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+44 20 7946 0958"
                className="mt-2 h-12 md:h-10 text-base"
              />
              {errors.phone && (
                <p className="text-destructive text-sm mt-2">{errors.phone}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5 md:space-y-4 animate-fade-in">
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-lg font-semibold text-foreground">Vehicle Details</h3>
              <p className="text-base md:text-sm text-muted-foreground mt-2">Tell us about your car</p>
            </div>
            <div>
              <Label htmlFor="registrationNumber" className="text-base md:text-sm">Registration Number</Label>
              <Input
                id="registrationNumber"
                value={formData.registrationNumber}
                onChange={(e) =>
                  handleChange("registrationNumber", e.target.value.toUpperCase())
                }
                placeholder="AB12 CDE"
                className="mt-2 h-12 md:h-10 text-base"
              />
              {errors.registrationNumber && (
                <p className="text-destructive text-sm mt-2">
                  {errors.registrationNumber}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-4">
              <div>
                <Label htmlFor="make" className="text-base md:text-sm">Make</Label>
                <Input
                  id="make"
                  value={formData.make}
                  onChange={(e) => handleChange("make", e.target.value)}
                  placeholder="BMW"
                  className="mt-2 h-12 md:h-10 text-base"
                />
                {errors.make && (
                  <p className="text-destructive text-sm mt-2">{errors.make}</p>
                )}
              </div>

              <div>
                <Label htmlFor="model" className="text-base md:text-sm">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleChange("model", e.target.value)}
                  placeholder="3 Series"
                  className="mt-2 h-12 md:h-10 text-base"
                />
                {errors.model && (
                  <p className="text-destructive text-sm mt-2">{errors.model}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="mileage" className="text-base md:text-sm">Mileage</Label>
              <Input
                id="mileage"
                value={formData.mileage}
                onChange={(e) => handleChange("mileage", e.target.value)}
                placeholder="45,000"
                className="mt-2 h-12 md:h-10 text-base"
              />
              {errors.mileage && (
                <p className="text-destructive text-sm mt-2">{errors.mileage}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5 md:space-y-4 animate-fade-in">
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-lg font-semibold text-foreground">Almost Done!</h3>
              <p className="text-base md:text-sm text-muted-foreground mt-2">Any additional details? (optional)</p>
            </div>
            <div>
              <Label htmlFor="notes" className="text-base md:text-sm">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Service history, recent repairs, condition notes..."
                className="mt-2 min-h-[140px] md:min-h-[120px] text-base"
              />
              {errors.notes && (
                <p className="text-destructive text-sm mt-2">{errors.notes}</p>
              )}
            </div>

            <div className="bg-muted/50 rounded-lg p-5 md:p-4 mt-6">
              <h4 className="font-semibold text-base md:text-sm mb-4 md:mb-3">Summary</h4>
              <div className="space-y-3 md:space-y-2 text-base md:text-sm">
                <div className="flex justify-between items-start gap-4">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium text-right">{formData.name}</span>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <span className="text-muted-foreground">Vehicle:</span>
                  <span className="font-medium text-right">{formData.make} {formData.model}</span>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <span className="text-muted-foreground">Registration:</span>
                  <span className="font-medium text-right">{formData.registrationNumber}</span>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <span className="text-muted-foreground">Mileage:</span>
                  <span className="font-medium text-right">{formData.mileage}</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl md:text-lg">Get Your Free Valuation</DialogTitle>
          <DialogDescription className="text-base md:text-sm">
            Step {currentStep} of {totalSteps}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-3 md:h-2 mb-4">
          <div
            className="bg-primary h-3 md:h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        <form onSubmit={handleSubmit}>
          {renderStepContent()}

          <div className="flex justify-between gap-3 mt-8 md:mt-6 pt-6 md:pt-4 border-t">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex-1 h-12 md:h-10 text-base md:text-sm"
              >
                <ChevronLeft className="w-5 h-5 md:w-4 md:h-4 mr-2" />
                Back
              </Button>
            )}
            
            {currentStep === 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 h-12 md:h-10 text-base md:text-sm"
              >
                Cancel
              </Button>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 md:h-10 text-base md:text-sm"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : currentStep === totalSteps ? (
                "Submit Inquiry"
              ) : (
                <>
                  Next
                  <ChevronRight className="w-5 h-5 md:w-4 md:h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ManualEntryDialog;
