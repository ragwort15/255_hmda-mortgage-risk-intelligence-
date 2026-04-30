import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import SimulationBanner from './components/SimulationBanner'
import RiskPredictor from './pages/RiskPredictor'
import ModelComparison from './pages/ModelComparison'
import SHAPExplorer from './pages/SHAPExplorer'
import About from './pages/About'
import Login from './pages/Login'

const STORAGE_KEY = 'hmda_user'

export default function App() {
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  })
  const [simulationMode, setSimulationMode] = useState(false)

  const login = (u) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    setUser(u)
  }
  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  useEffect(() => {
    if (!user) setSimulationMode(false)
  }, [user])

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login onLogin={login} />} />
      </Routes>
    )
  }

  return (
    <div className="min-h-screen flex bg-slate-100">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 ml-0 md:ml-64">
        {simulationMode && <SimulationBanner />}
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/predict" replace />} />
            <Route
              path="/predict"
              element={<RiskPredictor onSimulationChange={setSimulationMode} />}
            />
            <Route path="/models" element={<ModelComparison />} />
            <Route path="/shap" element={<SHAPExplorer />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/predict" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
