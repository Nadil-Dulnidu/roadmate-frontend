import React, { useState } from 'react';
import { CalendarIcon, Clock, Info } from 'lucide-react';
interface BookingFormProps {
  vehicle: {
    name: string;
    price: number;
  };
}
export function BookingForm({
  vehicle
}: BookingFormProps) {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Calculate number of days between dates
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };
  const days = calculateDays();
  const subtotal = vehicle.price * days;
  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      alert(`Booking submitted for ${vehicle.name} from ${startDate} to ${endDate}`);
      setIsSubmitting(false);
    }, 1500);
  };
  return <div className="bg-card rounded-lg border p-6 sticky top-24">
      <h2 className="text-xl font-semibold mb-6">Book this vehicle</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Pickup Date
            </label>
            <div className="relative">
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" required min={new Date().toISOString().split('T')[0]} />
              <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Return Date
            </label>
            <div className="relative">
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" required min={startDate || new Date().toISOString().split('T')[0]} />
              <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          {/* Pricing Breakdown */}
          {startDate && endDate && <div className="mt-6 space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  ${vehicle.price} × {days} day{days !== 1 ? 's' : ''}
                </span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <span className="text-muted-foreground">Service fee</span>
                  <Info className="h-3 w-3 text-muted-foreground ml-1" />
                </div>
                <span>${serviceFee}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>}
          {/* Booking Button */}
          <button type="submit" disabled={!startDate || !endDate || isSubmitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 rounded-md font-medium mt-4 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? <>
                <Clock className="animate-spin mr-2 h-4 w-4" />
                Processing...
              </> : 'Book Now'}
          </button>
        </div>
      </form>
      {/* Additional Info */}
      <div className="mt-6 text-sm text-muted-foreground">
        <p className="flex items-center">
          <Info className="h-4 w-4 mr-2" />
          Free cancellation 48 hours before pickup
        </p>
      </div>
    </div>;
}