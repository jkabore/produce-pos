import React from "react";
import axios from "axios";
import { Button, Form, Input, Row, Col } from "antd";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "../ressources/auth.css";
import { useDispatch } from "react-redux";
import { showLoading,  } from "../redux/slices/cartSlice";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";

const Register = () => {
  const loading = useSelector((state) => {
    return state.cart.loading;
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = (values) => {
    dispatch(showLoading(true));
    axios
      .post(`/api/user/register`, values)
      .then((res) => {
        dispatch(showLoading(false));
        toast.success(
          "successfully registered ! Please wait for verification",
          {
            position: toast.POSITION.TOP_CENTER,
          }
        );
        navigate("/");
      })
      .catch((err) => {
        dispatch(showLoading(true));
        toast.error("Something went wrong !", {
          position: toast.POSITION.TOP_CENTER,
        });
        console.log(err);
      });
  };
  if(loading){
    return <Loader/>
  }
  return (
    <div className="auth">
      <Row lg={10} xs={22}>
        <Col>
          <Form
            layout="vertical"
            //initialValues={editingItem}
            onFinish={onFinish}
          >
            <h1>
              <b>PRODUCE POS</b>
            </h1>
            <hr />
            <h3>Register</h3>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Name required!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="userName"
              label="Username"
              rules={[{ required: true, message: "User name required!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Password required!",
                },
              ]}
            >
              <Input type="password" />
            </Form.Item>

            <div className="d-flex justify-content-between mb-2 align-items-center">
              <span>
                Already registered?
                <Link style={{ textDecoration: "none" }} to="/">
                  Login here !
                </Link>
              </span>
              <Button className="mt-2" htmlType="submit" type="primary mb-2">
                Register
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
