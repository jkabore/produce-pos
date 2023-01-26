import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { Table, Button, Modal, Select, Form, Input } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import { showLoading} from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import {
  clearCart,
  removeItem,
  increase,
  decrease,
  
  getTotals,
} from "../redux/slices/cartSlice";

const CartPage = () => {
  const cartItems = useSelector((state) => {
    return state.cart.cartItems;
  });
  const cart = useSelector((state) => {
    return state.cart;
  });
  const dispatch = useDispatch();
  const [subTotal, setSubTotal] = useState(0);

  const [priceModal, setPriceModal] = useState(false);

  useEffect(() => {
    dispatch(getTotals(cartItems));
    setSubTotal(cart.cartTotalAmount);
  }, [cartItems, cart, dispatch]);
  useEffect(() => {}, [subTotal]);

  const navigate = useNavigate();
  const onFinish = (values) => {
    dispatch(showLoading(true));
    const reqObj = {
      ...values,
      cartItems,
      subTotal,
      tax: Number((subTotal / 100).toFixed(2)),
      totalAmount: Number(subTotal + Number((subTotal / 100) * 10)).toFixed(2),
      cashierId: JSON.parse(localStorage.getItem("pos-user"))?._id,
    };
    console.log(reqObj);

    axios
      .post(`https://pos-server-zkti.onrender.com/api/bill/charge-bill`, reqObj)
      .then((res) => {
        const data = res.data;

        toast.success("Bill successfully charged", {
          position: toast.POSITION.TOP_CENTER,
        });
        dispatch(showLoading(false));
        dispatch(clearCart());
        navigate("/bills");
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
      title: "Items",
      dataIndex: "name",
      key: "items",
    },
    {
      title: "Image",
      key: "image",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt="" height="60" width="60" />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Quantity",
      key: "quantity",
      dataIndex: "cartQuantity",
      render: (id, record) => {
        return (
          <div className="d-flex">
            <MinusCircleOutlined
              className="mx-3"
              onClick={() => dispatch(decrease(record))}
            />
            <p>{record.cartQuantity}</p>
            <PlusCircleOutlined
              className="mx-3"
              onClick={() => dispatch(increase(record))}
            />
          </div>
        );
      },
    },

    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => {
        return (
          <div className="d-flex align-items-center ">
            <DeleteOutlined
              className="mb-3"
              onClick={() => dispatch(removeItem(record))}
            />
          </div>
        );
      },
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  return (
    <DefaultLayout>
      {cartItems.length === 0 ? (
        <div className="d-flex cart-text justify-content-center ">
          <h2> Cart Is Empty !</h2>
        </div>
      ) : (
        <Table columns={columns} dataSource={cartItems} onChange={onChange} />
      )}

      {cartItems.length > 1 ? (
        <Button type="primary" onClick={() => dispatch(clearCart())}>
          Clear cart
        </Button>
      ) : null}
      <div className="d-flex justify-content-end flex-column align-items-end">
        <div className="subtotal">
          {cart.cartTotalAmount > 0 ? (
            <h3>
              SUB TOTAL:
              <span className="">
                $<b>{cart.cartTotalAmount}</b>
              </span>
            </h3>
          ) : null}
          {cart.cartTotalAmount > 0 && (
            <Button
              onClick={() => {
                setPriceModal(true);
                dispatch(getTotals());
              }}
              type="primary"
              className="mt-2"
            >
              CHARGE BILL
            </Button>
          )}
        </div>
      </div>
      <ToastContainer />
      <Modal
        title="Charge Bill"
        onCancel={() => setPriceModal(false)}
        open={priceModal}
        footer={false}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="customerName"
            label="customer Name"
            rules={[{ required: true, message: "Customer Name required!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[{ required: true, message: " phone Number required!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="paymentMode"
            label="Payment Mode"
            rules={[{ required: true, message: " Payment Mode required!" }]}
          >
            <Select>
              <Select.Option value="cash">Cash</Select.Option>
              <Select.Option value="card">Card</Select.Option>
            </Select>
          </Form.Item>
          <div className="charge-bill-amount">
            <h5>
              Sub Total: <b>${subTotal}</b>
            </h5>
            <h5>
              {" "}
              Tax: <b>${((subTotal / 100) * 10).toFixed(2)}</b>
            </h5>
            <hr />
            <h2 className="">
              Total:<b>${subTotal + (subTotal / 100) * 10}</b>
            </h2>
          </div>
          <div className="d-flex justify-content-end">
            <Button htmlType="submit" type="primary">
              Generate Bill
            </Button>
          </div>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default CartPage;
