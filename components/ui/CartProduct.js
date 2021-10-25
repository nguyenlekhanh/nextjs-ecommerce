import classes from "./CartProduct.module.css";

function CartProduct(props) {
  return <tr>{props.children}</tr>;
}

export default CartProduct;
