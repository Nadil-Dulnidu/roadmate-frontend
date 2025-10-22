import type { RentalStateDetails } from '@/features/booking/bookingTypes';
import { format } from 'date-fns';

export function OrderSummary({vehicle}:{vehicle: RentalStateDetails}) {
  return <div className="bg-white border border-gray-200 rounded-lg sticky top-24">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-black mb-4">Booking Summary</h2>
        <div className="flex items-center mb-4">
          <img src={vehicle.vehicle.images[0].image_url} alt={vehicle.vehicle.model} className="w-20 h-20 object-cover rounded-md mr-4" />
          <div>
            <h3 className="font-medium">{vehicle.vehicle.year} {vehicle.vehicle.brand} {vehicle.vehicle.model}</h3>
            <p className="text-sm text-gray-600">{vehicle.vehicle.vehicle_type}</p>
          </div>
        </div>
        <div className="text-sm border-t border-gray-100 pt-4">
          <div className="flex justify-between mb-2">
            <span>Rental Period:</span>
            <span>
              {format(new Date(vehicle.start_date), "MMM dd, yyyy")} -{' '}{format(new Date(vehicle.end_date), "MMM dd, yyyy")}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Pick-up & Return:</span>
            <span>{vehicle.vehicle.location}</span>
          </div>
        </div>
        <div className="border-t border-gray-100 my-4 pt-4">
          <div className="flex justify-between mb-2">
            <span>
              Base Rate ({vehicle.diff_days} {vehicle.diff_days === 1 ? 'day' : 'days'}):
            </span>
            <span>Rs.{vehicle.sub_total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2 text-sm">
            <span>Tax Fee:</span>
            <span>Rs.{vehicle.tax_fee.toFixed(2)}</span>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>Rs.{vehicle.total_price.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-b-lg text-xs text-gray-500">
        <p>Your card will not be charged until pickup.</p>
        <p className="mt-1">Free cancellation up to 24 hours before pickup.</p>
      </div>
    </div>;
}