import React from 'react'
import { BarChart3, TrendingDown, TrendingUp, Leaf } from 'lucide-react'

const CarbonFootprintSummary: React.FC = () => {
  // Mock data - in real app, fetch from API
  const carbonData = {
    today: 12.3,
    yesterday: 15.8,
    weekAverage: 14.2,
    monthlyTarget: 10.0,
    breakdown: {
      transportation: 45,
      energy: 30,
      consumption: 25
    },
    trend: -22 // percentage change
  }

  const isImproving = carbonData.trend < 0

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Carbon Footprint</h3>
        <BarChart3 className="w-5 h-5 text-gray-400" />
      </div>

      {/* Today's Footprint */}
      <div className="mb-6">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-3xl font-bold text-gray-900">
              {carbonData.today}
            </span>
            <span className="text-lg text-gray-500 ml-1">kg CO₂</span>
          </div>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            isImproving 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isImproving ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <TrendingUp className="w-3 h-3" />
            )}
            <span>{Math.abs(carbonData.trend)}%</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">Today's emissions</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress to monthly target</span>
          <span>{carbonData.monthlyTarget} kg CO₂/day</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              carbonData.today <= carbonData.monthlyTarget 
                ? 'bg-green-500' 
                : 'bg-red-500'
            }`}
            style={{ 
              width: `${Math.min((carbonData.today / carbonData.monthlyTarget) * 100, 100)}%` 
            }}
          ></div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Today's Breakdown</h4>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Transportation</span>
            </div>
            <span className="text-sm font-medium">{carbonData.breakdown.transportation}%</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Energy</span>
            </div>
            <span className="text-sm font-medium">{carbonData.breakdown.energy}%</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Consumption</span>
            </div>
            <span className="text-sm font-medium">{carbonData.breakdown.consumption}%</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6 pt-4 border-t">
        <button className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-climate-green-50 text-climate-green-700 rounded-lg hover:bg-climate-green-100 transition-colors">
          <Leaf className="w-4 h-4" />
          <span className="text-sm font-medium">Get Reduction Tips</span>
        </button>
      </div>
    </div>
  )
}

export default CarbonFootprintSummary
