import React, { useState } from "react";
import { CalendarIcon, Clock, Info } from "lucide-react";
import type { FullVehicle } from "@/features/vehicle/vehicleTypes";
import { Button } from "../../../components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useCreateBookingMutation } from "../bookingSlice";
import type { Booking, RentalStateDetails } from "../bookingTypes";

export function BookingForm({ vehicle }: { vehicle: FullVehicle }) {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const { getToken, isSignedIn } = useAuth();
  const [createBooking] = useCreateBookingMutation();

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const days = calculateDays();
  const subtotal = vehicle.price_per_day * days;
  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee;

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!startDate || !endDate) 
        throw new Error("Please select both pickup and return dates");
      setIsSubmitting(true);
      const token = await getToken({ template: "RoadMate" });
      const bookingData: Booking = {
        booking_id: 0,
        customer_name: "", // Temporary, will be replaced by backend
        renter_id: user?.id,
        vehicle: vehicle,
        start_date: startDate.toLocaleDateString(),
        end_date: endDate.toLocaleDateString(),
        total_price: total,
        created_at: new Date().toISOString(),
        status: "PENDING",
      };

      const data = await createBooking({
        token,
        booking: bookingData,
      }).unwrap();

      const stateData: RentalStateDetails = {
        renter_id: user?.id,
        booking_id: data.booking_id,
        vehicle: vehicle,
        start_date: startDate.toLocaleDateString(),
        end_date: endDate.toLocaleDateString(),
        total_price: total,
        diff_days: days,
        sub_total: subtotal,
        service_fee: serviceFee,
      };
      toast.success(`Booking submitted for ${vehicle.year} ${vehicle.brand} ${vehicle.model}`);
      const checkoutId = `${vehicle.vehicle_id}-${Date.now()}`;
      navigate(`/checkout/${checkoutId}`, { state: stateData });
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border p-6 sticky top-24">
      <h2 className="text-xl font-semibold mb-6">
        Book {vehicle.brand} {vehicle.model}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Pickup Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Pickup Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Select pickup date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* Return Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Return Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal" disabled={!startDate}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Select return date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} disabled={(date) => !startDate || date < startDate || date < new Date(new Date().setHours(0, 0, 0, 0))} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* Pricing Breakdown */}
          {startDate && endDate && (
            <div className="mt-6 space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {vehicle.price_per_day.toLocaleString("en-US", { style: "currency", currency: "LKR" })} × {days} day{days !== 1 ? "s" : ""}
                </span>
                <span>{subtotal.toLocaleString("en-US", { style: "currency", currency: "LKR" })}</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <span className="text-muted-foreground">Service fee</span>
                  <Info className="h-3 w-3 text-muted-foreground ml-1" />
                </div>
                <span>{serviceFee.toLocaleString("en-US", { style: "currency", currency: "LKR" })}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                <span>Total</span>
                <span>{total.toLocaleString("en-US", { style: "currency", currency: "LKR" })}</span>
              </div>
            </div>
          )}

          {/* Booking Button */}
          {isSignedIn ? (
            <Button
              type="submit"
              disabled={!startDate || !endDate || isSubmitting || user?.publicMetadata.role !== "RENTER"}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 rounded-lg font-medium mt-4 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Clock className="animate-spin mr-2 h-4 w-4" />
                  Processing...
                </>
              ) : (
                <>{user?.publicMetadata.role === "RENTER" ? "Book Now" : "Only Renters can Book"}</>
              )}
            </Button>
          ) : (
            <Link to="/auth/signup">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 rounded-lg font-medium mt-4 flex items-center justify-center">
                Sign in to Book
              </Button>
            </Link>
          )}
        </div>
      </form>

      {/* Additional Info */}
      <div className="mt-6 text-sm text-muted-foreground">
        <p className="flex items-center">
          <Info className="h-4 w-4 mr-2" />
          Free cancellation 48 hours before pickup
        </p>
      </div>
    </div>
  );
}
