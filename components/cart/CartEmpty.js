import { useRouter } from "next/router";
import CartProduct from "../ui/CartProduct";
import Link from "next/link";
import classes from "./CartEmpty.module.css";
import styled from "styled-components";

const RedLink = styled.a`
  color: blue;
  cursor: pointer;
`;

function CartEmpty(props) {
  const router = useRouter();

  return (
    <CartProduct>
      <td colSpan="6">
        Cart is empty.{" "}
        <Link href="/">
          <RedLink>Go Shopping</RedLink>
        </Link>
      </td>
    </CartProduct>
  );
}

export default CartEmpty;
