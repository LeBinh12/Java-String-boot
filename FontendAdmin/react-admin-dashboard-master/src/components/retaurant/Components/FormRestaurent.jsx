import React from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from '../../Form/InputField';
import { X } from 'lucide-react';
import { motion } from "framer-motion";

FormRestaurant.propTypes = {

};

function FormRestaurant({ setIsModalOpen, data, onAddRestaurant, onEditRestaurant, onClose, mode }) {



    const schema = yup.object().shape({
        name: yup.string().required('Vui lòng nhập tên nhà hàng'),
        address: yup.string().required('Vui lòng nhập địa chỉ'),
        phone_number: yup
            .string()
            .matches(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ')
            .required('Vui lòng nhập số điện thoại'),
        email: yup
            .string()
            .email('Email không hợp lệ')
            .required('Vui lòng nhập email'),
        description: yup.string().required('Vui lòng nhập mô tả'),
        opening_hours: yup.string().required('Vui lòng nhập giờ mở cửa'),
    });

    const form = useForm({
        defaultValues: {
            name: data?.name || '',
            address: data?.address || '',
            phone_number: data?.phone_number || '',
            email: data?.email || '',
            description: data?.description || '',
            opening_hours: data?.opening_hours || '',
        },
        resolver: yupResolver(schema),
    });

    const handleSubmit = (values) => {
        if (mode === "edit" && onEditRestaurant) {
            onEditRestaurant({ ...values, restaurantId: data.restaurantId });  // Gửi dữ liệu cập nhật
        } else if (mode === "add" && onAddRestaurant) {
            onAddRestaurant(values);
        }
        onClose();
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className=" bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Thêm nhà hàng</h2>
                    <button onClick={onClose}>
                        <X className="text-gray-900 hover:text-red-500" size={24} />
                    </button>
                </div>

                <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-2 gap-4">
                    <InputField name="name" form={form} label="Tên nhà hàng:" />
                    <InputField name="address" form={form} label="Địa chỉ:" />
                    <InputField name="phone_number" form={form} label="Số điện thoại:" />
                    <InputField name="email" form={form} label="Email:" />
                    <InputField name="description" form={form} label="Mô tả:" />
                    <InputField name="opening_hours" form={form} label="Giờ mở cửa:" />

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

export default FormRestaurant;