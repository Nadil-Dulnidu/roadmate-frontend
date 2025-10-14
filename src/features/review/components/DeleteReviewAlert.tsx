import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { useDeleteReviewMutation } from "../reviewSlice";

interface DeleteReviewAlertProps {
  isDeleteAlertOpen: boolean;
  setIsDeleteAlertOpen(open: boolean): void;
  selectedReviewToDelete: number | null;
}

const DeleteReviewAlert = ({ isDeleteAlertOpen, setIsDeleteAlertOpen, selectedReviewToDelete }: DeleteReviewAlertProps) => {
  const [deleteReview, { isError }] = useDeleteReviewMutation();
  const { getToken } = useAuth();

  const handleDelete = async () => {
    try {
      const token = await getToken({ template: "RoadMate" });
      if (!selectedReviewToDelete || !token) {
        throw new Error("Missing required information to delete review.");
      }
      await deleteReview({ id: selectedReviewToDelete, token });
      if (isError) {
        throw new Error("Failed to delete review.");
      }
      toast.success("Review deleted successfully!");
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error("Failed to delete vehicle. Please try again.");
    } finally {
      setIsDeleteAlertOpen(false);
    }
  };

  return (
    <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone. This will permanently delete the review and remove it from your listings.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsDeleteAlertOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              handleDelete();
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteReviewAlert;
