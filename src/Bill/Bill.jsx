import { FaAngleDown } from "react-icons/fa6";

import { useRef, useState } from "react";
import axios from "axios";

import img1 from "../assets/sale/img1.jpg";
import img2 from "../assets/sale/img2.jpg";
import img3 from "../assets/sale/img3.jpg";
import img4 from "../assets/sale/img4.jpg";
import img5 from "../assets/sale/img5.jpg";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "@tanstack/react-query";

import { FaMinus } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";

import PurchaseModal from "./PurchaseModal";
import generatePDF from "./generatePdf";

const fetchSaleData = async () => {
    const { data } = await axios.get("/api/allitems");
    console.log(data)
    return data;
  };


const generateSaleId = () => {
    const date = new Date();
    const formattedDate = date.toISOString().split("T")[0].replace(/-/g, "");

    const randomFourDigits = Math.floor(1000 + Math.random() * 9000);

    return `${formattedDate}${randomFourDigits}`;
};


const Bill = () => {

    const { data: saleData, isLoading, error } = useQuery({
    queryKey: ["saleData"],
    queryFn: fetchSaleData,
    });

    const searchInputRef = useRef(null);
    const doneButtonRef = useRef(null);

    const [filterSearchText, setFilterSearchText] = useState("barcode");
    const [searchText, setSearchText] = useState("");
    const [foundedquantity, setFoundedquantity] = useState(1);
    const [foundedItem, setFoundedItem] = useState("");
    const [cart, setCart] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    //const [quantity, setQuantity] = useState(1);

    const [showPurchaseModal, setShowPurchaseModal] = useState(false);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
/*
    const handleCheckout = (e) => {
        //e.preventDefault();
        
        if (e.key === "Enter" || e.type === "click") {
            const item = saleData.find(item => item[filterSearchText] === searchText);
            
            if (!item) {
                toast.error("Item not found!");
                return;
            }
    
            setCart([...cart, { ...item, quantity }]);
            setSearchText("");
            setFoundedItem(null);
            setSuggestions([]);
            setQuantity(1);
            searchInputRef.current?.focus();
        } else if (e.key === "Tab") {
            doneButtonRef.current?.focus();
        }
    };*/

    const handleCheckout = (inputValue) => {
        // Find item by barcode or item_code
        const item = saleData.find(item => item.barcode === inputValue || item.item_code === inputValue);
        
        if (!item) {
            toast.error("Item not found!");
            return;
        }
    
        const existingItemIndex = cart.findIndex(cartItem => cartItem.barcode === item.barcode || cartItem.item_code === item.item_code);
    
        setCart(prevCart => {
            if (existingItemIndex !== -1) {
                return prevCart.map((cartItem, index) =>
                    index === existingItemIndex ? { ...cartItem, quantity: cartItem.quantity + foundedquantity } : cartItem
                );
            } else {
                return [...prevCart, { ...item, quantity: foundedquantity }];
            }
        });
    
        setSearchText("");
        setFoundedItem(null);
        setSuggestions([]);
        setFoundedquantity(1);
        searchInputRef.current?.focus();
    };
    
/*     
      const handleSearchInput = (e) => {
        const query = e.target.value;
        setSearchText(query);
      
        if (query.length > 0) {
          const filtered = saleData.filter(item =>
            item[filterSearchText].toLowerCase().includes(query.toLowerCase())
          );
          setSuggestions(filtered);
        } else {
          setSuggestions([]);
        }
      
        const item = saleData.find(i => i.barcode === query);
        if (item) {
          handleCheckout(query);
        }
      };
*/
      const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchText(query);
      
        const matchedItem = saleData.find(item =>
          item[filterSearchText]?.toLowerCase() === query.toLowerCase().trim()
        );
        setFoundedItem(matchedItem);
      
        if (matchedItem && filterSearchText === 'barcode'|| matchedItem && filterSearchText === 'item_code') {
          handleCheckout(query);
        }
      };

      const handleSearchKeyDown = (e) => {
        if (filterSearchText === 'item_code' && e.key === 'Enter') {
          const query = e.target.value;
          const matchedItem = saleData.find(item =>
            item[filterSearchText]?.toLowerCase() === query.toLowerCase().trim()
          );

          console.log(matchedItem)
          
          if (matchedItem) {
            handleCheckout(query);
          } else {
            console.log(matchedItem)
            toast.error("Item not found!");
          }
        }
      };
    
    

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleDone = async (e) => {
        if (e.key === "Enter" || e.type === "click") {
            searchInputRef.current?.focus();
    
            if (cart.length === 0) {
                toast.error("Cart is empty!");
                return;
            }
    
            const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            const discount = 0;
            const cashBack = 0;
            const total = subtotal - discount - cashBack;
            const amountPaid = total;
    
            const saleData = {
                saleId: generateSaleId(),
                date: new Date().toISOString().slice(0, 19).replace("T", " "),
                subtotal,
                discount,
                cashBack,
                total,
                amountPaid,
                remainingBalance: total - amountPaid,
                items: cart.map(item => ({
                    item_code: item.item_code,
                    barcode: item.barcode,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                }))
            };
    
            try {
                await axios.post("/api/salesreport", saleData);
                toast.success("Sale recorded successfully!");
    
                generatePDF(cart,saleData);
    
                setCart([]);
    
                toast.success("Transaction completed!");
            } catch (error) {
                console.error("Error in handleDone:", error);
                toast.error("Transaction failed. Please try again.");
            }
        }
    };
    

    const handleRemove = (itemId) => {
        setCart(cart.filter(item => item.item_id !== itemId));
    };
