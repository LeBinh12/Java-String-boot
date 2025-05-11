import Header from "../components/common/Header";

import OverviewCards from "../components/analytics/OverviewCards";
import RevenueChart from "../components/analytics/RevenueChart";
import ChannelPerformance from "../components/analytics/ChannelPerformance";
import ProductPerformance from "../components/analytics/ProductPerformance";
import UserRetention from "../components/analytics/UserRetention";
import CustomerSegmentation from "../components/analytics/CustomerSegmentation";
import Order from "../components/order/order";

const OrderPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title={"Quản lý đơn hàng"} />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<Order />
				<OverviewCards />

			</main>
		</div>
	);
};
export default OrderPage;
