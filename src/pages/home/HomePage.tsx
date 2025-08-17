import { FeaturedVehicles } from "@/features/vehicle/components/FeaturedVehicles";
import { Hero } from "@/pages/home/components/Hero";
import TestimonialSection from "@/pages/home/components/TestimonialSection";
import { Helmet } from "react-helmet";
const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>RoadMate | Home Page</title>
        <meta name="description" content="Welcome to the Home Page" />
      </Helmet>
      <main>
        <Hero />
        <FeaturedVehicles />
        <TestimonialSection />
      </main>
    </>
  );
};

export default HomePage;
