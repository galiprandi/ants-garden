import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-[#f0f4f0] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] flex items-center justify-center p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white/80 backdrop-blur-md border border-emerald-100 shadow-[0_20px_50px_rgba(16,185,129,0.15)]">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-emerald-100/50 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-amber-100/50 blur-3xl" />

        <div className="relative z-10 p-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-emerald-100 text-emerald-600 text-3xl shadow-inner">
            🐜
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-emerald-900 mb-2">
            Ants Garden
          </h1>
          <p className="text-emerald-700/70 font-medium mb-8">
            Bienvenido al jardín de hormigas
          </p>
          
          <div className="space-y-6">
            <button 
              onClick={() => setCount((count) => count + 1)}
              className="group relative w-full overflow-hidden rounded-xl bg-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-emerald-200 active:scale-[0.98]"
            >
              <span className="relative z-10">Contador: {count}</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            </button>
            
            <div className="pt-4 border-t border-emerald-50">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-800/40">
                Vite • React • TypeScript
              </p>
              <p className="mt-2 text-sm text-emerald-600/60 italic">
                Listo para construir algo grande 🐜✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
