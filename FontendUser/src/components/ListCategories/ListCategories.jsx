import React, { useState } from "react";
import PropTypes from "prop-types";
import { FiMenu } from "react-icons/fi"; // Icon dấu 3 gạch
import { IoClose } from "react-icons/io5"; // Icon đóng menu

ListCategories.propTypes = {
    onCategoryClick: PropTypes.func
};


function ListCategories({ categories, onCategoryClick }) {
    const [isOpen, setIsOpen,] = useState(false); // State mở/đóng menu
    console.log("Category:", categories);


    const handleCategoryClick = (value) => {
        if (!onCategoryClick) return;
        onCategoryClick(value);
    }
    return (
        <>
            {/* Nút mở menu trên mobile */}
            <button
                className="md:hidden text-orange-500 text-3xl p-3 fixed top-4 left-4 z-50"
                onClick={() => setIsOpen(true)}>
                <FiMenu />
            </button>

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg 
                transform ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                transition-transform duration-300 ease-in-out z-40 
                md:relative md:translate-x-0 md:w-1/5 md:p-6 border-r 
                border-gray-200 mr-6 shadow-lg rounded-lg`}>

                {/* Nút đóng menu trên mobile */}
                <button
                    className="md:hidden text-orange-500 text-3xl p-3 absolute top-4 right-4"
                    onClick={() => setIsOpen(false)}>
                    <IoClose />
                </button>

                {/* Tiêu đề */}
                <h2 className="text-xl font-bold text-orange-500 mb-4 text-center relative 
                    after:content-[''] after:block after:w-16 after:h-1 after:bg-orange-500 after:mx-auto after:mt-1">
                    Gọi món
                </h2>

                {/* Danh sách danh mục */}
                <ul className="space-y-3">
                    <li
                        className="py-2 px-4 text-xl font-semibold cursor-pointer 
                        hover:text-orange-500 hover:bg-orange-100 hover:scale-105 
                        transition-all duration-300 ease-in-out rounded-md"
                        onClick={() => handleCategoryClick(null)}
                    >
                        Tất cả
                    </li>
                    {categories.map((category, index) => (
                        <li key={index}
                            onClick={() => handleCategoryClick(category)}
                            className="py-2 px-4 text-xl font-semibold cursor-pointer 
                            hover:text-orange-500 hover:bg-orange-100 hover:scale-105 
                            transition-all duration-300 ease-in-out rounded-md">
                            {category.name}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Overlay (nền đen khi mở menu) */}
            {isOpen && (
                <div className="fixed inset-0 bg-black opacity-50 md:hidden" onClick={() => setIsOpen(false)}></div>
            )}
        </>
    );
}

// Kiểm tra prop types
ListCategories.propTypes = {
    categories: PropTypes.array.isRequired,
};

export default ListCategories;
