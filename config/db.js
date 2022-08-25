import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.DB_ACCESS_KEY_ID,
  secretAccessKey: process.env.DB_SECRET_ACCESS_KEY,
  region: "us-east-1",
});

const db = new AWS.DynamoDB.DocumentClient();

export default db;
