import type { FullVehicle } from "../vehicle/vehicleTypes";

export interface Booking {
  readonly booking_id?: number;
  renter_id: string | undefined;
  vehicle: FullVehicle;
  start_date: string;
  end_date: string;
  total_price: number;
  created_at: string
  status: Status;
}

export type Status = "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED";


export interface RentalStateDetails {
  renter_id: string | undefined;
  booking_id: number | undefined;
  vehicle: FullVehicle;
  start_date: string;
  end_date: string;
  total_price: number;
  diff_days: number;
  sub_total: number;
  service_fee: number;
}