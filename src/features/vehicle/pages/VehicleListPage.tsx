import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { TabsList } from "@radix-ui/react-tabs";
import VehicleCard from "../components/VehicleCard";
import { useGetVehiclesQuery, selectAllVehicles } from "../vehicleSlice";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { JSX } from "react";
import { toast } from "sonner";
import { useAppSelector } from "@/app/hook";

const categories = [
  {id: "CAR", label: "Cars"}, 
  {id: "SUV", label: "SUVs"}, 
  {id: "PICKUP_TRUCK", label: "Pickup Trucks"}, 
  {id: "VAN", label: "Vans"}, 
  {id: "MOTORCYCLE", label: "Bikes"}
];

const VehicleListPage = () => {
  const { isLoading, isSuccess, isError, error } = useGetVehiclesQuery({ page: 0, size: 8 });
  const vehicles = useAppSelector(state => selectAllVehicles(state, { page: 0, size: 8 }));

  const renderVehicles = () => {
    let content: JSX.Element | null = null;
    if (isLoading) {
      content = <LoadingSpinner size={35} stroke={3.5} speed={1} color="black" />;
    } else if (isSuccess) {
      content = (
        <>
          {categories.map((category) => {
            return (
              <TabsContent key={category.id} value={category.id} className="mt-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {vehicles
                    .filter((v ) => v.vehicle_type === category.id)
                    .map((vehicle) => (
                      <VehicleCard key={vehicle.vehicle_id} vehicle={vehicle} />
                    ))}
                </div>
              </TabsContent>
            );
          })}
        </>
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
    <div className="container mx-auto p-8">
      <h1 className="text-3xl lg:text-4xl font-bold mb-4">Rental Vehicles</h1>
      <Tabs defaultValue="CAR" className="w-full py-5">
        <TabsList className="space-x-2 bg-muted w-fit rounded-lg p-1">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-sn font-semibold">
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
          {renderVehicles()}
      </Tabs>
    </div>
  );
};

export default VehicleListPage;
