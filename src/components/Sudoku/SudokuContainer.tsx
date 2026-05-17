import React, { useState } from 'react';
import SudokuGrid from './SudokuGrid';
import { SudokuBoard } from './types';

const MOCK_BOARD: SudokuBoard = Array(9).fill(null).map((_, rowIndex) =>
  Array(9).fill(null).map((_, colIndex) => ({
    value: (rowIndex === colIndex || rowIndex + colIndex === 8) ? (rowIndex + colIndex + 1) % 9 || 9 : null,
    isFixed: (rowIndex === colIndex || rowIndex + colIndex === 8),
    isError: false,
    isHighlighted: false,
  }))
);

const SudokuContainer: React.FC = () => {
  const [board, setBoard] = useState<SudokuBoard>(MOCK_BOARD);

  const handleCellClick = (row: number, col: number) => {
    console.log(`Cell clicked: ${row}, ${col}`);
    // For now, just highlight the cell
    const newBoard = board.map((r, rIdx) =>
      r.map((c, cIdx) => ({
        ...c,
        isHighlighted: rIdx === row && cIdx === col
      }))
    );
    setBoard(newBoard);
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-emerald-900">Sudoku Challenge</h2>
        <p className="text-emerald-700/60">Test your logic, ant!</p>
      </div>
      
      <SudokuGrid board={board} onCellClick={handleCellClick} />
      
      <div className="text-sm text-emerald-800/40">
        <p>Design System: Ants Garden v1.0</p>
      </div>
    </div>
  );
};

export default SudokuContainer;
