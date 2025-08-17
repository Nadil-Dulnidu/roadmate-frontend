import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import signinImage from "@/assets/signup-modal.jpg"

interface SignupDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignupDialog({ isOpen, onClose }: SignupDialogProps) {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate("/auth/signup");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden p-0 border-none rounded-2xl max-w-[440px] font-inter">
        <DialogTitle className="sr-only">Sign up to RoadMate</DialogTitle>
        <DialogDescription className="sr-only">
          Sign up dialog to access RoadMate's vehicle booking features
        </DialogDescription>
        <div className="relative h-48">
          <img src={signinImage} alt="Sign in" className="object-cover w-full h-full" />
        </div>
        <div className="px-8 py-10 bg-white rounded-2xl">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">
            Sign up to begin your journey with RoadMate
          </h2>
          <p className="text-base text-muted-foreground mb-6">
            Search through thousands of qualified RoadMate vehicles by brand,
            availability, and more!
          </p>
          <Button
            onClick={handleSignup}
            className="w-full font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <span>Sign up</span>
            <span>→</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
