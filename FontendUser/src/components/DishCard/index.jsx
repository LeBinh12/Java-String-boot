import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BannerImg from "../../assets/banner.png";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import HomeFeatures from '../../Features/Home';
import FoodDetailModal from '../FoodDetailModal';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { useRecoilState } from 'recoil';
import { isAuthenticatedState, ListCart } from '../../recoil/atom';
import Notification from '../Notification/NotificationProvider';

DishCard.propTypes = {
    foods: PropTypes.array,
    cartPosition: PropTypes.object,
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired

};

function DishCard({ foods, cartPosition, currentPage, totalPages, onPageChange }) {
    const [animatingFood, setAnimatingFood] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIdDish, setSelectedIdDish] = useState(null);
    const [AuthenticatedState, setAuthenticatedState] = useRecoilState(isAuthenticatedState)
    const [listCart, setListCart] = useRecoilState(ListCart);
    console.log("Food: ", foods);
    const handleAddToCart = (food, index) => {
        setAnimatingFood(index);
        setTimeout(() => {
            setAnimatingFood(null);
        }, 1000);

        setListCart((prevCart) => {
            let updateCart = [...prevCart];

            // Kiểm tra xem food có phải là mảng hay không
            const foodItems = Array.isArray(food) ? food : [food]; // Nếu food là một mảng thì sử dụng map, nếu không thì gán nó thành mảng có 1 phần tử

            foodItems.forEach((foodItem) => {
                const existingItemIndex = updateCart.findIndex((item) => item.dishId === foodItem.dishId);
                if (existingItemIndex !== -1) {
                    updateCart[existingItemIndex] = {
                        ...updateCart[existingItemIndex],
                        quantity: updateCart[existingItemIndex].quantity + 1,
                    };
                } else {
                    updateCart.push({ ...foodItem, quantity: 1 });
                }
            });

            return updateCart;
        });

        Notification.showMessage("Thêm vào bàn ăn thành công!");
    };


    console.log("List Cart: ", listCart);


    const handleDataFood = (food) => {
        setSelectedIdDish(food)
        setIsModalOpen(true)
    }

    return (
        <div>
            <div className="w-full px-4 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {foods.map((food, index) => (
                    <div
                        key={index}
                        className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm 
                    dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 transform 
                    hover:scale-105 hover:shadow-lg mx-auto"
                    >
                        <Link to={HomeFeatures}>

                            <motion.img

                                className="p-8 shadow-1 rounded-t-lg transition-all duration-300 hover:scale-105"
                                animate={
                                    animatingFood === index
                                        ? {
                                            x: cartPosition.x - 100,
                                            y: cartPosition.y - 50,
                                            scale: 0.2,
                                            opacity: 0
                                        }
                                        : { opacity: 1 }
                                }
                                transition={{ duration: 3, ease: "easeInOut" }}
                                src={food.image_url}
                                alt="product image"
                            />
                        </Link>

                        <div key={index} className="px-5 pb-5">
                            <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{food.name}</h5>

                            <div className="flex items-center mt-2.5 mb-5">
                                {[...Array(4)].map((_, i) => (
                                    <svg key={i} className="w-4 h-4 text-yellow-300 animate-pulse" viewBox="0 0 22 20" fill="currentColor">
                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                    </svg>
                                ))}
                            </div>

                            <div key={food.id} className="items-center justify-between">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">{food.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>

                                <div className="flex gap-2">
                                    {/* Nút Xem Chi Tiết */}
                                    <button
                                        className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 
            font-medium rounded-lg text-sm px-4 py-2.5 text-center transition-all duration-300 transform 
            hover:scale-110 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-700"
                                        onClick={() => handleDataFood(food)}
                                    >
                                        Xem chi tiết
                                    </button>

                                    {/* Nút Add to Cart */}
                                    <button
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 
            font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 transform 
            hover:scale-110 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        onClick={() => handleAddToCart(food, index)}
                                    >
                                        Add to cart
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                ))}



                {selectedIdDish && (
                    <FoodDetailModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        food={selectedIdDish}
                    />
                )}
            </div>

            <div className="flex flex-col items-center w-full mt-6">
                <nav className="flex items-center space-x-2">
                    <button
                        className="px-3 py-2 border rounded-l-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                        disabled={currentPage === 0}
                        onClick={() => onPageChange(currentPage - 1)}
                    >
                        Previous
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            className={`px-3 py-2 border ${currentPage === index
                                ? "bg-blue-500 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-300"
                                } transition`}
                            onClick={() => onPageChange(index)}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        className="px-3 py-2 border rounded-r-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                        disabled={currentPage === totalPages - 1}
                        onClick={() => onPageChange(currentPage + 1)}
                    >
                        Next
                    </button>
                </nav>
            </div>


        </div>

    );
}

export default DishCard;
