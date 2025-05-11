import React from "react";
import Slider from "react-slick"

const TestimonialData = [
  {
    id: 1,
    name: "Quan 1",
    text: ` Ở các bài viết giới thiệu nhà hàng, cần cung cấp cho khách hàng biết thông tin về
    thương hiệu và dịch vụ mà bạn cung cấp.Từ đó, khách hàng có thể hiểu sơ bộ về nhà hàng,
    các ưu điểm cũng như các thông tin liên hệ.Dạng mẫu quảng cáo chỉ phát huy tốt nhất vào l
    úc mới bắt đầu kinh doanh.`,
    img: "https://png.pngtree.com/png-clipart/20250104/original/pngtree-lucky-cat-holding-gold-coins-clipart-png-image_19777593.png"
  },
  {
    id: 2,
    name: "Quan 2",
    text: ` Ở các bài viết giới thiệu nhà hàng, cần cung cấp cho khách hàng biết thông tin về
    thương hiệu và dịch vụ mà bạn cung cấp.Từ đó, khách hàng có thể hiểu sơ bộ về nhà hàng,
    các ưu điểm cũng như các thông tin liên hệ.Dạng mẫu quảng cáo chỉ phát huy tốt nhất vào l
    úc mới bắt đầu kinh doanh.`,
    img: "https://png.pngtree.com/png-clipart/20250104/original/pngtree-lucky-cat-holding-gold-coins-clipart-png-image_19777593.png"
  },
  {
    id: 3,
    name: "Quan 3",
    text: ` Ở các bài viết giới thiệu nhà hàng, cần cung cấp cho khách hàng biết thông tin về
    thương hiệu và dịch vụ mà bạn cung cấp.Từ đó, khách hàng có thể hiểu sơ bộ về nhà hàng,
    các ưu điểm cũng như các thông tin liên hệ.Dạng mẫu quảng cáo chỉ phát huy tốt nhất vào l
    úc mới bắt đầu kinh doanh.`,
    img: "https://png.pngtree.com/png-clipart/20250104/original/pngtree-lucky-cat-holding-gold-coins-clipart-png-image_19777593.png"
  },
  {
    id: 4,
    name: "Quan 4",
    text: ` Ở các bài viết giới thiệu nhà hàng, cần cung cấp cho khách hàng biết thông tin về
    thương hiệu và dịch vụ mà bạn cung cấp.Từ đó, khách hàng có thể hiểu sơ bộ về nhà hàng,
    các ưu điểm cũng như các thông tin liên hệ.Dạng mẫu quảng cáo chỉ phát huy tốt nhất vào l
    úc mới bắt đầu kinh doanh.`,
    img: "https://png.pngtree.com/png-clipart/20250104/original/pngtree-lucky-cat-holding-gold-coins-clipart-png-image_19777593.png"
  },

]
const Testimonials = () => {
  const setting = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
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
      <div className="py-10 mb-10">
        <div className="container">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-center text-4xl font-bold font-cursive2">Retaurants</h1>
          </div>
          {/* Slider */}
          <div data-aos="zoom-in">
            <Slider {...setting}>
              {
                TestimonialData.map((map) => (
                  // eslint-disable-next-line react/jsx-key
                  <div className="my-6">
                    <div className="flex flex-col gap-4 shadow-lg py-8 px-6 mx-4 rounded-xl bg-primary/10 relative">
                      <div className="mb-4">
                        <img src={map.img} alt="" className="rounded-full w-20 h-20" />
                      </div>
                      {/* Content */}
                      <div className="flex flex-col items-center gap-4">
                        <div className="space-y-3">
                          <p className="text-xs text-gray-500">{map.text}</p>
                          <h1 className="text-xl font-bold text-black/80 font-cursive2">{map.name}</h1>
                        </div>
                      </div>
                      <p className="text-black/20 text-9xl font-serif absolute top-0 right-0">,,</p>

                    </div>
                  </div>
                ))
              }
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
};

export default Testimonials;
