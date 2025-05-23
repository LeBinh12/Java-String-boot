import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { CreditCard, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import SalesOverviewChart from "../components/sales/SalesOverviewChart";
import SalesByCategoryChart from "../components/sales/SalesByCategoryChart";
import DailySalesTrend from "../components/sales/DailySalesTrend";
import RestaurentsTable from "../components/retaurant/Restaurent";

const salesStats = {
	totalRevenue: "$1,234,567",
	averageOrderValue: "$78.90",
	conversionRate: "3.45%",
	salesGrowth: "12.3%",
};

const RestaurantPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Quản lý nhà hàng' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>


				<RestaurentsTable />

			</main>
		</div>
	);
};
export default RestaurantPage;
