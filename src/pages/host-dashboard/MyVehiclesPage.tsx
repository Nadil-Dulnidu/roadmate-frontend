import { AppSidebar } from "@/pages/host-dashboard/components/app-sidebar";
import { SiteHeader } from "@/pages/host-dashboard/components/site-header";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Calendar, Edit, Eye, MapPin, MessageSquare, MoreVertical, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetVehicleByOwnerQuery, selectAllVehiclesByOwner } from "@/features/vehicle/vehicleSlice";
import { useAppSelector } from "@/app/hook";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import RenderStars from "@/components/RenderStarts";
import ViewVehicleReviewModal from "@/features/review/components/ViewVehicleReviewModal";
import type { FullVehicle } from "@/features/vehicle/vehicleTypes";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import EditVehicleModel from "@/features/vehicle/components/EditVehicleModel";
import DeleteVehicleAlert from "@/features/vehicle/components/DeleteVehicleAlert";
import { useNavigate } from "react-router";


const MyVehiclesPage = () => {
  const { user } = useUser();
  const { isSignedIn, isLoaded } = useAuth();
  const userId = user?.id;
  const router = useNavigate();
  useGetVehicleByOwnerQuery(userId);
  const vehicles = useAppSelector(selectAllVehiclesByOwner(userId));

  useEffect(() => {
      if (isSignedIn && isLoaded && user?.publicMetadata.role === "OWNER") {
        return;
      } else {
        router("/auth/signup");
      }
    }, [isLoaded, router, user, isSignedIn]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [isVehicleReviewModalOpen, setIsVehicleReviewModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<FullVehicle | null>(null);
  const [isEditVehicleModalOpen, setIsEditVehicleModalOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [selectedVehicleAvailability, setSelectedVehicleAvailability] = useState<string>("");
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedVehicleToDelete, setSelectedVehicleToDelete] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) || vehicle.vehicle_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || vehicle.available === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-6">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search vehicles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="">
                      <SelectGroup>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="bookings">Most Bookings</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Vehicle Grid */}
              <div className="px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3  gap-4">
                  {filteredVehicles.map((vehicle) => (
                    <div key={vehicle.vehicle_id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                      {/* Vehicle Image */}
                      <div className="relative">
                        <img src={vehicle.images[0].image_url} alt={vehicle.model} className="w-full h-64 object-cover" />
                        <div className="absolute top-3 left-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(vehicle.available)}`}>
                            {vehicle.available.charAt(0).toUpperCase() + vehicle.available.slice(1).toLocaleLowerCase()}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-50">
                                <MoreVertical className="w-4 h-4 text-gray-600" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedVehicleId(vehicle.vehicle_id);
                                  setSelectedVehicleAvailability(vehicle.available);
                                  setIsEditVehicleModalOpen(true);
                                }}
                              >
                                <Edit className="mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedVehicleToDelete(vehicle.vehicle_id);
                                  setIsDeleteAlertOpen(true);
                                }}
                              >
                                <Trash2 className="mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      {/* Vehicle Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {vehicle.brand} {vehicle.model}
                            </h3>
                            <p className="text-sm text-gray-600">{vehicle.vehicle_type.charAt(0).toUpperCase() + vehicle.vehicle_type.slice(1).toLocaleLowerCase()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">${vehicle.price_per_day}</p>
                            <p className="text-xs text-gray-600">per day</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{vehicle.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{10} bookings</span>
                          </div>
                        </div>
                        {/* Rating and Reviews */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <RenderStars rating={vehicle.rating} />
                            <span className="text-sm font-medium text-gray-900">{vehicle.rating}</span>
                            <span className="text-sm text-gray-600">({vehicle.review_count} reviews)</span>
                          </div>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => {
                              setIsVehicleReviewModalOpen(true);
                              setSelectedVehicle(vehicle);
                            }}
                            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                            disabled={vehicle.review_count === 0}
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>View Reviews</span>
                          </Button>
                          <Button variant={"ghost"} className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {filteredVehicles.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Search className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
                    <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {selectedVehicle && <ViewVehicleReviewModal isOpen={isVehicleReviewModalOpen} onClose={() => setIsVehicleReviewModalOpen(false)} vehicle={selectedVehicle!} />}
        </div>
        {selectedVehicleId && selectedVehicleAvailability && (
          <EditVehicleModel isOpen={isEditVehicleModalOpen} onClose={() => setIsEditVehicleModalOpen(false)} vehicleId={selectedVehicleId!} availability={selectedVehicleAvailability!} />
        )}
        {selectedVehicleToDelete && (
          <DeleteVehicleAlert
            isDeleteAlertOpen={isDeleteAlertOpen}
            setIsDeleteAlertOpen={setIsDeleteAlertOpen}
            selectedVehicleToDelete={selectedVehicleToDelete!}
          />
        )}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MyVehiclesPage;
