import { Button } from "@/components/ui/button";
import { Car, Home, Search } from "lucide-react";
import { Link } from "react-router";

function NotFoundPage() {
  return (
    <div className="container relative bg-white mx-auto flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Large 404 with car icon */}
        <div className="relative mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold text-gray-100 select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Car className="w-20 h-20 md:w-24 md:h-24 text-gray-800" />
          </div>
        </div>
        {/* Main heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Looks like you've taken a wrong turn</h2>
        {/* Description */}
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">The page you're looking for seems to have driven off the lot. Don't worry, we'll help you get back on track.</p>
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/">
            <Button className="inline-flex items-center px-6 py-6 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 min-w-[160px]">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link to="/vehicle/listing">
            <Button
              variant={"outline"}
              className="inline-flex items-center px-6 py-6 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200 min-w-[160px]"
            >
              <Search className="w-5 h-5 mr-2" />
              Browse Vehicles
            </Button>
          </Link>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-4 opacity-5">
          <Car className="w-32 h-32 transform -rotate-12" />
        </div>
        <div className="absolute bottom-1/4 right-4 opacity-5">
          <Car className="w-24 h-24 transform rotate-12" />
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
