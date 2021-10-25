import { useContext } from "react";
import { useRouter } from "next/router";
import CartItem from "./CartItem";
import CartEmpty from "./CartEmpty";
import classes from "./Cart.module.css";
import { Store } from "../../utils/Store";
import { plural } from "../../utils/helper";

function Cart(props) {
  const router = useRouter();
  const { state } = useContext(Store);
  const { cart } = state;
  const products = props.products;
  const countProduct = cart.cartItems.length ? cart.cartItems.length : 0;
  let total = 0;

  function checkoutHandler() {
    router.push("/shipping");
  }

  return (
    <div className="row">
      <div className="col-md-7">
        <table className="table">
          <thead>
            <tr>
              <th className="text-center">Image</th>
              <th className="text-center">Name</th>
              <th className="text-center">Qty</th>
              <th className="text-center">Price</th>
              <th className="text-center">Total</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody suppressHydrationWarning>
            {cart.cartItems && cart.cartItems.length ? (
              cart.cartItems.map((cartItem) => {
                let product = products.find((item) => {
                  return item.id == cartItem.id;
                });
                let price = 0;
                if (product) {
                  price = product.price;
                } else {
                  product.price = 1;
                }
                let quantityProduct = cartItem?.quantity
                  ? cartItem.quantity
                  : 1;
                total = total + quantityProduct * price;
                return (
                  <CartItem
                    key={cartItem.id}
                    id={cartItem.id}
                    product={product}
                    quantity={quantityProduct}
                  />
                );
              })
            ) : (
              <CartEmpty />
            )}
          </tbody>
        </table>
      </div>
      {cart?.cartItems && cart.cartItems.length > 0 && (
        <div className="col-md-5" suppressHydrationWarning>
          <div className={classes.total_price}>
            Subtotal ({countProduct} item{plural(countProduct)}) : <br />$
            {total}
          </div>
          <button
            className={`${classes.checkout_btn} btn btn-primary`}
            onClick={checkoutHandler}
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
