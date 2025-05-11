import React from "react";
import OurImg from "../../assets/food2-plate.png"
import Silder from "react-slick";
import Slider from "react-slick";

const MenuData = [
  {
    id: 1,
    name: "Dish 1",
    price: "120",
    img: OurImg,
  },
  {
    id: 2,
    name: "Dish 2",
    price: "130",
    img: OurImg,
  },
  {
    id: 3,
    name: "Dish 3",
    price: "140",
    img: OurImg,
  },
  {
    id:4,
    name: "Dish 4",
    price: "200",
    img: OurImg,
  }
]
const OurMenu = () => {
  const setting = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 700,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 1000000, // Màn hình lớn
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1024, // Tablet
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 640, // Mobile
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      <div className="py-16 bg-primary text-white">
        <div className="container">
          {/* header */}
          <div className="mb-10 space-y-5">
            <h1 data-aos="fade-up" className="text-center text-4xl font-bold">Our Menu</h1>
            <div data-aos="fade-up" data-aos-delay="200" className="text-center sm:max-w-sm mx-auto text-xs opacity75">
              {" "}
              Đoạn code này là cấu hình responsive cho thư viện react-slick,
              giúp slider thay đổi số lượng slides hiển thị dựa trên độ rộng màn hình
            </div>
          </div>
          {/* slide */}
        </div>
        <div data-aos="zoom-in">
          <Slider {...setting} >
            {
              MenuData.map((menu) => (
                // eslint-disable-next-line react/jsx-key
                <div className="my-16">
                  <div className="flex flex-col gap-4 py-8 px-6 mx-4 rounded-xl">
                    {/* Image */}
                    <div className="mb-3 flex justify-center">
                      <img src={menu.img} alt="" className="rounded-full w-auto sm:max-w-[200px]
                                                             md:max-w-[250px] shadow-1"/>
                    </div>
                    {/* Text content */}
                    <div className="flex flex-col items-center gap-4">
                      <div className="space-y-3 text-center">
                        <h1 className="text-xl">{menu.name}</h1>
                        <p className="text-3xl font-semibold">
                          <span className="text-2xl font-cursive">Only</span> ${" "}
                          {menu.price}
                        </p>
                        <a href="#" className="underline"> Buy now </a>
                        </div>
                    </div>
                  </div>
                </div>
              ))
            }
          </Slider>
        </div>
      </div>
    </>
  );
};

export default OurMenu;
