import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from '../../Form/InputField';
import { X } from 'lucide-react';
import { motion } from "framer-motion";
import TableApi from '../../../Api/retaurantApi';
import restaurantApi from '../../../Api/retaurantApi';

FormTable.propTypes = {

};

function FormTable({ setIsModalOpen, data, onAddTable, onEditTable, onClose, mode }) {

    const [restaurantList, setTable] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const data = await restaurantApi.getAllRestaurants();
                console.log("Data Table:", data);
                setTable(data);
            } catch (error) {
                console.log('Error', error);
            }
        })()
    }, [])

    const statusOptions = [
        { value: "Available", label: "Available" },
        { value: "Occupied", label: "Occupied" },
        { value: "Reserved", label: "Reserved" },
    ];


    const schema = yup.object().shape({
        restaurantId: yup.string().required("Vui lòng chọn nhà hàng"),
        table_number: yup.number().integer().positive().required("Vui lòng nhập số bàn"),
        capacity: yup.number().integer().positive().min(1, "Sức chứa phải lớn hơn 0").required("Vui lòng nhập sức chứa"),
        status: yup.string().oneOf(["Available", "Occupied", "Reserved"], "Trạng thái không hợp lệ").required("Vui lòng chọn trạng thái bàn"),
    });

    const form = useForm({
        defaultValues: {
            restaurantId: data?.restaurantId || "",
            table_number: data?.table_number || "",
            capacity: data?.capacity || "",
            status: data?.status || "Available",
        },
        resolver: yupResolver(schema),
    });

    const handleSubmit = (values) => {
        console.log("Data add:", values);
        if (mode === "edit" && onEditTable) {
            onEditTable({ ...values, tableId: data.tableId });  // Gửi dữ liệu cập nhật
        } else if (mode === "add" && onAddTable) {
            onAddTable(values);
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
                    <h2 className="text-xl font-semibold text-gray-900">{mode === "edit" ? "Cập nhật bàn" : "Thêm bàn"}</h2>
                    <button onClick={onClose}>
                        <X className="text-gray-900 hover:text-red-500" size={24} />
                    </button>
                </div>

                <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-2 gap-4">
                    {/* Dropdown chọn nhà hàng */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Nhà hàng:</label>
                        <select
                            {...form.register("restaurantId")}
                            className="w-full p-2 border text-gray-900 rounded focus:ring focus:ring-blue-300"
                        >
                            <option value="" className='text-gray-900'>-- Chọn nhà hàng --</option>
                            {restaurantList.map((restaurant) => (
                                <option className='text-gray-900' key={restaurant.restaurant_id} value={restaurant.restaurant_id}>  {/* Lưu ID chứ không lưu tên */}
                                    {restaurant.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.restaurantId?.message}</p>
                    </div>


                    {/* Số bàn */}
                    <InputField name="table_number" form={form} label="Số bàn:" type="number" />

                    {/* Sức chứa */}
                    <InputField name="capacity" form={form} label="Sức chứa:" type="number" />

                    {/* Dropdown chọn trạng thái */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Trạng thái:</label>
                        <select
                            {...form.register("status")}
                            className="w-full p-2 text-gray-900 border rounded focus:ring focus:ring-blue-300"
                        >
                            {statusOptions.map((option) => (
                                <option className='text-gray-900' key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors?.message}</p>
                    </div>

                    {/* Nút thao tác */}
                    <div className="col-span-2 flex justify-end gap-4 mt-4">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg"
                        >
                            {mode === "edit" ? "Cập nhật" : "Thêm"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default FormTable;