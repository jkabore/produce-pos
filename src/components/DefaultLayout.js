import React, { useState, useEffect } from "react";

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  CopyOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

import { useSelector } from "react-redux";
import { Layout, Menu } from "antd";
import "../ressources/layout.css";
import { useNavigate, useLocation } from "react-router-dom";


const { Header, Sider, Content } = Layout;

const DefaultLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState("/home");
  const cartItems = useSelector((state) => {
    return state.cart.cartItems;
  });
 
 
  useEffect(() => {}, [cartItems]);
  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys(pathName);
  }, [location.pathname]);
  const navigate = useNavigate();

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={0}
        breakpoint={"xs"}
      >
        <div className="logo">
          <h3>{collapsed ? "PP" : "Produce Pos"}</h3>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          onClick={(item) => {
            //item.key
            if (item.key === "/logout") {
              localStorage.removeItem("pos-user");
              navigate("/");
            } else {
              navigate(item.key);
            }
          }}
          selectedKeys={[selectedKeys]}
          items={[
            {
              key: "/home",
              icon: <HomeOutlined />,
              label: "Home",
            },
            {
              key: "/cart",

              icon: <ShoppingCartOutlined />,
              label: "Cart",
            },
            {
              key: "/bills",

              icon: <CopyOutlined />,
              label: "Bills",
            },
            {
              key: "/items",

              icon: <UnorderedListOutlined />,
              label: "Items",
            },
            {
              key: "/customers",

              icon: <UserOutlined />,
              label: "Customers",
            },
            {
              key: "/logout",
              icon: <LogoutOutlined />,
              label: "Logout",
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 10,
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <div
            className="cart-count d-flex align-items-center "
            onClick={() => navigate("/cart")}
          >
            <p className="mt-3 mr-2 fw-bold">{cartItems.length}</p>
            <ShoppingCartOutlined />
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "10px",
            padding: 24,
          }}
        >
          {/* { loading &&( <div className="spinner">
            <div className="spinner-border" role="status">

        </div>*
        </div>)}*/}

          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
export default DefaultLayout;
