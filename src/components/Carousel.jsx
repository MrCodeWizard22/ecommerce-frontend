import { Carousel } from "@material-tailwind/react";
import { ImageUrls } from "../assets/images/ImageUrls";

const CarouselCustomNavigation = () => {
  return (
    <div className="relative w-full max-w-screen-xl mx-auto overflow-hidden">
      {" "}
      {/* Wrapper */}
      <Carousel
        className="rounded-xl my-2 w-full"
        navigation={({ setActiveIndex, activeIndex, length }) => (
          <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
            {new Array(length).fill("").map((_, i) => (
              <span
                key={i}
                className={`block h-1 cursor-pointer rounded-2xl transition-all ${
                  activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
                }`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        )}
      >
        <div className="h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden">
          <img
            src={ImageUrls.carousel1}
            alt="image 1"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden">
          <img
            src={ImageUrls.carousel2}
            alt="image 2"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden">
          <img
            src={ImageUrls.carousel3}
            alt="image 3"
            className="w-full h-full object-cover"
          />
        </div>
      </Carousel>
    </div>
  );
};

export default CarouselCustomNavigation;
