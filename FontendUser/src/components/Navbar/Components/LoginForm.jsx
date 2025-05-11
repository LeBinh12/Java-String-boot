import React from 'react';
import PropTypes from 'prop-types';
import * as yup from "yup";
import InputField from '../../Form/InputField';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { useRecoilState } from 'recoil';
import { isAuthenticatedState, userState, ListCart } from '../../../recoil/atom';
import AuthApi from '../../../api/Auth';
import Notification from '../../Notification/NotificationProvider';
import { saveAuthToStorage } from '../../../recoil/recoilPersist';

function LoginForm({ setIsLoginOpen, setIsRegistering }) {
    const [isAuthenticated, setIsAuthenticated] = useRecoilState(isAuthenticatedState);
    const [user, setUser] = useRecoilState(userState);
    const [cart] = useRecoilState(ListCart); // Lấy giỏ hàng hiện tại từ Recoil

    const loginSchema = yup.object().shape({
        usernameOrEmail: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
        password: yup.string().min(6, "Mật khẩu ít nhất 6 ký tự").required("Vui lòng nhập mật khẩu"),
    });

    const form = useForm({
        defaultValues: {
            usernameOrEmail: "",
            password: "",
        },
        resolver: yupResolver(loginSchema),
    });

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = form;

    const onSubmit = async (data) => {
        try {
            const response = await AuthApi.login(data);
            if (response.user) {
                setIsAuthenticated(true);
                setUser(response.user);
                // Lưu thông tin đăng nhập và giữ nguyên giỏ hàng hiện tại
                saveAuthToStorage(response.user, cart); // Truyền giỏ hàng hiện tại
                Notification.showMessage("Đăng nhập thành công");
                setIsLoginOpen(false);
            }
        } catch (error) {
            Notification.showMessage("Tài khoản hoặc mật khẩu không chính xác");
            console.log("Error login:", error);
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={() => setIsLoginOpen(false)}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg w-96 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={() => setIsLoginOpen(false)}
                    className="absolute top-2 right-4 text-gray-600 text-2xl hover:text-gray-900"
                >
                    ×
                </button>
                <h2 className="text-2xl font-bold text-center mb-4">Đăng nhập</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <InputField
                            name="usernameOrEmail"
                            form={form}
                            label="Email"
                            placeholder="Nhập email của bạn"
                        />
                    </div>
                    <div className="mb-4">
                        <InputField
                            name="password"
                            label="Mật khẩu"
                            placeholder="Nhập mật khẩu"
                            type="password"
                            form={form}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Đăng nhập
                    </button>
                    <p className="text-sm text-center mt-3">
                        Chưa có tài khoản?{" "}
                        <button
                            type="button"
                            className="text-blue-600 hover:underline"
                            onClick={() => setIsRegistering(true)}
                        >
                            Đăng ký ngay
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;