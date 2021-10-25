import { useContext } from "react";
import ProductItem from "./ProductItem";
import classes from "./ProductList.module.css";

function ProductList(props) {
  return (
    <div className={`${classes.list} row`}>
      {props.products.map((product) => (
        <ProductItem key={product.id} id={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductList;
