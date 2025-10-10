import RenderStars from "@/components/RenderStarts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGetReviewsByVehicleIdQuery, selectReviewsByVehicle } from "../reviewSlice";
import { useAppSelector } from "@/app/hook";
import type { FullVehicle } from "@/features/vehicle/vehicleTypes";
import { format } from "date-fns";

interface ViewVehicleReviewModalProps {
  isOpen: boolean;
  onClose(): void;
  vehicle: FullVehicle;
}

const ViewVehicleReviewModal = ({ isOpen, onClose, vehicle }: ViewVehicleReviewModalProps) => {
  const { isLoading } = useGetReviewsByVehicleIdQuery({ vehicleId: vehicle.vehicle_id });
  const vehicleReviews = useAppSelector(selectReviewsByVehicle(vehicle.vehicle_id));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] h-auto max-h-96">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-semibold text-xl">
                <h2 className="text-xl font-bold text-gray-900">{vehicle.brand} {vehicle.model}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <RenderStars rating={vehicle.rating} size="md" />
                  <span className="font-medium text-gray-900">{vehicle.rating}</span>
                  <span className="text-gray-600">({vehicle.review_count} reviews)</span>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto max-h-96">
              <div className="space-y-4">
                {vehicleReviews.map((review) => (
                  <div key={review.renter_id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">{review.reviewer_name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{review.reviewer_name}</p>
                          <p className="text-sm text-gray-600">{format(review.review_date, "MMMM dd, yyyy")}</p>
                        </div>
                      </div>
                      <RenderStars rating={review.rating} size="sm" />
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewVehicleReviewModal;
