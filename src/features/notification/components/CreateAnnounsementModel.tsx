import { useEffect, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useSendAnnouncementMutation } from "../notificationSlice";
import type { AnnouncementPayload } from "../notificationType";
import { toast } from "sonner";

interface AddMentorModalProp {
  isOpen: boolean;
  onClose(): void;
}

interface formData {
  title: string;
  message: string;
}

const formSchema = z.object({
  title: z.string().nonempty({ message: "Title is required." }),
  message: z.string().nonempty({ message: "Message is required." }),
});

const CreateAnnounsementModel = ({ isOpen, onClose }: AddMentorModalProp) => {
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const { user } = useUser();
  const [sendAnnouncement, { isError }] = useSendAnnouncementMutation();

  const form = useForm<formData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      message: "",
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

  const onSubmit = async (data: formData) => {
    try {
      if (!token || !user || !data) {
        throw new Error("Missing required information to create announcement.");
      }
      const announcement: AnnouncementPayload = {
        title: data.title,
        message: data.message,
      };
      await sendAnnouncement({ token, announcement }).unwrap();
      if (isError) {
        toast.error("Failed to create announcement. Please try again.");
        throw new Error("Failed to create announcement.");
      }
      toast.success("Announcement created successfully!");
    } catch (error) {
      console.error("Error creating announcement:", error);
      toast.error("Failed to create announcement. Please try again.");
    } finally {
      onClose();
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[375px] md:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>Create Announcement</DialogTitle>
          <DialogDescription>Announcements will be sent to all renters and vehicle owners.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter message" {...field} />
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
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAnnounsementModel;
