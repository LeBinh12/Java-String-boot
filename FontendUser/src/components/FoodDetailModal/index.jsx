import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import BannerImg from "../../assets/banner.png";
import { PhotoView } from 'react-photo-view';
import dishApi from '../../api/DishAPI';
import { useRecoilState } from 'recoil';
import { isAuthenticatedState, ListCart } from '../../recoil/atom';
import Notification from '../Notification/NotificationProvider';

FoodDetailModal.propTypes = {

};

function FoodDetailModal({ isOpen, onClose, food }) {
    const [animatingFood, setAnimatingFood] = useState(null);

    const [dishesCategory, setDishesCategory] = useState([]);
    const [dishbyId, setDishById] = useState([]);
    const [dishId, setDishId] = useState(null);
    const [AuthenticatedState, setAuthenticatedState] = useRecoilState(isAuthenticatedState)
    const [listCart, setListCart] = useRecoilState(ListCart);
    useEffect(() => {
        if (food.dishId != dishId) {
            setDishId(food.dishId)
        }
    }, [food.dishId])
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch the dish details and category in parallel
                const [categoryData, dishData] = await Promise.all([
                    dishApi.getDishesCategory(food.dishCategory.categoryId),
                    dishApi.get(dishId),
                ]);
                setDishesCategory(categoryData.data);
                setDishById(dishData);
            } catch (error) {
                console.log('Error', error);
            }
        };

        if (food.dishId && food.dishCategory) {
            fetchData();
        }
    }, [dishId, food.dishCategory]);



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

    console.log("Id dish, ", dishId);

    const handleDishClick = (newDishId) => {
        setDishId(newDishId); // Update dishId and trigger the useEffect
    };
    if (!isOpen) return null;
    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl p-6 w-11/12 sm:w-3/4 lg:w-2/3 xl:w-1/2 shadow-2xl relative max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl transition-colors duration-200"
                    onClick={onClose}
                >
                    ×
                </button>

                {/* Main Content */}
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Food Image */}
                    <div className="flex-shrink-0 flex justify-center md:w-1/2">
                        <PhotoView src={dishbyId.image_url}>
                            <img
                                src={dishbyId.image_url}
                                alt={dishbyId.name}
                                className="rounded-xl w-full max-w-sm h-64 object-cover shadow-md"
                            />
                        </PhotoView>
                    </div>

                    {/* Food Information */}
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-gray-800 mb-3">{dishbyId.name}</h2>

                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-lg font-medium text-gray-600">Price:</span>
                            {dishbyId.price ? dishbyId.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'Giá chưa có'}
                        </div>

                        {/* Add to Cart Button */}
                        <div className="mb-6">
                            <button
                                onClick={() => handleAddToCart(dishbyId)}
                                className="w-full sm:w-auto bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 text-lg font-semibold"
                            >
                                Add to Cart
                            </button>

                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Mô tả món ăn</h3>
                            <div
                                className="text-gray-600 leading-relaxed max-h-48 overflow-y-auto pr-2"
                                dangerouslySetInnerHTML={{ __html: dishbyId.description }}
                            />
                        </div>
                    </div>
                </div>

                {/* Suggested Products */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Các món liên quan</h3>
                    <div className="flex overflow-x-auto gap-4 pb-4">
                        {dishesCategory.map((dish) => (
                            <div
                                key={dish.id}
                                onClick={() => handleDishClick(dish.dishId)}
                                className="flex-none w-44 sm:w-52 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                                <PhotoView src={dish.image_url}>
                                    <img
                                        src={dish.image_url}
                                        alt={dish.name}
                                        className="w-full h-36 object-cover rounded-t-lg"
                                    />
                                </PhotoView>
                                <div className="p-3">
                                    <h4
                                        onClick={() => {
                                            setDishId(dish.dishId); // Cập nhật `dishId`
                                        }}
                                        className="text-base font-semibold text-gray-800 truncate"
                                    >
                                        {dish.name}
                                    </h4>
                                    <p className="text-sm font-medium text-gray-500 mt-1">{dish.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FoodDetailModal;