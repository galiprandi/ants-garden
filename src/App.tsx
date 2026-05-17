import SudokuContainer from './components/Sudoku/SudokuContainer'

function App() {
  return (
    <div className="min-h-screen bg-[#f0f4f0] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="fixed -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />
      <div className="fixed -bottom-24 -left-24 h-96 w-96 rounded-full bg-amber-100/30 blur-3xl pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-2xl">
        <SudokuContainer />
      </div>
    </div>
  )
}

export default App
