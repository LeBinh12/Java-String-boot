import React from "react";
import HeroPng from "../../assets/hero.png";
const Hero = () => {
  return (
    <>
      <div className="min-h-[500px] sm:min-h-[600p] pt-[150px]
                      bg-lightBlue flex justify-center items-center" >
        <div className="container pd-8 sm:pd-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Text content */}
            <div className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left">
              <h1 className="text-8xl lg:text-[12rem]
                              font-bold bg-clip-text text-transparent
                              bg-gradient-to-b from-primary
                              to-primary/90 font-cursive"
                              data-aos="zoom-out"
                              data-aos-delay="200">
                Rice
                <span className="text-3xl font-sans text-dark"> Bowl</span>
              </h1>
              <p data-aos="fade-down" data-aos-delay="300" className="text-sm text-dark font-sans">
                {" "}
                Thực phẩm, cũng gọi là thức ăn là bất kỳ vật phẩm nào,
                bao gồm chủ yếu các chất: chất bột, chất béo, chất đạm,
                khoáng chất, hoặc nước, mà con người hay động vật có thể ăn
                hay uống được, với mục đích cơ bản
              </p>
              <div>
                <button className="primary-btn" data-aos="fade-up" data-aos-delay="400" data-aos-offset="0">
                  View Our Menu
                </button>

              </div>
            </div>
            {/* Image */}
            <div data-aos="zoom-in" data-aos-duration="500" className="min-h-[450px] flex justify-center items-center relative order-1 sm:order-2">
              <img src={HeroPng} alt="Anhr biaf" className="max-w-[450px] w-full mx-auto sm:scale-125 shadow-1" />
              <div className="bg-primary p-3 rounded-xl absolute top-10 left-10 hidden md:block text-white">
              <h1 className="">Fresh food</h1>
            </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
