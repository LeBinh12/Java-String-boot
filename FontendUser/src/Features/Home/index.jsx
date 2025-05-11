import React from 'react';
import PropTypes from 'prop-types';
import Hero from '../../components/Hero/Hero';
import Banner from '../../components/Banner/Banner';
import OurMenu from '../../components/OurMenu/OurMenu';
import Testimonials from '../../components/Testimonials/Testimonials';
import Newsletter from '../../components/Newsletter/Newsletter';
import Dish from '../../components/Product';
import Cart from '../../components/Cart';

function HomeFeatures({ cartPosition }) {

    return (
        <>
            <Hero />
            <Banner />
            <div className="text-center text-xl font-semibold mt-4">
                <h2 className="text-8xl lg:text-[9rem]
                              font-bold bg-clip-text text-transparent
                              bg-gradient-to-b from-primary
                              to-primary/90 font-cursive"
                    data-aos="zoom-out"
                    data-aos-delay="200">
                    Gợi ý món ăn
                </h2>
            </div>
            <Dish cartPosition={cartPosition} />
            <Testimonials />
            <Newsletter />
        </>

    );
}

export default HomeFeatures;