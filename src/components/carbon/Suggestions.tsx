import React, { useState } from 'react'
import { Lightbulb, Car, Utensils, Zap, ShoppingBag, Home, TrendingDown, Target, CheckCircle } from 'lucide-react'

const Suggestions: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [completedTips, setCompletedTips] = useState<Set<number>>(new Set())

  const categories = {
    all: { name: 'All Tips', icon: Lightbulb },
    transportation: { name: 'Transportation', icon: Car },
    food: { name: 'Food & Diet', icon: Utensils },
    energy: { name: 'Energy', icon: Zap },
    shopping: { name: 'Shopping', icon: ShoppingBag },
    household: { name: 'Household', icon: Home }
  }

  const suggestions = [
    {
      id: 1,
      category: 'transportation',
      title: 'Use Public Transport',
      description: 'Taking the bus or train can reduce your carbon footprint by up to 45% compared to driving alone.',
      impact: '2.4 kg CO₂ saved per 10km trip',
    difficulty: 'Easy',
      tips: [
        'Plan your route using public transport apps',
        'Consider monthly passes for regular commuting',
        'Combine with walking or cycling for the last mile'
      ]
    },
    {
      id: 2,
      category: 'transportation',
      title: 'Cycle or Walk Short Distances',
      description: 'For trips under 3km, walking or cycling is often faster and always cleaner than driving.',
      impact: '1.8 kg CO₂ saved per 3km trip',
    difficulty: 'Easy',
      tips: [
        'Start with short distances and gradually increase',
        'Use bike-sharing services if you don\'t own a bike',
        'Plan safe routes using cycling apps'
      ]
    },
    {
      id: 3,
    category: 'food',
      title: 'Reduce Meat Consumption',
      description: 'Eating more plant-based meals can significantly reduce your carbon footprint.',
      impact: '3.0 kg CO₂ saved per meal with plant-based alternatives',
      difficulty: 'Medium',
      tips: [
        'Try "Meatless Monday" or other plant-based days',
        'Explore delicious vegetarian and vegan recipes',
        'Choose chicken or fish for lower-carbon protein options'
      ]
    },
    {
      id: 4,
      category: 'food',
      title: 'Buy Local and Seasonal',
      description: 'Local, seasonal produce requires less transportation and storage energy.',
      impact: '0.5 kg CO₂ saved per kg of local produce',
    difficulty: 'Easy',
      tips: [
        'Visit local farmers markets',
        'Learn about seasonal produce in your area',
        'Consider joining a Community Supported Agriculture (CSA) program'
      ]
    },
    {
      id: 5,
      category: 'energy',
    title: 'Switch to LED Bulbs',
      description: 'LED bulbs use 75% less energy and last 25 times longer than incandescent bulbs.',
      impact: '40 kg CO₂ saved per year per household',
    difficulty: 'Easy',
      tips: [
        'Replace bulbs as old ones burn out',
        'Look for ENERGY STAR certified LEDs',
        'Consider smart bulbs for additional energy savings'
      ]
    },
    {
      id: 6,
    category: 'energy',
      title: 'Optimize Air Conditioning',
      description: 'Setting your AC to 24°C instead of 22°C can save significant energy.',
      impact: '200 kg CO₂ saved per year',
      difficulty: 'Easy',
      tips: [
        'Use fans to feel cooler at higher temperatures',
        'Keep curtains closed during hot days',
        'Regular maintenance improves efficiency'
      ]
    },
    {
      id: 7,
      category: 'shopping',
      title: 'Buy Secondhand Clothing',
      description: 'The fashion industry is a major polluter. Buying secondhand extends clothing life.',
      impact: '18 kg CO₂ saved per secondhand item vs new',
    difficulty: 'Easy',
      tips: [
        'Check thrift stores and online secondhand platforms',
        'Host clothing swap parties with friends',
        'Sell or donate clothes you no longer wear'
      ]
    },
    {
      id: 8,
      category: 'shopping',
      title: 'Choose Quality Over Quantity',
      description: 'Buying durable, high-quality items reduces the need for frequent replacements.',
      impact: 'Varies by product, significant long-term savings',
      difficulty: 'Medium',
      tips: [
        'Research products before buying',
        'Read reviews and choose reputable brands',
        'Consider cost per use, not just upfront cost'
      ]
    },
    {
      id: 9,
      category: 'household',
      title: 'Reduce Water Waste',
      description: 'Shorter showers and fixing leaks can significantly reduce energy used for water heating.',
      impact: '300 kg CO₂ saved per year per household',
    difficulty: 'Easy',
      tips: [
        'Take 5-minute showers instead of 10-minute ones',
        'Fix leaky faucets promptly',
        'Use cold water for washing clothes when possible'
      ]
    },
    {
      id: 10,
      category: 'household',
      title: 'Compost Food Waste',
      description: 'Composting prevents methane emissions from landfills and creates useful soil amendment.',
      impact: '1.5 kg CO₂ saved per kg of composted waste',
    difficulty: 'Medium',
      tips: [
        'Start with a small kitchen compost bin',
        'Learn what can and cannot be composted',
        'Use finished compost in your garden or give to neighbors'
      ]
    }
  ]

  const filteredSuggestions = selectedCategory === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.category === selectedCategory)

  const toggleTipCompletion = (tipId: number) => {
    const newCompleted = new Set(completedTips)
    if (newCompleted.has(tipId)) {
      newCompleted.delete(tipId)
    } else {
      newCompleted.add(tipId)
    }
    setCompletedTips(newCompleted)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Eco-Friendly Tips</h2>
          <p className="text-gray-600">
            Actionable suggestions to reduce your carbon footprint and live more sustainably
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-gradient-to-r from-climate-green-50 to-climate-blue-50 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Progress</h3>
              <p className="text-gray-600">
                You've completed {completedTips.size} out of {suggestions.length} eco-tips
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-climate-green-600">
                {Math.round((completedTips.size / suggestions.length) * 100)}%
              </div>
              <p className="text-sm text-gray-500">Complete</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-climate-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedTips.size / suggestions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {Object.entries(categories).map(([key, category]) => {
            const Icon = category.icon
            return (
              <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === key
                      ? 'bg-climate-green-100 text-climate-green-700 border-2 border-climate-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
              </button>
            )
          })}
          </div>
        </div>

        {/* Suggestions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={`bg-white rounded-lg shadow-sm border p-6 transition-all ${
                completedTips.has(suggestion.id)
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Header */}
                <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className={`text-lg font-semibold ${
                      completedTips.has(suggestion.id) ? 'text-green-900' : 'text-gray-900'
                    }`}>
                      {suggestion.title}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getDifficultyColor(suggestion.difficulty)
                    }`}>
                      {suggestion.difficulty}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    completedTips.has(suggestion.id) ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    {suggestion.description}
                  </p>
                </div>
                <button
                  onClick={() => toggleTipCompletion(suggestion.id)}
                  className={`ml-4 p-2 rounded-full transition-colors ${
                    completedTips.has(suggestion.id)
                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
                </div>

              {/* Impact */}
              <div className="mb-4">
                <div className={`flex items-center space-x-2 p-3 rounded-lg ${
                  completedTips.has(suggestion.id) ? 'bg-green-100' : 'bg-blue-50'
                }`}>
                  <TrendingDown className={`w-4 h-4 ${
                    completedTips.has(suggestion.id) ? 'text-green-600' : 'text-blue-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    completedTips.has(suggestion.id) ? 'text-green-700' : 'text-blue-700'
                  }`}>
                    Impact: {suggestion.impact}
                  </span>
                </div>
        </div>

              {/* Action Steps */}
            <div>
                <h4 className={`text-sm font-medium mb-2 ${
                  completedTips.has(suggestion.id) ? 'text-green-900' : 'text-gray-900'
                }`}>
                  How to get started:
                </h4>
                <ul className="space-y-1">
                  {suggestion.tips.map((tip, index) => (
                    <li key={index} className={`text-sm flex items-start space-x-2 ${
                      completedTips.has(suggestion.id) ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      <span className="text-gray-400 mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
              </ul>
            </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <Target className="w-12 h-12 mx-auto text-climate-green-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ready to Make a Bigger Impact?
            </h3>
            <p className="text-gray-600 mb-6">
              Share your progress with friends and inspire others to join the climate action movement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-climate-green-600 text-white rounded-lg hover:bg-climate-green-700 transition-colors">
                Share Your Progress
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Explore More Tips
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Suggestions