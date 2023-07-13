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
  timer: 10,
  timerInterval: 0,
  timeLeft: 10,
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
    $(".indicator").toggleClass("running");
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
    $("#splash-screen").show();
    $("#game-screen").hide();
    game.stopTimer();
    game.resetScore();
    game.resetTimer();
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
        const randomCell = Math.floor(Math.random() * 9);
        $(".cell").eq(randomCell).addClass("mole");
        $(".cell.mole").css("background-color", "yellow");
      }, game.moleSpeed);
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
    game.timeLeft = game.timer;
    game.updateTimerDisplay();
  },

  updateTimerDisplay: function () {
    $("#timer").text(game.timeLeft);
  },

  startTimer: function () {
    game.timeLeft--;
    setTimeout(game.startTimer, 1000);
    setTimeout(game.updateTimerDisplay, 1000);
    if (game.timeLeft == 0) {
      game.stopTimer();
      $("#game-over-screen").show();
      $("#final-score").text(game.score);
      game.resetGame();
      // game.isRunning = false;
      clearTimeout(game.updateTimerDisplay);
      clearTimeout(game.startTimer);
      // window.setTimeout(function () {
      // }, game.timerInterval);
    }
  },

  stopTimer: function () {
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
  increaseSpeed: function () {
    game.moleSpeed -= 100;
    if (game.moleSpeed < 100) {
      game.moleSpeed = 100;
    }
    game.startMolePopUp();
  },

  // Decrease the mole speed
  decreaseSpeed: function () {
    game.moleSpeed += 100;
    game.startMolePopUp();
  },

  init: function () {
    // Hide everything except Home Screen

    $("#home-screen").hide(); //This line is just for JS checking, need to delete!!!
    $("#splash-screen").hide();
    // $("#game-screen").hide();
    $("#game-over-screen").hide();

    // Event handlers-Spalsh-screen
    $(".main-btn").on("click", function () {
      game.switchScreen("splash-screen");
    });

    $("#start-btn").on("click", function () {
      $("#gameTitle").text(game.title);
      game.switchScreen("game-screen");
      // game.startTimer();
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
      game.resetTimer();
      game.isRunning = true;
      game.startTimer();
      game.startMolePopUp();
    });

    $("#endGameButton").on("click", function () {
      game.resetGame;
      $("#splash-screen").hide();
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
