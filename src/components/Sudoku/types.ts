export type SudokuCell = {
  value: number | null;
  isFixed: boolean;
  isError: boolean;
  isHighlighted: boolean;
};

export type SudokuBoard = SudokuCell[][];
