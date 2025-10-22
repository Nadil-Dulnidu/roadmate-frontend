import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/features/payment/components/CheckoutForm";
import { STRIPE_PUBLIC_KEY } from "@/config/env";
import { useCreatePaymentIntentMutation } from "../paymentSlice";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "sonner";

const stripePromise = loadStripe(`${STRIPE_PUBLIC_KEY}`);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState("");
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const location = useLocation();
  const { getToken,isSignedIn, isLoaded } = useAuth();
  const stateData = location.state;
  const { user } = useUser();
  const router = useNavigate();

  useEffect(() => {
    if (isSignedIn && isLoaded && user?.publicMetadata.role === "RENTER") {
      return;
    } else {
      router("/auth/signup");
    }
  }, [isLoaded, router, user, isSignedIn]);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      if (!stateData || !stateData.vehicle) {
        toast.error("Session expired!");
        return <Navigate to="/" replace />;
      }
      const token = await getToken({ template: "RoadMate" });
      const { data, error } = await createPaymentIntent({ token, payment: { amount: stateData.total_price * 100 } });
      if (data) {
        setClientSecret(data.clientSecret);
      }
      if (error) {
        console.error("Error creating payment intent:", error);
      }
    };
    fetchPaymentIntent();
  }, [createPaymentIntent, getToken, stateData]);

  return (
    <>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
          <CheckoutForm stateData={stateData} />
        </Elements>
      )}
    </>
  );
}
