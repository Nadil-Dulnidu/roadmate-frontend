import React, { useState } from "react";
import { CalendarIcon, Clock, Info } from "lucide-react";
import type { FullVehicle } from "@/lib/types";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export function BookingForm({ vehicle }: { vehicle: FullVehicle }) {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;
    setIsSubmitting(true);
    setTimeout(() => {
      alert(`Booking submitted for ${vehicle.year} ${vehicle.brand} ${vehicle.model} from ${format(startDate, "PPP")} to ${format(endDate, "PPP")}`);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="bg-card rounded-lg border p-6 sticky top-24">
      <h2 className="text-xl font-semibold mb-6">Book this vehicle</h2>
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
                  Rs.{vehicle.price_per_day} × {days} day{days !== 1 ? "s" : ""}
                </span>
                <span>Rs.{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <span className="text-muted-foreground">Service fee</span>
                  <Info className="h-3 w-3 text-muted-foreground ml-1" />
                </div>
                <span>Rs.{serviceFee}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                <span>Total</span>
                <span>Rs.{total}</span>
              </div>
            </div>
          )}

          {/* Booking Button */}
          <Button
            type="submit"
            disabled={!startDate || !endDate || isSubmitting}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 rounded-lg font-medium mt-4 flex items-center justify-center disabled:opacity-90 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Clock className="animate-spin mr-2 h-4 w-4" />
                Processing...
              </>
            ) : (
              "Book Now"
            )}
          </Button>
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
