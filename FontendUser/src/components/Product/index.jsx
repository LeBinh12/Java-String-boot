import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DishCard from '../DishCard';
import ListCategories from '../ListCategories/ListCategories';
import dishApi from '../../api/DishAPI';
import CategoryApi from '../../api/CategoryApi';
import { use } from 'react';


function Dish({ cartPosition }) {

    const [foodsData, setFood] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [maxPrice, setMaxPrice] = useState(null);
    const pageSize = 6;
    useEffect(() => {
        const fetchData = async () => {
            try {

                const data = await dishApi.getDishesCategory(selectedCategory, currentPage, pageSize, search, maxPrice);

                setTotalPages(data.totalPages);
                setFood(data.data); // Giả sử dữ liệu trả về có `items`
            } catch (error) {
                console.log('Error', error);
            }
        };
        fetchData();
    }, [selectedCategory, currentPage, search, maxPrice]);


    console.log("CategoryId: ", selectedCategory)

    useEffect(() => {
        (async () => {
            try {
                const data = await CategoryApi.getAll();
                setCategories(data);
            } catch (error) {
                console.log('Error', error);
            }
        })()
    }, [])

    const handleCategoryClick = (value) => {
        setSelectedCategory(value ? value.categoryId : null);
    }
    // const foods = [
    //     {
    //         name: "Salad Cá hồi",
    //         price: "89.000 đ",
    //         image: "https://via.placeholder.com/200",
    //         description: "Salad tươi ngon với cá hồi áp chảo, rau xanh và sốt mè rang."
    //     },
    //     {
    //         name: "Salad mùa xuân",
    //         price: "79.000 đ",
    //         image: "https://via.placeholder.com/200",
    //         description: "Hỗn hợp rau tươi theo mùa kết hợp với sốt chua ngọt đặc trưng."
    //     },
    //     {
    //         name: "Há cảo truyền thống Hàn Quốc",
    //         price: "79.000 đ",
    //         image: "https://via.placeholder.com/200",
    //         description: "Những chiếc há cảo nhân thịt và rau củ, được hấp mềm và thơm ngon."
    //     },
    //     {
    //         name: "Kimbap chiên",
    //         price: "85.000 đ",
    //         image: "https://via.placeholder.com/200",
    //         description: "Kimbap truyền thống cuộn rong biển, tẩm bột chiên giòn rụm."
    //     },
    //     {
    //         name: "Kimchi hầm",
    //         price: "75.000 đ",
    //         image: "https://via.placeholder.com/200",
    //         description: "Kimchi lên men kết hợp với thịt ba chỉ, đậu hũ và nước dùng cay nồng."
    //     },
    //     {
    //         name: "Bánh xèo HQ",
    //         price: "95.000 đ",
    //         image: "https://via.placeholder.com/200",
    //         description: "Bánh xèo giòn rụm, nhân hải sản và rau củ, chấm nước sốt đậm đà."
    //     }
    // ];

    const handlePageChange = (newPage) => {
        console.log("Chuyển sang trang:", newPage);
        setCurrentPage(newPage);
    };
    return (
        <>
            <div className='"max-w-6xl mx-auto px-4 mt-8 flex gap-6'>
                {/* Cột trái: ListCategories cố định trong vùng cuộn */}
                <ListCategories
                    categories={categories}
                    onCategoryClick={handleCategoryClick}
                />


                {/* Cột phải: Danh sách món ăn */}
                <div className="w-4/5">
                    <DishCard
                        cartPosition={cartPosition}
                        foods={foodsData}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </>
    );
}

export default Dish;