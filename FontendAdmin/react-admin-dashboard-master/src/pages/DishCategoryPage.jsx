import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";

import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesTrendChart from "../components/products/SalesTrendChart";
import ProductsTable from "../components/products/DishCategoryTable";
import DisCategoryTable from "../components/products/DishCategoryTable";

const DishCategoryPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Quản lý loại món ăn' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>

				<DisCategoryTable />
			</main>
		</div>
	);
};
export default DishCategoryPage;
