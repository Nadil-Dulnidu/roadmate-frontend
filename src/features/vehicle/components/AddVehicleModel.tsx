import { useEffect, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { useAddVehicleMutation } from "../vehicleSlice";
import type { NewVehicle } from "../vehicleTypes";
import { Plus } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface AddMentorModalProp {
  isOpen: boolean;
  onClose(): void;
}

const VehicleTypes = [
  { label: "Car", value: "CAR" },
  { label: "Motorcycle", value: "MOTORCYCLE" },
  { label: "Pickup Truck", value: "PICKUP_TRUCK" },
  { label: "SUV", value: "SUV" },
  { label: "Van", value: "VAN" },
];

const EngineTypes = [
  { label: "Petrol", value: "PETROL" },
  { label: "Diesel", value: "DIESEL" },
  { label: "Electric", value: "ELECTRIC" },
  { label: "Hybrid", value: "HYBRID" },
];

const TransmissionTypes = [
  { label: "Manual", value: "MANUAL" },
  { label: "Automatic", value: "AUTOMATIC" },
];

interface FormData {
  vehicle_type: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  engine: string;
  transmission: string;
  number_of_seats: number;
  license_plate: string;
  description: string;
  base_price: number;
  location: string;
  city: string;
  contact_number: string;
  images: File[];
}

const formSchema = z.object({
  vehicle_type: z.string().nonempty({ message: "Vehicle type is required" }),
  brand: z.string().nonempty({ message: "Brand is required" }),
  model: z.string().nonempty({ message: "Model is required" }),
  year: z.preprocess((val) => Number(val), z.number().min(1900).max(new Date().getFullYear()).positive({ message: "Year must be a positive number" })),
  color: z.string().nonempty({ message: "Color is required" }),
  engine: z.string().nonempty({ message: "Engine is required" }),
  transmission: z.string().nonempty({ message: "Transmission is required" }),
  number_of_seats: z.preprocess((val) => Number(val), z.number().min(1).max(100).positive({ message: "Number of seats must be a positive number" })),
  license_plate: z.string().nonempty({ message: "License plate is required" }),
  description: z.string().nonempty({ message: "Description is required" }),
  base_price: z.preprocess((val) => Number(val), z.number().min(0).positive({ message: "Base price must be a positive number" })),
  location: z.string().nonempty({ message: "Location is required" }),
  city: z.string().nonempty({ message: "City is required" }),
  contact_number: z.string().nonempty({ message: "Contact number is required" }),
  images: z.array(z.instanceof(File)).min(1, { message: "Upload at least one image" }),
});

const AddVehicleModel = ({ isOpen, onClose }: AddMentorModalProp) => {
  const [addVehicle, { isLoading }] = useAddVehicleMutation();
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const { user } = useUser();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicle_type: "",
      brand: "",
      model: "",
      year: "",
      color: "",
      engine: "",
      transmission: "",
      number_of_seats: "",
      license_plate: "",
      description: "",
      base_price: "",
      location: "",
      city: "",
      contact_number: "",
      images: [],
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await getToken({ template: "RoadMate" });
      setToken(userToken);
    };
    fetchToken();
  }, [getToken, user]);

  const onSubmit = async (data: FormData) => {
    try {
      if (!token) {
        toast.error("User is not authenticated");
        return;
      }
      const userId = user?.id;
      if (!userId) {
        toast.error("User information is not available");
        return;
      }

      if (!data.images || data.images.length === 0) {
        toast.error("Please upload at least one image");
        return;
      }

      const formData = new FormData();

      for (const file of data.images) {
        formData.append("files", file);
      }

      console.log(formData);

      const newVehicle: NewVehicle = {
        vehicle_type: data.vehicle_type,
        brand: data.brand,
        model: data.model,
        year: data.year,
        color: data.color,
        engine: data.engine,
        transmission: data.transmission,
        number_of_seats: data.number_of_seats,
        license_plate: data.license_plate,
        description: data.description,
        base_price: data.base_price,
        location: data.location,
        city: data.city,
        contact_number: data.contact_number,
        owner_id: userId,
      };

      formData.append("vehicle", new Blob([JSON.stringify(newVehicle)], { type: "application/json" }));

      await addVehicle({ newVehicle: formData, token }).unwrap();
      toast.success("Vehicle added successfully");
      onClose();
      form.reset();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        toast.error("There was a problem with creating the vehicle. Please try again!");
      } else {
        console.error(error);
        toast.error("An unknown error occurred.");
      }
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[725px] h-5/6">
          <DialogHeader>
            <DialogTitle className="font-semibold text-xl">Rent Your Vehicle</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <LoadingSpinner size={35} stroke={3.5} speed={1} color="black" />
              <div>Listing your vehicle...</div>
            </div>
          ) : (
            <div className="overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent p-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 flex-row">
                  <FormField
                    control={form.control}
                    name="vehicle_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select a vehicle type</FormLabel>
                        <Select value={field.value} onValueChange={(val) => field.onChange(val)}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a vehicle type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel></SelectLabel>
                              {VehicleTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <FormControl>
                          <Input placeholder="BMW" {...field} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <Input placeholder="M4 CS" {...field} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="2025" {...field} value={field.value === undefined || field.value === null ? "" : String(field.value)} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input placeholder="Red" {...field} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="engine"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select an engine type</FormLabel>
                        <Select value={field.value} onValueChange={(val) => field.onChange(val)}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an engine type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel></SelectLabel>
                              {EngineTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="transmission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select a transmission type</FormLabel>
                        <Select value={field.value} onValueChange={(val) => field.onChange(val)}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a transmission type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel></SelectLabel>
                              {TransmissionTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="number_of_seats"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Seats</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="4" {...field} value={field.value === undefined || field.value === null ? "" : String(field.value)} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="license_plate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Plate</FormLabel>
                        <FormControl>
                          <Input placeholder="CBC-1234" {...field} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea className="h-28" placeholder="Type your description here..." {...field} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="base_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Price (LKR)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="3000.00" {...field} value={field.value === undefined || field.value === null ? "" : String(field.value)} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="1st Avenue" {...field} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Colombo" {...field} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contact_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="077-123-4567" {...field} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Images</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => {
                              const files = e.target.files ? Array.from(e.target.files) : [];
                              field.onChange(files);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" type="button">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit">
                      Create
                      <Plus size={15} />
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddVehicleModel;
