export type Vehicle = {
  vehicle_id: number;
  vehicle_type: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  description: string;
  price_per_day: number;
  location: string;
  city: string;
  contact_number: string;
  available: string;
  owner: {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    contact_number: string;
  };
  images: {
    image_id: number;
    imageUrl: string;
  }[];
};
