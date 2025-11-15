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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Server-side validation schema
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
      // Validate with zod schema
      const validatedData = vehicleInquirySchema.parse(formData);

      // Convert mileage string to integer
      const mileageInt = parseInt(validatedData.mileage.replace(/,/g, ""), 10);

      // Insert into Supabase
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

      // Send email notification to sales team
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
          // Don't fail the submission if email fails
        }
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Don't fail the submission if email fails
      }

      // Success
      toast.success("Vehicle inquiry submitted successfully! We'll get back to you soon.");
      
      // Reset form
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
        // Handle validation errors
        const fieldErrors: Partial<Record<keyof ManualVehicleData, string>> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof ManualVehicleData;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        // Handle database errors
        console.error("Error submitting inquiry:", error);
        toast.error("Failed to submit inquiry. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manual Vehicle Entry</DialogTitle>
          <DialogDescription>
            Enter your vehicle details manually. We'll get back to you with a valuation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="John Smith"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="07700 900000"
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Registration Number *</Label>
              <Input
                id="registrationNumber"
                value={formData.registrationNumber}
                onChange={(e) => handleChange("registrationNumber", e.target.value.toUpperCase())}
                placeholder="OO07 HAD"
              />
              {errors.registrationNumber && (
                <p className="text-sm text-destructive">{errors.registrationNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="make">Make *</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => handleChange("make", e.target.value)}
                placeholder="BMW"
              />
              {errors.make && (
                <p className="text-sm text-destructive">{errors.make}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleChange("model", e.target.value)}
                placeholder="3 Series"
              />
              {errors.model && (
                <p className="text-sm text-destructive">{errors.model}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage *</Label>
              <Input
                id="mileage"
                value={formData.mileage}
                onChange={(e) => handleChange("mileage", e.target.value)}
                placeholder="50,000"
              />
              {errors.mileage && (
                <p className="text-sm text-destructive">{errors.mileage}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Any additional information about your vehicle..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Vehicle Details"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
