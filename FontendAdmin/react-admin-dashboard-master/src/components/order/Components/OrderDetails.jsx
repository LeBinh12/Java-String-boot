import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import { motion } from "framer-motion";
import orderApi from '../../../Api/orderApi';

function OrderDetails({ orderId, onClose }) {
    const [orderDetails, setOrderDetails] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [paymentDetails, setPaymentDetails] = useState(null);
    useEffect(() => {
        (async () => {
            try {
                const [orderResponse, itemsResponse, paymentResponse] = await Promise.all([
                    orderApi.getOrderById(orderId),
                    orderApi.getOrderItemById(orderId),
                    orderApi.getStatusPay(orderId)
                ]);
                console.log("Chi tiết hóa đơn:", orderResponse);
                setOrderDetails(orderResponse);
                setOrderItems(itemsResponse);
                setPaymentDetails(paymentResponse);
            } catch (error) {
                console.log('Error fetching order details:', error);
            }
        })();
    }, [orderId]);

    const calculatePaidAmount = () => {
        if (!paymentDetails || paymentDetails.length === 0) return 0;
        return paymentDetails
            .filter((transaction) => transaction.transactionStatus === "Completed")
            .reduce((total, transaction) => total + Number(transaction.amount), 0);
    };

    const paidAmount = calculatePaidAmount();

    if (!orderDetails) {
        return <div>Loading...</div>;
    }
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl  font-semibold text-gray-900">Chi tiết đơn hàng #{orderDetails.orderId}</h2>
                    <button onClick={onClose}>
                        <X className="text-gray-900 hover:text-red-500" size={24} />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className='text-gray-700'><strong>Khách hàng:</strong> {orderDetails.user.username}</p>
                        <p className='text-gray-700'><strong>Số điện thoại liên hệ:</strong> {orderDetails.user.phoneNumber}</p>
                        <p className='text-gray-700'><strong>Nhà hàng:</strong> {orderDetails.restaurant.name}</p>
                        <p className='text-gray-700'><strong>Bàn:</strong> {orderDetails.table.table_number}</p>
                        <p className='text-gray-700'><strong>Sức chứa:</strong> {orderDetails.table.capacity} người</p>
                    </div>
                    <div>
                        <p className='text-gray-700'><strong>Tổng tiền:</strong> {orderDetails.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                        <p className='text-gray-700'><strong>Số tiền đã thanh toán:</strong> {paidAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>                        <p className='text-gray-700'><strong>Trạng thái:</strong> {orderDetails.status}</p>
                        <p className='text-gray-700'><strong>Thời gian đặt:</strong> {new Date(orderDetails.reservation_time).toLocaleString()}</p>
                        <p className='text-gray-700'><strong>Số lượng khách:</strong> {orderDetails.number_of_guest} người</p>
                    </div>
                </div>

                <h3 className="text-lg text-gray-700 font-semibold mb-2">Danh sách món ăn</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Món ăn</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orderItems.map((item) => (
                                <tr key={item.orderItemId}>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.dish.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.priceAtTime} VNĐ</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.quantity * item.priceAtTime} VNĐ</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}

OrderDetails.propTypes = {
    orderId: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default OrderDetails;