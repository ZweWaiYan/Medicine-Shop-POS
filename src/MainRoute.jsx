import React from 'react'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from './Dashboard/Dashboard';
import Layout from './Layout';
import ItemList from './Item/ItemList';
import BillList from './Bill/BillList';
import BillReport from './Bill/BillReport/BillReport';


const MainRoute = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ItemList" element={<ItemList />} />
          <Route path="/BillList" element={<BillList />} />
          <Route path="/BillReport" element={<BillReport />} />
        </Route>
      </Routes>
    </Router>
  )
}
export default MainRoute;