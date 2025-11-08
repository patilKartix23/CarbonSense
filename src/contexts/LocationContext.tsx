import React, { createContext, useContext, useState, useEffect } from 'react'
import { City, getDefaultCity, getCityById } from '../data/cities'

interface LocationContextType {
  selectedCity: City
  setSelectedCity: (city: City) => void
  selectCityById: (cityId: string) => void
  isLoading: boolean
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export const useLocation = () => {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}

interface LocationProviderProps {
  children: React.ReactNode
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState<City>(getDefaultCity())
  const [isLoading, setIsLoading] = useState(false)

  const selectCityById = (cityId: string) => {
    setIsLoading(true)
    const city = getCityById(cityId)
    if (city) {
      setSelectedCity(city)
      // Save to localStorage for persistence
      localStorage.setItem('selectedCityId', cityId)
    }
    setTimeout(() => setIsLoading(false), 500) // Simulate loading for smooth UX
  }

  const handleSetSelectedCity = (city: City) => {
    setIsLoading(true)
    setSelectedCity(city)
    localStorage.setItem('selectedCityId', city.id)
    setTimeout(() => setIsLoading(false), 500)
  }

  // Load saved city from localStorage on mount
  useEffect(() => {
    const savedCityId = localStorage.getItem('selectedCityId')
    if (savedCityId) {
      const savedCity = getCityById(savedCityId)
      if (savedCity) {
        setSelectedCity(savedCity)
      }
    }
  }, [])

  const value: LocationContextType = {
    selectedCity,
    setSelectedCity: handleSetSelectedCity,
    selectCityById,
    isLoading
  }

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  )
}
