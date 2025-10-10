import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useUpdateVehicleStatusMutation } from "../vehicleSlice";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

interface VehicleEditModalProps {
  isOpen: boolean;
  onClose(): void;
  vehicleId: number;
  availability: string;
}

const formSchema = z.object({
  availability: z.string().nonempty("Availability status is empty"),
});

const EditVehicleModel = ({ isOpen, onClose, vehicleId, availability }: VehicleEditModalProps) => {
  const [updateVehicleStatus, { isError }] = useUpdateVehicleStatusMutation();
  const { getToken } = useAuth();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      availability: "",
    },
  });

  useEffect(() => {
    if (isOpen && availability) {
      form.reset({
        availability: availability || "",
      });
    }
  }, [isOpen, form, availability]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const token = await getToken({ template: "RoadMate" });
      if (!token || !vehicleId || !data) {
        throw Error("Missing required information to update vehicle status.");
      }
      await updateVehicleStatus({ vehicle_id: vehicleId, status: data.availability, token });
      if (isError) {
        throw new Error("Failed to update vehicle status.");
      }
      toast.success("Vehicle status updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update vehicle status. Please try again.");
      console.error("Error updating vehicle status:", error);
      throw new Error("Failed to update vehicle status.");
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[325px] md:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Vehicle Availability</DialogTitle>
          <DialogDescription>Make changes to your vehicle's details.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Change Availability Status</FormLabel>
                  <Select value={field.value} onValueChange={(val) => field.onChange(val)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel></SelectLabel>
                        <SelectItem value="AVAILABLE">Available</SelectItem>
                        <SelectItem value="IN_MAINTENANCE">In Maintenance</SelectItem>
                        <SelectItem value="RESERVED">Reserved</SelectItem>
                        <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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

export default EditVehicleModel;
