import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { ListCart, orderIdState, userState } from '../../recoil/atom';
import { Link } from 'react-router-dom';
import RestaurantApi from '../../../RestaurantApi';
import TableApi from '../../api/TableApi';
import Notification from '../../components/Notification/NotificationProvider';
import { FaArrowRight, FaGift, FaShoppingCart, FaUtensils } from 'react-icons/fa';
import PayApi from '../../api/PayApi';
import OrderApi from '../../api/OrderApi';
import OrderItemApi from '../../api/OrderItem';

CartFeatures.propTypes = {};

function CartFeatures(props) {
    const selectUser = useRecoilValue(userState);

    const [loading, setLoading] = useState(false);
    const [itemCart, setItemCart] = useRecoilState(ListCart);
    const [listRestaurant, setListRestaurant] = useState([]);
    const [byRestaurantId, setByRestaurantId] = useState(0);
    const [listTable, setListTable] = useState([]);
    const [loadingTables, setLoadingTables] = useState(false);
    const [selectedTableId, setSelectedTableId] = useState('');
    const [selectedDateTime, setSelectedDateTime] = useState('');
    const [guestCount, setGuestCount] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [transactionCodeGUI, setTransactionCode] = useState('');
    const setOrderIdState = useSetRecoilState(orderIdState);
    const [depositPercentage, setDepositPercentage] = useState(30); // Mặc định 30%
    const [depositAmount, setDepositAmount] = useState(0); // Số tiền thanh toán trước
    const [tableCapacity, setTableCapacity] = useState(null); // Sức chứa của bàn được chọn

    const userId = 8;
    const [qrData, setQrData] = useState(null);
    const [vietQRUrl, setVietQRUrl] = useState('');
    const [transactionId, setTransactionId] = useState(null);
    const [orderId_Cart, setOrderId_Cart] = useState(0);

    // Tính tổng giá tiền và số tiền đặt cọc
    useEffect(() => {
        const total = itemCart.reduce((sum, item) => {
            return sum + item.quantity * item.price;
        }, 0);
        setTotalPrice(total);
        setDepositAmount((total * depositPercentage) / 100); // Cập nhật số tiền đặt cọc
    }, [itemCart, depositPercentage]);

    // Lấy danh sách nhà hàng
    useEffect(() => {
        (async () => {
            try {
                const data = await RestaurantApi.getAll();
                setListRestaurant(data);
            } catch (error) {
                console.log('Error', error);
            }
        })();
    }, []);

    // Lấy danh sách bàn theo nhà hàng
    useEffect(() => {
        const fetchData = async () => {
            console.log('useEffect - byRestaurantId: ', byRestaurantId);
            try {
                const response = await TableApi.getByRestaurantId(byRestaurantId);
                console.log('API Response: ', response);
                if (response.status === 200) {
                    console.log("List Table", response.data);
                    setListTable(response.data);
                } else {
                    Notification.showMessage('Lỗi chọn bàn');
                }
            } catch (error) {
                console.log('Error:', error);
            }
        };

        if (byRestaurantId) {
            fetchData();
        }
    }, [byRestaurantId]);

    // Tính ngày mai để đặt làm giá trị tối thiểu cho input datetime
    const getMinDateTime = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        // Định dạng theo yyyy-MM-ddThh:mm
        return tomorrow.toISOString().slice(0, 16);
    };

    // Xử lý khi chọn bàn
    const handleTableChange = (e) => {
        const tableId = e.target.value;
        setSelectedTableId(tableId);

        // Tìm sức chứa của bàn được chọn
        const selectedTable = listTable.find((table) => table.tableId === Number(tableId));
        console.log("Số lượng bàn", selectedTable);
        if (selectedTable) {
            setTableCapacity(selectedTable.capacity);
            // Nếu số lượng khách hiện tại vượt quá sức chứa, đặt lại về sức chứa tối đa
            if (guestCount > selectedTable.capacity) {
                setGuestCount(selectedTable.capacity);
                Notification.showMessage(`Số lượng khách không được vượt quá sức chứa của bàn (${selectedTable.capacity} người).`);
            }
        } else {
            setTableCapacity(null);
        }
    };

    // Kiểm tra ngày giờ khi người dùng thay đổi
    const handleDateTimeChange = (e) => {
        const selected = new Date(e.target.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Đặt giờ về 00:00:00 để so sánh ngày

        if (selected.toDateString() === today.toDateString()) {
            Notification.showMessage('Không thể chọn ngày hiện tại. Vui lòng chọn từ ngày mai trở đi.');
            setSelectedDateTime('');
        } else {
            setSelectedDateTime(e.target.value);
        }
    };

    // Xử lý thay đổi số lượng khách
    const handleGuestCountChange = (e) => {
        const value = Number(e.target.value);
        if (tableCapacity && value > tableCapacity) {
            Notification.showMessage(`Số lượng khách không được vượt quá sức chứa của bàn (${tableCapacity} người).`);
            setGuestCount(tableCapacity);
        } else if (value < 1) {
            Notification.showMessage('Số lượng khách phải ít nhất là 1.');
            setGuestCount(1);
        } else {
            setGuestCount(value);
        }
    };

    // Xử lý xác nhận thanh toán
    const handleConfirmPayment = async () => {
        setLoading(true);

        // Kiểm tra mã giao dịch có được nhập hay không
        if (!transactionCodeGUI) {
            Notification.showMessage('Vui lòng nhập mã giao dịch!');
            setLoading(false);
            return;
        }

        try {
            // Gọi API để kiểm tra trạng thái giao dịch và thông tin người dùng
            const transactionResponse = await PayApi.getTransactionStatus(transactionCodeGUI);

            // Kiểm tra trạng thái giao dịch
            if (transactionResponse.transactionStatus !== 'Pending') {
                Notification.showMessage('Giao dịch không ở trạng thái chờ thanh toán!');
                setLoading(false);
                return;
            }

            // Kiểm tra xem giao dịch có thuộc về người dùng hiện tại không
            if (transactionResponse.userId !== selectUser.userId) {
                Notification.showMessage('Bạn không có quyền xác nhận giao dịch này!');
                setLoading(false);
                return;
            }

            // Nếu thỏa mãn các điều kiện, tiến hành thêm các mục đơn hàng (order items)
            for (const item of itemCart) {
                const dataOrderItem = {
                    order: {
                        orderId: orderId_Cart,
                    },
                    user: {
                        userId: selectUser.userId,
                    },
                    dish: {
                        dishId: item.dishId,
                    },
                    quantity: item.quantity,
                    priceAtTime: item.price * item.quantity,
                };
                await OrderItemApi.add(dataOrderItem);
            }

            // Gọi API webhook để xác nhận thanh toán
            await PayApi.webhook({ transactionCode: transactionCodeGUI, status: 'SUCCESS' });

            // Kiểm tra trạng thái giao dịch sau khi xác nhận
            checkTransactionStatus(transactionCodeGUI);
            setLoading(false);
        } catch (error) {
            console.error('Lỗi khi xác nhận thanh toán:', error);
            Notification.showMessage('Có lỗi xảy ra khi xác nhận giao dịch!');
            setLoading(false);
        }
    };

    const handleDecrement = (dishId) => {
        setItemCart((prevItems) =>
            prevItems.map((item) =>
                item.dishId === dishId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
        console.log('Mã:', dishId);
    };

    const handleIncrement = (dishId) => {
        setItemCart((prevItems) =>
            prevItems.map((item) =>
                item.dishId === dishId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
        console.log('Mã:', dishId);
    };

    const handleRemove = (dishId) => {
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa món ăn này khỏi giỏ hàng không?');
        if (confirmDelete) {
            setItemCart((prevItems) => prevItems.filter((item) => item.dishId !== dishId));
        }
    };

    const handlePay = async () => {
        setLoading(true);
        if (!selectUser) {
            Notification.showMessage('Bạn cần đăng nhập để có thông tin!');
            setLoading(false);
            return;
        } else if (itemCart.length === 0) {
            Notification.showMessage('Bạn cần chọn món ăn để đặt bàn!');
            setLoading(false);
            return;
        } else if (byRestaurantId === 0 || selectedTableId === '' || selectedDateTime === '') {
            Notification.showMessage('Bạn cần điền đầy đủ thông tin!');
            setLoading(false);
            return;
        }

        // Kiểm tra ngày giờ đặt hàng
        const selected = new Date(selectedDateTime);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selected.toDateString() === today.toDateString()) {
            Notification.showMessage('Không thể chọn ngày hiện tại. Vui lòng chọn từ ngày mai trở đi.');
            setLoading(false);
            return;
        }

        // Kiểm tra số lượng khách
        if (tableCapacity && guestCount > tableCapacity) {
            Notification.showMessage(`Số lượng khách không được vượt quá sức chứa của bàn (${tableCapacity} người).`);
            setGuestCount(tableCapacity);
            setLoading(false);
            return;
        }

        try {
            await handleCheckout();
            setLoading(false);
        } catch (error) {
            console.log('Error', error);
            Notification.showMessage('Có lỗi xảy ra. Vui lòng thử lại!');
            setLoading(false);
        }
    };

    // Xử lý thanh toán
    const handleCheckout = async () => {

        try {

            const orderResponse = await OrderApi.add({
                user: { userId: selectUser.userId },
                restaurant: { restaurantId: byRestaurantId },
                table: { tableId: selectedTableId },
                totalAmount: totalPrice,
                status: 'Pending',
                reservation_time: selectedDateTime,
                number_of_guests: guestCount,
            });

            const orderId = orderResponse.orderId;
            setOrderIdState(orderId);
            setOrderId_Cart(orderId);
            console.log("Tổng tiền trả về server:", depositAmount);
            // Gọi API thanh toán với số tiền đặt cọc
            const paymentResponse = await PayApi.add(selectUser.userId, orderId, depositAmount);

            const transactionId = paymentResponse.transactionId;
            const qrData = paymentResponse.qrCodeUrl;

            console.log('Hình QR', transactionId);
            setTransactionId(transactionId);
            setVietQRUrl(qrData);
            setQrData(true); // Hiển thị modal mã QR
        } catch (error) {
            console.error('Lỗi khi thanh toán:', error);
            Notification.showMessage('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại!');
        }
    };

    // Kiểm tra trạng thái giao dịch
    const checkTransactionStatus = (transactionCode) => {
        const timeout = 5 * 60 * 1000; // 5 phút
        const startTime = Date.now();

        const interval = setInterval(async () => {
            try {
                if (Date.now() - startTime > timeout) {
                    Notification.showMessage('Thời gian thanh toán đã hết. Vui lòng thử lại!');
                    setQrData(false);
                    clearInterval(interval);
                    return;
                }

                const response = await PayApi.getTransactionStatus(transactionCode);
                const status = response.transactionStatus;

                if (status === 'Completed') {
                    Notification.showMessage('Thanh toán thành công!');
                    setItemCart([]); // Xóa giỏ hàng
                    setQrData(false);
                    clearInterval(interval);
                } else if (status === 'Failed') {
                    Notification.showMessage('Thanh toán thất bại. Vui lòng thử lại!');
                    setQrData(false);
                    clearInterval(interval);
                } else if (status === 'Pending') {
                    Notification.showMessage('Chưa thanh toán');
                    setQrData(false);
                    clearInterval(interval);
                }
            } catch (error) {
                console.error('Lỗi khi kiểm tra trạng thái giao dịch:', error);
                Notification.showMessage('Có lỗi xảy ra khi kiểm tra trạng thái giao dịch!');
                setQrData(false);
                clearInterval(interval);
            }
        }, 3000); // Kiểm tra mỗi 3 giây
    };

    console.log('itemCart:', itemCart);

    return (
        <div className="pt-[150px]">
            <div className="flex items-center text-gray-600 dark:text-gray-300 text-semibold mb-4 ml-10">
                <Link to="/" className="hover:text-blue-500 transition duration-200">
                    Trang chủ
                </Link>
                <span className="mx-2 text-gray-400">/</span>
                <Link to="/Category" className="hover:text-blue-500 transition duration-200">
                    Thực đơn
                </Link>
                <span className="mx-2 text-gray-400">/</span>
                <Link to="/cart" className="hover:text-blue-500 transition duration-200">
                    Giỏ hàng
                </Link>
            </div>
            <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
                <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Đặt món ăn</h2>
                    <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
                        <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
                            <div className="space-y-6">
                                {itemCart.length > 0 ? (
                                    itemCart.map((cart, index) => (
                                        <div
                                            key={cart.dishId}
                                            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6"
                                        >
                                            <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                                                <a href="#" className="shrink-0 md:order-1">
                                                    <img className="h-20 w-20 dark:hidden" src={cart.image_url} alt="imac image" />
                                                    <img
                                                        className="hidden h-20 w-20 dark:block"
                                                        src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg"
                                                        alt="imac image"
                                                    />
                                                </a>

                                                <label htmlFor="counter-input" className="sr-only">
                                                    Choose quantity:
                                                </label>
                                                <div className="flex items-center justify-between md:order-3 md:justify-end">
                                                    <div className="flex items-center">
                                                        <button
                                                            onClick={() => handleDecrement(cart.dishId)}
                                                            type="button"
                                                            id="decrement-button"
                                                            data-input-counter-decrement="counter-input"
                                                            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                                                        >
                                                            <svg
                                                                className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                                                                aria-hidden="true"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 18 2"
                                                            >
                                                                <path
                                                                    stroke="currentColor"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M1 1h16"
                                                                />
                                                            </svg>
                                                        </button>
                                                        <input
                                                            type="text"
                                                            id="counter-input"
                                                            data-input-counter
                                                            className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                                                            placeholder=""
                                                            value={cart.quantity}
                                                            required
                                                        />
                                                        <button
                                                            onClick={() => handleIncrement(cart.dishId)}
                                                            type="button"
                                                            id="increment-button"
                                                            data-input-counter-increment="counter-input"
                                                            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                                                        >
                                                            <svg
                                                                className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                                                                aria-hidden="true"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 18 18"
                                                            >
                                                                <path
                                                                    stroke="currentColor"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M9 1v16M1 9h16"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <div className="text-end md:order-4 md:w-32">
                                                        <p className="text-base font-bold text-gray-900 dark:text-white">
                                                            {(cart.price * cart.quantity).toLocaleString('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND',
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                                                    <a href="#" className="text-base font-medium text-gray-900 hover:underline dark:text-white">
                                                        {cart.name}
                                                    </a>

                                                    <div className="flex items-centre gap-4">
                                                        <button
                                                            onClick={() => handleRemove(cart.dishId)}
                                                            type="button"
                                                            className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                                                        >
                                                            <svg
                                                                className="me-1.5 h-5 w-5"
                                                                aria-hidden="true"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="24"
                                                                height="24"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    stroke="currentColor"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M6 18 17.94 6M18 18 6.06 6"
                                                                />
                                                            </svg>
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex justify-center items-center py-10">
                                        <img
                                            src="https://xmagic.vn/images/emptycart.png"
                                            alt="Bạn chưa có món ăn nào"
                                            className="w-60 md:w-80"
                                        />
                                    </div>
                                )}
                            </div>
                            {/* QR Thanh toán */}
                            <div className="hidden xl:mt-8 xl:block">
                                {vietQRUrl && (
                                    <>
                                        <h2>Thanh toán</h2>
                                        <div className="my-8">
                                            <img src={vietQRUrl} alt="Mã QR VietQR" style={{ width: 400, height: 400 }} />
                                        </div>
                                        <div className="my-4">
                                            <label htmlFor="transactionCode" className="block text-lg font-medium">
                                                Mã giao dịch (Nằm trong phần nội dung khi chuyển)
                                            </label>
                                            <input
                                                type="text"
                                                id="transactionCode"
                                                name="transactionCode"
                                                className="mt-2 p-2 border rounded"
                                                placeholder="Nhập mã giao dịch"
                                                onChange={(e) => setTransactionCode(e.target.value)}
                                            />
                                        </div>
                                        <div className="my-4">
                                            <button
                                                onClick={handleConfirmPayment}
                                                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                Xác nhận chuyển tiền
                                            </button>
                                        </div>
                                    </>
                                )}

                                {loading && (
                                    <div className="loading-overlay">
                                        <div className="loading-spinner">
                                            <span>Đang xác nhận giao dịch...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
                            {/* Card Tổng tiền */}
                            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800 transition-transform transform hover:scale-105">
                                <p className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                                    <FaShoppingCart className="mr-2 text-blue-500" /> Tổng quan đơn hàng
                                </p>
                                <div className="space-y-3">
                                    <dl className="flex items-center justify-between gap-4">
                                        <dt className="text-base font-medium text-gray-900 dark:text-white">Tổng tiền</dt>
                                        <dd className="text-base font-medium text-gray-900 dark:text-white">
                                            {totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </dd>
                                    </dl>
                                    <dl className="flex items-center justify-between gap-4">
                                        <dt className="text-base font-medium text-gray-900 dark:text-white">Tỷ lệ thanh toán trước</dt>
                                        <dd className="text-base font-medium text-gray-900 dark:text-white">{depositPercentage}%</dd>
                                    </dl>
                                    <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-3 dark:border-gray-700">
                                        <dt className="text-lg font-bold text-gray-900 dark:text-white">Số tiền thanh toán trước</dt>
                                        <dd className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                            {depositAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </dd>
                                    </dl>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="depositPercentage" className="block text-sm font-medium text-gray-900 dark:text-white">
                                        Chọn tỷ lệ thanh toán trước
                                    </label>
                                    <select
                                        id="depositPercentage"
                                        onChange={(e) => setDepositPercentage(Number(e.target.value))}
                                        value={depositPercentage}
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 transition-all duration-200"
                                    >
                                        <option value={30}>30%</option>
                                        <option value={50}>50%</option>
                                        <option value={70}>70%</option>
                                        <option value={100}>100%</option>
                                    </select>
                                </div>
                            </div>

                            {/* Card Chọn nhà hàng và bàn */}
                            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800 transition-transform transform hover:scale-105">
                                <p className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                                    <FaUtensils className="mr-2 text-blue-500" /> Chọn địa điểm
                                </p>
                                <div className="space-y-2">
                                    <label htmlFor="restaurant" className="block text-sm font-medium text-gray-900 dark:text-white">
                                        Chọn nhà hàng
                                    </label>
                                    <select
                                        id="restaurant"
                                        onChange={(e) => setByRestaurantId(e.target.value)}
                                        value={byRestaurantId || ''}
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 transition-all duration-200"
                                    >
                                        <option value="" disabled>
                                            Chọn nhà hàng
                                        </option>
                                        {listRestaurant.map((restaurant) => (
                                            <option key={restaurant.restaurant_id} value={restaurant.restaurant_id}>
                                                {restaurant.name} -
                                                <span className="block text-xs text-gray-500 dark:text-gray-400">
                                                    {restaurant.address}
                                                </span>
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="table" className="block text-sm font-medium text-gray-900 dark:text-white">
                                        Chọn bàn
                                    </label>
                                    <select
                                        id="table"
                                        onChange={handleTableChange}
                                        value={selectedTableId}
                                        disabled={!byRestaurantId || listTable.length === 0 || loadingTables}
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 transition-all duration-200"
                                    >
                                        <option value="" disabled>
                                            Chọn bàn
                                        </option>
                                        {loadingTables ? (
                                            <option disabled>Đang tải danh sách bàn...</option>
                                        ) : (
                                            listTable.map((table) => (
                                                <option key={table.tableId} value={table.tableId}>
                                                    Bàn {table.table_number} (Sức chứa: {table.capacity})
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label
                                        htmlFor="datetime"
                                        className="block text-sm md:text-base font-medium text-gray-900 dark:text-white"
                                    >
                                        Chọn ngày giờ đặt
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="datetime"
                                        value={selectedDateTime}
                                        onChange={handleDateTimeChange}
                                        min={getMinDateTime()} // Giới hạn ngày tối thiểu là ngày mai
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm md:text-base text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 transition-all duration-200"
                                    />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Vui lòng chọn ngày từ ngày mai trở đi.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <label
                                        htmlFor="guestCount"
                                        className="block text-sm md:text-base font-medium text-gray-900 dark:text-white"
                                    >
                                        Số lượng khách
                                    </label>
                                    <input
                                        type="number"
                                        id="guestCount"
                                        min={1}
                                        max={tableCapacity || undefined} // Giới hạn tối đa là sức chứa của bàn
                                        value={guestCount}
                                        onChange={handleGuestCountChange}
                                        placeholder="Nhập số người"
                                        disabled={!selectedTableId} // Vô hiệu hóa nếu chưa chọn bàn
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm md:text-base text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 transition-all duration-200"
                                    />
                                    {tableCapacity && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Sức chứa tối đa của bàn: {tableCapacity} người
                                        </p>
                                    )}
                                </div>
                            </div>


                            {/* Nút hành động */}
                            <div className="flex flex-col space-y-4">
                                <a
                                    onClick={handlePay}
                                    href="#"
                                    className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700 transition-all duration-200"
                                >
                                    Tiến hành thanh toán
                                </a>
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">hoặc</span>
                                    <Link
                                        to="/"
                                        title=""
                                        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 underline hover:no-underline dark:text-blue-400 transition-all duration-200"
                                    >
                                        Tiếp tục chọn món ăn
                                        <FaArrowRight className="h-4 w-4" />
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

export default CartFeatures;