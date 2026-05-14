import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
        <h1 className="text-4xl font-bold text-emerald-800 mb-4">🐜 Ants Garden</h1>
        <p className="text-gray-600 mb-6">Bienvenido al jardín de hormigas</p>
        
        <div className="space-y-4">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            Contador: {count}
          </button>
          
          <div className="text-sm text-gray-500">
            <p>Vite + React + TypeScript + PWA</p>
            <p className="mt-2">Listo para construir algo grande 🐜✨</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
