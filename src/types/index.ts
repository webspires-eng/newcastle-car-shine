export type BookingStatus = "new" | "contacted" | "completed" | "cancelled";

export interface BookingEmail {
  type: "user" | "admin";
  to: string;
  subject: string;
  body: string;
  sentAt: string;
}

export interface Booking {
  id: string;
  createdAt: string;
  status: BookingStatus;
  reg: string;
  make: string;
  model: string;
  year: string | number;
  mileage: string | number;
  condition: string;
  colour: string;
  serviceHistory: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  postcode: string;
  estimatedValue: number;
  offeredPrice?: number;
  notes?: string;
  emails: BookingEmail[];
}
