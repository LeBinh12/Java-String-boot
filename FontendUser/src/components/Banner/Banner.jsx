import React from "react";
import BannerImg from "../../assets/banner.png"
const Banner = () => {
  return (
    <>
      <div className="min-h-[620px] flex justify-center items-center py-12 sm:py-0">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* image section */}
            <div data-aos="zoom-in" className="flex justify-center items-center">
              <img src={BannerImg} alt="" className="max-w-[450px] w-full mx-auto shadow-1" />
            </div>
            {/* content */}
            <div className="flex flex-col justify-center gap-6 sm:pt-0">
              <p data-aos="fade-up" className="uppercase text-3xl font-semibold text-dark">About</p>
              <h1 data-aos="fade-up" data-aos-delay="200" className="text-5xl text-primary font-bold font-cursive2">Fresh Bowl</h1>
              <p data-aos="fade-up" data-aos-delay="300" className="text-sm text-gray-500 tracking-wide leading-5">
                khảo những mẫu content đồ ăn mà ABC Digi gợi ý dưới đây.
                10 Ý tưởng và 10 mẫu content có sẵn này sẽ giúp nội dung của bạn thu hút khán giả,
                từ đó gia tăng chuyển đổi cho doanh nghiệp.
              </p>
              <div>
                <button data-aos="fade-up" data-aos-delay="400" className="primary-btn">
                  View Our Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;
