import React from 'react'
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer } from 'lucide-react'
import { useWeather } from '../../hooks/useWeather'

interface WeatherWidgetProps {
  location: { lat: number; lon: number } | null
  cityNameOverride?: string
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ location, cityNameOverride }) => {
  const { weather, loading, error } = useWeather(location?.lat, location?.lon)

  const getWeatherIcon = (icon?: string) => {
    if (!icon) return <Cloud className="w-8 h-8 text-gray-500" />
    
    // OpenWeatherMap icon codes
    if (icon.startsWith('01')) return <Sun className="w-8 h-8 text-yellow-500" />
    if (icon.startsWith('02') || icon.startsWith('03') || icon.startsWith('04')) 
      return <Cloud className="w-8 h-8 text-gray-500" />
    if (icon.startsWith('09') || icon.startsWith('10')) 
      return <CloudRain className="w-8 h-8 text-blue-500" />
    
    return <Cloud className="w-8 h-8 text-gray-500" />
  }

  if (!location || loading) {
    return (
      <div className="card animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-16 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Weather</h3>
          <Cloud className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-red-500 text-sm">Unable to load weather data</p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Weather</h3>
        {getWeatherIcon(weather?.icon)}
      </div>

      {/* Current Weather */}
      <div className="mb-6">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-900">
                {weather?.temperature}°
              </span>
              <span className="text-lg text-gray-500 ml-1">C</span>
            </div>
            <p className="text-gray-600 text-sm capitalize">{weather?.description}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">{weather?.cityName || cityNameOverride || '—'}</p>
            <p className="text-xs text-gray-500">{weather?.country}</p>
          </div>
        </div>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Droplets className="w-4 h-4 text-blue-500" />
          <div>
            <p className="text-xs text-gray-500">Humidity</p>
            <p className="text-sm font-medium">{weather?.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Wind className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Wind</p>
            <p className="text-sm font-medium">{weather?.windSpeed} m/s</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Thermometer className="w-4 h-4 text-orange-500" />
          <div>
            <p className="text-xs text-gray-500">Feels like</p>
            <p className="text-sm font-medium">{weather?.feelsLike}°C</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Cloud className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Pressure</p>
            <p className="text-sm font-medium">{weather?.pressure} hPa</p>
          </div>
        </div>
      </div>

      {/* Real-time indicator */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Live data from OpenWeatherMap</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">Live</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeatherWidget
