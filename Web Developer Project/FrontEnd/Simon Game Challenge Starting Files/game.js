var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var isPlayer = false;
var level = 0;

$(document).keypress(function (event) {
  if (!isPlayer) {
    $("#level-title").text("Level" + level);
    nextSequence();
    isPlayer = true;
  }
});
$(".btn").click(function () {
  if (isPlayer) {
    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);
    PlaySound(userChosenColour);
    animatePress(userChosenColour);
    checkAnswer(userClickedPattern.length - 1);
  }
});

function PlaySound(name) {
  var audio = new Audio("./sounds/" + name + ".mp3");
  audio.play();
}
function startOver() {
  level = 0;
  gamePattern = [];
}
function animatePress(currentColour) {
  $("#" + currentColour).addClass("pressed");
  setTimeout(() => {
    $("#" + currentColour).removeClass("pressed");
  }, 100);
}
function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(function () {
        nextSequence();
      }, 1000);
    }
  } else {
    $("#level-title").text("Game Over, Press Any Key to Restart");
    $("body").addClass("game-over");
    PlaySound("wrong");
    setTimeout(() => {
      $("body").removeClass("game-over");
    }, 200);
    startOver();
  }
}
function nextSequence() {
  userClickedPattern = [];
  level++;
  $("#level-title").text("Level " + level);
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];

  gamePattern.push(randomChosenColour);
  $("#" + randomChosenColour)
    .fadeOut(200)
    .fadeIn(200)
    .fadeOut(200)
    .fadeIn(200);
  PlaySound(randomChosenColour);
}
