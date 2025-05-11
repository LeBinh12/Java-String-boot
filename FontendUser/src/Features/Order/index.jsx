import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaClock, FaStar, FaUtensils } from 'react-icons/fa';
import { useRecoilValue } from 'recoil';
import { toast } from 'react-toastify';
import OrderApi from '../../api/OrderApi';
import OrderItemApi from '../../api/OrderItem';
import { userState } from '../../recoil/atom';
import OrderHistoryApi from '../../api/OrderHistory';

function OrderFeatures() {
    const user = useRecoilValue(userState); // Lấy user từ Recoil
    const [order, setOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [trangThaiDonHang, setTrangThaiDonHang] = useState(''); // Trạng thái đơn hàng
    const [thoiGianUocTinh, setThoiGianUocTinh] = useState(''); // Thời gian ước tính
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSavedToHistory, setIsSavedToHistory] = useState(false);
    const [showRatingForm, setShowRatingForm] = useState(false);
    const [rating, setRating] = useState(0);
    // Ánh xạ trạng thái từ tiếng Anh sang tiếng Việt
    const statusMap = {
        Pending: 'Đang xử lý',
        Confirmed: 'Đã xác nhận',
        Completed: 'Hoàn thành',
        Cancelled: 'Đã hủy'
    };

    // Tính thời gian ước tính dựa trên trạng thái
    const getEstimatedTime = (status) => {
        switch (status) {
            case 'Pending':
                return '15 phút';
            case 'Confirmed':
                return '10 phút';
            case 'Completed':
                return '0 phút';
            case 'Cancelled':
                return 'Không áp dụng';
            default:
                return 'Không xác định';
        }
    };

    useEffect(() => {
        const fetchOrderData = async () => {
            if (!user?.userId) {
                setError('Vui lòng đăng nhập để xem đơn hàng.');
                setLoading(false);
                return;
            }

            try {
                console.log('UserId', user.userId);
                const response = await OrderApi.getOrderByUserId(user.userId);
                console.log('Order', response);

                if (response.length === 0) {
                    setError('Bạn chưa có đơn hàng nào.');
                    setLoading(false);
                    return;
                }

                // Lấy đơn hàng có orderId lớn nhất
                const maxOrderId = Math.max(...response.map((o) => o.orderId));
                console.log('Max OrderId:', maxOrderId);
                const responseOrder = await OrderApi.getOrderId(maxOrderId);
                setOrder(responseOrder);

                // Cập nhật trạng thái và thời gian ước tính
                const status = responseOrder.status || 'Pending';
                setTrangThaiDonHang(statusMap[status] || 'Không xác định');
                setThoiGianUocTinh(getEstimatedTime(status));

                // Lấy danh sách món ăn trong đơn hàng
                const orderItemsRes = await OrderItemApi.getOrderById(maxOrderId);
                setOrderItems(orderItemsRes);
            } catch (error) {
                console.error('Error fetching order:', error);
                setError('Không thể lấy thông tin đơn hàng.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderData();
    }, [user?.userId]);

    if (loading) return <div className="text-center py-8">Đang tải...</div>;
    if (error) return (
        <div className="text-center py-8 text-red-500">
            {error}
            <div className="mt-4">
                <Link to="/" className="text-blue-600 hover:underline">
                    Quay lại trang chủ
                </Link>
            </div>
        </div>
    );

    // Tính tổng tiền từ orderItems
    const totalAmount = orderItems.reduce(
        (total, item) => total + Number(item.priceAtTime) * item.quantity,
        0
    );

    // Tính phần trăm tiến trình dựa trên trạng thái
    const progressPercentage = () => {
        switch (order?.status) {
            case 'Pending':
                return '33%';
            case 'Confirmed':
                return '66%';
            case 'Completed':
                return '100%';
            case 'Cancelled':
                return '0%';
            default:
                return '0%';
        }
    };


    // Hàm lưu đơn hàng vào lịch sử
    const handleSaveToHistory = async () => {
        if (!order || !orderItems.length) {
            toast.error('Không có dữ liệu để lưu vào lịch sử.');
            return;
        }

        try {
            const savePromises = orderItems.map((item) =>
                OrderHistoryApi.add({
                    userId: user.userId,
                    orderId: order.orderId,
                    dishId: item.dish.dishId,
                    quantity: item.quantity,
                    orderTime: new Date().toISOString()
                })
            );

            await Promise.all(savePromises);
            setIsSavedToHistory(true);
            setShowRatingForm(true);
            toast.success('Đã lưu đơn hàng vào lịch sử thành công!');
        } catch (error) {
            console.error('Lỗi khi lưu vào lịch sử:', error);
            toast.error('Không thể lưu đơn hàng vào lịch sử.');
        }
    };

    const handleSubmitRating = async () => {
        if (rating === 0) {
            toast.error('Vui lòng chọn số sao để đánh giá!');
            return;
        }

        try {
            console.log("Đánh giá", rating);
            await OrderApi.rate(order.orderId, rating);
            toast.success('Đánh giá nhà hàng thành công!');
            setShowRatingForm(false); // Ẩn form sau khi gửi thành công
        } catch (error) {
            console.error('Lỗi khi gửi đánh giá:', error);
            toast.error('Không thể gửi đánh giá.');
        }
    }

    return (
        <div className="pt-[150px]">
            <div className="flex items-center text-gray-600 dark:text-gray-300 text-semibold mb-4 ml-10">
                <Link to="/" className="hover:text-blue-500 transition duration-200">
                    Trang chủ
                </Link>
                <span className="mx-2 text-gray-400">/</span>
                <Link to="/cart" className="hover:text-blue-500 transition duration-200">
                    Giỏ hàng
                </Link>
                <span className="mx-2 text-gray-400">/</span>
                <span>Trạng thái đơn hàng</span>
            </div>

            <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
                <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                        Trạng thái đơn hàng
                    </h2>

                    <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
                        <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
                            <div className="space-y-6">
                                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                            <FaUtensils className="mr-2 text-blue-500" /> Trạng thái: {trangThaiDonHang}
                                        </p>
                                        <p className="text-lg font-medium text-gray-600 dark:text-gray-400 flex items-center">
                                            <FaClock className="mr-2 text-blue-500" /> Thời gian ước tính: {thoiGianUocTinh}
                                        </p>
                                    </div>

                                    <div className="relative pt-1">
                                        <div className="flex mb-2 items-center justify-between">
                                            <div>
                                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-100">
                                                    {trangThaiDonHang}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                                            <div
                                                style={{ width: progressPercentage() }}
                                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Chi tiết đơn hàng</h3>
                                        <div className="mt-4 space-y-4">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Nhà hàng:</span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {order?.restaurant?.name || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Bàn:</span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {order?.table?.tableNumber || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Thời gian đặt:</span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {order?.createdAt
                                                        ? new Date(order.createdAt).toLocaleString('vi-VN')
                                                        : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Thời gian đặt bàn:</span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {order?.reservationTime
                                                        ? new Date(order.reservationTime).toLocaleString('vi-VN')
                                                        : 'N/A'}
                                                </span>
                                            </div>

                                            <div className="mt-4">
                                                <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                                                    Món ăn đã đặt:
                                                </h4>
                                                <div className="mt-2 space-y-3">
                                                    {orderItems.length > 0 ? (
                                                        orderItems.map((item) => (
                                                            <div
                                                                key={item.orderItemId}
                                                                className="flex justify-between items-center border-b border-gray-200 py-2"
                                                            >
                                                                <div className="flex-1">
                                                                    <span className="text-gray-900 dark:text-white">
                                                                        {item.dish?.name || 'N/A'}
                                                                    </span>
                                                                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                                                                        x{item.quantity}
                                                                    </span>
                                                                </div>
                                                                <span className="font-medium text-gray-900 dark:text-white">
                                                                    {(Number(item.priceAtTime) * item.quantity).toLocaleString('vi-VN', {
                                                                        style: 'currency',
                                                                        currency: 'VND',
                                                                    })}
                                                                </span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-gray-600 dark:text-gray-400">
                                                            Không có món ăn nào trong đơn hàng này.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex justify-between pt-4 border-t border-gray-200">
                                                <span className="text-gray-600 dark:text-gray-400">Tổng tiền:</span>
                                                <span className="font-medium text-blue-600 dark:text-blue-400">
                                                    {totalAmount.toLocaleString('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
                            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800 transition-transform transform hover:scale-105">
                                <p className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                                    <FaCheckCircle className="mr-2 text-blue-500" /> Hành động
                                </p>
                                <div className="flex flex-col space-y-4">
                                    {order?.status === 'Completed' && !isSavedToHistory && (
                                        <button
                                            onClick={handleSaveToHistory}
                                            className="flex w-full items-center justify-center rounded-lg bg-green-600 px-5 py-3 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-700 transition-all duration-200"
                                            aria-label="Xác nhận hoàn thành"
                                        >
                                            Xác nhận hoàn thành
                                        </button>
                                    )}
                                    {order?.status === 'Completed' && isSavedToHistory && (
                                        <button
                                            disabled
                                            className="flex w-full items-center justify-center rounded-lg bg-gray-400 px-5 py-3 text-sm font-medium text-white cursor-not-allowed"
                                            aria-label="Đã lưu vào lịch sử"
                                        >
                                            Đã lưu vào lịch sử
                                        </button>
                                    )}

                                    {order?.status === 'Completed' && showRatingForm && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Đánh giá nhà hàng
                                            </h3>
                                            <div className="flex space-x-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <FaStar
                                                        key={star}
                                                        className={`cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                        size={24}
                                                        onClick={() => setRating(star)}
                                                    />
                                                ))}
                                            </div>
                                            <button
                                                onClick={handleSubmitRating}
                                                className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700 transition-all duration-200"
                                                aria-label="Gửi đánh giá"
                                            >
                                                Gửi đánh giá
                                            </button>
                                        </div>
                                    )}
                                    <Link
                                        to="/"
                                        className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700 transition-all duration-200"
                                        aria-label="Quay lại trang chủ"
                                    >
                                        Quay lại trang chủ
                                    </Link>
                                    <Link
                                        to="/cart"
                                        className="flex w-full items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700 transition-all duration-200"
                                        aria-label="Xem giỏ hàng"
                                    >
                                        Xem giỏ hàng
                                    </Link>
                                    <Link
                                        to="/order-history"
                                        className="flex w-full items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700 transition-all duration-200"
                                        aria-label="Xem lịch sử đơn hàng"
                                    >
                                        Xem lịch sử đơn hàng
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default OrderFeatures;