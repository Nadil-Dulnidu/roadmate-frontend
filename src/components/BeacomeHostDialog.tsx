import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import signinImage from "@/assets/become-host.png"

interface BecomeHostDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const onConfirm = () => {
  // Handle the confirmation logic here
};

export default function BecomeHostDialog({ isOpen, onClose }: BecomeHostDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-2xl shadow-lg font-inter">
         <div className="relative h-48">
          <img src={signinImage} alt="Sign in" className="object-cover w-full h-full" />
        </div>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Become a Host</DialogTitle>
          <DialogDescription>
            By becoming a host, you’ll be able to list your vehicles and rent them out to others.
            Do you want to continue?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose} >Cancel</Button>
          <Button
            onClick={onConfirm}
          >
            Yes, Make Me a Host
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
