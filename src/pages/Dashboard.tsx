import React from 'react'
import { 
  Cloud, 
  Wind, 
  Thermometer, 
  BarChart3, 
  Leaf,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Factory,
  ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'
import WeatherWidget from '../components/dashboard/WeatherWidget'
import AirQualityWidget from '../components/dashboard/AirQualityWidget'
import CarbonFootprintSummary from '../components/dashboard/CarbonFootprintSummary'
import RecentActivity from '../components/dashboard/RecentActivity'
import QuickActions from '../components/dashboard/QuickActions'
import CitySelector from '../components/common/CitySelector'
import CCUSQuickStats from '../components/ccus/CCUSQuickStats'
import { useLocation } from '../contexts/LocationContext'
import { useWeather } from '../hooks/useWeather'

const Dashboard: React.FC = () => {
  const { selectedCity, isLoading } = useLocation()

  // Convert selectedCity to location format for existing components
  const location = selectedCity ? { lat: selectedCity.lat, lon: selectedCity.lon } : null
  const locationName = selectedCity ? `${selectedCity.name}, ${selectedCity.state}` : 'Loading...'

  // Fetch live weather/air-quality for quick stats
  const { weather, airQuality } = useWeather(location?.lat, location?.lon)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Climate Dashboard
              </h1>
              <div className="flex items-center mt-2 text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{locationName}</span>
                {selectedCity.population && (
                  <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                    {(selectedCity.population / 1000000).toFixed(1)}M people
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    {isLoading ? 'Updating...' : 'Live Data'}
                  </span>
                </div>
              </div>
              <CitySelector />
            </div>
          </div>
          
          {/* City Description */}
          {selectedCity.description && (
            <div className="mt-4 p-4 bg-gradient-to-r from-climate-blue-50 to-climate-green-50 rounded-lg border">
              <p className="text-sm text-gray-700">
                <span className="font-medium">{selectedCity.name}:</span> {selectedCity.description}
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-50">
                <Thermometer className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Temperature</p>
                <p className="text-2xl font-bold text-gray-900">{weather ? `${weather.temperature}°C` : '—'}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-50">
                <Wind className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Air Quality</p>
                <p className="text-2xl font-bold text-gray-900">{airQuality ? airQuality.category : '—'}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-50">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Daily CO2</p>
                <p className="text-2xl font-bold text-gray-900">12.3kg</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-orange-50">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">-15%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Weather & Air Quality */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WeatherWidget location={location} cityNameOverride={selectedCity?.name} />
              <AirQualityWidget location={location} />
            </div>

            {/* Carbon Footprint Summary */}
            <CarbonFootprintSummary />

            {/* Climate Alerts */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Climate Alerts</h3>
                <AlertTriangle className="w-5 h-5 text-orange-500" />
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Air Quality Alert
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      PM2.5 levels are elevated today. Consider limiting outdoor activities.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Cloud className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Weather Update
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Rain expected this afternoon. Perfect day to work from home!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CCUS Quick Overview */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Factory className="w-5 h-5 mr-2 text-blue-600" />
                  CCUS Overview
                </h3>
                <Link 
                  to="/ccus" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  View Full Hub
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <CCUSQuickStats />
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <span className="font-medium">India's Net Zero 2070:</span> CCUS technology is crucial for achieving 
                  carbon neutrality. Explore simulation tools and learn about storage opportunities.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <QuickActions />
            <RecentActivity />
            
            {/* Environmental Tip */}
            <div className="card">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-green-50">
                  <Leaf className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">
                  Today's Eco Tip
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                Try using public transportation or biking for trips under 5km. 
                You could save up to 2.3kg of CO2 today!
              </p>
              <button className="mt-3 text-sm font-medium text-green-600 hover:text-green-700">
                Learn more →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
