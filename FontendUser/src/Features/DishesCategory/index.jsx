import React from 'react';
import PropTypes from 'prop-types';
import { data, Link, Route } from 'react-router-dom';
import DishCard from '../../components/DishCard';
import Dish from '../../components/Product';


function DishesCategory({ cartPosition }) {

    return (
        <div className='pt-[150px]'>
            <div className="flex items-center text-gray-600 dark:text-gray-300 text-semibold  mb-4 ml-10">
                <Link to="/" className="hover:text-blue-500 transition duration-200">
                    Trang chủ
                </Link>
                <span className="mx-2 text-gray-400">/</span>
                <Link to="/Category" className="hover:text-blue-500 transition duration-200">
                    Thực đơn
                </Link>
            </div>

            <Dish cartPosition={cartPosition} />
        </div>

    );
}

export default DishesCategory;