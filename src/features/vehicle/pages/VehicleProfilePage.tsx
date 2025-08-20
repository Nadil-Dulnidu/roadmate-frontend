import { VehicleGallery } from "../components/VehicleGallery";
import { VehicleDetails } from "../components/VehicleDetails";
import { BookingForm } from "../../booking/components/BookingForm";
import { useParams } from "react-router";
import { useGetVehicleByIdQuery} from "@/features/vehicle/vehicleSlice";
import type { JSX } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "sonner";

function VehicleProfilePage() {
  const { vehicleId } = useParams();
  const { data: vehicle, isLoading, isSuccess, isError, error } =
  useGetVehicleByIdQuery(Number(vehicleId));

  const renderVehicleProfile = () => {
    let content: JSX.Element | null = null;
    if (isLoading) {
      content = <LoadingSpinner size={35} stroke={3.5} speed={1} color="black" />;
    } else if (isSuccess) {
      content = (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <VehicleGallery images={vehicle.images} />
            <VehicleDetails vehicle={vehicle} />
          </div>
          <div className="lg:col-span-1">
            <BookingForm vehicle={vehicle} />
          </div>
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
      content = <p className="text-center text-gray-500 text-sm">Vehicle Not Found</p>;
    }
    return content;
  };

  return (
      <div className="container mx-auto px-8 py-8">
        {renderVehicleProfile()}
      </div>
  );
}

export default VehicleProfilePage;
