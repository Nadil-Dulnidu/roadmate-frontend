import { FeaturedVehicles } from "@/components/FeaturedVehicles";
import { Hero } from "@/components/Hero";
import TestimonialSection from "@/components/testimonialSection";
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
