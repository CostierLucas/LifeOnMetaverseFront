import type { NextApiRequest, NextApiResponse } from "next";

import { hashPassword } from "../../../config/password";
import db from "../../../config/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password, username } = req.body;

  const hashedPassword = await hashPassword(password);

  const params = {
    TableName: "life-users",
    Item: {
      email,
      password: hashedPassword,
      username,
      role: "user",
    },
  };

  db.put(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to add item. Error JSON:",
        JSON.stringify(err, null, 2)
      );
      res.status(422).json({ resp: "Something went wrong" });
    } else {
      res.status(200).json({ resp: "User created" });
    }
  });
}
