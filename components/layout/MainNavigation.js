import { useContext, useMemo, useState } from "react";
import Link from "next/link";
import classes from "./MainNavigation.module.css";
import useStyles from "../../utils/styles";
import { Store } from "../../utils/Store";
import { Button, Menu, MenuItem, Box, IconButton } from "@material-ui/core";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

function MainNavigation() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const classes1 = useStyles();
  function showCartNumber() {
    return cart.cartItems.length ? cart.cartItems.length : 0;
  }

  const getCartNumber = useMemo(() => showCartNumber(), [cart]);

  const [anchorEl, setAnchorEl] = useState(null);
  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const loginMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null);
    if (redirect) {
      router.push(redirect);
    }
  };
  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("userInfo");
    Cookies.remove("cartItems");
    Cookies.remove("shippinhAddress");
    Cookies.remove("paymentMethod");
    router.push("/");
  };

  return (
    <header className={classes.header}>
      <div className={classes.logo}>Products</div>
      <nav>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          {/* <li>
            <Link href="/new-product">New Product</Link>
          </li> */}
          <li className={classes.cart_link}>
            <Link href="/cart">Cart</Link>
            <span className={classes.cart_number} suppressHydrationWarning>
              {cart.cartItems.length ? cart.cartItems.length : 0}
            </span>
          </li>
          <li>
            {userInfo ? (
              <>
                <Button
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={loginClickHandler}
                  className={classes.navbarButton1}
                >
                  {userInfo.name}
                </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={loginMenuCloseHandler}
                >
                  <MenuItem
                    onClick={(e) => loginMenuCloseHandler(e, "/order-history")}
                  >
                    Order Hisotry
                  </MenuItem>
                  <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Link href="/login">Login</Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
