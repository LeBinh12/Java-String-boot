import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import restaurantApi from "../../../Api/retaurantApi";
import tableApi from "../../../Api/tableApi";
import InputField from "../../Form/InputField";

function FormOrder({ data, onAddOrder, onEditOrder, onClose, mode }) {
    const [restaurantList, setRestaurantList] = useState([]);
    const [tableList, setTableList] = useState([]);

    console.log("Data received in FormOrder:", data);

    useEffect(() => {
        (async () => {
            try {
                const restaurants = await restaurantApi.getAllRestaurants();
                setRestaurantList(restaurants);
                console.log("Restaurant list:", restaurants);
            } catch (error) {
                console.log("Error fetching data:", error);
            }
        })();
    }, []);

    const statusOptions = [
        { value: "Pending", label: "Chờ xử lý" },
        { value: "Confirmed", label: "Đã xác nhận" },
        { value: "Completed", label: "Hoàn thành" },
        { value: "Cancelled", label: "Đã hủy" },
    ];

    const schema = yup.object().shape({
        restaurantId: yup.string().required("Vui lòng chọn nhà hàng"),
        tableId: yup.string().required("Vui lòng chọn bàn"),
        totalAmount: yup.number().positive().required("Vui lòng nhập tổng tiền"),
        status: yup
            .string()
            .oneOf(["Pending", "Confirmed", "Completed", "Cancelled"], "Trạng thái không hợp lệ")
            .required("Vui lòng chọn trạng thái"),
        reservation_time: yup.date().required("Vui lòng chọn thời gian đặt chỗ"),
        number_of_guests: yup.number().positive().required("Vui lòng nhập số lượng khách"),
    });

    const form = useForm({
        defaultValues: {
            restaurantId: data?.restaurant?.restaurantId || "", // Sửa restaurant_id thành restaurantId
            tableId: data?.table?.table_id || "",
            totalAmount: data?.totalAmount || "",
            status: data?.status || "Pending",
            reservation_time: data?.reservation_time
                ? new Date(data.reservation_time).toISOString().slice(0, 16)
                : "",
            number_of_guests: data?.number_of_guests || "",
        },
        resolver: yupResolver(schema),
    });

    const selectedRestaurantId = form.watch("restaurantId") || data?.restaurant?.restaurantId;

    useEffect(() => {
        if (selectedRestaurantId) {
            (async () => {
                try {
                    const response = await tableApi.getTablesByRestaurant(selectedRestaurantId);
                    setTableList(response.data);
                    console.log("Table list for restaurant", selectedRestaurantId, ":", response.data);
                } catch (error) {
                    console.error("Lỗi khi lấy bàn theo nhà hàng:", error);
                }
            })();
        } else {
            setTableList([]);
        }
    }, [selectedRestaurantId]);

    const handleSubmit = (values) => {
        const formattedData = {
            ...values,
            orderId: mode === "edit" ? data.orderId : undefined,
            restaurant: { restaurant_id: values.restaurantId },
            table: { table_id: values.tableId },
            reservation_time: new Date(values.reservation_time).toISOString(),
            number_of_guests: values.number_of_guests,
        };

        console.log("Formatted data sent:", formattedData);

        if (mode === "edit") {
            onEditOrder(formattedData);
        } else {
            onAddOrder(formattedData);
        }
        form.reset();
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
                    <h2 className="text-xl font-semibold text-gray-900">
                        {mode === "edit" ? "Cập nhật đơn hàng" : "Thêm đơn hàng"}
                    </h2>
                    <button onClick={onClose}>
                        <X className="text-gray-900 hover:text-red-500" size={24} />
                    </button>
                </div>

                <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Nhà hàng:</label>
                        <select
                            {...form.register("restaurantId")}
                            className="w-full p-2 text-gray-700 border rounded focus:ring focus:ring-blue-300"
                        >
                            <option value="">-- Chọn nhà hàng --</option>
                            {restaurantList.map((restaurant) => (
                                <option key={restaurant.restaurant_id} value={restaurant.restaurant_id}>
                                    {restaurant.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.restaurantId?.message}</p>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Bàn:</label>
                        <select
                            {...form.register("tableId")}
                            className="w-full p-2 text-gray-700 border rounded focus:ring focus:ring-blue-300"
                        >
                            <option value="">-- Chọn bàn --</option>
                            {tableList.map((table) => (
                                <option key={table.table_id} value={table.table_id}>
                                    Bàn {table.table_number}
                                </option>
                            ))}
                        </select>
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.tableId?.message}</p>
                    </div>

                    <InputField name="totalAmount" form={form} label="Tổng tiền:" type="number" />
                    <InputField
                        name="reservation_time"
                        form={form}
                        label="Thời gian đặt chỗ:"
                        type="datetime-local"
                    />
                    <InputField name="number_of_guests" form={form} label="Số lượng khách:" type="number" />

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Trạng thái:</label>
                        <select
                            {...form.register("status")}
                            className="w-full p-2 text-gray-700 border rounded focus:ring focus:ring-blue-300"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.status?.message}</p>
                    </div>

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

FormOrder.propTypes = {
    data: PropTypes.object,
    onAddOrder: PropTypes.func,
    onEditOrder: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    mode: PropTypes.string.isRequired,
};

export default FormOrder;