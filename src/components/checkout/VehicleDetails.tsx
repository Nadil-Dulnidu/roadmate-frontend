import React from 'react';
export function VehicleDetails({
  vehicle,
  updateVehicle
}) {
  // This could be expanded to allow vehicle selection from a list
  return <div className="space-y-6">
      <h2 className="text-xl font-semibold text-black">Vehicle Details</h2>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <img src={vehicle.image} alt={vehicle.name} className="w-full h-64 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-medium">{vehicle.name}</h3>
          <p className="text-gray-600">Type: {vehicle.type}</p>
          <div className="mt-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Daily Rate</p>
              <p className="text-xl font-semibold">
                ${vehicle.pricePerDay.toFixed(2)}
              </p>
            </div>
            <button type="button" className="text-sm text-black underline" onClick={() => {}}>
              Change Vehicle
            </button>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Vehicle Features</h4>
        <ul className="grid grid-cols-2 gap-2 text-sm">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-black rounded-full mr-2"></span>
            Automatic Transmission
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-black rounded-full mr-2"></span>
            Bluetooth
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-black rounded-full mr-2"></span>
            Backup Camera
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-black rounded-full mr-2"></span>
            Navigation System
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-black rounded-full mr-2"></span>5 Seats
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-black rounded-full mr-2"></span>
            Electric Vehicle
          </li>
        </ul>
      </div>
    </div>;
}