import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import DeleteModal from "./DeleteModal";
import Modal from "./Modal";

import img1 from "../assets/sale/img1.jpg";
import img2 from "../assets/sale/img2.jpg";
import img3 from "../assets/sale/img3.jpg";
import img4 from "../assets/sale/img4.jpg";
import img5 from "../assets/sale/img5.jpg";

import { FaFilter } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";
import { TbEdit } from "react-icons/tb";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineCreateNewFolder } from "react-icons/md";

import FilterModal from "./FilterModal";

const fetchSaleData = async () => {
  const { data } = await axios.get("/api/allitems");
  console.log(data)
  return data;
};

const Sale = () => {
/*
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

  ]);*/

  const { data: saleData, isLoading, error } = useQuery({
    queryKey: ["saleData"],
    queryFn: fetchSaleData,
  });

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [currentItem, setCurrentItem] = useState(null);
  const [deleteCurrentItem, setDeleteCurrentItem] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [filterSearchText, setFilterSearchText] = useState("item_code");

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleCreate = () => {
    console.log(filterSearchText);
    setCurrentItem(null);
    setShowModal(true);
  };

  const handleEdit = (item_id) => {
    const item = saleData.find((row) => row.item_id === item_id);
    setCurrentItem(item);
    setShowModal(true);
  };

  const handleDelete = (item_id) => {
    const item = saleData.find((row) => row.item_id === item_id);
    setDeleteCurrentItem(item);
    setShowDeleteModal(true);
  };

  const doCreate = () => {
    console.log("do save");
  };

  const doDelete = () => {
    console.log("do delete")
  };

  // Filtered data based on search 
  const filteredSaleData = saleData.filter((item) => {
    switch (filterSearchText) {
      case "Item Code":
        return item.item_code && item.item_code.toLowerCase().includes(searchText.toLowerCase()); 
      case "Barcode":
        return item.barcode && item.barcode.toLowerCase().includes(searchText.toLowerCase()); 
      case "Name":
        return item.name && item.name.toLowerCase().includes(searchText.toLowerCase());    
      default:
        return item.item_code && item.item_code.toLowerCase().includes(searchText.toLowerCase()); 
        break;
    }        
  });


  return (
    <div className="p-4 w-full">
      <div className="flex flex-col md:flex-row justify-between pb-7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-3 w-full">
          <div>
            <div className="mt-2">
              <div className="flex items-center rounded-md bg-white pl-3 outline -outline-offset-1 outline-gray-300 has-[*:focus-within]:outline-2 has-[*:focus-within]:-outline-offset-2 has-[*:focus-within]:outline-indigo-600">
                <input
                  type="text"
                  placeholder="Search....."
                  onChange={(e) => { setSearchText(e.target.value); }}
                  className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base  text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                />
                <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                  <select
                    value={filterSearchText}
                    onChange={(e) => { setFilterSearchText(e.target.value) }}
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pr-7 pl-3 text-base text-gray-500 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                  >
                    <option value="item_code">item_code</option>
                    <option value="Barcode">BarCode</option>
                    <option value="Name">Name</option>
                  </select>
                  <FaAngleDown
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-4 md:mt-0">
            <FaFilter
              onClick={() => setShowFilterModal(!showFilterModal)}

              className="h-6 w-6 text-gray-500 ml-4 my-4 cursor-pointer"
            />
            <button
              onClick={handleCreate}
              className="px-4 py-2 h-[50px] bg-blue-500 text-white rounded hover:bg-blue-400 text-sm"
            >
              {/* <MdOutlineCreateNewFolder /> */}
              Create
            </button>
          </div>
        </div>
      </div>

      {
        showFilterModal && (
          <FilterModal showModal={showFilterModal} closeModal={() => setShowFilterModal(false)} />
        )
      }

      <div className="overflow-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              {["Image", "item_code", "Barcode", "Name", "Category", "quantity", "Price", "expire_date", "Remark", "Actions"].map((heading) => (
                <th key={heading} className="px-2 md:px-4 py-2 border text-sm md:text-lg text-center bg-gray-100">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredSaleData.length > 0 ? (
              filteredSaleData.map((data) => (
                <tr key={data.item_id} className="h-12">
                  <td className="px-2 md:px-4 py-2 border">
                    <img src={data.image_path} alt="" className="w-12 h-12 md:w-16 md:h-16 m-auto" />
                  </td>
                  <td className="px-2 md:px-4 py-2 border text-center text-sm">{data.item_code}</td>
                  <td className="px-2 md:px-4 py-2 border text-center text-sm">{data.barcode}</td>
                  <td className="px-2 md:px-4 py-2 border text-center text-sm">{data.name}</td>
                  <td className="px-2 md:px-4 py-2 border text-center text-sm">{data.category}</td>
                  <td className="px-2 md:px-4 py-2 border text-center text-sm">{data.quantity}</td>
                  <td className="px-2 md:px-4 py-2 border text-center text-sm">{data.price}</td>
                  <td className="px-2 md:px-4 py-2 border text-center text-sm">{data.expire_date ? data.expire_date.split("T")[0] : "Doesn't Expire"}</td>
                  <td className="px-2 md:px-4 py-2 border text-center text-sm">{data.remark}</td>
                  <td className="px-2 md:px-4 py-2 border text-center">
                    <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
                      <button
                        className="px-3 py-1 md:px-4 md:py-2 bg-green-500 text-white hover:bg-green-400 rounded text-xs md:text-sm"
                        onClick={() => handleEdit(data.item_id)}
                      >
                        <TbEdit />
                      </button>
                      <button
                        className="px-3 py-1 md:px-4 md:py-2 bg-red-500 text-white hover:bg-red-400 rounded text-xs md:text-sm"
                        onClick={() => handleDelete(data.item_id)}
                      >
                        <AiOutlineDelete />
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

      <Modal showModal={showModal} closeModal={() => setShowModal(false)} item={currentItem} onSave={doCreate} tableData={saleData} />

      {
        deleteCurrentItem && (
          <DeleteModal
            showModal={showDeleteModal}
            closeModal={() => setShowDeleteModal(false)}
            item={deleteCurrentItem}
            onDelete={doDelete}
          />
        )
      }

      <ToastContainer />
    </div >

  );
};

export default Sale;