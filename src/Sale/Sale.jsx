import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const Sale = () => {

  const [saleData, setSaleData] = useState([
    {
      id: 1,
      img: img1,
      itemCode: "001",
      barcode: "123456789",
      name: "Sayar Ko",
      category: "Cream",
      qty: 10,
      price: 900,
      expireDate: "2027-12-31",
      alertDate: "2027-11-31",
      remark: "Famous"
    },
    {
      id: 2,
      img: img2,
      itemCode: "002",
      barcode: "1231234",
      name: "Paracap",
      category: "Capsule",
      qty: 40,
      price: 2700,
      expireDate: "2027-4-31",
      alertDate: "2027-3-31",
      remark: ""
    },
    {
      id: 3,
      img: img3,
      itemCode: "003",
      barcode: "123523",
      name: "Vitamin C",
      category: "Capsule",
      qty: 100,
      price: 60,
      expireDate: "2027-8-31",
      alertDate: "2027-7-31",
      remark: ""
    },
    {
      id: 4,
      img: img4,
      itemCode: "004",
      barcode: "12325434",
      name: "Decolgen",
      category: "Capsule",
      qty: 100,
      price: 3500,
      expireDate: "2027-8-31",
      alertDate: "2027-7-31",
      remark: ""
    },
    {
      id: 5,
      img: img5,
      itemCode: "005",
      barcode: "1231512",
      name: "Voltex",
      category: "Cream",
      qty: 30,
      price: 2000,
      expireDate: "2027-8-31",
      alertDate: "2027-7-31",
      remark: ""
    }

  ]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [currentItem, setCurrentItem] = useState(null);
  const [deleteCurrentItem, setDeleteCurrentItem] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [filterSearchText, setFilterSearchText] = useState("ItemCode");

  const handleCreate = () => {
    console.log(filterSearchText);
    setCurrentItem(null);
    setShowModal(true);
  };

  const handleEdit = (id) => {
    const user = saleData.find((row) => row.id === id);
    setCurrentItem(user);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const user = saleData.find((row) => row.id === id);
    setDeleteCurrentItem(user);
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
      case "ItemCode":
        return item.itemCode && item.itemCode.toLowerCase().includes(searchText.toLowerCase()); 
      case "Barcode":
        return item.barcode && item.barcode.toLowerCase().includes(searchText.toLowerCase()); 
      case "Name":
        return item.name && item.name.toLowerCase().includes(searchText.toLowerCase());    
      default:
        return item.itemCode && item.itemCode.toLowerCase().includes(searchText.toLowerCase()); 
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
                    <option value="ItemCode">ItemCode</option>
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
              {["Image", "ItemCode", "Barcode", "Name", "Category", "Qty", "Price", "ExpireDate", "Remark", "Actions"].map((heading) => (
                <th key={heading} className="px-2 md:px-4 py-2 border text-sm md:text-lg text-center bg-gray-100">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredSaleData.length > 0 ? (
              filteredSaleData.map((data) => (
                <tr key={data.id} className="h-12">
                  <td className="px-2 md:px-4 py-2 border">
                    <img src={data.img} alt="" className="w-12 h-12 md:w-16 md:h-16 m-auto" />
                  </td>
                  <td className="px-2 md:px-4 py-2 border text-center text-sm">{data.itemCode}</td>
                  <td className="px-2 md:px-4 py-2 border text-center text-sm">{data.barcode}</td>
                  <td className="px-2 md:px-4 py-2 border text-center text-sm">{data.name}</td>
                  <td className="px-2 md:px-4 py-2 border text-center text-sm">{data.category}</td>
                  <td className="px-2 md:px-4 py-2 border text-center text-sm">{data.qty}</td>
                  <td className="px-2 md:px-4 py-2 border text-center text-sm">{data.price}</td>
                  <td className="px-2 md:px-4 py-2 border text-center text-sm">{data.expireDate}</td>
                  <td className="px-2 md:px-4 py-2 border text-center text-sm">{data.remark}</td>
                  <td className="px-2 md:px-4 py-2 border text-center">
                    <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
                      <button
                        className="px-3 py-1 md:px-4 md:py-2 bg-green-500 text-white hover:bg-green-400 rounded text-xs md:text-sm"
                        onClick={() => handleEdit(data.id)}
                      >
                        <TbEdit />
                      </button>
                      <button
                        className="px-3 py-1 md:px-4 md:py-2 bg-red-500 text-white hover:bg-red-400 rounded text-xs md:text-sm"
                        onClick={() => handleDelete(data.id)}
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