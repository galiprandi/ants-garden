import React from 'react';
import { SudokuBoard } from './types';

interface SudokuGridProps {
  board: SudokuBoard;
  onCellClick: (row: number, col: number) => void;
  selectedCell: { row: number; col: number } | null;
  noteTakingEnabled?: boolean;
}

const SudokuGrid: React.FC<SudokuGridProps> = ({ board, onCellClick, selectedCell, noteTakingEnabled = false }) => {
  // Get currently selected cell's value for matching highlights
  const selectedValue = selectedCell ? board[selectedCell.row][selectedCell.col].value : null;

  const renderNotes = (notes: number[]) => {
    return (
      <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-0.5 md:p-1 pointer-events-none select-none">
        {Array.from({ length: 9 }, (_, i) => {
          const num = i + 1;
          const hasNote = notes.includes(num);
          return (
            <div
              key={num}
              className="flex items-center justify-center text-[9px] md:text-[10px] font-semibold text-emerald-600/70 leading-none transition-opacity duration-200 hover:text-emerald-800/90"
            >
              {hasNote ? num : ''}
            </div>
          );
        })}
      </div>
    );
  };

  const renderCell = (row: number, col: number) => {
    const cell = board[row][col];
    
    // Check various highlight levels for advanced UI guidance
    const isSelected = selectedCell !== null && selectedCell.row === row && selectedCell.col === col;
    
    const isSameRowOrCol = selectedCell !== null && (selectedCell.row === row || selectedCell.col === col);
    
    const isSameSubgrid = selectedCell !== null && (
      Math.floor(selectedCell.row / 3) === Math.floor(row / 3) &&
      Math.floor(selectedCell.col / 3) === Math.floor(col / 3)
    );

    const isMatchingValue = selectedValue !== null && cell.value === selectedValue && !isSelected;

    // Grid lines: Thicker lines between 3x3 blocks, thin ones elsewhere
    const borderRight = (col === 2 || col === 5) ? 'border-r-2 md:border-r-[3px] border-emerald-800/80' : col !== 8 ? 'border-r border-emerald-100/50' : '';
    const borderBottom = (row === 2 || row === 5) ? 'border-b-2 md:border-b-[3px] border-emerald-800/80' : row !== 8 ? 'border-b border-emerald-100/50' : '';

    // Color theme classes
    let bgClass = 'bg-white';
    let textClass = 'text-emerald-950';

    if (isSelected) {
      bgClass = 'bg-emerald-200/90 shadow-inner scale-[1.02] z-10';
      textClass = 'text-emerald-950 font-bold';
    } else if (isMatchingValue) {
      bgClass = 'bg-amber-100/70 border border-amber-300/40 shadow-sm z-10';
      textClass = 'text-emerald-950 font-bold animate-pulse duration-1000';
    } else if (isSameRowOrCol || isSameSubgrid) {
      bgClass = 'bg-emerald-50/40';
    }

    if (cell.isError) {
      bgClass = isSelected ? 'bg-rose-100' : 'bg-rose-50/80';
      textClass = 'text-rose-600 font-bold';
    } else if (cell.isFixed) {
      textClass = isSelected ? 'text-emerald-950 font-extrabold' : 'text-slate-800 font-extrabold';
    } else {
      // Special styling for note-taking mode
      if (noteTakingEnabled && cell.value === null && cell.notes.length > 0) {
        bgClass = 'bg-emerald-50/60';
        textClass = 'text-emerald-600/80';
      } else if (noteTakingEnabled && cell.value === null) {
        bgClass = 'bg-emerald-50/30';
        textClass = 'text-emerald-400/50';
      } else {
        textClass = cell.isError ? 'text-rose-600' : 'text-emerald-600 font-medium';
      }
    }

    return (
      <div
        key={`${row}-${col}`}
        onClick={() => onCellClick(row, col)}
        className={`
          relative flex items-center justify-center aspect-square text-base sm:text-lg md:text-xl font-sans cursor-pointer select-none transition-all duration-200
          ${borderRight} ${borderBottom} ${bgClass} ${textClass}
          hover:bg-emerald-50/80 hover:scale-[1.01] hover:shadow-sm
          ${noteTakingEnabled && cell.value === null && 'hover:bg-emerald-100/50'}
        `}
      >
        {cell.value !== null ? (
          <span className="transform transition-transform active:scale-95">
            {cell.value}
          </span>
        ) : (
          renderNotes(cell.notes)
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-[430px] mx-auto p-1.5 bg-emerald-900/10 rounded-2xl border border-emerald-200/50 shadow-[0_20px_50px_rgba(16,185,129,0.12)]">
      <div className="grid grid-cols-9 w-full aspect-square bg-white border-2 border-emerald-900 rounded-xl overflow-hidden shadow-md">
        {board.map((row, rowIndex) => (
          row.map((_, colIndex) => renderCell(rowIndex, colIndex))
        ))}
      </div>
    </div>
  );
};

export default SudokuGrid;