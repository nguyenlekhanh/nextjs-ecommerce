import classes from "./Card.module.css";

function Card(props) {
  return (
    <div className={`col-md-3 col-sm-12 col-xs-12`}>
      <div className={`${classes.card}`}>{props.children}</div>
    </div>
  );
}

export default Card;
