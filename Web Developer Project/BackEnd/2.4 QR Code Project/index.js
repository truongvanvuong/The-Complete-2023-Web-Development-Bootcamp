import inquirer from "inquirer";
import qr from "qr-image";
import fs from "fs";

inquirer
  .prompt([
    {
      message: "Nhập url của bạn",
      name: "URL",
    },
  ])
  .then((answers) => {
    var qr_img = qr.image(answers.URL);
    qr_img.pipe(fs.createWriteStream("QR_img.png"));
    fs.writeFile("URL.txt", answers.URL, (err) => {
      if (err) throw err;
    });
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
