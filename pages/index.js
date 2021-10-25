import { Fragment, useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import { Store } from "../utils/Store";

import ProductList from "../components/products/ProductList";
import { MongoClient } from "mongodb";

// import { session } from "next-session";
// import { withSession } from "next-session";
import { getSession } from "../utils/get-session.js";

const DUMMY_MEETUPS = [
  {
    id: "m1",
    title: "A first meetup",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg",
    address: "Some address 5, 12345 Some City",
    description: "This is a first meetup!",
  },
  {
    id: "m2",
    title: "A second meetup",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg",
    address: "Some address 10, 12345 Some City",
    description: "This is a first meetup!",
  },
];

export default function HomePage(props) {
  return <ProductList products={props.products} />;
}

export async function getServerSideProps(context) {
  const req = context.req;
  const res = context.res;

  const session = await getSession(req, res);

  const { cookies } = req;
  let sessionid = "";
  if (cookies.sid) {
    sessionid = cookies.sid;
  } else {
    session.view = 1; //temporary create sid
    sessionid = session.id;
  }

  const client = await MongoClient.connect(
    "mongodb+srv://academic:123654789@cluster0.5la9p.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const productsCollection = db.collection("products");

  const products = await productsCollection.find().toArray();

  client.close();

  return {
    props: {
      products: products.map((product) => ({
        name: product.name,
        description: product.description,
        image: product?.image ? product.image : "",
        price: product.price,
        id: product._id.toString(),
      })),
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
//     props: {
//       products: products.map((product) => ({
//         name: product.name,
//         description: product.description,
//         image: product?.image ? product.image : "",
//         price: product.price,
//         id: product._id.toString(),
//       })),
//     },
//   };

//   // return {
//   //   props: {
//   //     meetups: DUMMY_MEETUPS
//   //   },
//   //   revalidate: 1
//   // };
// }
