import React from "react";
import axios from "axios";
import { Button, Form, Input, Select } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "../ressources/auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { showLoading } from "../redux/slices/cartSlice";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
const Login = () => {
  const loading = useSelector((state) => {
    return state.cart.loading;
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = (values) => {
    dispatch(showLoading(true));
    axios
      .post(`${process.env.REACT_APP_API}/api/user/login`, values)
      .then((res) => {
        localStorage.setItem("pos-user", JSON.stringify(res.data));
        dispatch(showLoading(false));
        toast.success("successfully logged in!", {
          position: toast.POSITION.TOP_CENTER,
        });
        navigate("/home");
      })
      .catch((err) => {
        dispatch(showLoading(true));
        console.log(err);
        toast.error("Something went wrong !", {
          position: toast.POSITION.TOP_CENTER,
        });
        //console.log(err);
      });
  };
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="auth">
      <Form
        layout="vertical"
        //initialValues={editingItem}
        onFinish={onFinish}
      >
        <h1>
          <b>PRODUCE POS</b>
        </h1>
        <hr />
        <h3>Login</h3>
        <Form.Item
          name="userName"
          label="Username"
          rules={[{ required: true, message: "User Name required!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Password required!" }]}
        >
          <Input type="password" />
        </Form.Item>

        <div className="d-flex justify-content-between align-items-center">
          <span>
            {" "}
            Not yet registered?{" "}
            <Link style={{ textDecoration: "none" }} to="/register">
              Register here !
            </Link>
          </span>
          <Button className="mt-2" htmlType="submit" type="primary mb-2">
            Login
          </Button>
        </div>
      </Form>
      <ToastContainer />
    </div>
  );
};

export default Login;
