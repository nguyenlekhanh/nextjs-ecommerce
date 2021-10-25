import { useContext } from "react";
import { useRouter } from "next/router";
import Card from "../ui/Card";
import classes from "./ProductItem.module.css";
import axios from "axios";
import { Store } from "../../utils/Store";
import Cookies from "js-cookie";

function ImgObj(props) {
  return <img src={props.base64} alt={props.name} />;
}

function ProductItem(props) {
  const router = useRouter();
  const { dispatch } = useContext(Store);
  const { product } = props;

  function showDetailsHandler() {
    router.push("/product-detail/" + props.id);
  }

  async function addToCartHandler() {
    const { data } = await axios.get(`/api/products/add/${product.id}`);
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { id: product.id, quantity: 1 },
    });
  }

  return (
    <Card>
      <div className={classes.image}>
        {product?.image[0] ? (
          <ImgObj
            base64={product.image[0].base64}
            name={product.image[0].name}
          />
        ) : (
          ""
        )}
      </div>
      <div className={classes.content}>
        <h3>{product.name}</h3>
        <div className={classes.description}>{product.description}</div>
        <div className={classes.price}>Price: ${product.price}</div>
      </div>
      <div className={classes.actions}>
        <button className="form-control" onClick={showDetailsHandler}>
          Show Details
        </button>
        <button className="form-control" onClick={addToCartHandler}>
          Add to Cart
        </button>
      </div>
    </Card>
  );
}

export default ProductItem;
