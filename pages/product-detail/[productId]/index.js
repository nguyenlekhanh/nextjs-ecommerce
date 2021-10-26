import { Fragment } from "react";
import ProductDetail from "../../../components/products/ProductDetail";
import { MongoClient, ObjectId } from "mongodb";
import { useRouter } from "next/router";

export default function ProductDetails(props) {
  const router = useRouter();
  const { productId } = router.query;

  return (
    <>
      <ProductDetail
        id={props.productData.id}
        image={props.productData?.image[0] ? props.productData.image[0] : ""}
        category={props.productData.category}
        name={props.productData.name}
        price={props.productData.price}
        description={props.productData.description}
        qty={props.productData.qty}
      />
    </>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();

  const productsCollection = db.collection("products");

  const products = await productsCollection.find({}, { _id: 1 }).toArray();

  return {
    fallback: false,
    paths: products.map((product) => ({
      params: { productId: product._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  // fetch data for a single meetup

  const productId = context.params.productId;

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();

  const productsCollection = db.collection("products");

  const selectedProduct = await productsCollection.findOne({
    _id: ObjectId(productId),
  });

  //const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  return {
    props: {
      productData: {
        id: selectedProduct._id.toString(),
        name: selectedProduct.name,
        category: selectedProduct.category,
        price: selectedProduct.price,
        image: selectedProduct?.image ? selectedProduct.image : "",
        description: selectedProduct.description,
        qty: selectedProduct.qty,
      },
    },
    revalidate: 1,
  };
}
