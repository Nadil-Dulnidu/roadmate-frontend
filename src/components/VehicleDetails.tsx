import { Star, MapPin } from 'lucide-react';
interface Specification {
  name: string;
  value: string;
}
interface VehicleDetailsProps {
  vehicle: {
    name: string;
    category: string;
    price: number;
    rating: number;
    reviewCount: number;
    description: string;
    specifications: Specification[];
    features: string[];
    location: string;
  };
}
export function VehicleDetails({
  vehicle
}: VehicleDetailsProps) {
  return <div className="space-y-8">
      {/* Header with basic info */}
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{vehicle.name}</h1>
            <p className="text-muted-foreground">{vehicle.category}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              ${vehicle.price}
              <span className="text-sm font-normal text-muted-foreground">
                /day
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center mt-2 space-x-4">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="font-medium">{vehicle.rating}</span>
            <span className="text-muted-foreground ml-1">
              ({vehicle.reviewCount} reviews)
            </span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            {vehicle.location}
          </div>
        </div>
      </div>
      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold mb-2">About this vehicle</h2>
        <p className="text-muted-foreground">{vehicle.description}</p>
      </div>
      {/* Specifications */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Specifications</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {vehicle.specifications.map((spec, index) => <div key={index} className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">{spec.name}</p>
              <p className="font-medium">{spec.value}</p>
            </div>)}
        </div>
      </div>
      {/* Features */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Features</h2>
        <div className="grid grid-cols-2 gap-2">
          {vehicle.features.map((feature, index) => <div key={index} className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
              <span>{feature}</span>
            </div>)}
        </div>
      </div>
    </div>;
}