// Start Logic
const header = document.querySelector('#header');
const startBtn = document.querySelector('button');
const htmlBoard = document.querySelector('#board');
const player = document.getElementById('currentPlayerDisplay');
const playerText = document.querySelector('#currPlayerText');
const playerPiece = document.querySelector('.playerPiece');
const resetBtn = document.querySelector('.winReset');
let stopInterval = null;

startBtn.addEventListener('click', () => {
    header.style.marginTop = '5%';
    startBtn.style.display = 'none';
    htmlBoard.style.opacity = '1';
    player.style.display = 'block';
});

// Game Logic
const WIDTH = 7;
const HEIGHT = 6;

// active player: 1 or 2
let currPlayer = 1;

// array of rows, each row is array of cells  (board[y][x])
let board = [];

resetBtn.addEventListener('click', () => {
    currPlayer = 1;
    board = [];
    htmlBoard.innerHTML = '';
    htmlBoard.style.pointerEvents = 'auto';
    clearInterval(stopInterval);
    playerText.innerText = `Player ${currPlayer}'s Turn`;
    playerPiece.style.backgroundColor = 'red';
    resetBtn.style.display = 'none';
    makeBoard();
    makeHtmlBoard();
});

// makeBoard: create in-JS board structure
const makeBoard = () => {
    for (let column = 0; column < HEIGHT; column++) {
        let row = [];
        for (let cell = 0; cell < WIDTH; cell++) {
            row.push(null);
        }
        board.push(row);
    }
};

// makeHtmlBoard: make HTML table and row of column tops.
const makeHtmlBoard = () => {
    // Create table-row element with ID of column-top and a click event-listener
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', handleClick);

    // Create table cells, append them to the table row element, and append row to htmlBoard
    for (let x = 0; x < WIDTH; x++) {
        const headCell = document.createElement('td');
        headCell.setAttribute('id', x);
        top.append(headCell);
    }
    htmlBoard.append(top);

    // Create a (y, x) grid using HTML table elements and nested for-loops
    for (let y = 0; y < HEIGHT; y++) {
        const row = document.createElement('tr');
        row.classList.add('gameRows');
        for (let x = 0; x < WIDTH; x++) {
            const cell = document.createElement('td');
            const overlay = document.createElement('div');
            cell.setAttribute('id', `${y}-${x}`);
            overlay.classList.add('overlay');
            cell.append(overlay);
            row.append(cell);
        }
        htmlBoard.append(row);
    }
};

// findSpotForCol: given column x, return top empty y (null if filled)
const findSpotForCol = (x) => {
    for (let y = HEIGHT - 1; y >= 0; y--) {
        if (board[y][x] === null) {
            return y;
        }
    }
    return null;
};

// placeInTable: update DOM to place piece into HTML table of board
const placeInTable = (y, x) => {
    const selectedCell = document.getElementById(`${y}-${x}`);
    const selectedCellChild = selectedCell.children[0];
    const piece = document.createElement('div');
    piece.classList.add('piece');
    if (currPlayer === 1) {
        piece.classList.toggle('p1');
    } else {
        piece.classList.toggle('p2');
    }
    selectedCellChild.append(piece);
};

// endGame: announce game end
// replace alert with in-game msg
const endGame = (msg) => {
    htmlBoard.style.pointerEvents = 'none';
    resetBtn.style.display = 'block';
    if (msg === 'tie') {
        playerText.innerText = `Its a Tie!`;
        stopInterval = setInterval(() => {
            if (playerPiece.style.backgroundColor === 'red') {
                playerPiece.style.backgroundColor = 'blue';
            } else {
                playerPiece.style.backgroundColor = 'red';
            }
        }, 750);
    } else {
        playerText.innerText = `Player ${currPlayer} Won!`;
    }
};

// isBoardFilled: checks for tie via if game-board is filled
const isBoardFilled = () => {
    for (let y = 0; y < HEIGHT; y++) {
        const bool = board[y].every((cell) => typeof cell === 'number');
        if (bool) {
            continue;
        } else {
            return false;
        }
    }
    endGame('tie');
};

// handleClick: handle click of column top to play piece
const handleClick = (evt) => {
    // get x from ID of clicked cell
    let x = evt.target.id;

    // get next spot in column (if none, ignore click)
    let y = findSpotForCol(x);
    if (y === null) {
        return;
    }

    // place piece in board and add to HTML table
    placeInTable(y, x);
    board[y][x] = currPlayer;

    // check for win
    if (checkForWin()) {
        return endGame(`Player ${currPlayer} won!`);
    }

    // check for tie
    isBoardFilled();

    // switch players
    if (currPlayer === 1) {
        currPlayer = 2;
        playerText.innerText = `Player ${currPlayer}'s Turn`;
        playerPiece.style.backgroundColor = 'blue';
    } else {
        currPlayer = 1;
        playerText.innerText = `Player ${currPlayer}'s Turn`;
        playerPiece.style.backgroundColor = 'red';
    }
};

// checkForWin: check board cell-by-cell for "does a win start here?"

const checkForWin = () => {
    const _win = (cells) => {
        // Check four cells to see if they're all color of current player
        //  - cells: list of four (y, x) cells
        //  - returns true if all are legal coordinates & all match currPlayer

        return cells.every(
            ([y, x]) =>
                // ensure cell coordinates are within range of board
                y >= 0 &&
                y < HEIGHT &&
                x >= 0 &&
                x < WIDTH &&
                // actual checking condition
                board[y][x] === currPlayer
        );
    };

    // loops through board and checks if there is a legal win
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            let horiz = [
                [y, x],
                [y, x + 1],
                [y, x + 2],
                [y, x + 3],
            ];
            let vert = [
                [y, x],
                [y + 1, x],
                [y + 2, x],
                [y + 3, x],
            ];
            let diagDR = [
                [y, x],
                [y + 1, x + 1],
                [y + 2, x + 2],
                [y + 3, x + 3],
            ];
            let diagDL = [
                [y, x],
                [y + 1, x - 1],
                [y + 2, x - 2],
                [y + 3, x - 3],
            ];

            if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                return true;
            }
        }
    }
};

makeBoard();
makeHtmlBoard();
