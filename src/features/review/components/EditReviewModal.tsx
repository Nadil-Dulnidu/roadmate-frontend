import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Review } from "../reviewTypes";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/StarRating";
import { useEffect, useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { useUpdateReviewMutation } from "../reviewSlice";

interface EditReviewModalProps {
  review: Review;
  onClose: () => void;
  isOpen: boolean;
}

const formSchema = z.object({
  reviewerName: z.string().min(1, "Reviewer name is required"),
  comment: z.string().min(1, "Comment is required"),
});

const EditReviewModal = ({ review, onClose, isOpen }: EditReviewModalProps) => {
  const [rating, setRating] = useState(review.rating);
  const { getToken } = useAuth();
  const [updateReview, { isError }] = useUpdateReviewMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reviewerName: "",
      comment: "",
    },
  });

  useEffect(() => {
    if (isOpen && review) {
      form.reset({
        reviewerName: review.reviewer_name || "",
        comment: review.comment || "",
      });
    }
  }, [isOpen, form, review]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const token = await getToken({ template: "RoadMate" });
      if (!data || !token || !review || !rating) {
        toast.error("Missing data or authentication token.");
        throw new Error("Missing data or authentication token.");
      }
      const updatedreviewObj: Review = {
        review_id: review.review_id,
        reviewer_name: data.reviewerName,
        rating: rating,
        comment: data.comment,
        review_date: review.review_date,
        vehicle_id: review.vehicle_id,
        renter_id: review.renter_id,
      };
      await updateReview({token: token, review: updatedreviewObj}).unwrap();
      if (isError) {
        throw new Error("Failed to update review");
      }
      toast.success("Review updated successfully!");
    } catch (error) {
      toast.error("Failed to update review. Please try again.");
      console.error("Error updating review:", error);
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[375px] md:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
          <DialogDescription>Make changes to your review.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-2">
              <label className="block text-sm font-medium text-black mb-2">Change Rating</label>
              <StarRating rating={rating} onRatingChange={setRating} interactive={true} size="w-8 h-8" />
            </div>
            <FormField
              control={form.control}
              name="reviewerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Change Reviewer Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} className="border border-gray-300 rounded-md p-2 w-full" />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Change Comment</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="border border-gray-300 rounded-md p-2 w-full" />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditReviewModal;
