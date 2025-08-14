import { Card, CardContent } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const TestimonialSection = () => {
  const testimonials = [
    {
      quote: "The Chill Syndicate redefines what it means to belong. It's where visionaries gather and real connections thrive.",
      author: "Malshan Peris",
      title: "Chairman",
    },
    {
      quote: "In a world full of noise, The Chill Syndicate offers clarity, class, and conversation that actually real matters.",
      author: "Geeth Dananjaya",
      title: "Managing Director",
    },
    {
      quote: "Every visit feels intentional. The Chill Syndicate blends elegance with authenticity in a way never seen before.",
      author: "Dasula Siriwardana",
      title: "General Secretary",
    },
    {
      quote: "There's something magnetic about the energy here. The Chill Syndicate is more than a space - it's an experience.",
      author: "Banumath Kovinda",
      title: "Vice President",
    },
    {
      quote: "I didn't just join a club — I found alignment. The Chill Syndicate is where style, ambition, and soul converge.",
      author: "Nadil Dulnidu",
      title: "Member",
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
              <CarouselItem className="pl-1 lg:basis-1/3">
                <div className="p-2">
                  <Card key={index} className="p-8 rounded-xl bg-gray-50 text-black">
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                      </div>
                      <p className="text-base leading-relaxed mb-6">{testimonial.quote}</p>
                      <div>
                        <p className="font-semibold text-black">{testimonial.author}</p>
                        <p className="text-gray-500 text-sm">{testimonial.title}</p>
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
