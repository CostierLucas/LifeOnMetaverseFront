import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../config/db";
import crypto from "crypto";
import sendgrid from "@sendgrid/mail";
import { hashPassword } from "../../../config/password";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.body;
  const newPassword = crypto.randomBytes(20).toString("hex");
  const hashedPassword = await hashPassword(newPassword);
  sendgrid.setApiKey(process.env.SENDGRID_API as string);

  const params = {
    TableName: "life-users",
    Key: {
      email: email,
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
      try {
        sendgrid.send({
          to: email,
          from: process.env.SENDGRID_MAIL as string,
          subject: `New password for ${email}`,
          html: `
            <p>Your new password is ${newPassword}</p>
          `,
        });
        res.status(200).json({ resp: "Password generated and mail sent" });
      } catch (e) {
        res.status(422).json({ resp: "Something went wrong" });
      }
    }
  });
}
