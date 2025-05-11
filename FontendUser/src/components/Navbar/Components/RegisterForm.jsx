import React from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Notification from '../../Notification/NotificationProvider';
import AuthApi from '../../../api/Auth';
import InputField from '../../Form/InputField';

const RegisterForm = ({ setIsLoginOpen, setIsRegistering }) => {
    const registerSchema = yup.object().shape({
        username: yup.string().required("Vui lòng nhập tên người dùng"),
        email: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
        phoneNumber: yup.string().matches(/^[0-9]{9,11}$/, "Số điện thoại không hợp lệ").required("Vui lòng nhập số điện thoại"),
        address: yup.string().required("Vui lòng nhập địa chỉ"),
        password: yup.string().min(6, "Mật khẩu ít nhất 6 ký tự").required("Vui lòng nhập mật khẩu"),
        confirmPassword: yup.string()
            .oneOf([yup.ref('password')], 'Mật khẩu nhập lại không khớp')
            .required("Vui lòng xác nhận mật khẩu"),
    });

    const form = useForm({
        defaultValues: {
            username: '',
            email: '',
            phoneNumber: '',
            address: '',
            password: '',
            confirmPassword: '',
        },
        resolver: yupResolver(registerSchema),
    });

    const { handleSubmit, control, formState: { errors } } = form;

    const onSubmit = async (data) => {
        try {
            const { confirmPassword, ...registerData } = data; // Bỏ confirmPassword
            await AuthApi.register(registerData);
            Notification.showMessage("Đăng ký thành công. Vui lòng đăng nhập.");
            setIsRegistering(false); // Chuyển sang form đăng nhập
        } catch (error) {
            console.error("Register error:", error);
            Notification.showMessage("Đăng ký thất bại. Vui lòng thử lại.");
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

                <h2 className="text-2xl font-bold text-center mb-4">Đăng ký</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <InputField name="username" label="Tên người dùng" form={form} placeholder="Nhập tên của bạn" />
                    </div>
                    <div className="mb-3">
                        <InputField name="email" label="Email" form={form} placeholder="Nhập email của bạn" />
                    </div>
                    <div className="mb-3">
                        <InputField name="phoneNumber" label="Số điện thoại" form={form} placeholder="Nhập số điện thoại" />
                    </div>
                    <div className="mb-3">
                        <InputField name="address" label="Địa chỉ" form={form} placeholder="Nhập địa chỉ" />
                    </div>
                    <div className="mb-3">
                        <InputField name="password" type="password" label="Mật khẩu" form={form} placeholder="Nhập mật khẩu" />
                    </div>
                    <div className="mb-3">
                        <InputField name="confirmPassword" type="password" label="Nhập lại mật khẩu" form={form} placeholder="Nhập lại mật khẩu" />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
                    >
                        Đăng ký
                    </button>
                    <p className="text-sm text-center mt-3">
                        Đã có tài khoản?{" "}
                        <button
                            type="button"
                            className="text-blue-600 hover:underline"
                            onClick={() => setIsRegistering(false)}
                        >
                            Đăng nhập
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
