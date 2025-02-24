import React, { useEffect, useState } from "react";
import CarouselCustomNavigation from "../components/Carousel";
import CardComponent from "../components/CardComponent";
import { getAllProducts } from "../api/productApi";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProducts()
      .then((data) => setProducts(data))
      .catch((error) => console.error("Failed to fetch products:", error));
  }, []);

  return (
    <div className="relative w-full h-auto p-4 dark:text-white dark:bg-gray-600">
      <CarouselCustomNavigation />
      <div className="mt-6 flex flex-wrap justify-center gap-5">
        {products.length > 0 ? (
          products.map((product) => (
            <CardComponent
              key={product.productId}
              id={product.productId}
              name={product.name}
              description={product.description}
              image={product.image}
              price={product.price}
              quantity={product.quantity}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No products available.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
