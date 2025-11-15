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
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().min(10, "Phone number must be at least 10 characters").max(20, "Phone number must be less than 20 characters").regex(/^[\d\s+()-]+$/, "Invalid phone number format"),
  registrationNumber: z.string().trim().min(1, "Registration number is required").max(20, "Registration number must be less than 20 characters"),
  make: z.string().trim().min(1, "Make is required").max(50, "Make must be less than 50 characters"),
  model: z.string().trim().min(1, "Model is required").max(50, "Model must be less than 50 characters"),
  mileage: z.string().trim().min(1, "Mileage is required").regex(/^\d+(,\d+)*$/, "Invalid mileage format"),
  notes: z.string().trim().max(1000, "Notes must be less than 1000 characters").optional(),
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
  onSubmit
}: ManualEntryDialogProps) => {
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

  const [errors, setErrors] = useState<Partial<Record<keyof ManualVehicleData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof ManualVehicleData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const validatedData = vehicleInquirySchema.parse(formData);
      const mileageInt = parseInt(validatedData.mileage.replace(/,/g, ""), 10);

      const { error } = await supabase
        .from("vehicle_inquiries")
        .insert({
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
        const { error: emailError } = await supabase.functions.invoke('send-inquiry-email', {
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
        });

        if (emailError) {
          console.error('Failed to send email notification:', emailError);
        }
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
      }

      toast.success("Vehicle inquiry submitted successfully! We'll get back to you soon.");
      
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
      
      onOpenChange(false);
      onSubmit();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof ManualVehicleData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof ManualVehicleData] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Please check the form for errors");
      } else {
        console.error("Error submitting vehicle inquiry:", error);
        toast.error("Failed to submit inquiry. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enter Vehicle Details Manually</DialogTitle>
          <DialogDescription>
            Please provide your vehicle and contact information below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="John Smith"
              disabled={isSubmitting}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="john@example.com"
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="07XXX XXXXXX"
              disabled={isSubmitting}
            />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationNumber">Registration Number *</Label>
            <Input
              id="registrationNumber"
              value={formData.registrationNumber}
              onChange={(e) => handleChange("registrationNumber", e.target.value.toUpperCase())}
              placeholder="AB12 CDE"
              disabled={isSubmitting}
            />
            {errors.registrationNumber && (
              <p className="text-sm text-destructive">{errors.registrationNumber}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">Make *</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => handleChange("make", e.target.value)}
                placeholder="BMW"
                disabled={isSubmitting}
              />
              {errors.make && <p className="text-sm text-destructive">{errors.make}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleChange("model", e.target.value)}
                placeholder="3 Series"
                disabled={isSubmitting}
              />
              {errors.model && <p className="text-sm text-destructive">{errors.model}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mileage">Mileage *</Label>
            <Input
              id="mileage"
              value={formData.mileage}
              onChange={(e) => handleChange("mileage", e.target.value)}
              placeholder="50000"
              disabled={isSubmitting}
            />
            {errors.mileage && <p className="text-sm text-destructive">{errors.mileage}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Any additional information about your vehicle..."
              className="min-h-[100px]"
              disabled={isSubmitting}
            />
            {errors.notes && <p className="text-sm text-destructive">{errors.notes}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Inquiry"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
