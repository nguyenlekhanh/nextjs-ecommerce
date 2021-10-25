import { Fragment } from "react";
import EditProductForm from "../../../components/products/EditProductForm";
import { MongoClient, ObjectId } from "mongodb";
import { useRouter } from "next/router";

export default function ProductEdit(props) {
  const router = useRouter();
  const { productId } = router.query;

  async function editProductHandler(enterdProductData) {
    console.log(enterdProductData);
    const response = await fetch("/api/edit-product", {
      method: "POST",
      body: JSON.stringify(enterdProductData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    console.log(data);

    router.push("/product-detail/" + enterdProductData.id);
  }

  return (
    <>
      {productId}
      <EditProductForm
        id={props.productData.id}
        image={props.productData.image}
        name={props.productData.name}
        category={props.productData.category}
        price={props.productData.price}
        description={props.productData.description}
        qty={props.productData.qty}
        onEditProduct={editProductHandler}
      />
    </>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://academic:123654789@cluster0.5la9p.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const productsCollection = db.collection("products");

  const products = await productsCollection.find({}, { _id: 1 }).toArray();

  return {
    fallback: true,
    paths: products.map((product) => ({
      params: { productId: product._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  const productId = context.params.productId;

  const client = await MongoClient.connect(
    "mongodb+srv://academic:123654789@cluster0.5la9p.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const productsCollection = db.collection("products");

  const selectedProduct = await productsCollection.findOne({
    _id: ObjectId(productId),
  });

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
