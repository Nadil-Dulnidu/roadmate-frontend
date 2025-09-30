export interface FullVehicle {
  vehicle_id: number;
  vehicle_type: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  engine: string;
  transmission: string;
  number_of_seats: number;
  license_plate: string;
  description: string;
  price_per_day: number;
  location: string;
  city: string;
  contact_number: string;
  rating: number;
  review_count: number;
  available: string;
  owner_id: string;
  images: {
    image_id: number;
    vehicle_id: number;
    image_url: string;
  }[];
};

export type VehicleResponse = {
  content: FullVehicle[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
};

export interface NewVehicle {
  vehicle_type: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  engine: string;
  transmission: string;
  number_of_seats: number;
  license_plate: string;
  description: string;
  price_per_day: number;
  location: string;
  city: string;
  contact_number: string;
  owner_id: string;
}
