import nc from "next-connect";
import Order from "../../../../models/Order";
import Product from "../../../../models/Product";
import db from "../../../../utils/db";
import { isAuth } from "../../../../utils/auth";

const handler = nc();
handler.use(isAuth);
handler.get(async (req, res) => {
  await db.connect();
  const orders = await Order.findById(req.query.id);
  let ordersRes = orders.toObject();

  for (const y in ordersRes.orderItems) {
    const product = await Product.findById(
      ordersRes.orderItems[y]["productId"]
    );
    //console.log(product.image[0].base64);
    if (product && product.image && product.image[0]) {
      //   var jsonData = JSON.parse(product.image[0]);
      //   console.log(jsonData);
      ordersRes.orderItems[y].image = product.image[0];
    }
  }
  //   console.log(ordersRes);
  await db.disconnect();
  res.send(ordersRes);
});

export default handler;
