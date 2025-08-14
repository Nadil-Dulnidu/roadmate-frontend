import { Card, CardContent } from "@/components/ui/card";
import type { Vehicle } from "@/lib/types";
import { BookCheckIcon } from "lucide-react";
import { Button } from "./ui/button";

const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => {
  return (
    <Card key={vehicle.vehicle_id} className={`relative overflow-hidden rounded-2xl aspect-[3/2] sm:aspect-square group border`}>
      <img src={vehicle.images[0].imageUrl} alt={vehicle.brand} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
      <p className="absolute top-3 right-3 z-20 font-semibold text-sm text-black bg-white py-1 px-2 rounded-full">
        {vehicle.available.charAt(0).toUpperCase() + vehicle.available.toLocaleLowerCase().slice(1)}
      </p>
      <CardContent className="absolute bottom-0 z-20 text-white flex justify-between items-center w-full py-4 px-5 bg-gradient-to-t from-black/60 to-transparent">
        <div className="left-2">
          <h3 className="text-xl font-semibold">
            {vehicle.brand} {vehicle.model}
          </h3>
          <p>
            Rs. {vehicle.price_per_day} <span className="text-xs">per day</span>
          </p>
        </div>
        <div>
          <Button variant={"secondary"}>
            <BookCheckIcon className="size-5 text-black" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;
