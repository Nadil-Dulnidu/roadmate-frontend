import { VehicleGallery } from '../components/VehicleGallery';
import { VehicleDetails } from '../components/VehicleDetails';
import { BookingForm } from '../components/BookingForm';
// Mock vehicle data
const vehicleData = {
  id: 'v001',
  name: 'Tesla Model 3',
  category: 'Electric Sedan',
  price: 89,
  rating: 4.8,
  reviewCount: 124,
  description: "Experience the future of driving with the Tesla Model 3. This all-electric sedan combines performance, safety, and technology in one sleek package. With a range of up to 358 miles and acceleration from 0-60 mph in just 3.1 seconds, it's the perfect choice for both city commutes and longer journeys.",
  images: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80', 'https://images.unsplash.com/photo-1536617621572-1d5f1e6269a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
  specifications: [{
    name: 'Range',
    value: '358 miles'
  }, {
    name: 'Top Speed',
    value: '162 mph'
  }, {
    name: 'Acceleration',
    value: '0-60 mph in 3.1s'
  }, {
    name: 'Drive',
    value: 'All-Wheel Drive'
  }, {
    name: 'Seating',
    value: '5 adults'
  }, {
    name: 'Wheels',
    value: '19" Sport Wheels'
  }],
  features: ['Autopilot', '15" Touchscreen Display', 'Wireless Charging', 'Premium Audio System', 'Glass Roof', 'Heated Seats', 'Mobile App Control', 'Supercharger Access'],
  location: 'San Francisco, CA'
};
function VehicleProfilePage() {
  return <div className="bg-background min-h-screen w-full">
      <div className="container mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Gallery and Details */}
          <div className="lg:col-span-2">
            <VehicleGallery images={vehicleData.images} />
            <VehicleDetails vehicle={vehicleData} />
          </div>
          {/* Right column: Booking Form */}
          <div className="lg:col-span-1">
            <BookingForm vehicle={vehicleData} />
          </div>
        </div>
      </div>
    </div>;
}

export default VehicleProfilePage;