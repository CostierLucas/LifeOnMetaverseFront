import type { NextApiRequest, NextApiResponse } from "next";
import sendgrid from "@sendgrid/mail";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, email, phone, music, streaming, artwork, description } =
    req.body;
  sendgrid.setApiKey(process.env.SENDGRID_API as string);

  try {
    sendgrid.send({
      to: "lucas.costier@eveasoft.com", // Your email where you'll receive emails
      from: process.env.SENDGRID_MAIL as string, // your website email address here
      subject: `New message from ${email}}`,
      html: `<div>
      <p>Name: ${name}</p>
      <p>Description : ${description}</p>
      <p>Phone: ${phone}</p>
        <p>Music: ${music}</p>
        <p>Streaming: ${streaming}</p>
        <p>Artwork: ${artwork}</p>
      </div>`,
    });
    res.status(200).json({ message: "Email sent" });
  } catch (e) {
    res.status(500).json({ message: "Email not sent" });
  }
}
