import React, { useState, useEffect } from 'react';
import SudokuGrid from './SudokuGrid';
import { SudokuBoard } from './types';
import { generateSudoku, convertToSudokuBoard } from '../../utils/sudokuGenerator';

const SudokuContainer: React.FC = () => {
  const [board, setBoard] = useState<SudokuBoard>(() => {
    const puzzle = generateSudoku('medium');
    return convertToSudokuBoard(puzzle.puzzle);
  });
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won'>('playing');
  const [noteTakingEnabled, setNoteTakingEnabled] = useState<boolean>(false);

  const handleCellClick = (row: number, col: number) => {
    // Don't allow selecting fixed cells
    if (board[row][col].isFixed) {
      return;
    }
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (number: number) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    
    // Don't allow input on fixed cells
    if (board[row][col].isFixed) return;
    
    if (noteTakingEnabled) {
      // Toggle note (pencil mark)
      const newBoard = board.map((r, rIdx) =>
        r.map((c, cIdx) => {
          if (rIdx === row && cIdx === col) {
            const notes = [...c.notes];
            const noteIndex = notes.indexOf(number);
            
            if (noteIndex >= 0) {
              // Remove note if it exists
              notes.splice(noteIndex, 1);
            } else {
              // Add note if it doesn't exist
              notes.push(number);
            }
            
            return {
              ...c,
              notes,
            };
          }
          return c;
        })
      );
      
      setBoard(newBoard);
    } else {
      // Set definite value
      // Validate the move
      const isValid = validateMove(board, row, col, number);
      
      // Clear any existing error when user inputs a number
      const newBoard = board.map((r, rIdx) =>
        r.map((c, cIdx) => {
          if (rIdx === row && cIdx === col) {
            return {
              ...c,
              value: number,
              isError: !isValid,
              notes: [], // Clear notes when entering a definite value
            };
          }
          return c;
        })
      );
      
      setBoard(newBoard);
      
      // Check if game is won after valid move
      if (isValid && checkWinCondition(newBoard)) {
        setGameStatus('won');
      }
    }
  };

  // Validate if placing a number in a cell is valid according to Sudoku rules
  const validateMove = (board: SudokuBoard, row: number, col: number, number: number): boolean => {
    // Check row
    for (let c = 0; c < 9; c++) {
      if (c !== col && board[row][c].value === number) {
        return false;
      }
    }
    
    // Check column
    for (let r = 0; r < 9; r++) {
      if (r !== row && board[r][col].value === number) {
        return false;
      }
    }
    
    // Check 3x3 subgrid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if ((r !== row || c !== col) && board[r][c].value === number) {
          return false;
        }
      }
    }
    
    return true;
  };

  // Check if the Sudoku puzzle is solved correctly
  const checkWinCondition = (board: SudokuBoard): boolean => {
    // First check if all cells are filled
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col].value === null) {
          return false; // Empty cell found
        }
      }
    }
    
    // Then check if all placements are valid according to Sudoku rules
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = board[row][col].value;
        if (value !== null) {
          // Temporarily set this cell to 0 to check if the placement is valid
          board[row][col].value = null;
          const isValid = validateMove(board, row, col, value!);
          board[row][col].value = value; // Restore the value
          
          if (!isValid) {
            return false; // Invalid placement found
          }
        }
      }
    }
    
    return true; // All cells filled and all placements valid
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedCell || gameStatus === 'won') return;
      
      // Only handle number keys 1-9
      if (event.key >= '1' && event.key <= '9') {
        event.preventDefault(); // Prevent scrolling with arrow keys when inputting
        const number = parseInt(event.key, 10);
        handleNumberInput(number);
      }
      
      // Handle Delete or Backspace to clear cell
      if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        if (selectedCell) {
          const { row, col } = selectedCell;
          // Don't allow clearing fixed cells
          if (!board[row][col].isFixed) {
            const newBoard = board.map((r, rIdx) =>
              r.map((c, cIdx) => {
                if (rIdx === row && cIdx === col) {
                  return {
                    ...c,
                    value: null,
                    isError: false,
                  };
                }
                return c;
              })
            );
            setBoard(newBoard);
          }
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCell, board, gameStatus]);

   return (
     <div className="flex flex-col items-center gap-8 p-4 min-h-screen" tabIndex={0} onKeyDown={() => {}}>
       <div className="text-center">
         <h2 className="text-3xl font-bold text-emerald-900">Sudoku Challenge</h2>
         <p className="text-emerald-700/60">Test your logic, ant!</p>
         
         {/* Win message */}
         {gameStatus === 'won' && (
           <div className="mt-4 p-4 bg-emerald-50/90 rounded-xl border border-emerald-200/50">
             <h3 className="text-2xl font-bold text-emerald-900 mb-2">¡Felicidades!</h3>
             <p className="text-emerald-700">Has resuelto el Sudoku correctamente.</p>
           </div>
         )}
       </div>
       
       {/* Note-taking toggle */}
       <div className="flex items-center gap-2">
         <button
           onClick={() => setNoteTakingEnabled(!noteTakingEnabled)}
           className={`w-10 h-10 flex items-center justify-center rounded-lg 
           ${noteTakingEnabled ? 'bg-emerald-200/90 text-emerald-900 font-bold shadow-md' : 'bg-emerald-50/80 hover:bg-emerald-100/80 text-emerald-600/80'}`}
         >
           {noteTakingEnabled ? '✏️' : '🔢'}
         </button>
         <span className="text-sm text-emerald-600/60">
           {noteTakingEnabled ? 'Modo notas' : 'Modo números'}
         </span>
       </div>
       
       <SudokuGrid 
         board={board} 
         onCellClick={handleCellClick}
         selectedCell={selectedCell}
         noteTakingEnabled={noteTakingEnabled}
       />
       
       {/* Number Pad - only show when playing and cell is selected and not fixed */}
       {gameStatus === 'playing' && selectedCell && !board[selectedCell.row][selectedCell.col].isFixed && (
         <div className="grid grid-cols-3 gap-2">
           {[1,2,3,4,5,6,7,8,9].map(num => (
             <button
               key={num}
               onClick={() => handleNumberInput(num)}
               className={`w-full h-12 text-lg font-bold 
               ${noteTakingEnabled ? 'bg-emerald-50/60 text-emerald-600/80 hover:bg-emerald-100/80' : 'text-emerald-900 bg-emerald-50/80 rounded-lg hover:bg-emerald-100 transition-colors duration-200 shadow-md'}
               ${noteTakingEnabled && board[selectedCell.row][selectedCell.col].notes.includes(num) ? 'bg-emerald-200/70 text-emerald-900 font-bold' : ''}
               ${!noteTakingEnabled && 'text-emerald-900 bg-emerald-50/80 rounded-lg hover:bg-emerald-100 transition-colors duration-200 shadow-md'}`}
             >
               {num}
             </button>
           ))}
         </div>
       )}
       
       <div className="text-sm text-emerald-800/40">
         <p>Design System: Ants Garden v1.0</p>
       </div>
     </div>
   );
 };

export default SudokuContainer;
