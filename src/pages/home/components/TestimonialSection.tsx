import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const TestimonialSection = () => {
  const testimonials = [
    {
      quote: "Booking was quick and easy, the car was spotless, and the entire rental process felt smooth, reliable, and totally stress-free every step.",
      author: "Nadil Dulnidu",
    },
    {
      quote: "Great service with friendly staff, fair pricing, and a car that was ready on time. The experience was seamless and I will definitely rent again.",
      author: "Oshen Evanjalo",
    },
    {
      quote: "The app was simple to use and made comparing vehicles easy. My rental was ready when I arrived, clean, and the service team was very supportive.",
      author: "Sadila Bandara",
    },
    {
      quote: "I loved the flexibility of the rental terms, and customer support was quick to respond. The vehicle was well maintained and smooth to drive.",
      author: "S Jathusha",
    },
    {
      quote: "Everything went smoothly from booking to return. The vehicle was reliable, comfortable, and the entire rental felt convenient and stress-free.",
      author: "Dineth Sasmitha",
    },
  ];
  return (
    <section id="community" className="py-14">
      <div className="container mx-auto px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Whats Our Clients Say</h2>
          <p className="text-muted-foreground text-lg">Real feedback from people who’ve experienced our service.</p>
        </div>
        <Carousel
          className="w-full"
          opts={{
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
              stopOnMouseEnter: true,
              stopOnInteraction: false,
            }),
          ]}
        >
          <CarouselContent className="-ml-1">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-1 lg:basis-1/3">
                <div className="p-2">
                  <Card key={index} className="p-8 rounded-xl bg-muted text-black">
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                      </div>
                      <p className="text-base leading-relaxed mb-6">{testimonial.quote}</p>
                      <div>
                        <p className="font-semibold text-black">{testimonial.author}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialSection;
