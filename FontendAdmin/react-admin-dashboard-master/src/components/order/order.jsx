import { motion } from "framer-motion";
import { Edit, Search, Trash2, Eye, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import orderApi from "../../Api/orderApi";
import FormOrder from "./Components/FormOrder";
import OrderDetails from "./Components/OrderDetails";
import Notification from "../Notification/Notification";


const Order = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [paymentStatuses, setPaymentStatuses] = useState({});
	const [ordersList, setOrdersList] = useState([]);
	const [modalState, setModalState] = useState({ isOpen: false, mode: "", data: null });
	const [detailsModal, setDetailsModal] = useState({ isOpen: false, orderId: null });
	const [openDelete, setOpenDelete] = useState(false);
	const [dataDelete, setDataDelete] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [totalPages, setTotalPages] = useState(1);
	const pageSize = 5;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await orderApi.getOrder(searchTerm, currentPage, pageSize);
				const orders = response.content;
				setOrdersList(response.content);
				setTotalPages(response.totalPages);

				// Fetch payment status for each order
				const paymentPromises = orders.map((order) =>
					orderApi
						.getStatusPay(order.orderId)
						.then((paymentResponse) => ({
							orderId: order.orderId,
							transactions: paymentResponse,
						}))
						.catch((error) => {
							console.error(`Error fetching payment for order ${order.orderId}:`, error);
							return { orderId: order.orderId, transactions: [] };
						})
				);
				const paymentResults = await Promise.all(paymentPromises);

				// Summarize payment status based on transaction_status
				const paymentStatusMap = paymentResults.reduce((acc, { orderId, transactions }) => {
					let status = "Chưa thanh toán";
					if (transactions.length > 0) {
						const hasCompleted = transactions.some((t) => t.transactionStatus === "Completed");
						const hasPending = transactions.some((t) => t.transactionStatus === "Pending");
						const hasRefunded = transactions.some((t) => t.transactionStatus === "Refunded");
						status = hasCompleted
							? "Đã thanh toán"
							: hasPending
								? "Đang xử lý"
								: hasRefunded
									? "Đã hoàn tiền"
									: "Thanh toán thất bại";
					}
					return { ...acc, [orderId]: status };
				}, {});
				setPaymentStatuses(paymentStatusMap);
			} catch (error) {
				console.log("Error fetching orders:", error);
			}
		};
		fetchData();
	}, [currentPage, searchTerm]);

	const handleSearch = (e) => {
		setSearchTerm(e.target.value.toLowerCase());
		setCurrentPage(0);
	};

	const handleUpdateStatus = async (orderId, newStatus) => {
		try {
			await orderApi.ChangeStatus(orderId);
			const updatedList = await orderApi.getOrder(searchTerm, currentPage, pageSize);
			setOrdersList(updatedList.content);
			Notification.showMessage("Cập nhật trạng thái thành công", "success");
		} catch (error) {
			console.log("Error updating status:", error);
			Notification.showMessage("Lỗi khi cập nhật trạng thái", "error");
		}
	};

	const handleEditOrder = async (values) => {
		try {
			// Gửi yêu cầu cập nhật tới API
			await orderApi.update(values.orderId, {
				restaurant: { restaurant_id: values.restaurantId },
				table: { table_id: values.tableId },
				totalAmount: values.totalAmount,
				status: values.status,
				reservation_time: values.reservation_time,
				number_of_guests: values.number_of_guest, // Đổi tên để khớp với backend
				updatedAt: new Date().toISOString(), // Thêm updatedAt
			});

			// Lấy lại danh sách đơn hàng sau khi cập nhật
			const updatedList = await orderApi.getOrder(searchTerm, currentPage, pageSize);
			setOrdersList(updatedList.content);
			Notification.showMessage("Cập nhật đơn hàng thành công", "success");
		} catch (error) {
			console.log("Error:", error);
			const errorMessage = error.response?.data?.message || "Lỗi khi cập nhật đơn hàng";
			Notification.showMessage(errorMessage, "error");
		}
	};

	const handleAddOrder = async (values) => {
		try {
			const updatedList = await orderApi.getOrder(searchTerm, currentPage, pageSize);
			setOrdersList(updatedList.content);
			Notification.showMessage("Thêm đơn hàng thành công", "success");
		} catch (error) {
			console.log("Error:", error);
			Notification.showMessage("Lỗi khi thêm đơn hàng", "error");
		}
	};

	const handleDelete = (orderId) => {
		setDataDelete(orderId);
		setOpenDelete(true);
	};

	const handleDeleteData = async () => {
		try {
			await orderApi.delete(dataDelete);
			const updatedList = await orderApi.getOrder(searchTerm, currentPage, pageSize);
			setOrdersList(updatedList.content);
			Notification.showMessage("Xóa đơn hàng thành công", "success");
		} catch (error) {
			console.log("Error:", error);
			Notification.showMessage("Lỗi khi xóa đơn hàng", "error");
		}
		setOpenDelete(false);
	};

	const handleViewDetails = (orderId) => {
		setDetailsModal({ isOpen: true, orderId });
	};


	const translateStatus = (status) => {
		switch (status) {
			case 'Pending':
				return 'Chờ xác nhận';
			case 'Confirmed':
				return 'Đã xác nhận';
			case 'Completed':
				return 'Hoàn thành';
			case 'Cancelled':
				return 'Đã hủy';
			default:
				return status;
		}
	};

	console.log(paymentStatuses);

	const getPaymentStatusColor = (status) => {
		switch (status) {
			case "Đã thanh toán":
				return "bg-green-100 text-green-800";
			case "Đang xử lý":
				return "bg-yellow-100 text-yellow-800";
			case "Thanh toán thất bại":
				return "bg-red-100 text-red-800";
			case "Chưa thanh toán":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<>
			<motion.div
				className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				<div className='flex justify-between items-center mb-6'>
					<h2 className='text-xl font-semibold text-gray-100'>Danh sách đơn hàng</h2>
					<div className='flex gap-4'>
						<div className='relative'>
							<input
								type='text'
								placeholder='Tìm kiếm đơn hàng...'
								className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
								onChange={handleSearch}
								value={searchTerm}
							/>
							<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
						</div>
						<button
							onClick={() => setModalState({ isOpen: true, mode: "add" })}
							className='bg-blue-600 hover:bg-blue-500 text

-white font-semibold py-2 px-4 rounded-lg transition duration-200'
						>
							Thêm đơn hàng
						</button>
					</div>
				</div>

				<div className='overflow-x-auto'>
					<table className='min-w-full divide-y divide-gray-700'>
						<thead>
							<tr>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Mã hóa đơn
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Tên khách hàng
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Nhà hàng
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Bàn
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Tổng tiền
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Trạng thái
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Trạng thái thanh toán
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Chức năng
								</th>
							</tr>
						</thead>

						<tbody className='divide-y divide-gray-700'>
							{ordersList.map((order) => (
								<motion.tr
									key={order.orderId}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.3 }}
								>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
										{order.orderId}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
										{order.user.username}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
										{order.restaurant.name}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
										{order.table.table_number}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
										{order.totalAmount}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm">
										<span
											className={`px-3 py-1 rounded-full font-semibold
												${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
												${order.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' : ''}
												${order.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}
												${order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}`}>
											{translateStatus(order.status)}
										</span>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
										<span
											className={`px-3 py-1 rounded-full font-semibold ${paymentStatuses[order.orderId]
												? getPaymentStatusColor(paymentStatuses[order.orderId])
												: "bg-gray-100 text-gray-800"
												}`}
										>
											{paymentStatuses[order.orderId] || "Đang tải..."}
										</span>
									</td>

									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300 flex gap-2'>
										<button
											onClick={() => handleUpdateStatus(order.orderId)}
											className='text-green-400 hover:text-green-300'
											title="Cập nhật trạng thái"
										>
											<CheckCircle size={18} />
										</button>
										<button
											onClick={() => handleViewDetails(order.orderId)}
											className='text-blue-400 hover:text-blue-300'
											title="Xem chi tiết"
										>
											<Eye size={18} />
										</button>
										<button
											onClick={() => setModalState({ isOpen: true, mode: "edit", data: order })}
											className='text-indigo-400 hover:text-indigo-300'
											title="Sửa đơn hàng"
										>
											<Edit size={18} />
										</button>
										<button
											onClick={() => handleDelete(order.orderId)}
											className='text-red-400 hover:text-red-300'
											title="Xóa đơn hàng"
										>
											<Trash2 size={18} />
										</button>
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
					<div className="flex justify-center mt-4 space-x-2">
						<button
							onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
							disabled={currentPage === 0}
							className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
						>
							⬅️ Trước
						</button>

						{[...Array(totalPages).keys()].map((page) => (
							<button
								key={page}
								onClick={() => setCurrentPage(page)}
								className={`px-3 py-1 rounded ${page === currentPage ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"}`}
							>
								{page + 1}
							</button>
						))}

						<button
							onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
							disabled={currentPage === totalPages - 1}
							className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
						>
							Sau ➡️
						</button>
					</div>
				</div>
			</motion.div>

			{modalState.isOpen && (
				<FormOrder
					mode={modalState.mode}
					data={modalState.data}
					onClose={() => setModalState({ isOpen: false, mode: "" })}
					onAddOrder={handleAddOrder}
					onEditOrder={handleEditOrder}
				/>
			)}

			{detailsModal.isOpen && (
				<OrderDetails
					orderId={detailsModal.orderId}
					onClose={() => setDetailsModal({ isOpen: false, orderId: null })}
				/>
			)}

			<Dialog
				open={openDelete}
				onClose={() => setOpenDelete(false)}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">Xác nhận xóa</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Bạn có chắc muốn xóa đơn hàng này không?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenDelete(false)}>Hủy</Button>
					<Button onClick={handleDeleteData} autoFocus>Xóa</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default Order;