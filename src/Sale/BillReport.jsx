import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { FaFilter } from "react-icons/fa6";
import detail from "../assets/detail.png";
import { FaAngleDown } from "react-icons/fa6";

import BillReportFilterModal from "../Sale/BillReportFilterModal";
import DetailModal from "./DetailModal";

import generatePDF from "../Bill/generatePdf";
import BillReportgeneratePDF from "../Bill/BillReportgeneratePDF";

const fetchSaleData = async () => {
  const { data } = await axios.get("/api/fetchsales");
  return data;
};

const BillReport = () => {

  const { data: saleData, isLoading, error } = useQuery({
    queryKey: ["saleData"],
    queryFn: fetchSaleData,
  });

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDetailModal, setDetailModal] = useState(false);
  const [currentDetail, setCurrentDetail] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [filterSearchText, setFilterSearchText] = useState("bill_id");
  const [filteredDate, setFilteredDate] = useState({
    selectedSingleDate: null,
    selectedStartDate: null,
    selectedEndDate: null,
    selectedAmount: null,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleDetail = (sale_id) => {
    const item = saleData.find((row) => row.sale_id === sale_id);
    setCurrentDetail(item);
    setDetailModal(true);
  }

  const resetFilter = () => {
    setFilteredDate({
      selectedAmount: null,
      selectedSingleDate: null,
      selectedStartDate: null,
      selectedEndDate: null,
    });

    toast.success("successfully Clear Filtering!");
  }

  const filteredSaleDate = saleData.filter(item => {

    const matchesSearchText = filterSearchText === "bill_id"
      ? item.sale_id?.toLowerCase().includes(searchText.toLowerCase())
      : true;

    const d = new Date(item.date);
    const formattedDate = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;

    const matchesFilters =
      (!filteredDate.selectedSingleDate || formattedDate === filteredDate.selectedSingleDate) &&
      (!filteredDate.selectedStartDate && !filteredDate.selectedEndDate || formattedDate >= filteredDate.selectedStartDate && formattedDate <= filteredDate.selectedEndDate) &&
      (!filteredDate.selectedAmount || item.amount_paid <= filteredDate.selectedAmount)

    return matchesSearchText && matchesFilters;
  })
    .sort((a, b) => filteredDate.selectedAmount ? a.amount_paid - b.amount_paid : a.date - b.date)
    .map(({ date, ...rest }) => {
      const d = new Date(date);
      return {
        ...rest,        
        date : `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`
      };
    });

  const handlePrint = () => {    
    BillReportgeneratePDF(filteredSaleDate.slice(0,10));
  }


  const handleFilterFunc = (selectedSingleDate, selectedStartDate, selectedEndDate, selectedAmount) => {
    setFilteredDate({ selectedSingleDate, selectedStartDate, selectedEndDate, selectedAmount });
    toast.success("Filtered Successfully!");
  };

  return (
    <div className="p-4 w-full">
      <div className="flex flex-col md:flex-row justify-between pb-7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-3 w-full">
          <div>
            <div className="mt-2">
              <div className="flex items-center rounded-md bg-white pl-3 outline -outline-offset-1 outline-gray-300 has-[*:focus-within]:outline-2 has-[*:focus-within]:-outline-offset-2 has-[*:focus-within]:outline-indigo-600">
                <input
                  type="text"
                  placeholder="Search Bill ID....."
                  onChange={(e) => { setSearchText(e.target.value); }}
                  className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base  text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-4 md:mt-0">
            <FaFilter
              onClick={() => { setShowFilterModal(!showFilterModal) }}
              className="h-6 w-6 text-gray-500 ml-4 my-4 cursor-pointer"
            />
            <div>
              <button
                onClick={resetFilter}
                className="px-4 py-2 mr-5 h-[50px] bg-red-500 text-white rounded hover:bg-red-400 text-sm"
              >
                {/* <MdOutlineCreateNewFolder /> */}
                Clear
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 h-[50px] bg-orange-500 text-white rounded hover:bg-orange-400 text-sm"
              >
                {/* <MdOutlineCreateNewFolder /> */}
                Print
              </button>
            </div>
          </div>
        </div>
      </div>

      {
        showFilterModal && (
          <BillReportFilterModal showModal={showFilterModal} closeModal={() => setShowFilterModal(false)} handleFilter={handleFilterFunc} />
        )
      }

      {
        showDetailModal && (
          <DetailModal showModal={showDetailModal} closeModal={() => setDetailModal(false)} item={currentDetail} />
        )
      }

      <div className="overflow-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              {["ID", "Date", "Discount", "Cash Back", "Total", "Amount Paid", "Remain Balance","Action"].map((heading) => (
                <th key={heading} className="px-2 md:px-4 py-2 border text-sm md:text-lg text-center bg-gray-100">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredSaleDate.length > 0 ? (
              filteredSaleDate.slice(0,10).map((data) => (
                <tr key={data.sale_id}>
                  <td className="px-2 md:px-4 py-2 border text-center text-sm">{data.sale_id}</td>
                  <td className="px-2 md:px-4 py-2 border text-center text-sm">
                    {data.date}
                  </td>
                  <td className="px-2 md:px-4 py-2 border text-center text-sm">{data.discount}</td>
                  <td className="px-2 md:px-4 py-2 border text-center text-sm">{data.cash_back}</td>
                  <td className="px-2 md:px-4 py-2 border text-center text-sm">{data.total}</td>
                  <td className="px-2 md:px-4 py-2 border text-center text-sm">{data.amount_paid}</td>
                  <td className="px-2 md:px-4 py-2 border text-center text-sm">{data.remaining_balance}</td>                  
                  <td className="px-2 md:px-4 py-2 border text-center border-gray-300">
                    <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
                      <button
                        className="px-3 py-1 md:px-4 md:py-2 bg-green-500 text-white hover:bg-green-400 rounded text-xs md:text-sm"
                        onClick={() => handleDetail(data.sale_id)}
                      >
                        <img className="w-5" src={detail} alt="" />
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

      <ToastContainer />
    </div >

  );
};

export default BillReport;