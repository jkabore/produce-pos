import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import axios from "axios";

import { useDispatch } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import "../ressources/items.css";
import Item from "../components/Items";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import { showLoading } from "../redux/slices/cartSlice";
const HomePage = () => {
  const [itemData, setData] = useState([]);
  const [selectedCategory, setCategory] = useState("fruits");
  const loading = useSelector((state) => {
    return state.cart.loading;
  });

  const categories = [
    {
      name: "fruits",
      imageUrl:
        "https://cf.ltkcdn.net/wine/images/std/165373-800x532r1-grapes.jpg",
    },
    {
      name: "vegetables",
      imageUrl:
        "https://www.jiomart.com/images/product/original/590004102/brinjal-purple-striped-500-g-0-20201118.jpg",
    },
    {
      name: "meat",
      imageUrl:
        "https://subsistence.wiki/w/images/0/0f/Whole_Chicken_%28Raw%29-icon.png",
    },
  ];
  useEffect(() => {
    getAllItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const dispatch = useDispatch();

  const getAllItems = () => {
    dispatch(showLoading(true));
    axios
      .get(`https://pos-server-zkti.onrender.com/api/item/items/all-items`)
      .then((response) => {
        const items = response.data;

        setData(items);
        dispatch(showLoading(false));
      })
      .catch((err) => {
        dispatch(showLoading(true));
        console.log(err);
      });
  };
  if (loading) {
    return <Loader />;
  }
  return (
    <DefaultLayout>
      <div className="d-flex cat ">
        {categories.map((category) => {
          return (
            <div
              onClick={() => setCategory(category.name)}
              className={`d-flex category flex-wrap${
                selectedCategory === category.name && "selected-category"
              }`}
              key={`${category.name}-${Math.floor(Math.random())}`}
            >
              <h4>{category.name}</h4>
              <img src={category.imageUrl} alt="" height={50} width={80} />
            </div>
          );
        })}
      </div>
      <Row gutter={18}>
        {itemData
          .filter((i) => i.category === selectedCategory)
          .map((item) => (
            <Col
              key={`${item.name}-${Math.floor(Math.random())}`}
              xs={24}
              lg={6}
              md={12}
              sm={6}
            >
              <Item
                item={item}
                key={`${item.name}-${Math.floor(Math.random())}`}
              />
            </Col>
          ))}
      </Row>
    </DefaultLayout>
  );
};

export default HomePage;
