// InformationTable.jsx
import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import informationApi from "../../Api/informationApi";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Notification from "../Notification/Notification";
import FormInformationTable from "./FormInformation";

const InformationTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [informationList, setInformationList] = useState([]);
    const [modalState, setModalState] = useState({ isOpen: false, mode: "" });
    const [openDelete, setOpenDelete] = useState(false);
    const [dataDelete, setDataDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await informationApi.getPagination(currentPage, pageSize);
                console.log(response.content);
                setInformationList(response.content);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.log("Error fetching Information list:", error);
            }
        };

        fetchData();
    }, [currentPage]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        // Note: Search functionality would require backend support
        // You might want to modify the getPagination API to include search parameters
    };

    const handleAddInformation = async (values) => {
        console.log(values);
        try {
            
            await informationApi.add(values);
            const response = await informationApi.getPagination(currentPage, pageSize);
            setInformationList(response.data.content);
            setTotalPages(response.data.totalPages);
            Notification.showMessage("Thêm thông tin thành công", "success");
        } catch (error) {
            console.log("Error:", error);
            Notification.showMessage("Lỗi khi thêm thông tin", "error");
        }
    };

    const handleEditInformation = async (values) => {
        try {
            await informationApi.update(values, values.id);
            const response = await informationApi.getPagination(currentPage, pageSize);
            setInformationList(response.content);
            setTotalPages(response.totalPages);
            Notification.showMessage("Cập nhật thông tin thành công", "success");
        } catch (error) {
            console.log("Error:", error);
            Notification.showMessage("Lỗi khi cập nhật thông tin", "error");
        }
    };

    const handleOpenEditInformation = (info) => {
        setModalState({ isOpen: true, mode: "edit", data: info });
    };

    const handleDelete = (id) => {
        setDataDelete(id);
        setOpenDelete(true);
    };

    const handleDeleteData = async () => {
        try {
            await informationApi.delete(dataDelete);
            const response = await informationApi.getPagination(currentPage, pageSize);
            setInformationList(response.content);
            setTotalPages(response.totalPages);
            Notification.showMessage("Xóa thông tin thành công", "success");
        } catch (error) {
            console.log("Error:", error);
            Notification.showMessage("Lỗi khi xóa thông tin", "error");
        }
        setOpenDelete(false);
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
                    <h2 className='text-xl font-semibold text-gray-100'>Danh sách thông tin</h2>
                    <div className='flex gap-4'>
                        <div className='relative'>
                            <input
                                type='text'
                                placeholder='Tìm kiếm thông tin...'
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
                            Thêm thông tin
                        </button>
                    </div>
                </div>

                <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-700'>
                        <thead>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Mã thông tin
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Chủ đề
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Tiêu đề
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                    Chức năng
                                </th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-700'>
                            {informationList.map((info) => (
                                <motion.tr
                                    key={info.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
                                        {info.id}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                        {info.topic}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                        {info.title}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                        <button
                                            onClick={() => handleOpenEditInformation(info)}
                                            className='text-indigo-400 hover:text-indigo-300 mr-2'
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(info.id)}
                                            className='text-red-400 hover:text-red-300'
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
                <FormInformationTable
                    mode={modalState.mode}
                    data={modalState.data}
                    onClose={() => setModalState({ isOpen: false, mode: "" })}
                    onAddInformation={handleAddInformation}
                    onEditInformation={handleEditInformation}
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
                        Bạn có muốn xóa thông tin này không?
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

export default InformationTable;