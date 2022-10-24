import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../config/db";
import crypto from "crypto";
import sendgrid from "@sendgrid/mail";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.body;
  const randomCode = crypto.randomInt(1000, 9999);
  sendgrid.setApiKey(process.env.SENDGRID_API as string);

  const params = {
    TableName: "life-users",
    Key: {
      email: email,
    },
    UpdateExpression: "set resetCode = :r",
    ExpressionAttributeValues: {
      ":r": randomCode,
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
      try {
        sendgrid.send({
          to: email,
          from: process.env.SENDGRID_MAIL as string,
          subject: `Your code to reset your password`,
          html: `
            <p>Your code is ${randomCode}</p>
          `,
        });
        res.status(200).json({ resp: "Code generated and mail sent" });
      } catch (e) {
        res.status(422).json({ resp: "Something went wrong" });
      }
    }
  });
}
