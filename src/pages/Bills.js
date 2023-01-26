import React, { useEffect, useState, useRef } from "react";
import { Button, Table, Modal} from "antd";
import { useDispatch } from "react-redux";

import axios from "axios";
import DefaultLayout from "../components/DefaultLayout";
import { showLoading } from "../redux/slices/cartSlice";
import { EyeOutlined } from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
const Bills = () => {
  const loading = useSelector((state) => {
    return state.cart.loading;
  });
  const dispatch = useDispatch();
  const [selectedBill, setSelected] = useState(null);
  const componentRef = useRef();
  const [billData, setBill] = useState([]);
  const [billModal, setModal] = useState(false);

  useEffect(() => {
    getAllBills();
       // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getAllBills = () => {
    dispatch(showLoading(true));
    axios
      .get(`https://pos-server-zkti.onrender.com/api/bill/all-bills`)
      .then((response) => {
        const bills = response.data;
        dispatch(showLoading(false));
        setBill(bills);
      })
      .catch((err) => {
        dispatch(showLoading(true));
        toast.error("Something went wrong !", {
          position: toast.POSITION.TOP_CENTER,
        });
        console.log(err);
      });
  };

  const cartColumn = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
    },

    {
      title: "Quantity",
      dataIndex: "cartQuantity",
      render: (id, record) => {
        return <div className="d-flex">{record.cartQuantity}</div>;
      },
    },
    {
      title: "Price",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="d-flex">{record.cartQuantity * record.price}</div>
      ),
    },
  ];

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "ID",
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customer",
    },
    {
      title: "SubTotal",
      dataIndex: "subTotal",
      key: "subtotal",
    },

    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      key: "total",
    },

    {
      title: "Actions",
      key: "actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="d-flex">
          <EyeOutlined
            className="mx-2"
            onClick={() => {
              setSelected(record);
              setModal(true);
            }}
          />
        </div>
      ),
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  if (loading) {
    return <Loader />;
  }

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h3>Bills</h3>
      </div>
      <Table
        columns={columns}
        dataSource={billData}
        onChange={onChange}
        bordered
      />

      {billModal && (
        <Modal
          onCancel={() => {
            setModal(false);
          }}
          open={billData}
          title="Bill Details"
          footer={false}
          width={800}
        >
          <div className="bill-model m-5" ref={componentRef}>
            <div className="d-flex justify-content-between bill-header pb-2">
              <div className="">
                <h1>
                  <b>Produce Market</b>
                </h1>
              </div>
              <div className="">
                <p>Manhattan</p>
                <p>NY,10037</p>
                <p>347 347 0000</p>
              </div>
            </div>
            <div className="customer-details my-2">
              <p>Name: {selectedBill.customerName.toUpperCase()}</p>

              <p>Phone Number: {selectedBill.phoneNumber}</p>

              <p>Date: {selectedBill.createdAt.toString().substring(0, 10)}</p>
            </div>
            <Table
              dataSource={selectedBill.cartItems}
              columns={cartColumn}
              bordered
              pagination={false}
            />
            <div className="dotted-border my-2">
              <p>
                Sub Total: <b>$ {selectedBill.subTotal}</b>
              </p>
              {/*selectedBill.tax*/}
              <p className="pb-2">
                Tax: <b>{selectedBill.tax}</b>
              </p>
            </div>
            {/*billData.totalAmount*/}
            <div className="my-2">
              <h2>
                Total Amount: <b> $ {selectedBill.totalAmount}</b>
              </h2>
            </div>
            <div className="dotted-border "></div>
            <div className="text-center mt-2">
              <p>Thank you for business</p>
              <p>come back again :) !</p>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <Button type="primary" onClick={handlePrint}>
              Print
            </Button>
          </div>
        </Modal>
      )}
      <ToastContainer />
    </DefaultLayout>
  );
};

export default Bills;
