import type { NextApiRequest, NextApiResponse } from "next";
import sendgrid from "@sendgrid/mail";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, category, tx, price } = req.body;
  sendgrid.setApiKey(process.env.SENDGRID_API as string);

  try {
    sendgrid.send({
      to: email, // Your email where you'll receive emails
      from: process.env.SENDGRID_MAIL as string, // your website email address here
      subject: `Thank you for your purchase!`,
      html: `
        <p>
        Tx ID: ${tx}
        </p>
        <br/>
        <p>
          Categorie : ${category}
        </p>
        <br/>
        <p>
          Price : ${price} $
        </p>
      `,
    });
    res.status(200).json({ message: "Email sent" });
  } catch (e) {
    res.status(500).json({ message: "Email not sent" });
  }
}
