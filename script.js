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
    
    for(let i = 0; i < size; i++)
    {
        board[i] = []
        for(let j = 0; j < size; j++)
        {
            board[i][j] = Cell();
            board[i][j].setIndex(3*i + j);
        }
    }

    const getBoard = () => board;

    const playMove = (marker, row, column) => {
        if(board[row][column].getMarker() !== "")
            return -1;

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

    return {
        getBoard,
        playMove,
        printBoard,
        getAllIndex
    }
}

function GameController(player1 = "Player 1", player2 = "Player 2") {
    const board = GameBoard();

    const players = [
        {
            name: player1,
            marker: "X"
        },
        {
            name: player2,
            marker: "O"
        }
    ]

    let activePlayer = players[0];

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

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
            console.warn("Invalid move, please select a different cell.")
            return -1;
        }

        if(checkWinner()) {
            board.printBoard();
            console.log(`${activePlayer.name} won!`);
            console.log("--Game finished--");
            return;
        }

        switchActivePlayer();
        printNewRound();
    }

    return {
        playRound,
        getMoveInputConsole,
        getActivePlayer,
        getBoard: board.getBoard
    }
}

function ScreenController() {
    const game = GameController();
    const playerTurnH1 = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
    const warningH3 = document.querySelector(".warning")

    const updateScreen = (lastCellRowSelected, lastCellColumnSelected) => {
        boardDiv.textContent = "";

        board = game.getBoard();
        playerTurnH1.textContent = `${game.getActivePlayer().name}'s turn:`

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

    const clickHandlerBoard = (e) => {
        const selectedRowIndex = e.target.dataset.rowIndex;
        const selectedColumnIndex = e.target.dataset.columnIndex;
        warningH3.textContent = "";

        if(!selectedRowIndex && !selectedColumnIndex) return;

        let validRound = game.playRound(selectedRowIndex, selectedColumnIndex);
        if(validRound === -1) {
            warningH3.textContent = "Invalid move";
            return;
        }
        updateScreen(selectedRowIndex, selectedColumnIndex);
    }

    boardDiv.addEventListener("click", clickHandlerBoard);
    updateScreen(-1, -1);
}

ScreenController();





