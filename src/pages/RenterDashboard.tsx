import { Helmet } from "react-helmet";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RenterMyBookingSection from "@/features/booking/components/RenterMyBookingSection";
import RenterMyReviewsSection from "@/features/review/components/RenterMyReviewsSection";

const categories = [
  { id: "Booking", label: "My Bookings" },
  { id: "Review", label: "My Reviews" },
];

const RenterDashboard = () => {
  const { user } = useUser();
  const { isLoaded, isSignedIn } = useAuth();
  const router = useNavigate();

  useEffect(() => {
    if (isSignedIn && isLoaded && user?.publicMetadata.role === "RENTER") {
      return;
    } else {
      router("/auth/signup", { replace: true } );
    }
  }, [isLoaded, router, user, isSignedIn]);

  return (
    <>
      <Helmet>
        <meta name="description" content="Manage your rentals and discover new vehicles" />
        <title>RoadMate | Renter Dashboard</title>
      </Helmet>
      <div className="w-full">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.firstName}!</h2>
            <p className="text-muted-foreground">Manage your rentals and discover new vehicles</p>
          </div>
          <Tabs defaultValue="Booking" className="w-full">
            <TabsList className="space-x-2 bg-muted w-fit rounded-lg mb-2">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-sn font-semibold">
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="Booking">{<RenterMyBookingSection />}</TabsContent>
            <TabsContent value="Review">{<RenterMyReviewsSection/>}</TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
};

export default RenterDashboard;
