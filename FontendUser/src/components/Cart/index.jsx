import React, { useRef, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { ListCart } from "../../recoil/atom";
import { Link } from "react-router-dom";

function Cart({ setCartPosition }) {
    const cartRef = useRef(null);
    const listCart = useRecoilValue(ListCart);
    const updateCartPosition = () => {
        if (cartRef.current) {
            const rect = cartRef.current.getBoundingClientRect();
            setCartPosition({ x: rect.left, y: rect.top });
        }
    };

    useEffect(() => {
        updateCartPosition();
        window.addEventListener("resize", updateCartPosition);
        return () => window.removeEventListener("resize", updateCartPosition);
    }, []);

    return (
        <Link to="/cart">
            <div ref={cartRef} className="fixed bottom-5 right-5 bg-yellow-400 w-20 h-20 flex items-center justify-center rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer">
                <div className="absolute top-0 left-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-lg font-bold">
                    {listCart.length} {/* Sử dụng listCart.length để hiển thị số lượng */}
                </div>
                <img src="https://cdn.pixabay.com/photo/2014/04/02/10/53/shopping-cart-304843_1280.png" alt="Cart" className="w-8" />
            </div>
        </Link>
    );
}

export default Cart;
