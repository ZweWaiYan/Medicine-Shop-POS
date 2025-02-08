import { motion, AnimatePresence } from "framer-motion";

import { FaCheck } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { TbEdit } from "react-icons/tb";
import { AiOutlineDelete } from "react-icons/ai";
import { FaChevronDown } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { FaMinus } from "react-icons/fa6";

const categoryDate = ["Capsule", "Cream", "Liquid", "Capsule", "Cream", "Liquid", "Capsule", "Cream", "Liquid"];

const CategoryModal = ({ showModal, closeModal }) => {

    const handleCancel = () => {
        closeModal();
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
                        className="bg-white p-8 rounded-lg w-[400px] shadow-lg"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >

                        <h2 className="text-2xl font-bold mb-4">Category</h2>

                        <div className="mt-5 flex items-center gap-2">
                            <input
                                type="text"
                                className="p-2 border rounded-sm w-full"
                                placeholder="Enter new category"
                            />
                            <button
                                type="button"
                                onClick={() => { }}
                                className="p-2 bg-blue-500 text-white rounded"
                            >
                                <FaChevronDown />
                            </button>
                        </div>

                        <div className="h-[350px] overflow-y-scroll mt-4 p-4">
                            {categoryDate.map((category, index) => (
                                <div className="flex mb-3 items-center gap-2">
                                    <input
                                        key={index}
                                        value={category}
                                        type="text"
                                        className="p-2 border rounded-sm w-full"
                                        placeholder="Enter new category"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => { }}
                                        className="p-2 bg-green-500 text-white rounded"
                                    >
                                        {/* <FaCheck /> */}
                                        <FiPlus />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { }}
                                        className="p-2 bg-red-500 text-white rounded"
                                    >
                                        {/* <RxCross1 /> */}
                                        <FaMinus />
                                    </button>
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
                                onClick={handleCancel}
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                Save
                            </motion.button>
                        </div>
                    </motion.div >
                </motion.div >
            )}
        </AnimatePresence >
    )
}

export default CategoryModal;