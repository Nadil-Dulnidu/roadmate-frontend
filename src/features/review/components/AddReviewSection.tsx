import React, { useState } from "react";
import StarRating from "@/components/StarRating";
import { toast } from "sonner";
import { useCreateReviewMutation } from "../reviewSlice";
import type { Review } from "../reviewTypes";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import type { NotificationPayload, NotificationTypes } from "@/features/notification/notificationType";
import { useSendNotificationMutation } from "@/features/notification/notificationSlice";

interface AddReviewSectionProp {
  vehicleId: number;
}

function AddReviewSection({ vehicleId }: AddReviewSectionProp) {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  const { getToken, isSignedIn } = useAuth();
  const [createReview] = useCreateReviewMutation();
  const [sendNotification] = useSendNotificationMutation();

  const createNotification = async ({ type, title, message }: { type: NotificationTypes[keyof NotificationTypes]; title: string; message: string }) => {
    const token = await getToken({ template: "RoadMate" });
    const userId = user?.id;
    const notification: NotificationPayload = {
      user_id: userId,
      title: title,
      notification_type: type,
      message: message,
    };
    const { error } = await sendNotification({ token: token, notification: notification });
    if (error) {
      toast.error("Failed to send notification.");
      console.error("Notification error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (rating === 0 || !name.trim() || !comment.trim() || !vehicleId || !user) {
        toast.error("Error: All fields are required");
        throw new Error("All fields are required");
      }
      const token = await getToken({ template: "RoadMate" });
      const reviewData: Review = {
        reviewer_name: name.trim(),
        rating,
        comment: comment.trim(),
        review_date: new Date().toISOString(),
        vehicle_id: vehicleId,
        renter_id: user.id,
      };
      await createReview({ token, review: reviewData }).unwrap();
      toast.success("Review submitted successfully");
      await createNotification({
        type: "REVIEW",
        title: "New Review Submitted",
        message: `Your review for vehicle ${vehicleId} has been submitted successfully.`,
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setRating(0);
      setName("");
      setComment("");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-black">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">Rating *</label>
          <StarRating rating={rating} onRatingChange={setRating} interactive={true} size="w-8 h-8" />
        </div>
        {/* Name */}
        <div className=" placeholder:text-sm">
          <label htmlFor="reviewer-name" className="block text-sm font-medium text-black mb-2">
            Your Name *
          </label>
          <input
            id="reviewer-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-colors"
            placeholder="Enter your name"
            required
          />
        </div>
        {/* Comment */}
        <div>
          <label htmlFor="review-comment" className="block text-sm font-medium text-black mb-2">
            Your Review *
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-colors resize-vertical"
            placeholder="Share your experience with this vehicle..."
            required
          />
        </div>
        {/* Submit Button */}
        {isSignedIn ? (
          <Button
            type="submit"
            disabled={isSubmitting || rating === 0 || !name.trim() || !comment.trim() || user?.publicMetadata.role !== "RENTER"}
            className="w-full bg-black text-white py-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            {isSubmitting ? "Submitting..." : user?.publicMetadata.role === "RENTER" ? "Submit Review" : "Only Renters can Submit"}
          </Button>
        ) : (
          <Link to="/auth/signup">
            <Button className="w-full bg-black text-white py-6 rounded-lg font-medium hover:bg-gray-800 transition-colors">Sign in to submit review</Button>
          </Link>
        )}
      </form>
    </div>
  );
}

export default AddReviewSection;
