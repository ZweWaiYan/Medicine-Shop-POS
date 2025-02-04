import react, { useState } from "react";

import { FaHouseUser } from "react-icons/fa";
import { FaPlaceOfWorship } from "react-icons/fa6";
import { IoFastFoodSharp } from "react-icons/io5";

import { motion, AnimatePresence } from "framer-motion";

const FilterModal = ({ showModal, closeModal }) => {

    //last Date
    const [selectedLastestDate, setSelectedLastestDate] = useState(null);
    const handleLastestDate = (date) => {
        setSelectedLastestDate(date);
    }

    //Price
    const [price, setprice] = useState([
        { id: 1, name: "most" }, { id: 2, name: "less" },
    ]);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const handlePrice = (id) => {
        setSelectedPrice(id);
    }

    //quantity
    const [quantity, setquantity] = useState([
        { id: 1, name: "most" }, { id: 2, name: "less" },
    ]);
    const [selectedquantity, setSelectedquantity] = useState(null);
    const handlequantity = (id) => {
        setSelectedquantity(id);
    }

    //Category
    const [category, setCategory] = useState([
        { id: 1, name: "Capsule" }, { id: 2, name: "Cream" }, { id: 3, name: "Liquid" },
    ]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const handleCategory = (id) => {
        setSelectedCategory(id);
    }

    //filter func
    const handleFilter = () => {
        console.log("selectedDate ", selectedLastestDate);
        console.log("selectedLocation ", selectedPrice);
        console.log("selectedView ", selectedCategory);
        closeModal();
    }


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

                        <h2 className="text-2xl font-bold mb-4">Filter</h2>

                        <div className="text-sm font-semibold mt-5">Expire Date</div>
                        <input onChange={(e) => handleLastestDate(e.target.value)} type="date" className="w-full mt-2 p-2 border rounded " />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                            <div>
                                <div className="text-sm font-semibold">Most/Less Price</div>
                                <select onClick={(e) => handlePrice(e.target.value)} className="w-full mt-2 p-2 border rounded">
                                    {price.map(({ id, name }) => (
                                        <option key={id} value={id}>{name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <div className="text-sm font-semibold">Most/Less quantity</div>
                                <select onClick={(e) => handlequantity(e.target.value)} className="w-full mt-2 p-2 border rounded">
                                    {quantity.map(({ id, name }) => (
                                        <option key={id} value={id}>{name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="text-sm font-semibold mt-5">Locations</div>
                        <select onClick={(e) => handleCategory(e.target.value)} className="w-full mt-2 p-2 border rounded">
                            {category.map(({ id, name }) => (
                                <option key={id} value={id}>{name}</option>
                            ))}
                        </select>


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
                                onClick={handleFilter}
                                className="px-4 py-2 bg-blue-500 text-white rounded shadow-md"
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

export default FilterModal;