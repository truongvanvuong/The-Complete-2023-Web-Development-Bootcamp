import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
function formBand() {
  return `
    <div>
      <h1>Tên ban nhạc</h1>
      <form action="/submit" method="POST">
        <label for="street">Street name</label>
        <input type="text" name="street" id="street" />
        <label for="pet">pet name</label>
        <input type="text" name="pet" id="pet" />
        <input type="submit" value="submit" />
      </form>
    </div>
    `;
}

app.get("/", (req, res) => {
  res.send(formBand());
});
app.post("/submit", (req, res) => {
  const band = req.body;
  res.send(`<h2>${band.street}` + " " + `${band.pet}</h2`);
});
app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
