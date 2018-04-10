function Player(playerMarker) {
    this.playerMarker = playerMarker;
    this.playerMoved = false;
    this.playerType = 'Human';
}

function CompPlayer(playerMarker) {
    this.playerMarker = playerMarker;
    this.playerMoved = false;
    this.playerType = 'Comp'
    this.MakeMove = boardArray => {
        console.log("MY board looks like this " + boardArray);
        for (let i = 0; i < boardArray.length; i++) {
            if ($("#" + i).hasClass("notUsed")) {
                Manager.updateBoard(i);
                return;
            }
        }
    };
}



const UIManager = {
    boardId: "#board",

    playerSettingId: "#playerSettings",

    displayGameStartScreen: function () {
        $(this.boardId).css("display", "none");
        $(this.playerSettingId).css("display", "block");
    },

    startGame: function () {
        $(this.boardId).css("display", "block");
        $(this.playerSettingId).css("display", "none");
    },

    updateBox: function (boxId, playerMarker) {
        $(boxId).text(playerMarker);
        $(boxId).removeClass("notUsed");
    },

    resetBoard: () => {
        $("td").each(function (td) {
            if (!$(this).hasClass("notUsed")) {
                $(this).addClass("notUsed");
            }
            $(this).text("");
        });
    },

    displayTurnScreen: (playerName) => {
        this.changeTurnScreen(playerName);
        $(".turnSpeechDiv").addClass("displayTurn");
    },

    changeTurnScreen: (playerName) => {
        if (playerName == 'second player') {
            $("#playerTwoBackground").css("display", "none");
            $("#playerOneBackground").css("display", "block");
            $("#playerWinBackground").css("display", "none");
        } else {
            $("#playerTwoBackground").css("display", "block");
            $("#playerOneBackground").css("display", "none");
            $("#playerWinBackground").css("display", "none");
        }
    },

    displayResultScreen: function(winner)  {
        $("#playerWinBackground").text(winner + " wins!");
        $("#playerWinBackground").css("display", "block");
        $("#playerTwoBackground").css("display", "none");
        $("#playerOneBackground").css("display", "none");
    },

    updateScoreBoard: function(winner) {
        winner = '#' + winner + 'Score'
        $(winner + " span").text(parseInt($(winner + " span").text()) + 1);
    },

    onGameOver: function(winner) {
        let winnerScoreId = "";

        if(winner == 'first player') {
            winner = "Player one";
            winnerScoreId = "playerOne";
        } 
        else { 
            winner = "Player two";
            winnerScoreId = "playerTwo";
        }
        this.updateScoreBoard(winnerScoreId);
        this.displayResultScreen(winner);
    },
};

const gameManager = {
    player1: null,
    player2: null,
    numberOfPlayers: 0,
    numberOfMoves: 0,
    firstPlayer: "",
    board: [0, 0, 0, 0, 0, 0, 0, 0, 0],

    checkBoard: function () {
        console.log("hi");
    },
    decideWhoIsFirst: function () { },
    checkIfGameOver: function () {
        if (this.numberOfMoves < 3) {
            return false;
        }

        if (this.numberOfMoves >= 9) {
            return true;
        }

        if (
            Math.abs(this.board[0] + this.board[1] + this.board[2]) === 3 ||
            Math.abs(this.board[3] + this.board[4] + this.board[5]) === 3 ||
            Math.abs(this.board[6] + this.board[7] + this.board[8]) === 3 ||
            Math.abs(this.board[0] + this.board[3] + this.board[6]) === 3 ||
            Math.abs(this.board[1] + this.board[4] + this.board[7]) === 3 ||
            Math.abs(this.board[2] + this.board[5] + this.board[8]) === 3 ||
            Math.abs(this.board[0] + this.board[4] + this.board[8]) === 3 ||
            Math.abs(this.board[2] + this.board[4] + this.board[6]) === 3
        ) {
            return true;
        }

        return false;
    },
    changeFirstPlayer: function () {
        return this.firstPlayer === "" || this.firstPlayer === "second player"
            ? this.firstPlayer = "first player"
            : this.firstPlayer = "second player";
    },
    getCurrentPlayer: function () {
        return this.player1.playerMoved ? this.player2 : this.player1;
    },
    getCurrentPlayerName: function () {
        return this.player1.playerMoved ? "second player" : "first player";
    },
    resetBoard: function () {
        this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.numberOfMoves = 0;
    },
    updateBoard: function (row, playerMaker) {
        //playerMark = getCurrentPlayer().playerMarker;
        this.numberOfMoves += 1;
        this.board[row] = playerMaker == "X" ? 1 : -1;
        console.log("The board is now like this " + this.board);
    },
    startGame: function (playerSettings) {
        console.log("the this for game manager is ")
        console.log(this);
        this.numberOfPlayers = playerSettings[0]["value"];
        let firstPlayerMarker = playerSettings[1]["value"];
        let secondPlayerMarker = firstPlayerMarker == "X" ? "O" : "X";

        if (this.numberOfPlayers == 1) {
            this.player1 = new Player(firstPlayerMarker);
            this.player2 = new CompPlayer(secondPlayerMarker);
        } else {
            this.player1 = new Player(firstPlayerMarker);
            this.player2 = new Player(secondPlayerMarker);
        }
        console.log("player 1 marker is " + this.player1.playerMarker);
        console.log("player 2 marker is " + this.player2.playerMarker);
        this.changeFirstPlayer();
        this.firstPlayer == "first player"
            ? (this.player2.playerMoved = true)
            : (this.player1.playerMoved = false);
    },

    compIsThinking: function () {
        if (this.numberOfPlayers == 2) {
            return false;
        }

        if (this.player2.playerMoved) {
            return false;
        }

        return true;
    },

    nextPlayIsComp: function () {
        return this.numberOfPlayers == 1 && !this.player2.playerMoved
    },

    compMoves: function () {
        if (this.player2.MakeMove != null) {
            this.player2.MakeMove(this.board);
        }
    },

    changePlayerMoved: function () {
        this.player1.playerMoved = !this.player1.playerMoved
        this.player2.playerMoved = !this.player2.playerMoved
    }
};

