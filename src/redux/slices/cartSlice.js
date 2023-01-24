import { createSlice } from "@reduxjs/toolkit";
import { toast, ToastContainer } from "react-toastify";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    loading: false,
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    cartTotalQuantity: 0,
    cartTotalAmount: 0,
  },

  reducers: {
    //   ======= addToCart====
    addItems: (state, action) => {
      const existingIndex = state.cartItems.findIndex(
        (item) => item._id === action.payload._id
      );

      if (existingIndex >= 0) {
        state.cartItems[existingIndex] = {
          ...state.cartItems[existingIndex],
          cartQuantity: state.cartItems[existingIndex].cartQuantity + 1,
        };
        toast.info("Increased product quantity", {
          position: "bottom-left",
        });
      } else {
        let tempProductItem = { ...action.payload, cartQuantity: 1 };
        state.cartItems.push(tempProductItem);
        toast.success("Product added to cart", {
          position: "bottom-left",
        });
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      <ToastContainer autoClose={2000} />;
    },
    //   ======= remove cart Item====
    removeItem: (state, action) => {
      state.cartItems.map((cartItem) => {
        if (cartItem._id === action.payload._id) {
          const nextCartItems = state.cartItems.filter(
            (item) => item._id !== cartItem._id
          );

          state.cartItems = nextCartItems;

          toast.error("Product removed from cart", {
            position: toast.POSITION.TOP_CENTER,
          });
        }
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        return state;
        <ToastContainer />;
      });
    },
    //   ======= clear cart====
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      toast.error("Cart cleared", { position: toast.POSITION.TOP_CENTER });
    },
    //   ======= increase cart items====
    increase: (state, action) => {
      const existingIndex = state.cartItems.findIndex(
        (item) => item._id === action.payload._id
      );
      state.cartItems[existingIndex] = {
        ...state.cartItems[existingIndex],
        cartQuantity: state.cartItems[existingIndex].cartQuantity + 1,
      };
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    //   ======= decrease cart items====
    decrease: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) => item._id === action.payload._id
      );

      if (state.cartItems[itemIndex].cartQuantity > 1) {
        state.cartItems[itemIndex].cartQuantity -= 1;
      } else if (state.cartItems[itemIndex].cartQuantity === 1) {
        const nextCartItems = state.cartItems.filter(
          (item) => item._id !== action.payload._id
        );

        state.cartItems = nextCartItems;

        toast.error("Product removed from cart", {
          position: toast.POSITION.TOP_CENTER,
        });
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      <ToastContainer autoClose={2000} />;
    },

    getTotals(state, action) {
      let { total, quantity } = state.cartItems.reduce(
        (cartTotal, cartItem) => {
          const { price, cartQuantity } = cartItem;
          const itemTotal = price * cartQuantity;

          cartTotal.total += itemTotal;
          cartTotal.quantity += cartQuantity;

          return cartTotal;
        },
        {
          total: 0,
          quantity: 0,
        }
      );
      total = parseFloat(total.toFixed(2));
      state.cartTotalQuantity = quantity;
      state.cartTotalAmount = total;
    },
    //   ======= showloding====
    showLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  clearCart,
  removeItem,
  increase,
  decrease,
  addItems,
  showLoading,

  getTotals,
} = cartSlice.actions;

export const {
  selectCart,
} = (state) => {
  return state.cart.cartItems;
};

export default cartSlice.reducer;
