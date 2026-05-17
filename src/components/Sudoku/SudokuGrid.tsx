import React from 'react';
import { SudokuBoard } from './types';

interface SudokuGridProps {
  board: SudokuBoard;
  onCellClick: (row: number, col: number) => void;
}

const SudokuGrid: React.FC<SudokuGridProps> = ({ board, onCellClick }) => {
  const renderCell = (row: number, col: number) => {
    const cell = board[row][col];
    
    // Determine border styles for the 3x3 subgrids
    const borderRight = (col + 1) % 3 === 0 && col !== 8 ? 'border-r-2 border-emerald-800' : 'border-r border-emerald-100';
    const borderBottom = (row + 1) % 3 === 0 && row !== 8 ? 'border-b-2 border-emerald-800' : 'border-b border-emerald-100';
    const borderLeft = col === 0 ? 'border-l-2 border-emerald-800' : '';

    return (
      <div
        key={`${row}-${col}`}
        onClick={() => onCellClick(row, col)}
        className={`
          relative flex items-center justify-center aspect-square text-xl font-semibold cursor-pointer transition-all
          ${borderRight} ${borderBottom} ${borderLeft}
          ${cell.isHighlighted ? 'bg-emerald-100' : 'bg-white'}
          ${cell.isError ? 'text-red-500' : 'text-emerald-900'}
          hover:bg-emerald-50
        `}
      >
        {cell.value !== null ? cell.value : ''}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-9 w-full max-w-[450px] mx-auto border-l-2 border-t-2 border-emerald-800 shadow-2xl rounded-sm overflow-hidden">
      {board.map((row, rowIndex) => (
        row.map((_, colIndex) => renderCell(rowIndex, colIndex))
      ))}
    </div>
  );
};

export default SudokuGrid;
