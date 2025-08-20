import type { RentalStateDetails, Status } from "@/features/booking/bookingTypes";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import type { Stripe, StripeElements } from "@stripe/stripe-js";
import { useState } from "react";
import { toast } from "sonner";
import { useUpdateBookingMutation } from "@/features/booking/bookingSlice";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { FormData } from "../paymentTypes";
import { OrderSummary } from "@/features/payment/components/OrderSummary";

const CheckoutForm = ({ stateData }: { stateData: RentalStateDetails }) => {
  const stripe: Stripe | null = useStripe();
  const elements: StripeElements | null = useElements();
  const [loading, setLoading] = useState<boolean>(false);
  const { getToken } = useAuth();
  const [updateBooking] = useUpdateBookingMutation();
  const navigate = useNavigate();

  const formSchema = z.object({
    customerName: z.string().nonempty("Customer name must not be empty"),
    customerEmail: z.string().email("Invalid Email").nonempty("Customer email must not be empty"),
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
    },
  });

  const handlePayment = async ({ status }: { status: Status }) => {
    const token = await getToken({ template: "RoadMate" });
    const { error } = await updateBooking({ token, id: stateData?.booking_id, status: status });
    if (error) {
      toast.error("Failed to update booking.");
    }
  };

  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (!stripe || !elements) {
        toast.error("Stripe.js has not yet loaded.");
        setLoading(false);
        return;
      }

      const result: {
        error?: { message?: string };
        paymentIntent?: { status?: string };
      } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/completion`,
          payment_method_data: {
            billing_details: {
              name: data.customerName,
              email: data.customerEmail,
            },
          },
        },
        redirect: "if_required",
      });

      if ("error" in result && result.error) {
        console.error(result.error.message);
        toast.error(`Payment failed: ${result.error.message}`);
      } else if ("paymentIntent" in result && result.paymentIntent?.status === "succeeded") {
        toast.success("Payment succeeded!");
        handlePayment({ status: "CONFIRMED" });
      }
    } catch (err) {
      console.error("Payment error:", err);
      handlePayment({ status: "CANCELED" });
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
      navigate("/", { replace: true });
    }
  };

  return (
    <section className="container px-8 mx-auto">
      <header className=" border-gray-200">
        <div className="container py-6">
          <h1 className="text-3xl font-bold text-black">Checkout</h1>
        </div>
      </header>
      {/* Checkout content */}
      <main className="pt-2 pb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main checkout form */}
          <div className="flex-1 border border-gray-200 rounded-lg p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Customer Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Customer Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <PaymentElement className="font-inter" />
                <Button type="submit" disabled={!stripe || loading} className="px-8">
                  {loading ? "Processing..." : "Pay"}
                </Button>
              </form>
            </Form>
          </div>
          {/* Order summary sidebar */}
          <div className="lg:w-96 mt-8 lg:mt-0">
            <OrderSummary vehicle={stateData} />
          </div>
        </div>
      </main>
    </section>
  );
};

export default CheckoutForm;
