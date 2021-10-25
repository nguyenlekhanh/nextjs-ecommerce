// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// import { getSession } from "../../utils/get-session.js";

// import db from "../../utils/db";

export default async function handler(req, res) {
  // const session = await getSession(req, res);
  // console.log(session);
  // session.views = session.views ? session.views + 1 : 1;
  // const sessionid = session.genid;
  // console.log(sessionid);

  // await session.commit();

  // await db.connect();
  // await db.disconnect();
  res.status(200).json({ name: "John Doe" });
}

// export const config = {
//   api: {
//     externalResolver: true,
//   },
// };
