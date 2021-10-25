import Cookies from "js-cookie";
import cookieCutter from "cookie-cutter";
import { loadGetInitialProps } from "next/dist/shared/lib/utils";
import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
  cart: {
    cartItems: Cookies.get("cartItems")
      ? JSON.parse(Cookies.get("cartItems"))
      : [],
    shippingAddress: Cookies.get("shippingAddress")
      ? JSON.parse(Cookies.get("shippingAddress"))
      : { location: {} },
    paymentMethod: Cookies.get("paymentMethod")
      ? Cookies.get("paymentMethod")
      : "",
  },
  userInfo: Cookies.get("userInfo")
    ? JSON.parse(Cookies.get("userInfo"))
    : null,
};

function reducer(state, action) {
  switch (action.type) {
    case "DARK_MODE_ON":
      return { ...state, darkMode: true };
    case "DARK_MODE_OFF": {
      let products = {};
      return { ...state, products: products };
    }
    case "ADD_PRODUCT_TO_STORE":
      return { ...state, darkMode: false };
    case "CART_ADD_ITEM": {
      const newItem = action.payload;
      newItem.image = "";
      const existItem = state.cart.cartItems.find(
        (item) => item.id === newItem.id
      );

      let cartItems = [];
      //increase quantity
      if (existItem) {
        cartItems = state.cart.cartItems.map((item) => {
          if (item.id === existItem.id) {
            if (item.quantity) {
              newItem.quantity = item.quantity;
              newItem.quantity = newItem.quantity + 1;
            }
            return newItem;
          } else {
            return item;
          }
        });
      } else {
        cartItems = [...state.cart.cartItems, newItem];
      }
      // const cartItems = existItem
      //   ? state.cart.cartItems.map((item) =>
      //       item.name === existItem.name ? newItem : item
      //     )
      //   : [...state.cart.cartItems, newItem];

      Cookies.set("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_ADD_QUANTITY_ITEM": {
      const newProductQuantity = action.payload;
      state.cart.cartItems.forEach((item, index) => {
        if (
          newProductQuantity?.quantity &&
          newProductQuantity.quantity > 0 &&
          item.id == newProductQuantity.id
        ) {
          state.cart.cartItems[index].quantity = newProductQuantity.quantity;
          Cookies.set("cartItems", JSON.stringify(state.cart.cartItems));
        }
      });
      return { ...state };
    }
    case "CART_DELETE_ITEM": {
      const deleteItem = action.payload;
      // console.log("deleteItem");
      // console.log(deleteItem.id);
      const cartItemsFiltered = state.cart.cartItems.filter((item) => {
        // console.log(item.id);
        return item.id !== deleteItem.id;
      });
      //console.log(cartItemsFiltered);
      //Cookies.set("cartItems", JSON.stringify(cartItemsFiltered));
      state.cart.cartItems = cartItemsFiltered;
      Cookies.set("cartItems", JSON.stringify(cartItemsFiltered));
      // console.log(cartItemsFiltered.length);
      return { ...state };
    }
    case "USER_LOGIN": {
      return { ...state, userInfo: action.payload };
    }
    case "USER_LOGOUT":
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: { location: {} },
          paymentMethod: "",
        },
      };
    case "SAVE_SHIPPING_ADDRESS":
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            ...action.payload,
          },
        },
      };
    case "SAVE_PAYMENT_METHOD":
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    case "CART_CLEAR":
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
