const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { createId } = require("@paralleldrive/cuid2");
const fs = require("fs");
const express = require("express");
const app = express();

// Replaces with your Spaces access key and secret key
const ACCESS_KEY = "{YOUR-SPACES-ACCESS-KEY}";
const SECRET_KEY = "{YOUR-SPACES-SECRET-KEY}";

// Creates a client for the Spaces service
const client = new S3Client({
  region: "sfo3", // Replace with your region if different
  endpoint: "https://sfo3.digitaloceanspaces.com", // Replace with your region if different
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

// Set the name of your bucket and the file you want to upload
const BUCKET_NAME = "drone-tracker-manual"; // Replace with your bucket name if different
const FILE_NAME = "./drone.txt";

// Reads the file into a Buffer
const fileBuffer = fs.readFileSync(FILE_NAME);

app.get("/", async (req, res) => {
  let index = createId();

  const params = {
    Bucket: BUCKET_NAME,
    Key: `${index}.txt`,
    Body: fileBuffer,
  };
  const result = await client.send(new PutObjectCommand(params));

  console.log(result);
  res.json(result);
});

app.listen("3000", () => {
  console.log(`Example app listening on port: 3000`);
});
