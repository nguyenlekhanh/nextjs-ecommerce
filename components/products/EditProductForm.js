import { useRef, useState } from "react";
import FileBase64 from "react-file-base64";
import Card from "../ui/Card";
import classes from "./EditProductForm.module.css";
import { Plus, Dash } from "react-bootstrap-icons";

function EditProductForm(props) {
  const nameInputRef = useRef();
  const categoryInputRef = useRef();
  const priceInputRef = useRef();
  const descriptionInputRef = useRef();
  const qtyInputRef = useRef();
  const [image, setImage] = useState([]);

  const [enteredName, setEnteredName] = useState(props.name);
  const [enteredCategory, setEnteredCategory] = useState(props.category);
  const [enteredPrice, setEnteredPrice] = useState(props.price);
  const [enteredDescription, setEnteredDescription] = useState(
    props.description
  );
  const [enteredQty, setEnteredQty] = useState(props.qty);

  function getFiles(files) {
    setImage(files);
  }

  function submitHandler(event) {
    event.preventDefault();

    // const enteredName = nameInputRef.current.value;
    // const enteredCategory = categoryInputRef.current.value;
    // const enteredPrice = priceInputRef.current.value;
    // const enteredDescription = descriptionInputRef.current.value;
    // const enteredQty = qtyInputRef.current.value;

    const productData = {
      id: props.id,
      name: enteredName,
      category: enteredCategory,
      price: enteredPrice,
      description: enteredDescription,
      qty: enteredQty,
      image: image,
    };

    props.onEditProduct(productData);
  }

  return (
    <Card>
      <form className={classes.form} onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            required
            id="name"
            ref={nameInputRef}
            value={enteredName}
            onChange={(e) => setEnteredName(e.target.value)}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="category">Category</label>
          <input
            type="text"
            required
            id="category"
            ref={categoryInputRef}
            value={enteredCategory}
            onChange={(e) => setEnteredCategory(e.target.value)}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            required
            rows="5"
            ref={descriptionInputRef}
            value={enteredDescription}
            onChange={(e) => setEnteredDescription(e.target.value)}
          ></textarea>
        </div>
        <div className={classes.control}>
          <label htmlFor="price">Price</label>
          <input
            type="number"
            required
            id="price"
            ref={priceInputRef}
            value={enteredPrice}
            onChange={(e) => setEnteredPrice(e.target.value)}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="qty">Qty</label>
          <input
            type="text"
            required
            id="qty"
            ref={qtyInputRef}
            value={enteredQty}
            onChange={(e) => setEnteredQty(e.target.value)}
          />
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
          <button>Save Product</button>
        </div>
      </form>
    </Card>
  );
}

export default EditProductForm;
