import { Fragment } from "react";
import classes from "./MeetupDetail.module.css";

export default function MeetupDetail(props) {
  return (
    <section className={classes.detail}>
      <img src={props.image} alt={props.title} />
      <h1>{props.title}</h1>
      <address>{props.address}</address>
      <p>{props.description}</p>
      <img src={props.image1} alt={props.title} />
    </section>
  );
}
