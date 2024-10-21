// Base Player class
class Player {
  constructor(name, symbol) {
    this.name = name;
    this.symbol = symbol;
  }

  async takeTurn(board) {
    // Default behavior: do nothing
    // Can be overridden by subclasses
  }
}

// HumanPlayer class inherits from Player
class HumanPlayer extends Player {
  constructor(name, symbol) {
    super(name, symbol);
  }

  async takeTurn(board) {
    return new Promise((resolve) => {
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const askForMove = () => {
        console.log(`${this.name}'s turn (${this.symbol}). Please enter a position (0-8):`);
        readline.question('', (move) => {
          move = parseInt(move);
          if (move >= 0 && move <= 8) {
            if (board.makeMove(move, this.symbol)) {
              readline.close();
              resolve(move);
            } else {
              console.log('Position already taken, try again.');
              askForMove(); // Re-ask for move if invalid
            }
          } else {
            console.log('Invalid input. Please enter a position between 0 and 8.');
            askForMove(); // Re-ask for move if invalid
          }
        });
      };

      askForMove(); // Initial prompt
    });
  }
}

// AIPlayer class inherits from Player
class AIPlayer extends Player {
  constructor(name, symbol) {
    super(name, symbol);
  }

  async takeTurn(board) {
    return new Promise((resolve) => {
      console.log(`${this.name}'s turn (${this.symbol}).`);
      setTimeout(() => {
        let move;
        // Find a valid move
        do {
          move = Math.floor(Math.random() * 9);
        } while (!board.makeMove(move, this.symbol)); // Keep trying until a valid move is found
        console.log(`${this.name} chose position: ${move}`);
        resolve(move);
      }, 1000); // Simulating delay for AI decision
    });
  }
}

// Board class to handle the game state
class Board {
  constructor() {
    this.board = Array(9).fill(null); // Initialize with 9 nulls
  }

  display() {
    console.log(`
      ${this.board[0] || ' '} | ${this.board[1] || ' '} | ${this.board[2] || ' '}
      -----------
      ${this.board[3] || ' '} | ${this.board[4] || ' '} | ${this.board[5] || ' '}
      -----------
      ${this.board[6] || ' '} | ${this.board[7] || ' '} | ${this.board[8] || ' '}
    `);
  }

  makeMove(position, symbol) {
    if (this.board[position] === null) {
      this.board[position] = symbol;
      return true;
    }
    return false;
  }

  checkWin() {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        return this.board[a]; // Return the winning symbol
      }
    }
    return null;
  }

  isFull() {
    return this.board.every(cell => cell !== null);
  }
}

// Game class to manage the game flow
class Game {
  constructor(player1, player2) {
    this.board = new Board();
    this.players = [player1, player2];
    this.currentPlayerIndex = 0;
  }

  async start() {
    console.log("Starting Tic Tac Toe game!");
    let winner = null;

    while (!winner && !this.board.isFull()) {
      this.board.display();
      const currentPlayer = this.players[this.currentPlayerIndex];

      // Wait for player to take a turn
      let move;
      move = await currentPlayer.takeTurn(this.board);
      winner = this.board.checkWin();
      this.currentPlayerIndex = 1 - this.currentPlayerIndex; // Switch players
    }

    this.board.display();
    if (winner) {
      console.log(`${winner} wins!`);
    } else {
      console.log("It's a draw!");
    }
  }
}

// Initialize players: AI and Human
const player1 = new AIPlayer("AI Player", "X");
const player2 = new HumanPlayer("Human Player", "O");

const game = new Game(player1, player2);
game.start();
