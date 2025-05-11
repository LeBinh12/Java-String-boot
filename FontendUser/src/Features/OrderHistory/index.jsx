import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atom';
import OrderHistoryApi from '../../api/OrderHistory';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

OrderHistoryFeatures.propTypes = {

};

function OrderHistoryFeatures(props) {
    const user = useRecoilValue(userState);
    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user?.userId) {
                setError('Vui lòng đăng nhập để xem lịch sử đơn hàng.');
                setLoading(false);
                return;
            }

            try {
                const response = await OrderHistoryApi.getByUserId(user.userId, page, size);
                console.log("Data history: ", response);
                setHistory(response.content);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error('Lỗi khi lấy lịch sử đơn hàng:', error);
                setError('Không thể lấy lịch sử đơn hàng.');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user?.userId, page, size]);

    const handleDelete = async (historyId) => {
        try {
            await OrderHistoryApi.delete(historyId);
            setHistory(history.filter((item) => item.historyId !== historyId));
            toast.success('Đã xóa lịch sử đơn hàng thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa lịch sử:', error);
            toast.error('Không thể xóa lịch sử đơn hàng.');
        }
    };

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

    return (
        <div className="pt-[150px]">
            <div className="flex items-center text-gray-600 dark:text-gray-300 text-semibold mb-4 ml-10">
                <Link to="/" className="hover:text-blue-500 transition duration-200">
                    Trang chủ
                </Link>
                <span className="mx-2 text-gray-400">/</span>
                <span>Lịch sử đơn hàng</span>
            </div>

            <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
                <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                        Lịch sử đơn hàng
                    </h2>

                    <div className="mt-6 sm:mt-8">
                        {history.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Mã lịch sử</th>
                                            <th scope="col" className="px-6 py-3">Món ăn</th>
                                            <th scope="col" className="px-6 py-3">Số lượng</th>
                                            <th scope="col" className="px-6 py-3">Nhà hàng</th>
                                            <th scope="col" className="px-6 py-3">Bàn</th>
                                            <th scope="col" className="px-6 py-3">Tổng tiền</th>
                                            <th scope="col" className="px-6 py-3">Trạng thái</th>
                                            <th scope="col" className="px-6 py-3">Thời gian đặt</th>
                                            <th scope="col" className="px-6 py-3">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((item) => (
                                            <tr
                                                key={item.historyId}
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                            >
                                                <td className="px-6 py-4">{item.historyId}</td>
                                                <td className="px-6 py-4">{item.dishName}</td>
                                                <td className="px-6 py-4">{item.quantity}</td>
                                                <td className="px-6 py-4">{item.restaurantName}</td>
                                                <td className="px-6 py-4">{item.tableNumber || 'N/A'}</td>
                                                <td className="px-6 py-4">
                                                    {(item.dishPrice * item.quantity).toLocaleString('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    })}
                                                </td>
                                                <td className="px-6 py-4">{item.orderStatus}</td>
                                                <td className="px-6 py-4">
                                                    {new Date(item.orderTime).toLocaleString('vi-VN')}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleDelete(item.historyId)}
                                                        className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-700"
                                                        aria-label="Xóa lịch sử"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-600 dark:text-gray-400">Bạn chưa có lịch sử đơn hàng nào.</p>
                        )}

                        {history.length > 0 && (
                            <div className="mt-6 flex justify-center space-x-4">
                                <button
                                    onClick={() => setPage((p) => Math.max(p - 1, 0))}
                                    disabled={page === 0}
                                    className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700 disabled:opacity-50"
                                >
                                    Trước
                                </button>
                                <button
                                    onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                                    disabled={page === totalPages - 1}
                                    className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700 disabled:opacity-50"
                                >
                                    Sau
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default OrderHistoryFeatures;