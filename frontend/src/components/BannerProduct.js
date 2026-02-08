import React, { useEffect, useState } from "react";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";

const BannerProduct = () => {
  const [currentImage, setCurrentImage] = useState(0);

  // ✅ Updated paths to use public/assets/banner folder
  const desktopImages = [
    "/assets/banner/img1.webp",
    "/assets/banner/img2.webp",
    "/assets/banner/img3.jpg",
    "/assets/banner/img4.jpg",
    "/assets/banner/img5.webp",
  ];

  const mobileImages = [
    "/assets/banner/img1_mobile.jpg",
    "/assets/banner/img2_mobile.webp",
    "/assets/banner/img3_mobile.jpg",
    "/assets/banner/img4_mobile.jpg",
    "/assets/banner/img5_mobile.png",
  ];

  const nextImage = () => {
    setCurrentImage((prev) =>
      prev < desktopImages.length - 1 ? prev + 1 : 0
    );
  };

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev > 0 ? prev - 1 : desktopImages.length - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 rounded">
      <div className="h-56 md:h-72 w-full bg-slate-200 relative overflow-hidden">

        {/* ARROWS */}
        <div className="absolute z-10 h-full w-full hidden md:flex items-center">
          <div className="flex justify-between w-full text-2xl px-2">
            <button
              onClick={prevImage}
              className="bg-white shadow-md rounded-full p-1"
            >
              <FaAngleLeft />
            </button>
            <button
              onClick={nextImage}
              className="bg-white shadow-md rounded-full p-1"
            >
              <FaAngleRight />
            </button>
          </div>
        </div>

        {/* DESKTOP */}
        <div
          className="hidden md:flex h-full w-full transition-transform duration-700"
          style={{ transform: `translateX(-${currentImage * 100}%)` }}
        >
          {desktopImages.map((img, index) => {
            return (
              <img
                key={index}
                src={img}
                className="min-w-full h-full object-cover"
                alt="banner"
              />
            );
          })}
        </div>

        {/* MOBILE */}
        <div
          className="flex md:hidden h-full w-full transition-transform duration-700"
          style={{ transform: `translateX(-${currentImage * 100}%)` }}
        >
          {mobileImages.map((img, index) => {
            return (
              <img
                key={index}
                src={img}
                className="min-w-full h-full object-cover"
                alt="banner"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BannerProduct;
