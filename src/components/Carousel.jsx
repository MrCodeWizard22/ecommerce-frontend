import { useState, useEffect } from "react";
import { ImageUrls } from "../assets/images/ImageUrls";

const CarouselCustomNavigation = () => {
  const images = [
    ImageUrls.carousel1,
    ImageUrls.carousel2,
    ImageUrls.carousel3,
  ];
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-slide every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full max-w-screen-xl mx-auto overflow-hidden">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="h-[300px] md:h-[400px] lg:h-[500px] w-full flex-shrink-0"
          >
            <img
              src={src}
              alt={`image ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <span
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`block h-1 cursor-pointer rounded-2xl transition-all ${
              activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CarouselCustomNavigation;
