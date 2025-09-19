import StarRating from "@/components/StarRating";
import { Calendar, User } from "lucide-react";
import { useGetReviewsByVehicleIdQuery, selectReviewsByVehicle } from "../reviewSlice";
import { useAppSelector } from "@/app/hook";
import { format } from "date-fns";

interface ReviewListProp {
  vehicleId: number;
}
const ReviewList = ({ vehicleId }: ReviewListProp) => {
  const { isError, isLoading, isSuccess, error } = useGetReviewsByVehicleIdQuery({ vehicleId });
  const reviewList = useAppSelector(selectReviewsByVehicle(vehicleId));

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-black">Recent Reviews</h3>
      {reviewList.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {reviewList.map((review) => (
            <div key={review.review_id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-black">{review.reviewer_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {format(review.review_date, "MMM dd, yyyy")}
                </div>
              </div>
              <div className="mb-2">
                <StarRating rating={review.rating} />
              </div>
              <p className="text-gray-700 leading-relaxed text-sm">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
