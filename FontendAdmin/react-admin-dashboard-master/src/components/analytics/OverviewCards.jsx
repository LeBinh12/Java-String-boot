import { motion } from "framer-motion";
import { DollarSign, Users, ShoppingBag, Eye, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import orderApi from "../../Api/orderApi";

// Dữ liệu mặc định (khi API chưa trả về kết quả)
const defaultOverviewData = [
	{ name: "Revenue", value: "$0", change: 0, icon: DollarSign },
	{ name: "Orders", value: "0", change: 0, icon: ShoppingBag },
	{ name: "Page Views", value: "0", change: 0, icon: Eye },
	{ name: "Other Metric", value: "0", change: 0, icon: Users },
];

const OverviewCards = () => {
	const [overviewData, setOverviewData] = useState(defaultOverviewData);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const response = await orderApi.start();
				console.log("Dashboard stats:", response);

				// Cập nhật overviewData với dữ liệu từ API
				const updatedOverviewData = [
					{
						name: "Tổng đơn hôm nay",
						value: `$${Number(response.totalOrders || 0).toLocaleString()}`,
						change: response.totalRevenue || 0,
						icon: ShoppingBag,
					},
					{
						name: "Tổng giá tiền hôm nay",
						value: Number(response.totalRevenue || 0).toLocaleString(),
						change: response.totalRevenue || 0,
						icon: DollarSign,
					},
				];

				setOverviewData(updatedOverviewData);
			} catch (error) {
				console.log("Error fetching dashboard stats:", error);
				// Nếu có lỗi, giữ nguyên dữ liệu mặc định
				setOverviewData(defaultOverviewData);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []); // Chỉ gọi API một lần khi component mount

	return (
		<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
			{overviewData.map((item, index) => (
				<motion.div
					key={item.name}
					className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: index * 0.1 }}
				>
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-sm font-medium text-gray-400">{item.name}</h3>
							<p className="mt-1 text-xl font-semibold text-gray-100">
								{loading ? "Loading..." : item.value}
							</p>
						</div>

						<div
							className={`
                p-3 rounded-full bg-opacity-20 ${item.change >= 0 ? "bg-green-500" : "bg-red-500"}
              `}
						>
							<item.icon
								className={`size-6 ${item.change >= 0 ? "text-green-500" : "text-red-500"}`}
							/>
						</div>
					</div>
					<div
						className={`
              mt-4 flex items-center ${item.change >= 0 ? "text-green-500" : "text-red-500"}
            `}
					>
						{item.change >= 0 ? <ArrowUpRight size="20" /> : <ArrowDownRight size="20" />}
						<span className="ml-1 text-sm font-medium">{Math.abs(item.change)}%</span>
						<span className="ml-2 text-sm text-gray-400">vs last period</span>
					</div>
				</motion.div>
			))}
		</div>
	);
};

export default OverviewCards;