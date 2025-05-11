import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import staffApi from "../../Api/staffApi";
import FormStaff from "./Component/FormStaff";
import { motion as MotionFramer } from "framer-motion";
import { X } from "lucide-react";
import Notification from "../Notification/Notification";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useForm } from "react-hook-form";
const userData = [
	{ id: 1, name: "John Doe", email: "john@example.com", role: "Customer", status: "Active" },
	{ id: 2, name: "Jane Smith", email: "jane@example.com", role: "Admin", status: "Active" },
	{ id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Customer", status: "Inactive" },
	{ id: 4, name: "Alice Brown", email: "alice@example.com", role: "Customer", status: "Active" },
	{ id: 5, name: "Charlie Wilson", email: "charlie@example.com", role: "Moderator", status: "Active" },
];

const StaffTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredUsers, setFilteredUsers] = useState(userData);
	const [staffList, setStaffList] = useState([]);
	const [modalState, setModalState] = useState({ isOpen: false, mode: "" });
	const [dataEdit, setDataEdit] = useState(null);
	const [openDelete, setOpenDelete] = useState(false);
	const [dataDelete, setDataDelete] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [totalPages, setTotalPages] = useState(1);
	const pageSize = 5; // Số nhân viên trên mỗi trang


	useEffect(() => {
		(async () => {
			try {
				const data = await staffApi.getStaffs();
				console.log("Data:", data.data);
				setStaffList(data.data);
				// setStaffList(data);
			} catch (error) {
				console.log('Error', error);
			}
		})()
	}, [])

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await staffApi.getStaffs(searchTerm, currentPage, pageSize);
				console.log("Data:", response.data);
				setStaffList(response.data);
				setTotalPages(response.totalPages); // Lưu tổng số trang
			} catch (error) {
				console.log("Error fetching staff list:", error);
			}
		};

		fetchData();
	}, [currentPage, searchTerm]); // Cập nhật khi trang hoặc từ khóa thay đổi


	const handleSearch = async (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			const term = searchTerm.toLowerCase();

			console.log("Search: ", term);
			try {
				const response = await staffApi.getStaffs(searchTerm); // Gửi searchTerm lên BE
				setStaffList(response.data); // Cập nhật danh sách nhân viên từ BE
				setCurrentPage(0)
			} catch (error) {
				console.log("Error fetching search results:", error);
			}
		}
	};


	const handleAddStaff = async (values) => {

		const hireDateFormatted = new Date(values.hireDate).toISOString().split('T')[0]; // "YYYY-MM-DD"


		const formattedData = {
			name: values.name,
			position: values.position,
			phoneNumber: values.phoneNumber,
			email: values.email,
			salary: Number(values.salary),
			hireDate: hireDateFormatted,
			status: values.status,
			restaurant: { restaurant_id: values.restaurant_id }
		};
		try {
			await staffApi.add(formattedData);

			const updatedList = await staffApi.getStaffs();
			setStaffList(updatedList.data);
			Notification.showMessage("Thêm dữ liệu thành công", "success")
		} catch (error) {
			console.log("Error: ", error);
		}
	}


	const handleOpenEditStaff = (staff) => {
		setModalState({ isOpen: true, mode: "edit", data: staff });
	};


	const handleEditStaff = async (values) => {
		const hireDateFormatted = new Date(values.hireDate).toISOString().split('T')[0]; // "YYYY-MM-DD"


		const formattedData = {
			name: values.name,
			position: values.position,
			phoneNumber: values.phoneNumber,
			email: values.email,
			salary: Number(values.salary),
			hireDate: hireDateFormatted,
			status: values.status,
			restaurant: { restaurant_id: values.restaurant_id }
		};
		try {
			await staffApi.update(formattedData, values.staff_Id);
			const updatedList = await staffApi.getStaffs();
			setStaffList(updatedList.data);
			Notification.showMessage("Cập nhật dữ liệu thành công", "success")
		} catch (error) {
			console.log("Error:", error);
		}
	}


	const handldeDelete = (values) => {
		console.log("ID delete:", values);
		setDataDelete(values);
		setOpenDelete(true);
	}


	const handldeDeleteData = async () => {
		try {
			await staffApi.delete(dataDelete);
			const updatedList = await staffApi.getStaffs();
			setStaffList(updatedList.data);
			Notification.showMessage("Xóa dữ liệu thành công", "success")
		} catch (error) {
			console.log("Error:", error);
		}
		setOpenDelete(false);
	}

	return (
		<>
			<motion.div
				className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>

				<div className='flex justify-between items-center mb-6'>
					<h2 className='text-xl font-semibold text-gray-100'>Nhân viên</h2>
					<div className='flex gap-4'>
						<div className='relative'>
							<input
								type="text"
								placeholder="Search users..."
								className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								onKeyDown={handleSearch}
							/>
							<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
						</div>
						<button
							onClick={() => setModalState({ isOpen: true, mode: "add" })}
							className='bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-200'
						>
							Thêm nhân viên
						</button>
					</div>
				</div>

				<div className='overflow-x-auto'>
					<table className='min-w-full divide-y divide-gray-700'>
						<thead>
							<tr>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Mã nhân viên
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Tên nhân viên
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Chức vụ
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Trạng thái
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
									Chức năng
								</th>
							</tr>
						</thead>

						<tbody className='divide-y divide-gray-700'>
							{staffList.map((staff) => (
								<motion.tr
									key={staff.staff_Id}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.3 }}
								>
									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='flex items-center'>
											{/* <div className='flex-shrink-0 h-10 w-10'>
												<div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold'>
													{staff.name.charAt(0)}
												</div>
											</div> */}
											<div className='ml-4'>
												<div className='text-sm font-medium text-gray-100'>{staff.staff_Id}</div>
											</div>
										</div>
									</td>

									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='text-sm text-gray-300'>{staff.name}</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100'>
											{staff.position}
										</span>
									</td>

									<td className='px-6 py-4 whitespace-nowrap'>
										<span
											className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${staff.status === "Active"
												? "bg-green-800 text-green-100"
												: "bg-red-800 text-red-100"
												}`}
										>
											{staff.status}
										</span>
									</td>

									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
										<button
											onClick={() => handleOpenEditStaff(staff)}
											className='text-indigo-400 hover:text-indigo-300 mr-2'

										>Edit</button>
										<button
											className='text-red-400 hover:text-red-300'
											onClick={() => handldeDelete(staff.staff_Id)}
										>Delete</button>
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
				<FormStaff
					mode={modalState.mode}
					data={modalState.data}
					onClose={() => setModalState({ isOpen: false, mode: "" })}
					onAddStaff={handleAddStaff}
					onEditStaff={handleEditStaff}
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
export default StaffTable;
