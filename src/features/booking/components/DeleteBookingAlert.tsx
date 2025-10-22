import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useDeleteBookingMutation } from "../bookingSlice";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

interface DeleteBookingAlertProps {
  isDeleteAlertOpen: boolean;
  setIsDeleteAlertOpen(open: boolean): void;
  selectedBookingToDelete: number | undefined;
}

const DeleteBookingAlert = ({ isDeleteAlertOpen, setIsDeleteAlertOpen, selectedBookingToDelete }: DeleteBookingAlertProps) => {
  const [deleteBooking, { isError }] = useDeleteBookingMutation();
  const { getToken } = useAuth();

  const handleDelete = async () => {
    try {
      const token = await getToken({ template: "RoadMate" });
      if (!selectedBookingToDelete || !token) {
        throw new Error("Missing required information to delete booking.");
      }
      await deleteBooking({ token: token, id: selectedBookingToDelete });
      if (isError) {
        throw new Error("Failed to delete booking.");
      }
      toast.success("Booking deleted successfully!");
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
          <AlertDialogDescription>This action cannot be undone. This will permanently delete the booking and remove it from your listings.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsDeleteAlertOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await handleDelete();
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBookingAlert;
