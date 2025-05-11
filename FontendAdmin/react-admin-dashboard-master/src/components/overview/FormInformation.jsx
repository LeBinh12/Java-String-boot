import React from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from '../Form/InputField';
import { X } from 'lucide-react';
import { motion } from "framer-motion";
import { Editor } from '@tinymce/tinymce-react';

FormInformationTable.propTypes = {
    mode: PropTypes.string,
    data: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    onAddInformation: PropTypes.func,
    onEditInformation: PropTypes.func,
};

function FormInformationTable({ onClose, data, onAddInformation, onEditInformation, mode }) {
    const schema = yup.object().shape({
        topic: yup.string()
            .max(50, "Chủ đề không được quá 50 ký tự")
            .nullable(),
        title: yup.string()
            .required("Tiêu đề không được để trống")
            .min(3, "Tiêu đề phải có ít nhất 3 ký tự")
            .max(300, "Tiêu đề không được quá 300 ký tự"),
        description: yup.string()
            .nullable(),
    });

    const form = useForm({
        defaultValues: {
            topic: data?.topic || '',
            title: data?.title || '',
            description: data?.description || '',
        },
        resolver: yupResolver(schema),
    });

    const handleSubmit = (values) => {
        if (mode === "edit" && onEditInformation) {
            onEditInformation({ ...values, id: data.id });
        } else if (mode === "add" && onAddInformation) {
            onAddInformation(values);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">{mode === "edit" ? "Chỉnh sửa thông tin" : "Thêm thông tin"}</h2>
                    <button onClick={onClose}>
                        <X className="text-gray-900 hover:text-red-500" size={24} />
                    </button>
                </div>

                <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-2 gap-4">
                    <InputField name="topic" form={form} label="Chủ đề" />
                    <InputField name="title" form={form} label="Tiêu đề" />
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-800 mb-1">Mô tả</label>
                        <Editor
                            onEditorChange={(content) => form.setValue("description", content)}
                            apiKey='oeu3yhycyrj0lqa722zpeyqh5xj7r8imoh31ctunafgvtgmz'
                            init={{
                                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                            }}
                            initialValue={mode === 'edit' ? form.getValues("description") : ""}
                        />
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.description?.message}</p>
                    </div>
                    <div className="col-span-2 flex justify-end gap-4 mt-4">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg"
                        >
                            {mode === "edit" ? "Cập nhật" : "Thêm mới"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default FormInformationTable;