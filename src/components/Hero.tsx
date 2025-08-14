import heroImage1 from "@/assets/hero-1.jpg";
import heroImg4 from "@/assets/hero-4.jpg";
import heroImg5 from "@/assets/hero-5.jpg";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";

export const Hero = () => {
  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }));

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slidesInView, setSlidesInView] = useState<number[]>([]);

  const images = [heroImage1, heroImg4, heroImg5];

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const autoplayTimer = setInterval(() => {
      const nextIndex = (selectedIndex + 1) % images.length;
      emblaApi.scrollTo(nextIndex, true); // jump instantly
      setSelectedIndex(nextIndex);
    }, 5000);
    setSlidesInView(emblaApi.slidesInView());
    emblaApi.on("select", onSelect);
    return () => clearInterval(autoplayTimer);
  }, [emblaApi, images.length, onSelect, selectedIndex]);

  const handleMouseEnter = () => autoplay.current.stop();
  const handleMouseLeave = () => autoplay.current.play();

  return (
    <section className="relative h-[85vh] overflow-hidden" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {/* Carousel */}
      <div className="absolute inset-0" ref={emblaRef}>
        <div className="flex h-full relative">
          {images.map((img, index) => (
            <div key={index} className={`flex-[0_0_100%] absolute inset-0 transition-opacity duration-1000 overflow-hidden ${index === selectedIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
              <div className={`w-full h-full transform transition-transform duration-1000 ${index === selectedIndex ? "scale-100" : "scale-110"}`}>
                <img src={img} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero content */}
      <div className="absolute inset-0 flex items-center z-10">
        <div className="container mx-auto px-8">
          <div className="max-w-4xl">
            <p className="text-xl md:text-2xl text-white mb-2">Welcome to the</p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
              <span className="text-5xl md:text-7xl lg:text-8xl">#1 </span>
              Premium Car Rental
              <div>in Sri Lanka</div>
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8">Are you impressed with our cars?</p>
          </div>
        </div>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slidesInView.map((_, idx) => (
          <button
            key={idx}
            onClick={() => emblaApi && emblaApi.scrollTo(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === selectedIndex ? "bg-white scale-110" : "bg-white/50 hover:bg-white/80"}`}
          />
        ))}
      </div>
    </section>
  );
};
