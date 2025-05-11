import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from '../../Form/InputField';
import { Button } from '@mui/material';
import { motion } from "framer-motion";
import { X } from "lucide-react";
import dishCategoryApi from '../../../Api/dishCategoryApi';

FormStaff.propTypes = {
    onAddStaff: PropTypes.func,
    onClose: PropTypes.func
};

function FormStaff(props) {

    const { setIsModalOpen, data, onAddStaff, onClose, onEditStaff, mode } = props;


    const [categoriesList, setCategoriesList] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const data = await dishCategoryApi.getAllDishCategories();
                console.log("Data category:", data.data);
                setCategoriesList(data.data);
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
            .min(5, "Mô tả phải có ít nhất 5 ký tự")
            .max(255, "Mô tả không được quá 255 ký tự"),

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
            category_id: data?.category_id || ''
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

    // const handleSubmit = (value) => {
    //     if (data) {
    //         if (onEditStudent) {
    //             onEditStudent({ ...value, staff_Id: data.staff_Id });
    //         }
    //     } else {
    //         if (onAddStudent) {
    //             onAddStudent(value);
    //         }
    //     }
    //     form.reset();
    // };


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className=" bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Thêm nhân viên</h2>
                    <button onClick={onClose}>
                        <X className="text-gray-900 hover:text-red-500" size={24} />
                    </button>
                </div>

                <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-2 gap-4">
                    <InputField name="name" form={form} label="Nhập tên nhân viên" />
                    <InputField name="position" form={form} label="Chức vụ" />
                    <InputField name="phoneNumber" form={form} label="Số điện thoại" />
                    <InputField name="email" form={form} label="Email" />
                    <InputField name="salary" form={form} label="Lương" type="number" />

                    <InputField name="hireDate" form={form} type="date" />
                    <InputField name="status" form={form} label="Trạng thái (Active/Inactive)" />
                    <InputField name="restaurant_id" form={form} label="Mã nhà hàng" type="number" />

                    <div className="col-span-2 flex justify-end gap-4 mt-4">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg"
                        >
                            {mode === "edit" ? "Cập nhật thông tin" : "Thêm thông tin"}  {/* Cập nhật tên nút */}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default FormStaff;