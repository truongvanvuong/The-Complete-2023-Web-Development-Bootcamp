import { app, weekday } from ".";

app.get("/", (req, res) => {
  res.render("../views/index.ejs", {
    weekday: weekday,
    text,
    text,
  });
});
