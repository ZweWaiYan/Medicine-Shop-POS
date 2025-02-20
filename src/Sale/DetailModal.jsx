import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useQuery } from "@tanstack/react-query";

import { FaCheck } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import BillDetailgeneratePDF from "../Bill/BillDetailgeneratePDF";

const fetchBillDetailData = async (id) => {
    const { data } = await axios.get(`/api/fetchsale/${id}`);
    return data;
};

const DetailModal = ({ showModal, closeModal, item }) => {

    console.log("item", item);

    const { data: saleData, isLoading, error } = useQuery({
        queryKey: ["saleData", item.sale_id],
        queryFn: () => fetchBillDetailData(item.sale_id),
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading data</p>;

    const handleCancel = () => {
        closeModal();
    };

    const handlePrint = () => {
        BillDetailgeneratePDF(saleData);
    }

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
                        <h2 className="text-2xl font-bold mb-4">
                            Bill Detail
                        </h2>

                        <div className="flex justify-between pb-5">
                            <div>
                                <p>Sale ID</p>
                                <p>{item.sale_id}</p>
                            </div>

                            <div>
                                <p>Date</p>
                                <p>{new Date(item.date).toLocaleDateString("en-GB")}</p>
                            </div>
                        </div>

                        {saleData.items.map((data) => {

                            return (
                                <div key={data.id} className="flex justify-between pb-3">
                                    <div>
                                        <p className="py-2">{data.name}</p>
                                        <p>Qty : {data.quantity}</p>
                                    </div>
                                    <div className="my-auto">
                                        <p>{data.price} Kyats</p>
                                    </div>
                                </div>
                            )
                        })}

                        <div className="border-t-2 py-2 flex justify-between">
                            <div>Sub Total :</div>
                            <div>{saleData.sale.subtotal} Kyats</div>
                        </div>
                        <div className="py-2 flex justify-between">
                            <div>Discount : </div>
                            <div>{saleData.sale.discount}</div>
                        </div>
                        <div className="py-2 flex justify-between">
                            <div>Cash Back : </div>
                            <div>{saleData.sale.cash_back}</div>
                        </div>  
                        <div className="py-2 flex justify-between border-t-2">
                            <div>Total : </div>
                            <div>{saleData.sale.total} Kyats</div>
                        </div>     
                        <div className="py-2 flex justify-between">
                            <div>Amount Paid : </div>
                            <div>{saleData.sale.amount_paid} Kyats</div>
                        </div>                                                
                        <div className="py-2 flex justify-between">
                            <div>Remaining Balance : </div>
                            <div>{saleData.sale.remaining_balance} Kyats</div>
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
                                onClick={handlePrint}
                                className="px-4 py-2 bg-orange-400 text-white rounded"
                            >
                                Print
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DetailModal;
