import { Route, Routes } from "react-router-dom";

import Sidebar from "./components/common/Sidebar";

import OverviewPage from "./pages/OverviewPage";

import DishPage from "./pages/DishPage";
import TablePage from "./pages/Table";
import DishCategoryPage from "./pages/DishCategoryPage";
import StaffPage from "./pages/StaffPage";
import RestaurantPage from "./pages/RetaurantPage";
import OrderPage from "./pages/OrderPage";

function App() {
	return (
		<div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
			{/* BG */}
			<div className='fixed inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
				<div className='absolute inset-0 backdrop-blur-sm' />
			</div>

			<Sidebar />
			<Routes>
				<Route path='/' element={<OverviewPage />} />
				<Route path='/dishCategory' element={<DishCategoryPage />} />
				<Route path='/staff' element={<StaffPage />} />
				<Route path='/restaurant' element={<RestaurantPage />} />
				<Route path='/dishes' element={<DishPage />} />
				<Route path='/tables' element={<TablePage />} />
				<Route path='/order' element={<OrderPage />} />
			</Routes>
		</div>
	);
}

export default App;
