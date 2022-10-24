import type { NextApiRequest, NextApiResponse } from "next";
import { hashPassword } from "../../../config/password";
import db from "../../../config/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { password, resetCode } = req.body;
  console.log(req.body);
  const hashedPassword = await hashPassword(password);

  let paramsUserCode = {
    TableName: "life-users",
    FilterExpression: "#resetCode =:resetCode",
    ExpressionAttributeValues: { ":resetCode": parseInt(resetCode) },
    ExpressionAttributeNames: { "#resetCode": "resetCode" },
  };

  let ress = await db.scan(paramsUserCode).promise();

  if (ress.Count === 0) {
    throw new Error("No user found!");
  }

  const params = {
    TableName: "life-users",
    Key: {
      code: parseInt(resetCode),
    },
    UpdateExpression: "set password = :p",
    ExpressionAttributeValues: {
      ":p": hashedPassword,
    },
    ReturnValues: "UPDATED_NEW",
  };

  db.update(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to add item. Error JSON:",
        JSON.stringify(err, null, 2)
      );
      res.status(422).json({ resp: "Something went wrong" });
    } else {
      res.status(200).json({ resp: "Password modified" });
    }
  });
}
