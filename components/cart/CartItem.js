import { useContext, useState } from "react";
import { useRouter } from "next/router";
import classes from "./CartItem.module.css";
import axios from "axios";
import CartProduct from "../ui/CartProduct";
import { AiFillDelete } from "react-icons/ai";
import { Store } from "../../utils/Store";
function ImgObj(props) {
  return <img width="50px" src={props.base64} alt={props.name} />;
}

function CartItem(props) {
  const { dispatch } = useContext(Store);
  const router = useRouter();
  var { product, quantity } = props;
  const [productQuantity, setProductQuantity] = useState(quantity);
  const [totalProduct, setTotalProduct] = useState(quantity * product.price);

  function handleQuantityChange(e) {
    //setProductQuantity((previousState) => e.target.value);
    //setTotalProduct((previousState) => e.target.value * product.price);
    setProductQuantity(e.target.value);
    setTotalProduct(e.target.value * product.price);
    dispatch({
      type: "CART_ADD_QUANTITY_ITEM",
      payload: { id: product.id, quantity: e.target.value },
    });
  }

  async function deleteToCartHandler() {
    let confirm = window.confirm("Are you sure to delete this item?");
    if (confirm) {
      const { data } = await axios.get(`/api/products/delete/${product.id}`);
      dispatch({
        type: "CART_DELETE_ITEM",
        payload: { id: product.id },
      });
    }
  }

  return (
    <CartProduct>
      <td className="text-center">
        {product?.image[0] ? (
          <ImgObj
            base64={product.image[0].base64}
            name={product.image[0].name}
          />
        ) : (
          ""
        )}
      </td>
      <td>{product.name}</td>
      <td className={`${classes.quantity_input} text-center`}>
        <input
          type="number"
          className="form-control"
          id="quantity"
          value={productQuantity}
          onChange={handleQuantityChange}
        />
      </td>
      <td className="text-center">${product.price}</td>
      <td suppressHydrationWarning className="text-center">
        ${totalProduct}
      </td>
      <td className="text-center">
        <AiFillDelete
          className={classes.delete_icon}
          onClick={deleteToCartHandler}
        />
      </td>
    </CartProduct>
  );
}

export default CartItem;
