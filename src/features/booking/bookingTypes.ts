import type { FullVehicle } from "../vehicle/vehicleTypes";

export interface Booking {
  booking_id: number;
  renter_id: string | undefined;
  customer_name: string;
  vehicle: FullVehicle;
  start_date: string;
  end_date: string;
  total_price: number;
  created_at: string
  status: Status;
}

export type Status = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "ACTIVE";


export interface RentalStateDetails {
  renter_id: string | undefined;
  booking_id: number | undefined;
  vehicle: FullVehicle;
  start_date: string;
  end_date: string;
  total_price: number;
  diff_days: number;
  sub_total: number;
  tax_fee: number;
}

export type BookingPageResponse = {
  content: Booking[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
};