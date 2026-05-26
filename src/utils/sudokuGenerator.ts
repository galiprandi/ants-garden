/**
 * Sudoku Generator Utility
 * Generates valid Sudoku puzzles with configurable difficulty
 */

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface SudokuPuzzle {
  solution: number[][];
  puzzle: number[][];
}

/**
 * Checks if placing a number at a specific position is valid according to Sudoku rules
 */
function isValidMove(board: number[][], row: number, col: number, num: number): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) {
      return false;
    }
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) {
      return false;
    }
  }

  // Check 3x3 subgrid
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Solves a Sudoku board using backtracking algorithm
 */
function solveSudoku(board: number[][]): boolean {
  let row = -1;
  let col = -1;
  let isEmpty = true;
  
  // Find an empty cell
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        row = i;
        col = j;
        isEmpty = false;
        break;
      }
    }
    if (!isEmpty) break;
  }

  // If no empty cell found, puzzle is solved
  if (isEmpty) return true;

  // Try digits 1-9
  for (let num = 1; num <= 9; num++) {
    if (isValidMove(board, row, col, num)) {
      board[row][col] = num;
      
      if (solveSudoku(board)) {
        return true;
      }
      
      // Backtrack
      board[row][col] = 0;
    }
  }
  
  return false;
}

/**
 * Generates a complete, valid Sudoku solution
 */
function generateSolution(): number[][] {
  // Start with empty board
  const board: number[][] = Array(9).fill(0).map(() => Array(9).fill(0));
  
  // Fill diagonal 3x3 boxes first (they don't interfere with each other)
  for (let box = 0; box < 9; box += 3) {
    fillBox(board, box, box);
  }
  
  // Solve the rest using backtracking
  solveSudoku(board);
  
  return board;
}

/**
 * Fills a 3x3 box with random numbers
 */
function fillBox(board: number[][], rowStart: number, colStart: number): void {
  const nums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      board[rowStart + i][colStart + j] = nums[i * 3 + j];
    }
  }
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Removes numbers from a solved Sudoku to create a puzzle based on difficulty
 */
function removeNumbers(board: number[][], difficulty: Difficulty): number[][] {
  const puzzle = board.map(row => [...row]); // Deep copy
  
  // Number of cells to remove based on difficulty
  let cellsToRemove: number;
  switch (difficulty) {
    case 'easy':
      cellsToRemove = 30;
      break;
    case 'medium':
      cellsToRemove = 40;
      break;
    case 'hard':
      cellsToRemove = 50;
      break;
    case 'expert':
      cellsToRemove = 60;
      break;
    default:
      cellsToRemove = 40;
  }
  
  // Create list of all cell positions
  const positions: [number, number][] = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push([row, col]);
    }
  }
  
  // Shuffle positions
  shuffleArray(positions);
  
  // Remove numbers from random positions
  for (let i = 0; i < cellsToRemove && i < positions.length; i++) {
    const [row, col] = positions[i];
    puzzle[row][col] = 0;
  }
  
  return puzzle;
}

/**
 * Generates a new Sudoku puzzle with solution
 */
export function generateSudoku(difficulty: Difficulty = 'medium'): SudokuPuzzle {
  // Generate a complete solution
  const solution = generateSolution();
  
  // Create puzzle by removing numbers based on difficulty
  const puzzle = removeNumbers(solution, difficulty);
  
  return { solution, puzzle };
}

/**
 * Converts Sudoku board (number[][]) to SudokuBoard (SudokuCell[][])
 */
export function convertToSudokuBoard(puzzle: number[][]): import('../components/Sudoku/types').SudokuBoard {
  return puzzle.map((row) =>
    row.map((value) => ({
      value: value === 0 ? null : value,
      isFixed: value !== 0,
      isError: false,
      isHighlighted: false,
      notes: [],
    }))
  );
}