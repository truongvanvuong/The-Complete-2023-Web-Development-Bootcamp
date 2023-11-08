import express from "express";
const app = express();
const port = 3000;

const date = new Date();
let day = date.getDay();
let text = "";
const weekdays = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期一四",
  "星期五",
  "星期六",
];

const weekday = weekdays[day];
function handleText(day) {
  if (day >= 1 && day <= 5) {
    text = "努力工作";
  } else if (day == 0 || day == 6) {
    text = "周末了， 休息把";
  }
}

app.get("/", (req, res) => {
  handleText(day);
  res.render("../views/index.ejs", {
    text: text,
    weekday: weekday,
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
