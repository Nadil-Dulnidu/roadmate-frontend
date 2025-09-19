import React, { useState } from "react";
import StarRating from "@/components/StarRating";
import { toast } from "sonner";
import { useCreateReviewMutation } from "../reviewSlice";
import type { Review } from "../reviewTypes";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Link } from "react-router";

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
          <button
            type="submit"
            disabled={isSubmitting || rating === 0 || !name.trim() || !comment.trim()}
            className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        ) : (
          <Link to="/auth/signup">
            <button className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors">Sign in to submit review</button>
          </Link>
        )}
      </form>
    </div>
  );
}

export default AddReviewSection;
