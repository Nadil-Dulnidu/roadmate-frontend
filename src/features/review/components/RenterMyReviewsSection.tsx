import React, { useEffect, useMemo, useState, type JSX } from "react";
import { Star, Edit2, Trash2, Car, Calendar, Filter, MessageSquareMoreIcon } from "lucide-react";
import type { Review } from "../reviewTypes";
import { useGetReviewsByUserIdQuery, selectReviewsByUser } from "../reviewSlice";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useAppSelector } from "@/app/hook";
import { useGetVehicleByIdQuery } from "@/features/vehicle/vehicleSlice";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "sonner";

const ReviewCard: React.FC<{ review: Review; vehicle: number }> = ({ review, vehicle }) => {
  const { data: vehicleData, isSuccess, isLoading, isError, error } = useGetVehicleByIdQuery(vehicle);
  const renderStars = (rating: number) => {
    return Array.from(
      {
        length: 5,
      },
      (_, i) => <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-gray-900 text-gray-900" : "text-gray-300"}`} />
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderReviewCard = () => {
    let content: JSX.Element | null = null;
    if (isLoading) {
      content = <LoadingSpinner size={35} stroke={3.5} speed={1} color="black" />;
    } else if (isSuccess) {
      content = (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Vehicle Image */}
            <div className="flex-shrink-0">
              <img src={vehicleData.images[0].image_url} alt={`${vehicleData.brand} ${vehicleData.model}`} className="w-full lg:w-32 h-24 object-cover rounded-md" />
            </div>
            {/* Review Content */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {vehicleData.year} {vehicleData.brand} {vehicleData.model}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Car className="w-3 h-3" />
                    {vehicleData.license_plate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors" title="Edit review">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete review">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">{renderStars(review.rating)}</div>
                <span className="text-sm text-gray-600">({review.rating}/5)</span>
              </div>
              <p className="text-gray-700 mb-3">{review.comment}</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Reviewed on {formatDate(review.review_date)}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (isError) {
      toast.error("Something went wrong. Error fetching Vehicle details");
      let errorMessage = "An error occurred";
      if (error && typeof error === "object") {
        if ("status" in error) {
          errorMessage = `Error: ${JSON.stringify(error.data) || error.status}`;
        } else if ("message" in error) {
          errorMessage = (error as { message?: string }).message || errorMessage;
          console.error(errorMessage);
        }
      }
    }
    return content;
  };

  return <>{renderReviewCard()}</>;
};

const FilterBar: React.FC<{
  sortBy: string;
  onSortChange: (sort: string) => void;
  ratingFilter: number | null;
  onRatingFilterChange: (rating: number | null) => void;
}> = ({ sortBy, onSortChange, ratingFilter, onRatingFilterChange }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="rating-desc">Highest Rating</option>
          <option value="rating-asc">Lowest Rating</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Rating:</span>
        <div className="flex gap-1">
          <button
            onClick={() => onRatingFilterChange(null)}
            className={`px-3 py-1 text-sm rounded-md border transition-colors ${
              ratingFilter === null ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            All
          </button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => onRatingFilterChange(rating)}
              className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                ratingFilter === rating ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-1">
                <span>{rating}</span> <Star className="w-3 h-3 inline-block fill-black" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const RenterMyReviewsSection = () => {
  const [sortBy, setSortBy] = useState("date-desc");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const { getToken } = useAuth();
  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken({ template: "RoadMate" });
      setAuthToken(token);
    };
    fetchToken();
  }, [getToken]);

  const { isLoading, isSuccess, isError, error } = useGetReviewsByUserIdQuery({ token: authToken, userId: userId }, { skip: !userId || !authToken });
  const reviews = useAppSelector(selectReviewsByUser(authToken, userId));

  const filteredAndSortedReviews = useMemo(() => {
    let filtered = reviews;
    // Apply rating filter
    if (ratingFilter !== null) {
      filtered = filtered.filter((review) => review.rating === ratingFilter);
    }
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.review_date).getTime() - new Date(a.review_date).getTime();
        case "date-asc":
          return new Date(a.review_date).getTime() - new Date(b.review_date).getTime();
        case "rating-desc":
          return b.rating - a.rating;
        case "rating-asc":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });
    return filtered;
  }, [reviews, sortBy, ratingFilter]);

  const averageRating = reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : "0";

  const stats = [
    {
      label: "Total Reviews",
      value: reviews.length,
      icon: MessageSquareMoreIcon,
    },
    {
      label: "Average Rating",
      value: averageRating,
      icon: Star,
    },
  ];

  const renderReviews = () => {
    let content: JSX.Element | null = null;
    if (isLoading) {
      content = <LoadingSpinner size={35} stroke={3.5} speed={1} color="black" />;
    } else if (isSuccess) {
      content = (
        <>
          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Reviews Yet</h3>
              <p className="text-gray-600 mb-6">You haven't written any reviews yet. After completing a rental, you'll be able to share your experience here.</p>
            </div>
          ) : (
            <>
              <FilterBar sortBy={sortBy} onSortChange={setSortBy} ratingFilter={ratingFilter} onRatingFilterChange={setRatingFilter} />
              {filteredAndSortedReviews.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-600">No reviews match your current filters.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredAndSortedReviews.map((review) => (
                    <ReviewCard key={review.review_id} review={review} vehicle={review.vehicle_id} />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      );
    } else if (isError) {
      toast.error("Something went wrong. Error fetching Bookings");
      let errorMessage = "An error occurred";
      if (error && typeof error === "object") {
        if ("status" in error) {
          errorMessage = `Error: ${JSON.stringify(error.data) || error.status}`;
        } else if ("message" in error) {
          errorMessage = (error as { message?: string }).message || errorMessage;
          console.error(errorMessage);
        }
      }
      content = (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Reviews Yet</h3>
          <p className="text-gray-600 mb-6">You haven't written any reviews yet. After completing a rental, you'll be able to share your experience here.</p>
        </div>
      );
    }
    return content;
  };

  return (
    <div className="w-full mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold mt-1">{stat.value}</p>
              </div>
              <stat.icon className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
      {renderReviews()}
    </div>
  );
};

export default RenterMyReviewsSection;
