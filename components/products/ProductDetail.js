import { Fragment } from "react";
import { useRouter } from "next/router";
import classes from "./ProductDetail.module.css";

function ImgObj(props) {
  return <img src={props.base64} alt={props.name} width="255px" />;
}

export default function ProductDetail(props) {
  const router = useRouter();
  // console.log(props);
  function EditProductHandler() {
    router.push("/product-edit/" + props.id);
  }

  return (
    <section className={classes.detail}>
      <h1>{props.name}</h1>
      {props.image && (
        <ImgObj base64={props.image.base64} name={props.image.name} />
      )}
      <div>{props.category}</div>
      <address>Price: ${props.price}</address>
      <p>{props.description}</p>
      {/* <div className={classes.actions}>
        <button onClick={EditProductHandler}>Edit Product</button>
      </div> */}
    </section>
  );
}
