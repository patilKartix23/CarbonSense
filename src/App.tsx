import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Chatbot from './components/common/Chatbot'
import Dashboard from './pages/Dashboard'
import CarbonTracker from './pages/CarbonTracker'
import ClimateMap from './pages/ClimateMap'
import SocialFeed from './pages/SocialFeed'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import CCUSPage from './pages/CCUSPage'
import EcoShoppingPage from './pages/EcoShoppingPage'
import AdvocacyPage from './pages/AdvocacyPage'
import { AuthProvider } from './contexts/AuthContext'
import { LocationProvider } from './contexts/LocationContext'

function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)

  return (
    <AuthProvider>
      <LocationProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/carbon" element={<CarbonTracker />} />
              <Route path="/ccus" element={<CCUSPage />} />
              <Route path="/eco-shopping" element={<EcoShoppingPage />} />
              <Route path="/map" element={<ClimateMap />} />
              <Route path="/social" element={<SocialFeed />} />
              <Route path="/advocacy" element={<AdvocacyPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          <Footer />
          
          {/* Chatbot */}
          <Chatbot 
            isOpen={isChatbotOpen} 
            onToggle={() => setIsChatbotOpen(!isChatbotOpen)}
            userId="default"
          />
          
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#374151',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              },
            }}
          />
        </div>
      </LocationProvider>
    </AuthProvider>
  )
}

export default App
