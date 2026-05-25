export type SudokuCell = {
  value: number | null;
  isFixed: boolean;
  isError: boolean;
  isHighlighted: boolean;
  notes: number[]; // Pencil marks/draft values for candidates
};

export type SudokuBoard = SudokuCell[][];
