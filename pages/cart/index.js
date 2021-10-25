import { Fragment, useContext, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Cart from "../../components/cart/Cart";
import { MongoClient } from "mongodb";
import { getSession } from "../../utils/get-session.js";

export default function ShowCart(props) {
  const router = useRouter();

  return <Cart products={props.products} />;
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

// export async function getStaticProps() {
//   // fetch data from an api or database

//   const client = await MongoClient.connect(
//     "mongodb+srv://academic:123654789@cluster0.5la9p.mongodb.net/meetups?retryWrites=true&w=majority"
//   );
//   const db = client.db();

//   const productsCollection = db.collection("products");

//   const products = await productsCollection.find().toArray();

//   client.close();

//   return {
//     props: {},
//   };
// }
