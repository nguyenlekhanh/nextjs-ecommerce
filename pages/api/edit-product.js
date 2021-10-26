import { MongoClient } from "mongodb";
// /api/new-product
// POST /api/new-product

async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    //const { title, image, address, description } = data;

    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();

    const productsCollection = db.collection("products");
    // console.log(data.id);
    const result = await productsCollection.find({
      _id: data._id,
    });

    // console.log(result);

    client.close();

    res.status(201).json({ message: "Product saved!" });
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
