import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useDeleteVehicleMutation } from "../vehicleSlice";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

interface DeleteVehicleAlertProps {
  isDeleteAlertOpen: boolean;
  setIsDeleteAlertOpen(open: boolean): void;
  selectedVehicleToDelete: number | null;
}

const DeleteVehicleAlert = ({ isDeleteAlertOpen, setIsDeleteAlertOpen, selectedVehicleToDelete }: DeleteVehicleAlertProps) => {
  const [deleteVehicle, { isError }] = useDeleteVehicleMutation();
  const { getToken } = useAuth();

  const handleDelete = async () => {
    try {
      const token = await getToken({ template: "RoadMate" });
      if (!selectedVehicleToDelete || !token) {
        throw new Error("Missing required information to delete vehicle.");
      }
      await deleteVehicle({ vehicle_id: selectedVehicleToDelete, token });
      if (isError) {
        throw new Error("Failed to delete vehicle.");
      }
      toast.success("Vehicle deleted successfully!");
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
          <AlertDialogDescription>This action cannot be undone. This will permanently delete the vehicle and remove it from your listings.</AlertDialogDescription>
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

export default DeleteVehicleAlert;
