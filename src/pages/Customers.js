import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { useDispatch } from "react-redux";

import axios from "axios";
import DefaultLayout from "../components/DefaultLayout";
import { showLoading } from "../redux/slices/cartSlice";

import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";


const Customer = () => {
  const dispatch = useDispatch();
  
  const [billData, setBill] = useState([]);
 
  const loading = useSelector((state) => {
    return state.cart.loading;
  });
  useEffect(() => {
    getAllBills();
       // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllBills = () => {
    dispatch(showLoading(true));
    axios
      .get(`https://pos-server-zkti.onrender.com/api/bill/all-bills`)
      .then((response) => {
        const bills = response.data;
        //bills.reverse()

        setBill(bills);
        dispatch(showLoading(false));
        
      })
      .catch((err) => {
        dispatch(showLoading(true));
        toast.error("Something went wrong !", {
          position: toast.POSITION.TOP_CENTER,
        });
        console.log(err);
      });
  };

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "customerName",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
    },
    {
      title: "Created on",
      dataIndex: "createdAt",
      render: (value) => <span>{value.toString().substring(0, 10)}</span>,
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  if(loading){
    return <Loader/>
  }


  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h3>Customers</h3>
      </div>
      <Table
        columns={columns}
        dataSource={billData}
        onChange={onChange}
        bordered
      />

      <ToastContainer />
    </DefaultLayout>
  );
};

export default Customer;
