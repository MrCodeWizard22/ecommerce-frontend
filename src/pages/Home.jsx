import React from "react";
import CarouselCustomNavigation from "../components/Carousel";
import CardComponent from "../components/CardComponent.jsx"; // Import your Card component

const Home = () => {
  const cardData = [
    { title: "Card 1", description: "This is the first card." },
    { title: "Card 2", description: "This is the second card." },
    { title: "Card 3", description: "This is the third card." },
    { title: "Card 4", description: "This is the fourth card." },
  ];
  return (
    <div className="relative w-full h-[650px]">
      {" "}
      {/* Adjust height as needed */}
      <CarouselCustomNavigation />
      <div className="absolute top-2/3 mx-2 flex justify-center gap-5">
        {cardData.map((card, index) => (
          <CardComponent
            key={index}
            title={card.title}
            description={card.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
