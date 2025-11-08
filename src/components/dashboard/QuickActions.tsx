import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Calculator, 
  Map, 
  Plus,
  ShoppingBag,
  Factory
} from 'lucide-react'

const QuickActions: React.FC = () => {
  const actions = [
    {
      title: 'Track Carbon',
      description: 'Log your daily activities',
      icon: Calculator,
      href: '/carbon',
      color: 'blue'
    },
    {
      title: 'EcoMarket',
      description: 'Shop sustainable products',
      icon: ShoppingBag,
      href: '/eco-shopping',
      color: 'green'
    },
    {
      title: 'CCUS Hub',
      description: 'Carbon capture solutions',
      icon: Factory,
      href: '/ccus',
      color: 'purple'
    },
    {
      title: 'Climate Map',
      description: 'View climate data',
      icon: Map,
      href: '/map',
      color: 'orange'
    }
  ]

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <Plus className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <Link
              key={index}
              to={action.href}
              className={`p-4 rounded-lg border-2 transition-colors group ${
                action.color === 'blue' ? 'border-blue-100 bg-blue-50 hover:bg-blue-100' :
                action.color === 'green' ? 'border-green-100 bg-green-50 hover:bg-green-100' :
                action.color === 'purple' ? 'border-purple-100 bg-purple-50 hover:bg-purple-100' :
                'border-orange-100 bg-orange-50 hover:bg-orange-100'
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`p-2 rounded-lg transition-colors ${
                  action.color === 'blue' ? 'bg-blue-100 group-hover:bg-blue-200' :
                  action.color === 'green' ? 'bg-green-100 group-hover:bg-green-200' :
                  action.color === 'purple' ? 'bg-purple-100 group-hover:bg-purple-200' :
                  'bg-orange-100 group-hover:bg-orange-200'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    action.color === 'blue' ? 'text-blue-600' :
                    action.color === 'green' ? 'text-green-600' :
                    action.color === 'purple' ? 'text-purple-600' :
                    'text-orange-600'
                  }`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    action.color === 'blue' ? 'text-blue-900' :
                    action.color === 'green' ? 'text-green-900' :
                    action.color === 'purple' ? 'text-purple-900' :
                    'text-orange-900'
                  }`}>
                    {action.title}
                  </p>
                  <p className={`text-xs mt-1 ${
                    action.color === 'blue' ? 'text-blue-700' :
                    action.color === 'green' ? 'text-green-700' :
                    action.color === 'purple' ? 'text-purple-700' :
                    'text-orange-700'
                  }`}>
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default QuickActions
