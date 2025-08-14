import { Card, CardContent } from "@/components/ui/card";
import type { Vehicle } from "@/lib/types";

const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => {
  return (
    <Card key={vehicle.vehicle_id} className={`relative overflow-hidden rounded-2xl aspect-[3/2] sm:aspect-square group border`}>
      <img src={vehicle.images[0].imageUrl} alt={vehicle.brand} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
      <CardContent className="absolute bottom-0 left-4 z-20 text-white">
        <h3 className="text-xl font-semibold">{vehicle.brand} {vehicle.model}</h3>
        <p>Rs. {vehicle.price_per_day} <span className="text-xs">per day</span></p>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;
