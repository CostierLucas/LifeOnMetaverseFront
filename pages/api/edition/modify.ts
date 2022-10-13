import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../config/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { date, artist, title, description, categorie, opensea } = req.body;

  console.log(opensea);

  const params = {
    TableName: "life-edition",
    Key: {
      date: parseInt(date),
    },
    UpdateExpression:
      "set title = :r, artist = :a, description = :d, categorie_selected = :c, opensea = :o",
    ExpressionAttributeValues: {
      ":r": title,
      ":a": artist,
      ":d": description,
      ":c": categorie,
      ":o": opensea,
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
      res.status(200).json({ resp: "edition modified" });
    }
  });
}
