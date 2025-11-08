import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  Menu, 
  X, 
  Home, 
  BarChart3, 
  Map, 
  Users, 
  User,
  LogOut,
  Leaf,
  Factory,
  ShoppingBag,
  Megaphone
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import LanguageSwitcher from '../LanguageSwitcher'

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()
  const { t } = useTranslation()

  const navigation = [
    { name: t('nav.dashboard'), href: '/', icon: Home },
    { name: t('nav.carbonTracker'), href: '/carbon', icon: BarChart3 },
    { name: t('nav.ccusHub'), href: '/ccus', icon: Factory },
    { name: t('nav.ecoMarket'), href: '/eco-shopping', icon: ShoppingBag },
    { name: t('nav.climateMap'), href: '/map', icon: Map },
    { name: t('nav.socialFeed'), href: '/social', icon: Users },
    { name: t('nav.advocacy'), href: '/advocacy', icon: Megaphone },
  ]

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-climate-blue-500 to-climate-green-500 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">CarbonSense</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-climate-blue-50 text-climate-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  {user?.profile_image_url ? (
                    <img
                      src={user.profile_image_url}
                      alt={user.username}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span>{user?.username}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('common.logout')}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  {t('nav.signUp')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium ${
                    isActive(item.href)
                      ? 'bg-climate-blue-50 text-climate-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            
            {isAuthenticated ? (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-1">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium bg-climate-blue-600 text-white hover:bg-climate-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
