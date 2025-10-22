import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import signinImage from "@/assets/become-host.png";
import { useUpdateUserRoleMutation } from "@/features/user/userSlice";
import { useAuth, useUser } from "@clerk/clerk-react";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "sonner";
import { useNavigate } from "react-router";

interface BecomeHostDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BecomeHostDialog({ isOpen, onClose }: BecomeHostDialogProps) {
  const [updateUserRole, { isLoading }] = useUpdateUserRoleMutation();
  const { getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  const onConfirm = async () => {
    const token = await getToken({ template: "RoadMate" });
    const { error } = await updateUserRole({ userId: user?.id, role: "OWNER", token });
    if (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to become a host");
    } else {
      toast.success("Successfully became a host");
      navigate("/");
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-2xl shadow-lg font-inter">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 rounded-2xl">
            <LoadingSpinner size={32} stroke={2} speed={1} color="white" />
          </div>
        )}
        <div className={isLoading ? "opacity-50 pointer-events-none rounded-2xl" : ""}>
          <div className="relative h-48">
            <img src={signinImage} alt="Sign in" className="object-cover w-full h-full" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mt-2">Become a Host</DialogTitle>
            <DialogDescription>By becoming a host, you’ll be able to list your vehicles and rent them out to others. Do you want to continue?</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onConfirm}>Yes, Make Me a Host</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
