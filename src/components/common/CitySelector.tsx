import React, { useState } from 'react'
import { MapPin, ChevronDown, Check } from 'lucide-react'
import { useLocation } from '../../contexts/LocationContext'
import { INDIAN_CITIES } from '../../data/cities'

const CitySelector: React.FC = () => {
  const { selectedCity, selectCityById, isLoading } = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const handleCitySelect = (cityId: string) => {
    selectCityById(cityId)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* Selected City Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`
          flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-climate-blue-500 focus:border-transparent
          transition-colors duration-200 min-w-[200px] justify-between
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-climate-blue-600" />
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">{selectedCity.name}</p>
            <p className="text-xs text-gray-500">{selectedCity.state}</p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="py-1">
            {INDIAN_CITIES.map((city) => (
              <button
                key={city.id}
                onClick={() => handleCitySelect(city.id)}
                className={`
                  w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150
                  flex items-center justify-between group
                  ${selectedCity.id === city.id ? 'bg-climate-blue-50' : ''}
                `}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        selectedCity.id === city.id ? 'text-climate-blue-900' : 'text-gray-900'
                      }`}>
                        {city.name}
                      </p>
                      <p className={`text-xs ${
                        selectedCity.id === city.id ? 'text-climate-blue-700' : 'text-gray-500'
                      }`}>
                        {city.state} • {(city.population / 1000000).toFixed(1)}M people
                      </p>
                      <p className={`text-xs mt-1 ${
                        selectedCity.id === city.id ? 'text-climate-blue-600' : 'text-gray-400'
                      }`}>
                        {city.description}
                      </p>
                    </div>
                  </div>
                </div>
                {selectedCity.id === city.id && (
                  <Check className="w-4 h-4 text-climate-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default CitySelector
