const btnPlay = document.querySelector(".btn-play");
const imgDice1 = document.querySelector(".img1");
const imgDice2 = document.querySelector(".img2");
const title = document.querySelector(".container>h1");

let number1 = null;
let number2 = null;
function randomNumber1() {
  let randomNumber1 = Math.ceil(Math.random() * 6);
  console.log(randomNumber1);
  number1 = randomNumber1;
}
function randomNumber2() {
  let randomNumber2 = Math.ceil(Math.random() * 6);
  console.log(randomNumber2);
  number2 = randomNumber2;
}

btnPlay.onclick = function () {
  randomNumber1();
  randomNumber2();
  imgDice1.src = "./images/dice" + number1 + ".png";
  imgDice2.src = "./images/dice" + number2 + ".png";
  if (number1 > number2) {
    title.innerHTML = "Player 1 Winer";
  } else if (number1 == number2) {
    title.innerHTML = "Draw";
  } else {
    title.innerHTML = "Player 2 Winer";
  }
};
