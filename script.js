function Cell() {
    let marker = "";
    let index = -1;

    const getMarker = () => marker;

    const setMarker = (playerMarker) => {
        marker = playerMarker;
    };

    const getIndex = () => index;

    const setIndex = (cellIndex) => index = cellIndex;

    return {
        getMarker,
        setMarker,
        getIndex,
        setIndex
    }
}

function GameBoard() {
    const size = 3;

    let board = [];
    
    const fillBoardwithCells = () => {
        for(let i = 0; i < size; i++)
        {
            board[i] = []
            for(let j = 0; j < size; j++)
            {
                board[i][j] = Cell();
                board[i][j].setIndex(3*i + j);
            }
        }
    }

    const getBoard = () => board;

    const playMove = (marker, row, column) => {
        if(board[row][column].getMarker() !== "") {
            console.log("hi");
            return -1;
        }

        board[row][column].setMarker(marker);
        return 1;
    }

    const printBoard = () => {
        boardWithMarkers = board.map((row) => row.map((cell) => cell.getMarker()));
        console.log("Printing board...");
        boardWithMarkers.forEach((row) => { 
            let rowString = "";
            row.forEach((marker) => rowString += `${marker} `)
            console.log(rowString);
            })
    }

    const getAllIndex = (marker) => {
        //[].concat() converts 2d array to 1d array
        return [].concat(...board.map((row) => row.map((cell) => {
            if(cell.getMarker() === marker)
                return cell.getIndex();
        })));
    }

    const isFull = () => {
        return board.every((row) => row.every((cell) => cell.getMarker() !== ""));
    }

    const clearBoard = () => {
        board = []
        fillBoardwithCells();
    }

    fillBoardwithCells();

    return {
        getBoard,
        playMove,
        printBoard,
        getAllIndex,
        isFull,
        clearBoard
    }
}

function GameController(player1 = "Player 1", player2 = "Player 2") {
    const board = GameBoard();

    const players = [
        {
            name: player1,
            marker: "X",
            wins: 0
        },
        {
            name: player2,
            marker: "O",
            wins: 0
        }
    ]

    let activePlayer = players[0];
    let firstMoveActivePlayer = players[0];
    let winner = null;
    let player2IsBot = false;

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    const getGameBoard = () => board;

    const getWinner = () => winner;

    const resetWinner = () => winner = null;

    const setFirstMoveActivePlayer = () => {
        firstMoveActivePlayer = firstMoveActivePlayer === players[0] ? players[1] : players[0];
        activePlayer = firstMoveActivePlayer;
    }

    const getPlayers = () => players;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${activePlayer.name}'s turn:`)
    }

    const getMoveInputConsole = () => {
        move = []
        move[0] = prompt("Your input row:");
        move[1] = prompt("Your input column:");
        return move;
    }

    const checkWinner = () => {
        const victoryCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        indexArray = board.getAllIndex(activePlayer.marker);

        let isWinner = false;
        for(i in victoryCombinations) {
            isWinner = victoryCombinations[i].every((el) => indexArray.includes(el))
            if(isWinner) break;
        }

        return isWinner;
    }

    const playRound = (row, column) => {
        let validMove = board.playMove(activePlayer.marker, row, column);
        if(validMove === -1) {
            console.log("Invalid move, please select a different cell.");
            return -1;
        }

        if(checkWinner()) {
            winner = activePlayer;
            activePlayer.wins++;

            //console stuff below
            board.printBoard();
            console.log(`${activePlayer.name} won!`);
            console.log("--Game finished--");
            return;
        }

        if(board.isFull()) {
            players[0].wins++;
            players[1].wins++;
            return;
        }

        switchActivePlayer();
        printNewRound();
    }

    return {
        playRound,
        getMoveInputConsole,
        getActivePlayer,
        getPlayers,
        getBoard: board.getBoard,
        getWinner,
        boardIsFull: board.isFull,
        getGameBoard,
        resetWinner,
        setFirstMoveActivePlayer
    }
}

