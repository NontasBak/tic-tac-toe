function Cell() {
    let marker = 0;
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
        if(board[row][column].getMarker() !== 0)
            return -1;

        board[row][column].setMarker(marker);
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

    const getMoveInput = () => {
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
        board.playMove(activePlayer.marker, row, column);

        if(checkWinner()) {
            board.printBoard();
            console.log(`${activePlayer.name} won!`);
            console.log("--Game finished--");
            return;
        }

        switchActivePlayer();
        printNewRound();
        let move = getMoveInput();
        playRound(move[0], move[1]);
    }

    //First time running the game
    printNewRound();
    initialMoves = getMoveInput();
    playRound(initialMoves[0], initialMoves[1]);

    return {
        playRound,
        getMoveInput
    }
}

game = GameController();

