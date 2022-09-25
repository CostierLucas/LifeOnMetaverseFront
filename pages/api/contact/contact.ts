import type { NextApiRequest, NextApiResponse } from "next";
import sendgrid from "@sendgrid/mail";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, subject, description } = req.body;
  sendgrid.setApiKey(process.env.SENDGRID_API as string);

  try {
    sendgrid.send({
      to: "lucas.costier@eveasoft.com", // Your email where you'll receive emails
      from: process.env.SENDGRID_MAIL as string, // your website email address here
      subject: `New message from ${email} - ${subject}`,
      html: `<p>${description}</p>`,
    });
    res.status(200).json({ message: "Email sent" });
  } catch (e) {
    res.status(500).json({ message: "Email not sent" });
  }
}
