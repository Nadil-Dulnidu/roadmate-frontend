import AddReviewSection from "@/features/review/components/AddReviewSection";
import type { FullVehicle } from "../vehicleTypes";
import { Star, MapPin, User, Phone } from "lucide-react";
import ReviewList from "@/features/review/components/ReviewList";

export function VehicleDetails({ vehicle }: { vehicle: FullVehicle }) {
  return (
    <div className="space-y-8">
      {/* Header with basic info */}
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">
              {vehicle.year} {vehicle.brand} {vehicle.model}
            </h1>
            <p className="text-muted-foreground">{vehicle.vehicle_type.charAt(0).toUpperCase() + vehicle.vehicle_type.slice(1).toLocaleLowerCase()}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {vehicle.price_per_day.toLocaleString("en-US", { style: "currency", currency: "LKR" })}
              <span className="text-sm font-normal text-muted-foreground">/day</span>
            </div>
          </div>
        </div>
        <div className="flex md:flex-col lg:flex-row items-center mt-2 space-x-4">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="font-medium">{vehicle.rating}</span>
            <span className="text-muted-foreground ml-1">({vehicle.review_count} reviews)</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            {vehicle.location}
          </div>
          <div className="flex items-center text-muted-foreground">
            <User className="h-4 w-4 mr-1"/>
            {"Nadil Dulnidu"}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Phone className="h-4 w-4 mr-1"/>
            {vehicle.contact_number}
          </div>
        </div>
      </div>
      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold mb-2">About this vehicle</h2>
        <p className="text-muted-foreground">{vehicle.description}</p>
      </div>
      {/* Specifications */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Specifications</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Engine</p>
            <p className="font-medium">{vehicle.engine.charAt(0).toUpperCase() + vehicle.engine.slice(1).toLocaleLowerCase()}</p>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Transmission</p>
            <p className="font-medium">{vehicle.transmission.charAt(0).toUpperCase() + vehicle.transmission.slice(1).toLocaleLowerCase()}</p>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Number of Seats</p>
            <p className="font-medium">{vehicle.number_of_seats}</p>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Color</p>
            <p className="font-medium">{vehicle.color}</p>
          </div>
        </div>
      </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-black mb-2">
            Customer Reviews
          </h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <AddReviewSection vehicleId={vehicle.vehicle_id}/>
          <ReviewList vehicleId={vehicle.vehicle_id} />
        </div>
    </div>
  );
}
