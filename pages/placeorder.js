import React, { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Store } from "../utils/Store";
import NextLink from "next/link";
import Image from "next/image";
import { MongoClient } from "mongodb";
import { getSession } from "../utils/get-session.js";

import {
  Grid,
  TableContainer,
  Table,
  Typography,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Link,
  CircularProgress,
  Button,
  Card,
  List,
  ListItem,
} from "@material-ui/core";
import axios from "axios";
import { useRouter } from "next/router";
import useStyles from "../utils/styles";
import CheckoutWizard from "../components/CheckoutWizard";
import { useSnackbar } from "notistack";
import { getError } from "../utils/error";
import Cookies from "js-cookie";

function PlaceOrder(props) {
  const classes = useStyles();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { cartItems, shippingAddress, paymentMethod },
  } = state;
  const products = props.products;
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.456 => 123.46
  let orderItems = [];

  const itemsPrice = round2(
    cartItems.reduce((a, c) => {
      let product = products.find((itemProduct) => {
        return itemProduct.id == c.id;
      });
      let orderItem = {
        name: product.name,
        quantity: c.quantity,
        price: product.price,
        productId: c.id,
      };
      orderItems.push(orderItem);
      return a + product.price * c.quantity;
    }, 0)
  );

  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  useEffect(() => {
    if (!paymentMethod) {
      router.push("/payment");
    }
    if (cartItems.length === 0) {
      router.push("/cart");
    }
  }, []);
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const placeOrderHandler = async () => {
    closeSnackbar();
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/orders",
        {
          orderItems: orderItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: "CART_CLEAR" });
      Cookies.remove("cartItems");
      setLoading(false);
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };
  return (
    <>
      <CheckoutWizard activeStep={3}></CheckoutWizard>
      <Typography component="h3" variant="h3">
        Place Order
      </Typography>

      <Grid container spacing={1}>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h4" variant="h4">
                  Shipping Address
                </Typography>
              </ListItem>
              <ListItem>
                {shippingAddress.fullName}, {shippingAddress.address},{" "}
                {shippingAddress.city}, {shippingAddress.postalCode},{" "}
                {shippingAddress.country}
              </ListItem>
            </List>
          </Card>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h4" variant="h4">
                  Payment Method
                </Typography>
              </ListItem>
              <ListItem>{paymentMethod}</ListItem>
            </List>
          </Card>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h4" variant="h4">
                  Order Items
                </Typography>
              </ListItem>
              <ListItem>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cartItems.map((item) => {
                        let product = products.find((itemProduct) => {
                          return itemProduct.id == item.id;
                        });
                        let price = 1;
                        if (product) {
                          price = product.price;
                        } else {
                          product.price = 1;
                        }
                        let quantityProduct = item?.quantity
                          ? item.quantity
                          : 1;

                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Link>
                                <Image
                                  src={product.image[0].base64}
                                  alt={product.image[0].name}
                                  width={50}
                                  height={50}
                                ></Image>
                              </Link>
                            </TableCell>

                            <TableCell>
                              <Link>
                                <Typography>{product.name}</Typography>
                              </Link>
                            </TableCell>
                            <TableCell align="right">
                              <Typography>{quantityProduct}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography>${price}</Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography variant="h4">Order Summary</Typography>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Items:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">${itemsPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Tax:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">${taxPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Shipping:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">${shippingPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>
                      <strong>Total:</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">
                      <strong>${totalPrice}</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  onClick={placeOrderHandler}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Place Order
                </Button>
              </ListItem>
              {loading && (
                <ListItem>
                  <CircularProgress />
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export async function getServerSideProps(context) {
  const req = context.req;
  const res = context.res;

  const session = await getSession(req, res);
  const { cookies } = req;
  const sessionid = cookies.sid ? cookies.sid : session.id;

  let products = [];

  const client = await MongoClient.connect(
    "mongodb+srv://academic:123654789@cluster0.5la9p.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const cartsCollection = db.collection("carts");

  products = await cartsCollection
    .aggregate([
      { $match: { session_id: sessionid } },
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "cart_product",
        },
      },
    ])
    .toArray();

  let productsProp = [];
  for await (const item of products) {
    if (item.cart_product[0]) {
      let cartProduct = item.cart_product[0];
      let product = {
        name: cartProduct.name,
        description: cartProduct.description,
        image: cartProduct?.image ? cartProduct.image : "",
        price: cartProduct.price,
        id: item.product_id.toString(),
      };
      productsProp.push(product);
    }
  }

  return {
    props: {
      products: productsProp,
    },
  };
}

export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: true });
