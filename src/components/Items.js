import React from "react";
import { Button } from "antd";
import { useDispatch } from "react-redux";
import { addItems } from "../redux/slices/cartSlice";
import "../ressources/items.css";

const Items = ({ item }) => {
  const dispatch = useDispatch();

  const addToCart = () => {
    dispatch(addItems(item));
  };

  return (
    <div className="item">
      <h4>{item.name}</h4>
      <img src={item.image} alt="" width={100} height={100} />
      <h4 className="item.price">
        <b>Price:</b>${item.price}
      </h4>
      <div className="d-flex justify-content-end">
        <Button onClick={() => addToCart()}>Add To Cart</Button>
      </div>
    </div>
  );
};

export default Items;
