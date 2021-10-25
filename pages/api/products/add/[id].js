import { MongoClient, ObjectId } from "mongodb";
import nc from "next-connect";
import { getSession } from "../../../../utils/get-session.js";
import { parse } from "cookie";
// /api/new-product
// POST /api/new-product

async function handler(req, res) {
  const session = await getSession(req, res);

  const { cookies } = req;
  let sessionid = "";
  if (cookies.sid) {
    sessionid = cookies.sid;
  } else {
    session.view = 1; //temporary create sid
    sessionid = session.id;
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();

  const productsCollection = db.collection("products");

  const product = await productsCollection.findOne({
    _id: ObjectId(req.query.id),
  });

  const cartsCollection = db.collection("carts");

  const cartProduct = await cartsCollection.findOne({
    session_id: sessionid,
    product_id: ObjectId(req.query.id),
  });

  if (!cartProduct) {
    let data = {
      session_id: sessionid,
      product_id: ObjectId(req.query.id),
      created_date: new Date(),
    };

    const result = await cartsCollection.insertOne(data);
  }

  client.close();

  res.send(product);
}

export default handler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
};
