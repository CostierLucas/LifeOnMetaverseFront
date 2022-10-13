import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../config/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    artist,
    title,
    description,
    type,
    supply,
    categories,
    baseUri,
    price,
    percentages,
    address,
    image,
    banner,
    titleList,
    royalty,
    spotify,
  } = req.body;

  const params = {
    TableName: "life-edition",
    Item: {
      date: Date.now(),
      artist,
      title,
      description,
      categorie_selected: type,
      supply,
      categories,
      baseUri,
      price,
      percentages,
      address,
      image,
      banner,
      titleList,
      created_at: Date.now(),
      royalty,
      spotify,
      opensea: "",
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
      res.status(200).json({ resp: "edition created" });
    }
  });
}
