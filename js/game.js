"use strict";

const game = {
  title: "Whack A Mole",
  isRunning: false,
  playerName: "",
  playerForm: document.getElementById("name-input"),
  joinGameButton: document.getElementById("join-btn"),
  startGameButton: document.getElementById("start-btn"),
  instructionButton: document.getElementById("instruction-btn"),
  playerNameDisplay: document.getElementById("player-name-display"),

  score: 0,
  moleSpeed: 1000,
  timer: 60,
  timerInterval: 0,
  timeLeft: 60,
  moleInterval: 0,

  switchScreen: function (currentScreen) {
    $(".screen").hide();
    $("#" + currentScreen).show();
  },
  // Update user name and jump to game
  updateName() {
    game.playerName = game.playerForm.value;
    game.playerNameDisplay.innerHTML = "Hello, " + game.playerForm.value;

    game.startGameButton.disabled = false;
    // game.instructionButton.hidden = false;
    game.playerForm.style.display = "none";
    game.joinGameButton.style.display = "none";
  },

  toggleRunning: function () {
    this.isRunning = !this.isRunning;
    // $(".indicator").toggleClass("running");
    // if (game.isRunning) {
    //   $("#playPauseButton").html('<i class="bi bi-pause-circle" ><i/>');
    //   $("#playPauseButton").css("color", "white");
    // } else {
    //   $("#playPauseButton").html('<i class="bi bi-play-circle" ><i/>');
    //   $("#playPauseButton").css("color", "black");
    // }
  },
  resetGame: function () {
    game.isRunning = false;
    // $("#splash-screen").show();
    game.playerName = "";
    game.playerForm.value = "";
    game.switchScreen("splash-screen");
    $("#game-over-screen").hide();
    // game.stopTimer();
    game.resetScore();
    game.resetTimer();
    game.timeLeft = 60;
    $(".cell").removeClass("mole").css("background-color", "");
    game.moleSpeed = 1000;
    //Reset the speed after end-game🛑
    $(".speed-display").val("1");
  },

  startMolePopUp: function () {
    if (game.isRunning) {
      clearInterval(game.moleInterval);
      game.moleInterval = setInterval(function () {
        $(".cell").removeClass("mole");
        $(".cell").css("background-color", "");
        const randomCell = Math.floor(Math.random() * 10);
        $(".cell").eq(randomCell).addClass("mole");
        // $(".cell.mole").css("background-color", "yellow");
      }, game.moleSpeed);
    } else {
      clearInterval(game.moleInterval);
    }
  },
  handleMoleClick: function () {
    if (game.isRunning && $(this).hasClass("mole")) {
      $(this).removeClass("mole");
      $(this).css("background-color", "red");
      game.increaseScore();
      setTimeout(
        function () {
          $(this).css("background-color", "");
        }.bind(this),
        100
      );
    }
  },

  resetTimer: function () {
    game.timeLeft = 60;
    game.updateTimerDisplay();
  },

  updateTimerDisplay: function () {
    $("#timer").text(game.timeLeft);
  },

  startTimer: function () {
    if (!game.isRunning) {
      game.this.isRunning = true;
    }
    game.timeLeft--;
    setTimeout(game.updateTimerDisplay, 1000);
    game.updateTimerDisplay();

    if (game.timeLeft == 0) {
      game.isRunning = false;
      game.stopTimer();
      game.switchScreen("game-over-screen");
      $("#final-score").text(game.score);
      game.resetGame();
      clearTimeout(game.updateTimerDisplay);
      clearTimeout(game.startTimer);
      window.setTimeout(function () {}, game.timerInterval);
    } else {
      setTimeout(game.startTimer, 1000);
    }
  },

  stopTimer: function () {
    game.isRunning = false;
    clearTimeout(game.startTimer);
    clearTimeout(game.updateTimerDisplay);
  },

  increaseScore: function () {
    game.score++;
    $("#score").text(game.score);
  },
  resetScore: function () {
    game.score = 0;
    $("#score").text(game.score);
    game.updateTimerDisplay();
  },
  decreaseSpeed: function () {
    game.moleSpeed -= 100;
    if (game.moleSpeed < 100) {
      game.moleSpeed = 100;
    }
    game.startMolePopUp();
  },

  // Decrease the mole speed
  increaseSpeed: function () {
    game.moleSpeed += 100;
    game.startMolePopUp();
  },

  init: function () {
    // Hide everything except Home Screen

    // $("#home-screen").hide(); //This line is just for JS checking, need to delete!!!
    $("#splash-screen").hide();
    $("#game-screen").hide();
    $("#game-over-screen").hide();

    // Event handlers-Spalsh-screen
    $(".main-btn").on("click", function () {
      game.switchScreen("splash-screen");
    });

    $("#start-btn").on("click", function () {
      $("#gameTitle").text(game.title);
      game.resetGame();
      game.switchScreen("game-screen");
    });

    game.playerForm.addEventListener("keyup", function () {
      if (game.playerForm.value.length > 0) {
        game.joinGameButton.disabled = false;
      } else {
        game.joinGameButton.disabled = true;
      }
    });

    game.joinGameButton.addEventListener("click", game.updateName);

    $(".cell").on("click", game.handleMoleClick);

    $("#playButton").on("click", function () {
      // game.toggleRunning();
      // game.resetScore();
      game.isRunning = true;
      // game.resetTimer();
      game.startTimer();
      game.startMolePopUp();
    });

    $("#endGameButton").on("click", function () {
      // game.resetGame();
      $("#final-score").text(game.score);
      game.switchScreen("game-over-screen");
    });

    $("#playAgainButton").on("click", function () {
      game.resetGame();
      game.playerName = "";
      game.playerForm.value = "";
      game.switchScreen("splash-screen");
    });

    // This is the difficulty-bar function👇
    $(".minus").click(function () {
      game.decreaseSpeed();
      const $input = $(this).parent().find("input");
      let count = parseInt($input.val()) - 1;
      count = count < 1 ? 1 : count;
      $input.val(count);
      $input.change();
      // return false;
    }),
      $(".plus").click(function () {
        game.increaseSpeed();
        const $input = $(this).parent().find("input");
        let count = parseInt($input.val()) + 1;
        $input.val(count);
        $input.change();
        // return false;
      });
  }, //This line is the end of init function
}; //This line is the end of game object

game.init();