function ScreenController() {
    let game = GameController();
    const playerTurnH1 = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
    const warningH3 = document.querySelector(".warning");
    const winnerStatsDiv = document.querySelector(".winner-stats-container");
    const gameContainer = document.querySelector(".game-container");
    const confirmButton = document.querySelector(".confirm");
    const buttonsContainerDiv = document.querySelector(".buttons-container");
    const resetButton = document.querySelector(".reset-scores");
    const VSBotButton = document.querySelector(".bot-button");

    const updateBoardScreen = (lastCellRowSelected, lastCellColumnSelected) => {
        boardDiv.textContent = "";

        board = game.getBoard();
        playerTurnH1.textContent = `${game.getActivePlayer().name}'s turn (${game.getActivePlayer().marker}):`;

        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.rowIndex = rowIndex;
                cellButton.dataset.columnIndex = columnIndex;

                cellText = document.createElement("h5");
                cellText.textContent = cell.getMarker();

                if(columnIndex == lastCellColumnSelected && rowIndex == lastCellRowSelected)
                    cellText.classList.add("fadeIn");

                cellButton.appendChild(cellText);
                boardDiv.appendChild(cellButton);
            })
        })
    }

    const updateWinnerStatsScreen = () => {
        const winnerStatsHeader = document.querySelector(".winner-stats-header");
        const playerStatsDiv = document.querySelector(".player-stats-container");

        playerStatsDiv.textContent = '';
        winnerStatsHeader.textContent = '';
        winnerStatsHeader.textContent = "Total wins:"

        for(let i = 0; i < 2; i++) {
            const playerStats = document.createElement("h3");
            let winsUI = `<span style='font-size: 2rem; font-weight: 600;'> ${game.getPlayers()[i].wins}</span>`;
            playerStats.innerHTML = `${game.getPlayers()[i].name}:` + winsUI;

            playerStatsDiv.appendChild(playerStats);
        }
    }

    const showWinnerMessage = () => {
        const winnerMessageDiv = document.createElement("div");
        winnerMessageDiv.classList.add("winner-message");
        winnerMessageDiv.classList.add("visible");
        const winnerMessage = document.createElement("h1");

        if(game.getWinner()) {
            winnerMessage.textContent = `${game.getActivePlayer().name} won!`;
            playerTurnH1.textContent = `${game.getActivePlayer().name} won!`;
        }
        else {
            winnerMessage.textContent = `It's a draw`;
            playerTurnH1.textContent = `It's a draw`;
        }
        winnerMessageDiv.appendChild(winnerMessage);
        gameContainer.appendChild(winnerMessageDiv);

        setTimeout(() => {
            winnerMessageDiv.classList.add("hidden");
        }, 2000);
    }

    const handleNameInputs = () => {
        const player1NameInput = document.querySelector("#player-1");
        const player2NameInput = document.querySelector("#player-2");
        
        if(player1NameInput.value !== "") game.getPlayers()[0].name = player1NameInput.value;
        if(player2NameInput.value !== "") game.getPlayers()[1].name = player2NameInput.value;

        player1NameInput.value = "";
        player2NameInput.value = "";
        updateWinnerStatsScreen();
    }

    const clickPlayAgainHandler = () => {
        game.getGameBoard().clearBoard();
        boardDiv.addEventListener("click", clickHandlerBoard);
        updateBoardScreen();

        if(game.player2IsBot && game.getActivePlayer() === game.getPlayers()[1])
            playRandomMove(); 

        const playAgainButton = document.querySelector(".play-again");
        playAgainButton.removeEventListener("click", clickPlayAgainHandler);
        playAgainButton.classList.add("grayscale-filter");
    }

    const clickResetHandler = () => {
        game = GameController(); //reset game
        updateBoardScreen();
        updateWinnerStatsScreen();
        boardDiv.addEventListener("click", clickHandlerBoard);

        const playAgainButton = document.querySelector(".play-again");
        playAgainButton.classList.add("grayscale-filter");
    }

    const clickVSBotHandler = () => {
        game.player2IsBot = true;

        boardDiv.addEventListener("click", () => {
            setTimeout(playRandomMove, 2500);
        })
    }

    const playRandomMove = () => {
        const runRandomMove = () => {
            let randomRow = Math.floor(Math.random() * 3);
            let randomColumn = Math.floor(Math.random() * 3);
            console.log(randomRow);
            console.log(randomColumn);

            return [randomRow, randomColumn];
        }

        if(gameFinished()) return;

        let randomMove;
        do {
            randomMove = runRandomMove();
        } while(game.getBoard()[randomMove[0]][randomMove[1]].getMarker() != '');
        game.playRound(randomMove[0], randomMove[1]);
        updateBoardScreen(randomMove[0], randomMove[1]);
        handleEndGameState();
    }

    const gameFinished = () => {
        return (game.getWinner() || game.boardIsFull());
    }

    const handleEndGameState = () => {
        if(gameFinished()) {
            boardDiv.removeEventListener("click", clickHandlerBoard)
            showWinnerMessage();
            updateWinnerStatsScreen();

            game.resetWinner();
            game.setFirstMoveActivePlayer();

            const playAgainButton = document.querySelector(".play-again");
            playAgainButton.classList.remove("grayscale-filter");
            playAgainButton.addEventListener("click", clickPlayAgainHandler);
        }
    }

    const clickHandlerBoard = (e) => {
        const selectedRowIndex = e.target.dataset.rowIndex;
        const selectedColumnIndex = e.target.dataset.columnIndex;
        warningH3.textContent = "";

        //if there's a marker already, e.target will target the marker and not the cell
        if(!selectedRowIndex && !selectedColumnIndex) {
            warningH3.textContent = "Invalid move";
            return;
        }

        game.playRound(selectedRowIndex, selectedColumnIndex);
        updateBoardScreen(selectedRowIndex, selectedColumnIndex);

        handleEndGameState();
    }

    boardDiv.addEventListener("click", clickHandlerBoard);
    confirmButton.addEventListener("click", handleNameInputs);
    resetButton.addEventListener("click", clickResetHandler);
    VSBotButton.addEventListener("click", clickVSBotHandler);
    updateBoardScreen();
    updateWinnerStatsScreen();
}

ScreenController();





