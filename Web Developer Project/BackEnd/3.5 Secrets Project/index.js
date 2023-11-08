import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(dirname(fileURLToPath(import.meta.url)) + "/public/index.html");
});

app.post("/check", (req, res) => {
  const pass = req.body.password;

  if (pass === "ILoveProgaming") {
    console.log("ok");
    res.sendFile(
      dirname(fileURLToPath(import.meta.url)) + "/public/secret.html"
    );
  } else {
    res.sendFile(
      dirname(fileURLToPath(import.meta.url)) + "/public/index.html"
    );
  }
});
app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
