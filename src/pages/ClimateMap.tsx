import React, { useState, useEffect } from 'react'
import { 
  Map, 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  TrendingUp, 
  MapPin, 
  Loader, 
  RefreshCw,
  BarChart3,
  Cloud
} from 'lucide-react'
import { indianClimateAPI, IndianClimateData, IndianCityWeather } from '../api/indian-climate'
import { INDIAN_CITIES } from '../data/indian-geography'
import ClimateTrendsChart from '../components/climate/ClimateTrendsChart'

interface ViewMode {
  type: 'temperature' | 'humidity' | 'rainfall' | 'overview';
  label: string;
  icon: React.ReactNode;
  color: string;
}

const ClimateMap: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [climateData, setClimateData] = useState<IndianClimateData | null>(null)
  const [selectedCity, setSelectedCity] = useState<IndianCityWeather | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode['type']>('overview')
  const [selectedZone, setSelectedZone] = useState<string>('all')
  const [error, setError] = useState<string | null>(null)

  const viewModes: ViewMode[] = [
    { type: 'overview', label: 'Overview', icon: <Map className="w-4 h-4" />, color: 'blue' },
    { type: 'temperature', label: 'Temperature', icon: <Thermometer className="w-4 h-4" />, color: 'red' },
    { type: 'humidity', label: 'Humidity', icon: <Droplets className="w-4 h-4" />, color: 'blue' },
    { type: 'rainfall', label: 'Rainfall', icon: <Cloud className="w-4 h-4" />, color: 'indigo' }
  ]

  const zones = ['all', 'North', 'South', 'East', 'West', 'Central', 'Northeast']

  useEffect(() => {
    loadClimateData()
  }, [])

  const loadClimateData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await indianClimateAPI.getIndiaOverview()
      setClimateData(data)
    } catch (err) {
      setError('Failed to load climate data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getTemperatureColor = (temp: number) => {
    if (temp <= 15) return 'text-blue-600 bg-blue-50'
    if (temp <= 25) return 'text-green-600 bg-green-50'
    if (temp <= 35) return 'text-yellow-600 bg-yellow-50'
    if (temp <= 40) return 'text-orange-600 bg-orange-50'
    return 'text-red-600 bg-red-50'
  }

  const getHumidityColor = (humidity: number) => {
    if (humidity <= 40) return 'text-yellow-600 bg-yellow-50'
    if (humidity <= 60) return 'text-green-600 bg-green-50'
    if (humidity <= 80) return 'text-blue-600 bg-blue-50'
    return 'text-indigo-600 bg-indigo-50'
  }

  const getRainfallColor = (rainfall: number) => {
    if (rainfall <= 1) return 'text-yellow-600 bg-yellow-50'
    if (rainfall <= 5) return 'text-green-600 bg-green-50'
    if (rainfall <= 15) return 'text-blue-600 bg-blue-50'
    return 'text-indigo-600 bg-indigo-50'
  }

  const getCityValue = (city: IndianCityWeather, mode: ViewMode['type']) => {
    switch (mode) {
      case 'temperature': return `${city.temperature}°C`
      case 'humidity': return `${city.humidity}%`
      case 'rainfall': return `${city.rainfall}mm`
      default: return `${city.temperature}°C`
    }
  }

  const getCityColor = (city: IndianCityWeather, mode: ViewMode['type']) => {
    switch (mode) {
      case 'temperature': return getTemperatureColor(city.temperature)
      case 'humidity': return getHumidityColor(city.humidity)
      case 'rainfall': return getRainfallColor(city.rainfall)
      default: return getTemperatureColor(city.temperature)
    }
  }

  const filteredCities = climateData?.cities_overview.filter(city => 
    selectedZone === 'all' || INDIAN_CITIES.find(c => c.name === city.city)?.zone === selectedZone
  ) || []

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin text-climate-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading Indian climate data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-climate-blue-50">
                <Map className="w-8 h-8 text-climate-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Indian Climate Map
                </h1>
                <p className="text-gray-600 mt-1">
                  Real-time climate data across Indian cities and regions
                </p>
              </div>
            </div>
            <button
              onClick={loadClimateData}
              className="btn-secondary"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Current Conditions Summary */}
        {climateData?.current_conditions && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <Thermometer className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Avg Temperature</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {climateData.current_conditions.avg_temperature}°C
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <Droplets className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Avg Humidity</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {climateData.current_conditions.avg_humidity}%
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <Cloud className="w-8 h-8 text-indigo-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Rainfall</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {climateData.current_conditions.total_rainfall}mm
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Cities Tracked</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {climateData.cities_overview.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* View Mode Selector */}
          <div className="flex space-x-2">
            {viewModes.map((mode) => (
              <button
                key={mode.type}
                onClick={() => setViewMode(mode.type)}
                className={`btn flex items-center space-x-2 ${
                  viewMode === mode.type
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                {mode.icon}
                <span>{mode.label}</span>
              </button>
            ))}
          </div>

          {/* Zone Filter */}
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="form-input"
          >
            {zones.map((zone) => (
              <option key={zone} value={zone}>
                {zone === 'all' ? 'All Zones' : `${zone} India`}
              </option>
            ))}
          </select>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {filteredCities.map((city) => (
            <div
              key={city.city}
              className={`card p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedCity?.city === city.city ? 'ring-2 ring-climate-blue-500' : ''
              }`}
              onClick={() => setSelectedCity(selectedCity?.city === city.city ? null : city)}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{city.city}</h3>
                  <p className="text-sm text-gray-600">{city.state}</p>
                </div>
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCityColor(city, viewMode)}`}>
                {getCityValue(city, viewMode)}
              </div>
              
              {viewMode === 'overview' && (
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <Droplets className="w-3 h-3 text-blue-500" />
                    <span>{city.humidity}%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Cloud className="w-3 h-3 text-indigo-500" />
                    <span>{city.rainfall}mm</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Wind className="w-3 h-3 text-gray-500" />
                    <span>{city.wind_speed} km/h</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3 text-purple-500" />
                    <span>{city.pressure} hPa</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Selected City Details */}
        {selectedCity && (
          <div className="card p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedCity.city}, {selectedCity.state}
              </h3>
              <button
                onClick={() => setSelectedCity(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Thermometer className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{selectedCity.temperature}°C</p>
                <p className="text-sm text-gray-600">Temperature</p>
              </div>
              
              <div className="text-center">
                <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{selectedCity.humidity}%</p>
                <p className="text-sm text-gray-600">Humidity</p>
              </div>
              
              <div className="text-center">
                <Cloud className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{selectedCity.rainfall}mm</p>
                <p className="text-sm text-gray-600">Rainfall</p>
              </div>
              
              <div className="text-center">
                <Wind className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{selectedCity.wind_speed}</p>
                <p className="text-sm text-gray-600">Wind (km/h)</p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Coordinates:</strong> {selectedCity.lat.toFixed(4)}°N, {selectedCity.lon.toFixed(4)}°E
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Atmospheric Pressure:</strong> {selectedCity.pressure} hPa
              </p>
            </div>
          </div>
        )}

        {/* Regional Summary */}
        {climateData?.regional_summary && (
          <div className="card p-6 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="w-6 h-6 text-climate-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">Regional Climate Summary</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(climateData.regional_summary).map(([state, data]) => (
                <div key={state} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{state}</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Avg Temp:</span> {data.avg_temperature}°C</p>
                    <p><span className="text-gray-600">Avg Humidity:</span> {data.avg_humidity}%</p>
                    <p><span className="text-gray-600">Total Rainfall:</span> {data.total_rainfall}mm</p>
                    <p><span className="text-gray-600">Cities:</span> {data.cities_count}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Climate Trends Chart */}
        <ClimateTrendsChart />
      </div>
    </div>
  )
}

export default ClimateMap
