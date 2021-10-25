import { useRef, useState } from "react";
import FileBase64 from "react-file-base64";
import Card from "../ui/Card";
import classes from "./NewProductForm.module.css";
import { Plus, Dash } from "react-bootstrap-icons";

function ImgObj(props) {
  return (
    <div className={classes.control}>
      <label htmlFor="Image">Image</label>
      <FileBase64
        type="file"
        multiple={false}
        id={`img_${props.id}`}
        onDone={({ base64 }) => props.saveImgBase64(props.id, base64)}
      />
      <div className={classes.pull_right}>
        <Plus color="royalblue" size={22} onClick={props.addImg} />
        <Dash color="royalblue" size={22} onDone={(files) => getFiles(files)} />
      </div>
    </div>
  );
}

function NewProductForm(props) {
  const nameInputRef = useRef();
  const categoryInputRef = useRef();
  const priceInputRef = useRef();
  const descriptionInputRef = useRef();
  const qtyInputRef = useRef();
  const [image, setImage] = useState([]);

  // function saveImgBase64(index, base64Content) {
  //   //base64ImgArr.push(base64Content);
  //   //console.log(index);
  //   base64ImgArr[index] = base64Content;
  //   for (let i in base64ImgArr) {
  //     console.log(i);
  //     console.log(base64ImgArr[i]);
  //   }
  // }

  // function addImg() {
  //   let numImageTmp = numImage;
  //   numImageTmp++;
  //   if (numImageTmp <= 5) {
  //     setNumImage(numImageTmp);
  //   }
  // }

  // function removeImg(index) {
  //   let numImageTmp = numImage;
  //   numImageTmp--;
  //   if (numImageTmp >= 1) {
  //     setNumImage(numImageTmp);
  //   }
  //   console.log(index);
  // }

  function getFiles(files) {
    setImage(files);
  }

  function submitHandler(event) {
    event.preventDefault();

    const enteredName = nameInputRef.current.value;
    const enteredCategory = categoryInputRef.current.value;
    const enteredPrice = priceInputRef.current.value;
    const enteredDescription = descriptionInputRef.current.value;
    const enteredQty = qtyInputRef.current.value;

    const productData = {
      name: enteredName,
      category: enteredCategory,
      price: enteredPrice,
      description: enteredDescription,
      qty: enteredQty,
      image: image,
    };

    props.onAddProduct(productData);
  }

  return (
    <Card>
      <form className={classes.form} onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="name">Name</label>
          <input type="text" required id="name" ref={nameInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="category">Category</label>
          <input type="text" required id="category" ref={categoryInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            required
            rows="5"
            ref={descriptionInputRef}
          ></textarea>
        </div>
        <div className={classes.control}>
          <label htmlFor="price">Price</label>
          <input type="number" required id="price" ref={priceInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="qty">Qty</label>
          <input type="text" required id="qty" ref={qtyInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="Image">Image</label>
          <FileBase64
            type="file"
            multiple={true}
            onDone={(files) => getFiles(files)}
          />
        </div>
        <div className={classes.actions}>
          <button>Add Product</button>
        </div>
      </form>
    </Card>
  );
}

export default NewProductForm;
