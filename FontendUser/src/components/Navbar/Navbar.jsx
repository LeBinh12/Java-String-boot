import React, { useState } from "react";
import Logo from "../../assets/logo.png";
import { FaBars, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import RegisterForm from "./Components/RegisterForm";
import LoginForm from "./Components/LoginForm";
import { useRecoilState } from "recoil";
import { isAuthenticatedState, userState } from "../../recoil/atom";
import { useTranslation } from 'react-i18next'; // Thêm useTranslation
import i18n from '../../i18n'; // Import i18n

const Menu = [
  { id: 1, name: "Thực đơn", link: "/menu" },
  { id: 2, name: "Thông tin nhà hàng", link: "/information" },
  { id: 3, name: "Lịch sử đơn hàng", link: "/order-history" },
  { id: 4, name: "Bàn đặt", link: "/order" },
];

const Navbar = () => {
  const { t, i18n } = useTranslation(); // Sử dụng useTranslation
  const [open, setOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [AuthenticatedState, setAuthenticated] = useRecoilState(isAuthenticatedState);
  const [user, setUser] = useRecoilState(userState);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  console.log("User Login", user);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('ListCart');
    localStorage.removeItem('orderId');
    setAuthenticated(false);
    setUser(null);
    setShowLogout(false);
    navigate("/");
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <div className="bg-lightBlue fixed top-0 left-0 w-full z-50 shadow-md">
        <div className="container py-2">
          <div className="flex justify-between items-center">
            {/* Logo section */}
            <div data-aos="fade-down" data-aos-once="true">
              <Link to="/">
                <img src={Logo} alt="Logo" className="w-36" />
              </Link>
            </div>
            {/* Link section */}
            <div
              className="hidden lg:flex justify-between items-center gap-4"
              data-aos="fade-down"
              data-aos-once="true"
              data-aos-delay="300"
            >
              <ul className="hidden lg:flex justify-between items-center gap-4">
                {Menu.map((menu) => (
                  <li key={menu.id}>
                    {menu.name === "Bàn đặt" ? (
                      <button
                        onClick={() => {
                          if (!AuthenticatedState) {
                            setIsLoginOpen(true);
                          } else {
                            navigate("/order");
                          }
                        }}
                        className="inline-block text-xl p-4 hover:text-primary"
                      >
                        {t(menu.name)}
                      </button>
                    ) : (
                      <Link to={menu.link} className="inline-block text-xl p-4">
                        {t(menu.name)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
              {/* Nút chuyển đổi ngôn ngữ */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeLanguage('vi')}
                  className="text-xl p-2 hover:text-primary"
                >
                  VN
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className="text-xl p-2 hover:text-primary"
                >
                  EN
                </button>
                <button
                  onClick={() => changeLanguage('zh')}
                  className="text-xl p-2 hover:text-primary"
                >
                  中
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {AuthenticatedState ? (
                <div className="relative">
                  <button
                    onClick={() => setShowLogout(!showLogout)}
                    className="text-2xl text-gray-700 hover:text-gray-900 transition-colors duration-200"
                  >
                    {user.username}
                  </button>
                  {showLogout && (
                    <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg p-2 z-50">
                      <button
                        onClick={handleLogout}
                        className="text-red-600 hover:underline text-sm"
                      >
                        {t("Đăng xuất")}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="text-2xl text-gray-700 hover:text-gray-900 transition-colors duration-200"
                >
                  <FaUser />
                </button>
              )}
              <button onClick={() => setOpen(!open)} className="lg:hidden">
                <FaBars className="text-3xl" />
              </button>
            </div>

            {/* Responsive Menu */}
            <div className="lg:hidden">
              {open && (
                <div>
                  <ul className="bg-white space-y-3 p-4 rounded-md shadow-md absolute right-10 top-24 z-50">
                    {Menu.map((menu) => (
                      <li key={menu.id}>
                        {menu.name === "Bàn đặt" ? (
                          <button
                            onClick={() => {
                              if (!AuthenticatedState) {
                                setIsLoginOpen(true);
                              } else {
                                navigate("/order");
                              }
                              setOpen(false);
                            }}
                            className="inline-block text-xl p-4 hover:bg-primary hover:text-white w-full rounded-md"
                          >
                            {t(menu.name)}
                          </button>
                        ) : (
                          <Link
                            to={menu.link}
                            onClick={() => setOpen(false)}
                            className="inline-block text-xl p-4 hover:bg-primary hover:text-white w-full rounded-md"
                          >
                            {t(menu.name)}
                          </Link>
                        )}
                      </li>
                    ))}
                    {/* Nút chuyển đổi ngôn ngữ trong responsive */}
                    <div className="flex justify-around mt-2">
                      <button
                        onClick={() => {
                          changeLanguage('vi');
                          setOpen(false);
                        }}
                        className="text-xl p-2 hover:bg-primary hover:text-white w-10 rounded-md"
                      >
                        VN
                      </button>
                      <button
                        onClick={() => {
                          changeLanguage('en');
                          setOpen(false);
                        }}
                        className="text-xl p-2 hover:bg-primary hover:text-white w-10 rounded-md"
                      >
                        EN
                      </button>
                      <button
                        onClick={() => {
                          changeLanguage('zh');
                          setOpen(false);
                        }}
                        className="text-xl p-2 hover:bg-primary hover:text-white w-10 rounded-md"
                      >
                        中
                      </button>
                    </div>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isLoginOpen && (
        isRegistering ? (
          <RegisterForm setIsLoginOpen={setIsLoginOpen} setIsRegistering={setIsRegistering} />
        ) : (
          <LoginForm setIsLoginOpen={setIsLoginOpen} setIsRegistering={setIsRegistering} />
        )
      )}
    </>
  );
};

export default Navbar;