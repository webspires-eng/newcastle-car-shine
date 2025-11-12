import { useState } from "react";
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

interface ManualEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ManualVehicleData) => void;
  initialReg?: string;
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
  initialReg = "" 
}: ManualEntryDialogProps) => {
  const [formData, setFormData] = useState<ManualVehicleData>({
    name: "",
    email: "",
    phone: "",
    registrationNumber: initialReg,
    make: "",
    model: "",
    mileage: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ManualVehicleData, string>>>({});

  const handleChange = (field: keyof ManualVehicleData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof ManualVehicleData, string>> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^[\d\s+()-]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }
    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = "Registration number is required";
    }
    if (!formData.make.trim()) newErrors.make = "Make is required";
    if (!formData.model.trim()) newErrors.model = "Model is required";
    if (!formData.mileage.trim()) {
      newErrors.mileage = "Mileage is required";
    } else if (!/^\d+$/.test(formData.mileage.replace(/,/g, ""))) {
      newErrors.mileage = "Invalid mileage";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
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
            >
              Cancel
            </Button>
            <Button type="submit">Submit Vehicle Details</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