/*
    const updateInventory = async () => {
        try {
            for (const item of cart) {
                await axios.put(`/api/updateQuantity/${item.item_id}`, { quantity: item.quantity });
            }
            toast.success("Purchase successful! Inventory updated.");
        } catch (error) {
            toast.error("Failed to update inventory.");
            console.error("Error updating inventory:", error);
        }
    };
*/
    return (
        <div className="p-4 w-full flex-col justify-between">
            <div className="flex flex-col md:flex-row justify-between pb-7">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    <div className="col-span-2">
                        <div className="relative">
                            <div className="flex  items-center rounded-md bg-white pl-3 outline -outline-offset-1 outline-gray-300 has-[*:focus-within]:outline-2 has-[*:focus-within]:-outline-offset-2 has-[*:focus-within]:outline-indigo-600">
                                <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                                    <select
                                        value={filterSearchText}
                                        onChange={(e) => { setFilterSearchText(e.target.value) }}
                                        className="col-start-1 row-start-1 w-full border-r-2 border-gray-300 appearance-none py-1.5 pr-7 text-base text-gray-500 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                    >
                                        <option value="barcode">BarCode</option>
                                        <option value="item_code">item_code</option>
                                    </select>
                                    <FaAngleDown
                                        aria-hidden="true"
                                        className="pointer-events-none col-start-1 row-start-1 pl-2 mr-3 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search....."
                                    ref={searchInputRef}
                                    value={searchText}
                                    onChange={handleSearchChange}
                                    onKeyDown={handleSearchKeyDown}
                                    className="block min-w-0 grow h-[50px] py-1.5 pr-3 pl-3 text-base  text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                />
                            </div>
                            {foundedItem && (
                                <div className="absolute left-28 w-auto m-2 text-xs bg-white p-2 shadow-xl border border-gray-300 rounded-md">
                                    <table className="min-w-full border-collapse border border-gray-300">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="px-2 py-1 border text-center">Image</th>
                                                <th className="px-2 py-1 border text-center">Name</th>
                                                <th className="px-2 py-1 border text-center">Price</th>
                                                <th className="px-2 py-1 border text-center">In stock</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="px-2 py-1 border text-center">
                                                    <img src={foundedItem.image_path} alt="" className="w-12 h-12" />
                                                </td>
                                                <td className="px-2 py-1 border text-center">{foundedItem.name}</td>
                                                <td className="px-2 py-1 border text-center">{foundedItem.price}</td>
                                                <td className="px-2 py-1 border text-center">{foundedItem.quantity}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <div className="flex items-center w-[100px] rounded-md bg-white pl-3 outline -outline-offset-1 outline-gray-300 has-[*:focus-within]:outline-2 has-[*:focus-within]:-outline-offset-2 has-[*:focus-within]:outline-indigo-600">
                                <input
                                    type="text"
                                    placeholder="Enter quantity"
                                    value={foundedquantity}
                                    onChange={(e) => { setFoundedquantity(e.target.value); }}
                                    className="block min-w-0 grow h-[50px] py-1.5 pr-3 pl-1 text-base  text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                />
                            </div>
                        </div>
                        <div className="flex justify-between max-w-[150px] md:mt-0">
                            <div>
                                <button
                                    onClick={handleCheckout}
                                    onKeyDown={handleCheckout}
                                    className="flex justify-around px-4 py-4  bg-blue-500 text-white rounded hover:bg-blue-400 text-sm"
                                >
                                    <FiShoppingCart className="m-auto " />
                                    <div className="hidden md:block ml-4">Checkout</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="overflow-auto h-[calc(100vh-300px)] md:h-[calc(100vh-200px)]">
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            {["Image", "Name", "quantity", "Price", "Actions"].map((heading) => (
                                <th key={heading} className="px-2 md:px-4 py-2 text-sm md:text-lg text-center bg-gray-100">
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {saleData.length > 0 ? (
                            cart.map((data) => (
                                <tr className="border-b-2" key={data.item_id}>
                                    <td className="px-2 md:px-4 py-2 ">
                                        <img src={data.image_path} alt="" className="w-12 h-12 md:w-16 md:h-16 m-auto" />
                                    </td>
                                    <td className="px-2 md:px-4 py-2  text-center text-sm">{data.name}</td>
                                    <td className="px-2 md:px-4 py-2  text-center text-sm">{data.quantity}</td>
                                    <td className="px-2 md:px-4 py-2  text-center text-sm">{data.price * data.quantity} Kyats</td>
                                    <td className="px-2 md:px-4 py-2  text-center border-gray-300">
                                        <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
                                            <button
                                                className="px-3 py-1 md:px-4 md:py-2 bg-red-500 text-white hover:bg-red-400 rounded text-xs md:text-sm"
                                                onClick={() => handleRemove(data.item_id)}
                                            >
                                                <FaMinus />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="h-12">
                                <td colSpan="10" className="px-4 py-2 border text-center text-gray-500 text-sm">
                                    No matching sale found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between p-3 mt-3">
                <div className="mt-2.5 text-2xl md:text-3xl font-bold text-orange-500">
                    Total: {calculateTotal()} Kyats
                </div>
                <div>
                    <button
                        ref={doneButtonRef}
                        onClick={() => setShowPurchaseModal(true)}
                        className="flex justify-around px-4 py-3 mt-1 bg-green-500 text-white rounded hover:bg-green-400 text-sm"
                    >
                        <FaCheck className="m-auto" />
                        <div className="hidden md:block ml-4">Done</div>
                    </button>
                </div>
            </div>

            {
                showPurchaseModal && (
                    <PurchaseModal showModal={showPurchaseModal} closeModal={() => setShowPurchaseModal(false)} handleDone={handleDone} generatePDF={generatePDF} />
                )
            }

            <ToastContainer />
        </div >
    )
}

export default Bill;