import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Notification from "../Notification/Notification";
import restaurantApi from "../../Api/retaurantApi";
import FormRestaurant from "./Components/FormTable";
import tableApi from "../../Api/tableApi";
import FormTable from "./Components/FormTable";

const PRODUCT_DATA = [
	{ id: 1, name: "Wireless Earbuds", restaurent: "Electronics", price: 59.99, stock: 143, sales: 1200 },
	{ id: 2, name: "Leather Wallet", restaurent: "Accessories", price: 39.99, stock: 89, sales: 800 },
	{ id: 3, name: "Smart Watch", restaurent: "Electronics", price: 199.99, stock: 56, sales: 650 },
	{ id: 4, name: "Yoga Mat", restaurent: "Fitness", price: 29.99, stock: 210, sales: 950 },
	{ id: 5, name: "Coffee Maker", restaurent: "Home", price: 79.99, stock: 78, sales: 720 },
];

const RestaurentsTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredProducts, setFilteredProducts] = useState(PRODUCT_DATA);
	const [tablesList, setTablesList] = useState([]);
	const [modalState, setModalState] = useState({ isOpen: false, mode: "" });
	const [openDelete, setOpenDelete] = useState(false);
	const [dataDelete, setDataDelete] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [totalPages, setTotalPages] = useState(1);
	const pageSize = 5;

	useEffect(() => {
		(async () => {
			try {
				const data = await tableApi.getTables();
				console.log("Data Table:", data);
				setTotalPages(data.totalPages)
				setTablesList(data.data);
			} catch (error) {
				console.log('Error', error);
			}
		})()
	}, [])

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await tableApi.getTables("", currentPage, pageSize);
				console.log("Data:", response.data);
				setTablesList(response.data);
				setTotalPages(response.totalPages); // Lưu tổng số trang
			} catch (error) {
				console.log("Error fetching Restaurant list:", error);
			}
		};

		fetchData();
	}, [currentPage]);

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = PRODUCT_DATA.filter(
			(product) => product.name.toLowerCase().includes(term) || product.restaurent.toLowerCase().includes(term)
		);

		setFilteredProducts(filtered);
	};



	const handleAddTable = async (values) => {


		const formattedData = {
			table_number: values.table_number,
			capacity: values.capacity,
			status: values.status,
			restaurant: { restaurant_id: values.restaurantId },
		};
		console.log("Data add Tables: ", formattedData);
		try {
			await tableApi.add(formattedData);
			const updatedList = await tableApi.getTables();
			setTablesList(updatedList.data);
			Notification.showMessage("Cập nhật dữ liệu thành công", "success")
		} catch (error) {
			console.log("Error:", error);
		}
	}

	const handleEditTable = async (values) => {
		const formattedData = {
			table_number: values.table_number,
			capacity: values.capacity,
			status: values.status,
			restaurant: { restaurant_id: values.restaurantId },
		};
		try {
			await tableApi.update(formattedData, values.table_id);
			const updatedList = await tableApi.getTables();
			setTablesList(updatedList.data);
			Notification.showMessage("Cập nhật dữ liệu thành công", "success")
		} catch (error) {
			console.log("Error:", error);
		}
	}

	const handleOpenEditRestaurant = (restaurent) => {
		setModalState({ isOpen: true, mode: "edit", data: restaurent });
	}


	const handldeDelete = (values) => {
		console.log("ID delete:", values);
		setDataDelete(values);
		setOpenDelete(true);
	}

	const handldeDeleteData = async () => {
		try {
			await tableApi.delete(dataDelete);
			const updatedList = await tableApi.getTables();
			setTablesList(updatedList.data);
			Notification.showMessage("Xóa dữ liệu thành công", "success")
		} catch (error) {
			console.log("Error:", error);
		}
		setOpenDelete(false);
	}


	return (
		<>
			<motion.div
				className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				<div className='flex justify-between items-center mb-6'>
					<h2 className='text-xl font-semibold text-gray-100'>Danh nhà hàng</h2>
					<div className='flex gap-4'>

						<div className='relative'>
							<input
								type='text'
								placeholder='Search products...'
								className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
								onChange={handleSearch}
								value={searchTerm}
							/>
							<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
						</div>
						<button
							onClick={() => setModalState({ isOpen: true, mode: "add" })}
							className='bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-200'
						>
							Thêm nhà hàng
						</button>
					</div>
				</div>

				<div className='overflow-x-auto'>
					<table className='min-w-full divide-y divide-gray-700'>
						<thead>
							<tr>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Mã bàn
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Bàn thuộc số
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Sức chứa
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									trạng thái
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Nhà hàng
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Chức năng
								</th>
							</tr>
						</thead>

						<tbody className='divide-y divide-gray-700'>
							{tablesList.map((table) => (
								<motion.tr
									key={table.tableId}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.3 }}
								>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center'>
										{table.tableId}
									</td>

									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
										{table.table_number}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
										{table.capacity}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
										{table.status}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
										{table.restaurant.name}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
										<button
											onClick={() => handleOpenEditRestaurant(table)}
											className='text-indigo-400 hover:text-indigo-300 mr-2'>
											<Edit size={18} />
										</button>
										<button
											onClick={() => handldeDelete(table.tableId)}
											className='text-red-400 hover:text-red-300'>
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
				<FormTable
					mode={modalState.mode}
					data={modalState.data}
					onClose={() => setModalState({ isOpen: false, mode: "" })}
					onAddTable={handleAddTable}
					onEditTable={handleEditTable}
				/>
			)}

			<Dialog
				open={openDelete}
				onClose={handldeDelete}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					{"Use Google's location service?"}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Bạn có muốn xóa dữ liệu này không
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenDelete(false)}>Hủy</Button>
					<Button onClick={handldeDeleteData} autoFocus>
						Xóa
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
export default RestaurentsTable;
