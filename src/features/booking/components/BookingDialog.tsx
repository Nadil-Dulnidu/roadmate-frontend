import { Dialog, DialogContent} from "@/components/ui/dialog";
import { BookingForm } from "./BookingForm";
import type { FullVehicle } from "@/features/vehicle/vehicleTypes";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: FullVehicle;
}

const BookingDialog = ({ isOpen, onClose, vehicle }: BookingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 max-h-[90vh] overflow-y-auto">
          <BookingForm vehicle={vehicle}/>
      </DialogContent>
    </Dialog>
  );
}

export default BookingDialog
