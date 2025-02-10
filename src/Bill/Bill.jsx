import { FaAngleDown } from "react-icons/fa6";

import { useRef, useState } from "react";

import img1 from "../assets/sale/img1.jpg";
import img2 from "../assets/sale/img2.jpg";
import img3 from "../assets/sale/img3.jpg";
import img4 from "../assets/sale/img4.jpg";
import img5 from "../assets/sale/img5.jpg";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FaMinus } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { MdLocalPrintshop } from "react-icons/md";

import PurchaseModal from "./PurchaseModal";

const Bill = () => {

    const [saleData, setSaleData] = useState([
        {
            item_id: 1,
            image_path: img1,
            item_code: "001",
            barcode: "123456789",
            name: "Sayar Ko",
            category: "Cream",
            quantity: 10,
            price: 900,
            expire_date: "2027-12-31",
            alert_date: "2027-11-31",
            remark: "Famous"
        },
        {
            item_id: 2,
            image_path: img2,
            item_code: "002",
            barcode: "1231234",
            name: "Paracap",
            category: "Capsule",
            quantity: 40,
            price: 2700,
            expire_date: "2027-4-31",
            alert_date: "2027-3-31",
            remark: ""
        },
        {
            item_id: 3,
            image_path: img3,
            item_code: "003",
            barcode: "123523",
            name: "Vitamin C",
            category: "Capsule",
            quantity: 100,
            price: 60,
            expire_date: "2027-8-31",
            alert_date: "2027-7-31",
            remark: ""
        },
        {
            item_id: 4,
            image_path: img4,
            item_code: "004",
            barcode: "12325434",
            name: "Decolgen",
            category: "Capsule",
            quantity: 100,
            price: 3500,
            expire_date: "2027-8-31",
            alert_date: "2027-7-31",
            remark: ""
        },
        {
            item_id: 5,
            image_path: img5,
            item_code: "005",
            barcode: "1231512",
            name: "Voltex",
            category: "Cream",
            quantity: 30,
            price: 2000,
            expire_date: "2027-8-31",
            alert_date: "2027-7-31",
            remark: ""
        }
    ]);

    const searchInputRef = useRef(null);
    const doneButtonRef = useRef(null);

    const [filterSearchText, setFilterSearchText] = useState("Barcode");
    const [searchText, setSearchText] = useState("");
    const [foundedQty, setFoundedQty] = useState(0);
    const [foundedItem, setFoundedItem] = useState("");

    const [showPurchaseModal, setShowPurchaseModal] = useState(false);

    const handleCheckout = (e) => {
        e.preventDefault();
        if (e.key === "Enter" || e.type === "click") {
            searchInputRef.current?.focus();
            setSearchText("");
            setFoundedQty(0);
        } else if (e.key === "Tab") {
            doneButtonRef.current?.focus();
        }
    }

    const handleSearchInput = (e) => {
        if (e.key === "Tab") {
            setFoundedItem("");
        }
    }

    const handleDone = (e) => {
        if (e.key === "Enter" || e.type === "click") {
            searchInputRef.current?.focus();
        }
    }

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
                                        <option value="Barcode">BarCode</option>
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
                                    onClick={handleSearchInput}
                                    onKeyDown={handleSearchInput}
                                    onChange={(e) => { setSearchText(e.target.value); setFoundedItem(saleData.find(item => item[filterSearchText] === e.target.value)) }}
                                    className="block min-w-0 grow maxlw-[100px] h-[50px] py-1.5 pr-3 pl-3 text-base  text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                />
                            </div>
                            {foundedItem && (
                                <div className="absolute left-28 w-[110px] m-2 text-xs flex items-center justify-center bg-white p-2 shadow-xl border border-gray-300 rounded-md">
                                    <div className="flex-col sm:flex md:flex items-center justify-center">
                                        <img src={foundedItem.image_path} alt="" className="w-[50px] h-[50px]" />
                                        <div>
                                            <p className="mb-1">{foundedItem.name}</p>
                                            <p>{foundedItem.price}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex">
                        <div className="flex justify-between max-w-[150px] md:mt-0 mr-3">
                            <div>
                                <button
                                    onClick={handleCheckout}
                                    onKeyDown={handleCheckout}
                                    className="flex justify-around px-4 py-4  bg-orange-500 text-white rounded hover:bg-orange-400 text-sm"
                                >
                                    <MdLocalPrintshop className="m-auto" />
                                    <div className="hidden md:block ml-4">Print</div>
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between max-w-[150px] md:mt-0">
                            <div>
                                <button
                                    onClick={() => setShowPurchaseModal(true)}
                                    className="flex justify-around px-4 py-4  bg-blue-500 text-white rounded hover:bg-blue-400 text-sm"
                                >
                                    <FiShoppingCart className="m-auto " />
                                    <div className="hidden md:block ml-4">Checkout</div>
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* <div className="flex justify-between">
                        <div>
                            <div className="flex items-center w-[100px] rounded-md bg-white pl-3 outline -outline-offset-1 outline-gray-300 has-[*:focus-within]:outline-2 has-[*:focus-within]:-outline-offset-2 has-[*:focus-within]:outline-indigo-600">
                                <input
                                    type="text"
                                    placeholder="Enter Qty"
                                    value={foundedQty}
                                    onChange={(e) => { setFoundedQty(e.target.value); }}
                                    className="block min-w-0 grow h-[50px] py-1.5 pr-3 pl-1 text-base  text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                />
                            </div>
                        </div>
                        <div className="flex justify-between max-w-[150px] md:mt-0 mr-3">
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
                    </div> */}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
                <div className="col-span-0 lg:col-span-2 overflow-auto h-[calc(100vh-300px)] md:h-[calc(100vh-200px)]">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr>
                                {["ItemCode", "Name", "quantity", "Price", "Actions"].map((heading) => (
                                    <th key={heading} className="px-2 md:px-4 py-2 text-sm md:text-lg text-center bg-gray-100">
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {saleData.length > 0 ? (
                                saleData.map((data) => (
                                    <tr className="border-b-2" key={data.item_id}>
                                        <td className="px-2 md:px-4 py-2  text-center text-sm">{data.item_id}</td>
                                        <td className="px-2 md:px-4 py-2  text-center text-sm">{data.name}</td>
                                        <td className="px-2 md:px-4 py-2  text-center text-sm">{data.quantity}</td>
                                        <td className="px-2 md:px-4 py-2  text-center text-sm">{data.price}</td>
                                        <td className="px-2 md:px-4 py-2  text-center border-gray-300">
                                            <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
                                                <button
                                                    className="px-3 py-1 md:px-4 md:py-2 bg-red-500 text-white hover:bg-red-400 rounded text-xs md:text-sm"
                                                    onClick={() => handleDelete(data.item_id)}
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
                <div className="border ml-0 md:ml-5 h-[450px] flex flex-col justify-evenly px-5  shadow-lg rounded-lg">
                    <div className="flex flex-col  items-center">
                        <p className="font-bold text-3xl">Shop Name</p>
                        <p className="text-1xl">09-XXXXXXXXX</p>
                    </div>
                    <div className="grid grid-cols-2 font-bold text-2xl text-orange-500">
                        <div>
                            Total:
                        </div>
                        <div>
                            {saleData.reduce((total, item) => total + item.price, 0)} Kyats
                        </div>
                    </div>
                    <div className="grid grid-cols-2 items-center">
                        <div>
                            Discount :
                        </div>
                        <div className="items-center rounded-md bg-white pl-3 outline -outline-offset-1 outline-gray-300 has-[*:focus-within]:outline-2 has-[*:focus-within]:-outline-offset-2 has-[*:focus-within]:outline-indigo-600">
                            <input
                                type="text"
                                placeholder="Enter Discount"
                                // value={foundedQty}
                                // onChange={(e) => { setFoundedQty(e.target.value); }}
                                className="block w-full h-[50px] py-1.5 pr-3 pl-1 text-base  text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 items-center">
                        <div>
                            Cashback
                        </div>
                        <div>
                            <div className="items-center rounded-md bg-white pl-3 outline -outline-offset-1 outline-gray-300 has-[*:focus-within]:outline-2 has-[*:focus-within]:-outline-offset-2 has-[*:focus-within]:outline-indigo-600">
                                <input
                                    type="text"
                                    placeholder="Enter Discount"
                                    // value={foundedQty}
                                    // onChange={(e) => { setFoundedQty(e.target.value); }}
                                    className="block w-full w h-[50px] py-1.5 pr-3 pl-1 text-base  text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 items-center">
                        <div>
                            Debit
                        </div>
                        <div>
                            <div>
                                <div className="items-center rounded-md bg-white pl-3 outline -outline-offset-1 outline-gray-300 has-[*:focus-within]:outline-2 has-[*:focus-within]:-outline-offset-2 has-[*:focus-within]:outline-indigo-600">
                                    <input
                                        type="text"
                                        placeholder="Enter Discount"
                                        // value={foundedQty}
                                        // onChange={(e) => { setFoundedQty(e.target.value); }}
                                        className="block w-full h-[50px] py-1.5 pr-3 pl-1 text-base  text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {
                showPurchaseModal && (
                    <PurchaseModal showModal={showPurchaseModal} closeModal={() => setShowPurchaseModal(false)} handleDone={handleDone} />
                )
            }

            <ToastContainer />
        </div >
    )
}

export default Bill;