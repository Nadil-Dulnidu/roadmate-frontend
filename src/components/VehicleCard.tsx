import { Card, CardContent } from "@/components/ui/card";
import type { FullVehicle } from "@/lib/types";
import { BookCheckIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { SignupDialog } from "./SignUpDialog";
import { Link } from "react-router";

const VehicleCard = ({ vehicle }: { vehicle: FullVehicle }) => {
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false);
  const { isSignedIn } = useAuth();

  const handleSchedule = () => {
    if (!isSignedIn) {
      setIsSignupDialogOpen(true);
      return;
    }
    console.log("Scheduling vehicle:", vehicle.vehicle_id);
  };

  return (
    <>
      <Card key={vehicle.vehicle_id} className={`relative overflow-hidden rounded-2xl aspect-[3/2] sm:aspect-square group border`}>
        <Link to={`/vehicle/${vehicle.vehicle_id}`}>
          <img src={vehicle.images[0].image_url} alt={vehicle.brand} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
        </Link>
        <p className="absolute top-3 left-3 z-20 font-semibold text-sm text-black bg-white py-1 px-2 rounded-full">
          {vehicle.available.charAt(0).toUpperCase() + vehicle.available.toLocaleLowerCase().slice(1)}
        </p>
        <CardContent className="absolute bottom-0 z-20 text-white flex justify-between items-center w-full py-4 px-5 bg-gradient-to-t from-black/80 to-transparent">
          <div className="left-2">
            <h3 className="text-lg font-semibold">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-sm">
              Rs. {vehicle.price_per_day} <span className="text-xs">per day</span>
            </p>
          </div>
          <div>
            <Button onClick={handleSchedule} variant={"secondary"}>
              <BookCheckIcon className="size-5 text-black" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <SignupDialog isOpen={isSignupDialogOpen} onClose={() => setIsSignupDialogOpen(false)} />
    </>
  );
};

export default VehicleCard;
