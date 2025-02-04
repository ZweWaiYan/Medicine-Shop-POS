import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const DeleteModal = ({ showModal, closeModal, item, onDelete }) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading, isError, error } = useMutation({
    mutationFn: async (itemId) => {
      const url = `http://localhost:3000/api/deleteitem/${itemId}`;
      const method = "delete";

      const response = await axios({ method, url });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["items"]);
      toast.success("Item deleted successfully!");
      closeModal();
      onDelete(item.item_id);
    },
    onError: (err) => {
      toast.error(`An error occurred: ${err.message}`);
    },
  });

  // Handle delete action
  const handleDelete = async () => {
    if (item && item.item_id) {
      await mutateAsync(item.item_id);
    }
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
                        <h2 className="text-2xl font-bold mb-4">Delete item</h2>
                        {console.log(item)}
                        <p>Are you sure you want to delete {item.name}?</p>
                        <div className="mt-4 flex justify-between">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-400 text-white rounded"
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded shadow-md"
                            >
                                Delete
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DeleteModal;