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
  available: string;
  owner: {
    user_id: number;
    clerk_id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    created_at: string;
  };
  images: {
    image_id: number;
    imageUrl: string;
  }[];
};
