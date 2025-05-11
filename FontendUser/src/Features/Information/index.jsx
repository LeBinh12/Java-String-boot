import React, { useEffect, useState } from "react";
import InformationApi from "../../api/InformationApi";

const InformationPage = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await InformationApi.getPagination(page, pageSize);
                setData(res.content);
                setTotalPages(res.totalPages);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin:", error);
            }
        };

        fetchData();
    }, [page]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="pt-[120px] px-4 max-w-4xl mx-auto text-gray-800">
            <h1 className="text-3xl font-bold mb-8 text-center text-teal-600">📚 Thông tin nhà hàng</h1>

            {data.map((item) => (
                <div key={item.id} className="bg-white shadow-md p-6 rounded-xl mb-8 border border-gray-200">
                    <p className="text-sm text-teal-600 font-medium mb-1">📌 {item.topic}</p>
                    <h2 className="text-2xl font-bold mb-2 text-gray-900">{item.title}</h2>
                    <div
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                    ></div>
                </div>
            ))}

            {/* Pagination */}
            <div className="flex justify-center items-center gap-3 mt-6">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                    className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 disabled:opacity-50"
                >
                    Trang trước
                </button>
                <span className="text-gray-800 font-medium">
                    Trang {page + 1} / {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page + 1 >= totalPages}
                    className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 disabled:opacity-50"
                >
                    Trang sau
                </button>
            </div>
        </div>
    );
};

export default InformationPage;
