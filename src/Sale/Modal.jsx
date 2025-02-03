import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Modal = ({ showModal, closeModal, item, onSave, tableData }) => {
    const [fields, setFields] = useState({});
    const [errors, setErrors] = useState({});

    const [categories, setCategories] = useState([
        "Capsule",
        "Cream",
        "Liquid",
    ]);
    const [newCategory, setNewCategory] = useState("");
    const [isAddCategory, setIsAddCategory] = useState(false);

    const addCategory = () => {
        if (newCategory.trim() && !categories.includes(newCategory)) {
            setCategories([...categories, newCategory]);
            setNewCategory("");
            setIsAddCategory(false);
            handleChange("category", "");
        }
    };

    // Update fields when item prop changes
    useEffect(() => {
        if (item) {
            setFields({
                itemCode: item.itemCode,
                barcode: item.barcode,
                name: item.name,
                category: item.category,
                qty: item.qty,
                price: item.price,
                expireDate: item.expireDate,
                alertDate: item.alertDate,
                remark: item.remark
            });
        } else {
            setFields({
                itemCode: "",
                barcode: "",
                name: "",
                category: "",
                qty: 0,
                price: 0,
                expireDate: "",
                alertDate: "",
                remark: ""
            });
        }
    }, [item]);

    // Validate form
    const validate = () => {
        const newErrors = {};
        const fieldRules = {
            itemCode: "ItemCode is required!",
            itemCodeDulicate: "ItemCode can't be duplicated!",
            barcode: "BarCode is required!",
            name: "Name is required!",
            category: "Category is required!",
            qty: "Qty is required!",
            price: "Price is required!",
            expireDate: "ExpireDate is required!",
        };

        if (!item) {
            fieldRules.itemCode = "ItemCode is required!";
            fieldRules.barcode = "BarCode is required!";
            fieldRules.name = "Name is required!";
            fieldRules.category = "Category is required!";
            fieldRules.qty = "Qty is required!";
            fieldRules.price = "Price is required!";
            fieldRules.expireDate = "ExpireDate is required!";
        }

        Object.keys(fields).forEach((field) => {
            if (!fields[field]) {
                newErrors[field] = fieldRules[field];
            }
        });

        const existingItemCode = tableData.find((u) => u.itemCode === fields.itemCode);
        if (existingItemCode) {
            newErrors.itemCode = "ItemCode already exists!";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle dynamic input changes
    const handleChange = (field, value) => {
        if (field === "category" && value === "Add") {
            setIsAddCategory(true);
        }
        setFields({ ...fields, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: "" });
        }
    };

    const handleSubmit = async () => {
        if (validate()) {
            try {
                const updateditem = {
                    itemCode: fields.itemCode,
                    barcode: fields.barcode,
                    name: fields.name,
                    category: fields.category,
                    qty: fields.qty,
                    price: fields.price,
                    expireDate: fields.expireDate,
                    alertDate: fields.alertDate,
                    remark: fields.remark
                };

                await onSave(fields);

                resetInput();
                closeModal();
                /*toast.success(`${item ? "item updated" : "item added"}: ${fields.itemname}`, {
                    position: "top-right",
                    autoClose: 2000,
                });*/
            } catch (error) {
                toast.error('An error occurred while updating the item');
            }
        }
    };

    const handleCancel = () => {
        resetInput();
        closeModal();
    };

    const resetInput = () => {
        setFields(item ? {
            itemCode: item.itemCode,
            barcode: item.barcode,
            name: item.name,
            category: item.category,
            qty: item.qty,
            price: item.price,
            expireDate: item.expireDate,
            alertDate: item.alertDate,
            remark: item.remark
        } : {
            itemCode: "",
            barcode: "",
            name: "",
            category: "",
            qty: 0,
            price: 0,
            expireDate: "",
            alertDate: "",
            remark: ""
        });
        setErrors({});
    };

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
                        className="bg-white p-8 rounded-lg w-[400px] shadow-lg max-h-[90vh] overflow-y-auto"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <h2 className="text-2xl font-bold mb-4">{item ? "Edit" : "Add"} item</h2>
                        <div>
                            {["itemCode", "barcode", "name", "category", "qty", "price", "expireDate", "remark"].map((field) => (
                                <div key={field} className="mb-4">
                                    {(() => {
                                        switch (field) {
                                            case "category":
                                                return (
                                                    <div>
                                                        <select
                                                            value={fields[field] || ""}
                                                            onChange={(e) => handleChange(field, e.target.value)}
                                                            className={`w-full p-2 border rounded-sm ${isAddCategory ? "text-gray-300" : ""} ${errors[field] ? "border-red-500" : ""}`}
                                                            disabled={isAddCategory}
                                                        >
                                                            <option value="">Select a category</option>
                                                            {categories.map((cat) => (
                                                                <option key={cat} value={cat}>
                                                                    {cat}
                                                                </option>
                                                            ))}

                                                            <option value="Add">+ Add Category</option>
                                                        </select>

                                                        {isAddCategory ? (
                                                            <div className="mt-2 flex items-center gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={newCategory}
                                                                    onChange={(e) => setNewCategory(e.target.value)}
                                                                    className="p-2 border rounded-sm w-full"
                                                                    placeholder="Enter new category"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => { addCategory() }}
                                                                    className="p-2 bg-blue-500 text-white rounded"
                                                                >
                                                                    Add
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => { setIsAddCategory(false); setNewCategory(""); handleChange("category", ""); }}
                                                                    className="p-2 bg-gray-300 rounded"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        )
                                                            :
                                                            ''}
                                                    </div>
                                                );
                                            case "expireDate":
                                                return (
                                                    <input
                                                        value={fields[field] || ""}
                                                        onChange={(e) => handleChange(field, e.target.value)}
                                                        type="date"
                                                        className="w-full p-2 border rounded relative z-[9999] bg-white"
                                                    />
                                                );
                                            default:
                                                return (
                                                    <input
                                                        value={fields[field] || ""}
                                                        onChange={(e) => handleChange(field, e.target.value)}
                                                        className={`w-full p-2 border rounded-sm ${errors[field] ? "border-red-500" : ""}`}
                                                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                                    />
                                                );
                                        }
                                    })()}

                                    {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex justify-between">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-400 text-white rounded"
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-blue-500 text-white rounded shadow-md"
                            >
                                Save
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
