import { Button } from "./ui/button";
import {vehicle} from "@/data/mockData";
import type { Vehicle } from "@/lib/types";
import VehicleCard from "./VehicleCard";

export const FeaturedVehicles = () => {
  const featuredVehicles: Vehicle[] = vehicle;
  return (
    <section id="vehicles" className="pt-14 scroll-mt-7">
      <div className="container mx-auto px-8">
         <div className="mb-10 flex justify-between items-center align-middle">
           <div>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-1">
            Luxury Vehicles For Rent
          </h2>
          <p className="text-lg text-muted-foreground">Experience premium comfort and style on every journey.</p>
           </div>
          <Button className="text-lg font-bold" variant={"link"}>
            <a href="#">View more</a>
          </Button>
         </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {featuredVehicles.slice(0,8).map((car) => (
            <VehicleCard key={car.vehicle_id} vehicle={car} />
          ))}
        </div>
      </div>
    </section>
  );
};
