import { motion, AnimatePresence } from "framer-motion";

import { FaCheck } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { TbEdit } from "react-icons/tb";
import { AiOutlineDelete } from "react-icons/ai";
import { FaChevronDown } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { FaMinus } from "react-icons/fa6";
import axiosInstance from "../axiosInstance";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const categoryDate = ["Capsule", "Cream", "Liquid", "Capsule", "Cream", "Liquid", "Capsule", "Cream", "Liquid"];

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const fetchCategories = async () => {
    const { data } = await axiosInstance.get("/api/fetchcategory");
    return data;
};

const addCategory = async (name) => {
    await axiosInstance.post("/api/addcategory", { name });
};

const updateCategory = async({id, newName}) =>{
    await axiosInstance.put(`/api/updatecategory/${id}`, {newName});
}

const deleteCategory = async(id) =>{
    await axiosInstance.delete(`/api/deletecategory/${id}`);
}


const CategoryModal = ({ showModal, closeModal }) => {
    const queryClient = useQueryClient();
    const [newCategory, setNewCategory] = useState("");

    const { data: category, isLoading, isError } = useQuery({
        queryKey: ["category"], 
        queryFn: fetchCategories
    });

    const addMutation = useMutation({
        mutationFn: addCategory,
        onSuccess: () => {
            queryClient.invalidateQueries(["category"]);
        }
    });

    const updateMutation = useMutation({
        mutationFn: updateCategory,
        onSuccess: () => {
            queryClient.invalidateQueries(["category"]);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries(["category"]);
        }
    });

    const handleAddCategory = (e) => {
        e.preventDefault();
        if (newCategory.trim()) {
            addMutation.mutate(newCategory);
            setNewCategory("");
            toast.success("Categories createed successfully!!!")
        }
    };

    const handleUpdateCategory = (id, currentName) => {
        const newName = prompt("Enter new name:", currentName);
        if (newName && newName !== currentName) {
            updateMutation.mutate({ id, newName });
        }
    };

    const handleDeleteCategory = (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            deleteMutation.mutate(id);
        }
    };

    const handleCancel = () => {
        closeModal();
    };
    if (!showModal) return null;
    if (isLoading) return <p>Loading categories...</p>;
    if (isError) return <p>Error loading categories</p>;

    return (
        <AnimatePresence>
            {showModal && (
                <motion.div
                    className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white p-8 rounded-lg w-[400px] shadow-lg"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >

                        <h2 className="text-2xl font-bold mb-4">Category</h2>

                        {/* Add new category input */}
                        <div className="mt-5 flex items-center gap-2">
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="p-2 border rounded-sm w-full"
                                placeholder="Enter new category"
                            />
                            <button
                                type="button"
                                onClick={handleAddCategory}
                                className="p-2 bg-blue-500 text-white rounded"
                            >
                                <FaChevronDown />
                            </button>
                        </div>

                        {/* Category List */}
                        <div className="h-[350px] overflow-y-scroll mt-4 p-4">
                            {category.map((category) => (
                                <div key={category._id} className="flex mb-3 items-center gap-2">
                                    <input
                                        value={category.name}
                                        type="text"
                                        className="p-2 border rounded-sm w-full"
                                        readOnly
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleUpdateCategory(category._id, category.name)}
                                        className="p-2 bg-green-500 text-white rounded"
                                    >
                                        <FiPlus />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteCategory(category._id)}
                                        className="p-2 bg-red-500 text-white rounded"
                                    >
                                        <FaMinus />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Modal Footer */}
                        <div className="mt-4 flex justify-between">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-400 text-white rounded"
                            >
                                Cancel
                            </motion.button>
                            {/* <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleAddCategory}
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                Save
                            </motion.button> */}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default CategoryModal;