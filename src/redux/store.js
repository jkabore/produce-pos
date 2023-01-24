import { configureStore } from "@reduxjs/toolkit";
import cartItems from "./slices/cartSlice";

export default configureStore({
  reducer: {
    cart: cartItems,
    
  },
  devTools: true
});
