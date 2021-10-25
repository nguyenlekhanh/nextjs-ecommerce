import { MongoClient } from "mongodb";
// /api/new-product
// POST /api/new-product

async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    //const { title, image, address, description } = data;

    const client = await MongoClient.connect(
      "mongodb+srv://academic:123654789@cluster0.5la9p.mongodb.net/meetups?retryWrites=true&w=majority"
    );
    const db = client.db();

    const productsCollection = db.collection("products");

    const result = await productsCollection.insertOne(data);

    // console.log(result);

    client.close();

    res.status(201).json({ message: "Product inserted!" });
  }
}

export default handler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
};
