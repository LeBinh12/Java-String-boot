import React from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from '../../Form/InputField';
import { X } from 'lucide-react';
import { motion } from "framer-motion";

FormDishCategory.propTypes = {

};

function FormDishCategory({ setIsModalOpen, data, onAddStaff, onEditStaff, onClose, mode }) {



    const schema = yup.object().shape({
        name: yup.string().required('Vui lòng nhập tên nhân viên'),
    });

    const form = useForm({
        defaultValues: {
            name: data?.name || '',
        },
        resolver: yupResolver(schema),
    })

    const handleSubmit = (values) => {
        if (mode === "edit" && onEditStaff) {
            onEditStaff({ ...values, categoryId: data.categoryId });  // Gửi dữ liệu cập nhật
        } else if (mode === "add" && onAddStaff) {
            onAddStaff(values);
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
                    <h2 className="text-xl font-semibold text-gray-900">Thêm loại món ăn</h2>
                    <button onClick={onClose}>
                        <X className="text-gray-900 hover:text-red-500" size={24} />
                    </button>
                </div>

                <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-2 gap-4">
                    <InputField name="name" form={form} label="Nhập tên loại món ăn" />

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

export default FormDishCategory;