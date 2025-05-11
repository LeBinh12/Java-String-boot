import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";

import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesTrendChart from "../components/products/SalesTrendChart";
import ProductsTable from "../components/products/DishCategoryTable";
import DishesTable from "../components/dish/DishTable";
import { useEffect, useState } from "react";
import dishApi from "../Api/dishApi";

const DishPage = () => {

    const [totalPrice, setTotalPrice] = useState(null);
    const [countDish, setCount] = useState(null)
    useEffect(() => {
        (async () => {
            try {
                const data = await dishApi.getTotal();
                const count = await dishApi.getCount();
                setCount(count.totalDish)
                setTotalPrice(data.totalPrice);
                // setStaffList(data);
            } catch (error) {
                console.log('Error', error);
            }
        })()
    }, [])


    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Quản lý món ăn' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* STATS */}
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard name='Số lượng món ăn' icon={Package} value={countDish} color='#6366F1' />
                    <StatCard name='Tổng toàn bộ giá' icon={DollarSign} value={totalPrice} color='#EF4444' />
                </motion.div>

                <DishesTable />


            </main>
        </div>
    );
};
export default DishPage;
