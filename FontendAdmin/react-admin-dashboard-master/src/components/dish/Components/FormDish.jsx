import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from '../../Form/InputField';
import { X } from 'lucide-react';
import { motion } from "framer-motion";
import dishCategoryApi from '../../../Api/dishCategoryApi';
import { Editor } from '@tinymce/tinymce-react';

FormDishCategory.propTypes = {

};

function FormDishCategory({ setIsModalOpen, data, onAddDish, onEditDish, onClose, mode }) {



    const [categoriesList, setCategoriesList] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const data = await dishCategoryApi.getAllDishCategories();
                console.log("Data category:", data);
                setCategoriesList(data);
                // setStaffList(data);
            } catch (error) {
                console.log('Error', error);
            }
        })()
    }, [])

    const schema = yup.object().shape({

        name: yup.string()
            .required("Tên món ăn không được để trống")
            .min(3, "Tên món ăn phải có ít nhất 3 ký tự")
            .max(100, "Tên món ăn không được quá 100 ký tự"),

        description: yup.string()
            .required("Mô tả không được để trống")
            .min(5, "Mô tả phải có ít nhất 5 ký tự"),

        price: yup.number()
            .required("Giá món ăn không được để trống")
            .min(1000, "Giá phải lớn hơn hoặc bằng 1,000 VNĐ")
            .max(10000000, "Giá không được vượt quá 10,000,000 VNĐ"),

        image_url: yup.string()
            .required("Đường dẫn hình ảnh không được để trống")
            .matches(
                /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))|(^[a-zA-Z0-9-_/]+)$/,
                "URL hình ảnh không hợp lệ"
            ),

        is_available: yup.boolean()
            .required("Trạng thái không được để trống"),

        category_id: yup.number()
            .required("Danh mục không được để trống")
            .integer("Danh mục phải là số nguyên")
            .min(1, "Danh mục phải có ID lớn hơn 0"),
    });

    const form = useForm({
        defaultValues: {
            name: data?.name || '',
            description: data?.description || '',
            price: data?.price || 0,
            image_url: data?.image_url || '',
            is_available: data?.is_available || '',
            categoryId: data?.category_id || ''
        },
        resolver: yupResolver(schema),
    })

    const handleSubmit = (values) => {
        if (mode === "edit" && onEditDish) {
            onEditDish({ ...values, dishId: data.dishId });  // Gửi dữ liệu cập nhật
        } else if (mode === "add" && onAddDish) {
            onAddDish(values);
        }
        onClose();
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">{mode === "edit" ? "Chỉnh sửa món ăn" : "Thêm món ăn"}</h2>
                    <button onClick={onClose}>
                        <X className="text-gray-900 hover:text-red-500" size={24} />
                    </button>
                </div>

                <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-2 gap-4">
                    <InputField name="name" form={form} label="Tên món ăn" />
                    <InputField name="price" form={form} label="Giá" type="number" />
                    <InputField name="image_url" form={form} label="URL Hình ảnh" />

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Có sẵn</label>
                        <input
                            type="checkbox"
                            {...form.register("is_available")}
                            className="w-5 h-5 accent-blue-600 cursor-pointer"
                        />
                    </div>
                    {/* Dropdown danh mục món ăn */}
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">Danh mục</label>
                        <select
                            {...form.register("category_id")}
                            className="mt-1 block w-full text-gray-800 rounded-md border-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                        >
                            <option value="" className="text-gray-800 mb-1">Chọn danh mục</option>
                            {categoriesList.map((category) => (
                                <option key={category.categoryId} value={category.categoryId} className="text-gray-800">
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-800 mb-1">Mô tả</label>
                        <Editor
                            onEditorChange={(content) => form.setValue("description", content)}

                            apiKey='oeu3yhycyrj0lqa722zpeyqh5xj7r8imoh31ctunafgvtgmz'
                            init={{
                                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                            }}
                            initialValue={mode === 'edit' ? form.getValues("description") : "Welcome to TinyMCE!"}
                        />
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.description?.message}</p>
                    </div>

                    <div className="col-span-2 flex justify-end gap-4 mt-4">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg"
                        >
                            {mode === "edit" ? "Cập nhật" : "Thêm mới"}
                        </button>
                    </div>


                </form>
            </motion.div>
        </div>
    );
}

export default FormDishCategory;