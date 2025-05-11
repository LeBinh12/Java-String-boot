import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Banner from "./components/Banner/Banner.jsx";
import OurMenu from "./components/OurMenu/OurMenu.jsx";
import Testimonials from "./components/Testimonials/Testimonials.jsx";
import Newsletter from "./components/Newsletter/Newsletter.jsx";
import Footer from "./components/Footer/Footer.jsx";
import AOS from "aos";
import "aos/dist/aos.css";
import { Route, Routes } from "react-router-dom";
import HomeFeatures from "./Features/Home/index.jsx";
import Cart from "./components/Cart/index.jsx";
import DishesCategory from "./Features/DishesCategory/index.jsx";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isAuthenticatedState, ListCart, userState } from "./recoil/atom.jsx";
import { getAuthFromStorage } from "./recoil/recoilPersist.jsx";
import CartFeatures from "./Features/Cart/index.jsx";
import MenuFeatures from "./Features/Menu/index.jsx";
import OrderFeatures from "./Features/Order/index.jsx";
import InformationPage from "./Features/Information/index.jsx";
import OrderHistoryFeatures from "./Features/OrderHistory/index.jsx";

const App = () => {

  const [cartPosition, setCartPosition] = useState({ x: 0, y: 0 }); // lưu tọa độ của giỏ hàng


  const setUser = useSetRecoilState(userState);
  const setIsAuthenticated = useSetRecoilState(isAuthenticatedState);
  const setCart = useSetRecoilState(ListCart);

  useEffect(() => {
    const { user, isAuthenticated, cart } = getAuthFromStorage();
    console.log("App - Initial auth state:", { user, isAuthenticated, cart });

    // Luôn cập nhật trạng thái Recoil, ngay cả khi không có user/isAuthenticated
    setUser(user || null);
    setIsAuthenticated(isAuthenticated || false);
    setCart(Array.isArray(cart) ? cart : []);

    // Thêm listener để kiểm tra nếu localStorage thay đổi từ tab khác
    const handleStorageChange = () => {
      const { user, isAuthenticated, cart } = getAuthFromStorage();
      console.log("App - Storage changed:", { user, isAuthenticated, cart });
      setUser(user || null);
      setIsAuthenticated(isAuthenticated || false);
      setCart(Array.isArray(cart) ? cart : []);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [setUser, setIsAuthenticated, setCart]);

  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 700,
      easing: "ease-in",
      delay: 100,
    });
    AOS.refresh();
  });

  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeFeatures cartPosition={cartPosition} />} />
        <Route path="/cart" element={<CartFeatures />} />
        <Route path="/menu" element={<MenuFeatures cartPosition={cartPosition} />} />
        <Route path="/order" element={<OrderFeatures />} />
        <Route path="/information" element={<InformationPage />} />
        <Route path="/order-history" element={<OrderHistoryFeatures />} />
      </Routes>
      <Footer />
      <Cart setCartPosition={setCartPosition} />
    </main>
  );
};

export default App;