const Manager = {
    gameManager: gameManager,
    UIManager: UIManager,

    onLoad: function () {
        console.log(this);
        this.UIManager.displayGameStartScreen();
    },

    startGame: function (fields) {
        //this.UIManager.onGameOver("player 1")
        this.gameManager.startGame(fields);
        this.UIManager.startGame();

        console.log("current state of game manager " + JSON.stringify(this.gameManager));
    },

    updateBoard: function (boxIdNumber) {
        let currentPlayer = this.gameManager.getCurrentPlayer();
        let currentPlayerName = this.gameManager.getCurrentPlayerName();
        let playerMarker = currentPlayer.playerMarker;
        let boxId = "#" + boxIdNumber;
        console.log("going to update box " + boxId);
        this.UIManager.updateBox(boxId, playerMarker);
        this.gameManager.updateBoard(boxIdNumber, playerMarker);

        if (this.gameManager.checkIfGameOver()) {
            this.onGameOver(currentPlayerName);
            //this.resetBoard();
            return
        } else {
            this.gameManager.changePlayerMoved();
            this.UIManager.changeTurnScreen(currentPlayerName)
        }
        console.log("Is the game over? " + this.gameManager.checkIfGameOver());
        console.log("The players move status are " + this.gameManager.player1.playerMoved + " " + this.gameManager.player2.playerMoved)
        console.log("Is the next play from COMP? " + this.gameManager.nextPlayIsComp());
        if (this.gameManager.nextPlayIsComp()) {
            console.log("before the timeout");
            setTimeout(this.gameManager.compMoves.bind(this.gameManager), 500);
        }
    },

    resetBoard: function () {
        this.UIManager.resetBoard();
        this.gameManager.resetBoard();
    },

    onGameOver: function(currentPlayerName) {
        // 1. Disable board

        // 2. Hide turn display

        // 3. update score board and declare winner
        this.UIManager.onGameOver(currentPlayerName);

        // 4. Choose who will go next
        this.gameManager.changeFirstPlayer();

        // 5. Reset Board - remove markers and added listeners
        
        // 6. if compe is player 2 and it's the comp turn, tell game manager to call compMoves
    },

    compIsNotMoving() {
        return this.gameManager.compIsThinking();
    }
};

const divs = () => {
    $("td").each(function (td) {
        if (!$(this).hasClass("notUsed")) {
            $(this).addClass("notUsed");
        }
        $(this).text("");

        $(this).click(function () {
            $(this).text("X");
            $(this).removeClass("notUsed");
            gameManager.updateBoard($(this).attr("id"));
            console.log("The game is over?" + gameManager.checkIfGameOver());
            $(this).off("click");
        });
    });
};

$(document).ready(function () {
    Manager.onLoad();
    $("#resetButton").click(function () {
        Manager.resetBoard();
    });

    $("td").each(function () {
        if (!$(this).hasClass("notUsed")) {
            $(this).addClass("notUsed");
        }

        $(this).text("");

        $(this).click(function () {
            if (!$(this).hasClass("notUsed") || Manager.compIsNotMoving()) {
                return;
            }
            console.log($(this).attr("id"));
            $(this).removeClass("notUsed");
            Manager.updateBoard($(this).attr("id"));
        });
    });

    $("#startButton").click(function (event) {
        var formID = "#" + event.currentTarget.form.id;
        var fields = $(formID).serializeArray();
        console.log(
            "form id is " + formID + "fields are " + JSON.stringify(fields[0])
        );
        //gameManager.startGame(fields);
        Manager.startGame(fields);
        event.preventDefault();
    });
});
