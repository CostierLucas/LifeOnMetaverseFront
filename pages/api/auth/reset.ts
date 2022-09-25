import type { NextApiRequest, NextApiResponse } from "next";
import { hashPassword } from "../../../config/password";
import db from "../../../config/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.body;
}
