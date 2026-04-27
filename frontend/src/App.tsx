import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Navbar from './components/Navbar'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#EED6BF] p-2 sm:p-4 md:p-6 lg:p-8 flex flex-col gap-3 sm:gap-4 md:gap-6 lg:gap-8">
        <div className="max-w-[1600px] mx-auto w-full">
          <Navbar />
        </div>
        <div className="max-w-[1600px] mx-auto w-full flex-1 flex flex-col bg-cream-200 rounded-2xl sm:rounded-3xl md:rounded-4xl shadow-soft border border-black/5 overflow-hidden\">
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/home" element={<Home />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
