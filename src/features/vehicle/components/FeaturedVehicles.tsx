import type { JSX } from "react";
import { Button } from "../../../components/ui/button";
import VehicleCard from "./VehicleCard";
import { selectAllVehicles, useGetVehiclesQuery } from "../vehicleSlice";
import { useAppSelector } from "@/app/hook";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "sonner";

export const FeaturedVehicles = () => {
  const { isLoading, isSuccess, isError, error } = useGetVehiclesQuery();
  const vehicles = useAppSelector(selectAllVehicles);

  const renderedVehicles = () => {
    let content: JSX.Element | null = null;
    if (isLoading) {
      content = <LoadingSpinner size={35} stroke={3.5} speed={1} color="black" />;
    } else if (isSuccess) {
      content = (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {vehicles.slice(0, 8).map((car) => (
            <VehicleCard key={car.vehicle_id} vehicle={car} />
          ))}
        </div>
      );
    } else if (isError) {
      toast.error("Something went wrong. Error fetching vehicles");
      let errorMessage = "An error occurred";
      if (error && typeof error === "object") {
        if ("status" in error) {
          errorMessage = `Error: ${JSON.stringify(error.data) || error.status}`;
        } else if ("message" in error) {
          errorMessage = (error as { message?: string }).message || errorMessage;
          console.error(errorMessage);
        }
      }
      content = <p className="text-center text-gray-500 text-sm">Empty vehicles</p>;
    }
    return content;
  };

  return (
    <section id="vehicles" className="pt-14 scroll-mt-7">
      <div className="container mx-auto px-8">
        <div className="mb-10 flex justify-between items-center align-middle">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-1">Luxury Vehicles For Rent</h2>
            <p className="text-lg text-muted-foreground">Experience premium comfort and style on every journey.</p>
          </div>
          <Button className="text-lg font-bold" variant={"link"}>
            <a href="#">View more</a>
          </Button>
        </div>
        {renderedVehicles()}
      </div>
    </section>
  );
};
