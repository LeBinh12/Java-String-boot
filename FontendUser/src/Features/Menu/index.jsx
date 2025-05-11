import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DishCard from '../../components/DishCard';
import ListCategories from '../../components/ListCategories/ListCategories';
import CategoryApi from '../../api/CategoryApi';
import dishApi from '../../api/DishAPI';
import { Link } from 'react-router-dom';

MenuFeatures.propTypes = {

};

function MenuFeatures({ cartPosition }) {
    const [foodsData, setFood] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 12;
    const [search, setSearch] = useState("");
    const [maxPrice, setMaxPrice] = useState(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {

                const data = await dishApi.getDishesCategory(selectedCategory, currentPage, pageSize, search, maxPrice);
                setTotalPages(data.totalPages);
                setFood(data.data); // Giả sử dữ liệu trả về có `items`
                setLoading(false);
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


    const handlePageChange = (newPage) => {
        console.log("Chuyển sang trang:", newPage);
        setCurrentPage(newPage);
    };
    return (
        <>
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
                <div className="text-center text-xl font-semibold mt-4">
                    <h2 className="text-8xl lg:text-[9rem]
                              font-bold bg-clip-text text-transparent
                              bg-gradient-to-b from-primary
                              to-primary/90 font-cursive"
                        data-aos="zoom-out"
                        data-aos-delay="200">
                        Thực đơn
                    </h2>
                </div>
                {/* Bộ lọc tìm kiếm và giá */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-6 px-4 w-full">
                    {/* Ô tìm kiếm */}
                    <input
                        type="text"
                        placeholder="Tìm món ăn..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(0);
                        }}
                        className="border border-gray-300 rounded px-4 py-2 w-[250px] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>



                <div className='"max-w-4xl mx-auto px-4 mt-8 flex gap-6'>

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
            </div>
        </>
    );
}

export default MenuFeatures;