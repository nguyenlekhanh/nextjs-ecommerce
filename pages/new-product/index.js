import { Fragment } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import NewProductForm from "../../components/products/NewProductForm";

export default function NewProductPage() {
  const router = useRouter();

  async function addProductHandler(enterdProductData) {
    const response = await fetch("/api/new-product", {
      method: "POST",
      body: JSON.stringify(enterdProductData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    console.log(data);

    router.push("/");
  }

  return <NewProductForm onAddProduct={addProductHandler} />;
}
