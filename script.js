function Cell() {
    let value = 0;

    const getValue = () => value;

    const setValue = (player) => {
        value = player;
    };

    return {
        getValue,
        setValue
    }
}

function GameBoard() {
    const size = 3;

    let board = [];
    
    for(let i = 0; i < size; i++)
    {
        board[i] = []
        for(let j = 0; j < size; j++)
            board[i][j] = Cell();
    }

    const getBoard = () => board;

    const playMove = (player, row, column) => {
        if(board[row][column] !== 0)
            return;

        board[row][column].setValue(player);
    }

    const printBoard = () => {
        boardWithValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log("Printing board...");
        boardWithValues.forEach((row) => { 
            let rowString = "";
            row.forEach((value) => rowString += `${value} `)
            console.log(rowString);
            })
    }

    return {
        getBoard,
        playMove,
        printBoard
    }
}

board = GameBoard();
board.printBoard();
