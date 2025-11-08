import React, { useState, useEffect } from 'react'
import { Calculator, Car, Utensils, Zap, ShoppingBag, Home, Check, Lightbulb } from 'lucide-react'
import toast from 'react-hot-toast'
import { carbonAPI } from '../../api/carbon'

interface Activity {
  activity_type: string
  category: string
  emission_factor: number
  unit: string
  description: string
}

interface ActivityLoggerProps {
  onActivityLogged?: (emissions: number) => void
}

const ActivityLogger: React.FC<ActivityLoggerProps> = ({ onActivityLogged }) => {
  const [selectedCategory, setSelectedCategory] = useState('transportation')
  const [selectedActivity, setSelectedActivity] = useState('')
  const [value, setValue] = useState('')
  const [description, setDescription] = useState('')
  const [activities, setActivities] = useState<Record<string, Activity>>({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const categories = {
    transportation: { name: '🚗 Transportation', icon: Car, color: 'blue' },
    food: { name: '🍔 Food & Diet', icon: Utensils, color: 'green' },
    energy: { name: '⚡ Energy', icon: Zap, color: 'yellow' },
    shopping: { name: '🛍️ Shopping', icon: ShoppingBag, color: 'purple' },
    household: { name: '🏠 Household', icon: Home, color: 'gray' }
  }

  // Fetch available activities on component mount
  useEffect(() => {
  const fetchActivities = async () => {
    try {
        const response = await carbonAPI.getAvailableActivities()
      setActivities(response.activities as Record<string, Activity>)
      
        // Set default activity for transportation
        const transportActivities = Object.keys(response.activities).filter(
          key => response.activities[key].category === 'transportation'
        )
      if (transportActivities.length > 0) {
          setSelectedActivity(transportActivities[0])
        }
      } catch (error) {
        console.error('Failed to fetch activities:', error)
        toast.error('Failed to load activity types')
      }
    }
    fetchActivities()
  }, [])

  // Update selected activity when category changes
  useEffect(() => {
    const categoryActivities = Object.keys(activities).filter(
      key => activities[key].category === selectedCategory
    )
    if (categoryActivities.length > 0) {
      setSelectedActivity(categoryActivities[0])
    }
  }, [selectedCategory, activities])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedActivity || !value || parseFloat(value) <= 0) {
      toast.error('Please select an activity and enter a valid value')
      return
    }

    setLoading(true)
    try {
      const response = await carbonAPI.logActivity({
        activity_type: selectedActivity,
        value: parseFloat(value),
        description: description.trim() || undefined
      })

      setResult(response)
      toast.success(`Activity logged! ${response.emissions_kg_co2} kg CO₂ calculated`)
      
      // Reset form
      setValue('')
      setDescription('')
      
      // Notify parent component
      if (onActivityLogged) {
        onActivityLogged(response.emissions_kg_co2)
      }
    } catch (error: any) {
      console.error('Failed to log activity:', error)
      toast.error(error.response?.data?.detail || 'Failed to log activity')
    } finally {
      setLoading(false)
    }
  }

  const getActivityOptions = () => {
    return Object.keys(activities).filter(
      key => activities[key].category === selectedCategory
    )
  }

  const currentActivity = activities[selectedActivity]

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Log Your Activity</h2>
          <p className="text-gray-600">
            Track your daily activities to understand and reduce your carbon footprint.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Category
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(categories).map(([key, category]) => {
              const Icon = category.icon
              return (
                <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedCategory(key)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedCategory === key
                      ? `border-${category.color}-500 bg-${category.color}-50 text-${category.color}-700`
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm font-medium">{category.name}</div>
                </button>
              )
            })}
          </div>
        </div>

          {/* Activity Selection */}
          <div>
                <label htmlFor="activity" className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Type
                </label>
            <select
                  id="activity"
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-climate-green-500 focus:border-climate-green-500"
                >
                  {getActivityOptions().map((activityKey) => (
                    <option key={activityKey} value={activityKey}>
                      {activities[activityKey].description}
                </option>
              ))}
            </select>
                {currentActivity && (
                  <p className="mt-1 text-xs text-gray-500">
                    Emission factor: {currentActivity.emission_factor} kg CO₂ per {currentActivity.unit}
                  </p>
                )}
          </div>

          {/* Value Input */}
          <div>
                <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount {currentActivity && `(${currentActivity.unit})`}
            </label>
            <input
              type="number"
                  id="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
                  step="0.1"
                  min="0.1"
                  placeholder={`Enter ${currentActivity?.unit || 'amount'}`}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-climate-green-500 focus:border-climate-green-500"
              required
            />
          </div>

          {/* Description (Optional) */}
          <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <input
              type="text"
                  id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add any additional details..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-climate-green-500 focus:border-climate-green-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
                disabled={loading || !selectedActivity || !value}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-climate-green-600 hover:bg-climate-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-climate-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Calculating...
              </>
            ) : (
              <>
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate Emissions
              </>
            )}
          </button>
        </form>
          </div>

          {/* Result Panel */}
          <div className="space-y-6">
            {/* Calculation Preview */}
            {currentActivity && value && parseFloat(value) > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Preview</h3>
                <div className="text-2xl font-bold text-blue-900">
                  {(parseFloat(value) * currentActivity.emission_factor).toFixed(2)} kg CO₂
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  {value} {currentActivity.unit} × {currentActivity.emission_factor} kg CO₂/{currentActivity.unit}
                </p>
          </div>
        )}

            {/* Result */}
            {result && (
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
                <div className="flex items-center mb-3">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="text-sm font-medium text-green-900">Activity Logged!</h3>
                </div>
                
                <div className="mb-4">
                  <div className="text-2xl font-bold text-green-900">
                    {result.emissions_kg_co2} kg CO₂
                  </div>
                  <p className="text-xs text-green-700">
                    {result.value} {result.unit} of {result.activity_type.replace('_', ' ')}
                  </p>
                </div>

                {/* Suggestions */}
                {result.suggestions && result.suggestions.length > 0 && (
              <div>
                    <h4 className="text-xs font-medium text-green-900 mb-2 flex items-center">
                      <Lightbulb className="w-3 h-3 mr-1" />
                      Suggestions
                    </h4>
                    <ul className="space-y-1">
                      {result.suggestions.map((suggestion: string, index: number) => (
                        <li key={index} className="text-xs text-green-700">
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Quick Tips */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                <Lightbulb className="w-4 h-4 mr-1" />
                Quick Tips
              </h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Log activities daily for accurate tracking</li>
                <li>• Small changes add up to big impacts</li>
                <li>• Share your progress with friends</li>
                <li>• Set weekly reduction goals</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivityLogger