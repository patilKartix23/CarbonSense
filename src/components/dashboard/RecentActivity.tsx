import React from 'react'
import { 
  Calendar, 
  Camera, 
  BarChart3, 
  MapPin,
  Clock
} from 'lucide-react'

const RecentActivity: React.FC = () => {
  // Mock activity data
  const activities = [
    {
      id: 1,
      type: 'carbon_log',
      title: 'Logged carbon footprint',
      description: '8.2 kg CO₂ - mostly from commuting',
      time: '2 hours ago',
      icon: BarChart3,
      color: 'blue'
    },
    {
      id: 2,
      type: 'photo_upload',
      title: 'Shared climate photo',
      description: 'Beautiful sunset after the rain',
      time: '5 hours ago',
      icon: Camera,
      color: 'green'
    },
    {
      id: 3,
      type: 'location_check',
      title: 'Checked air quality',
      description: 'Central Park - AQI: 45 (Good)',
      time: '1 day ago',
      icon: MapPin,
      color: 'purple'
    },
    {
      id: 4,
      type: 'goal_achieved',
      title: 'Weekly goal achieved!',
      description: 'Reduced emissions by 15%',
      time: '2 days ago',
      icon: Calendar,
      color: 'orange'
    }
  ]

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg flex-shrink-0 ${
                activity.color === 'blue' ? 'bg-blue-50' :
                activity.color === 'green' ? 'bg-green-50' :
                activity.color === 'purple' ? 'bg-purple-50' :
                'bg-orange-50'
              }`}>
                <Icon className={`w-4 h-4 ${
                  activity.color === 'blue' ? 'text-blue-600' :
                  activity.color === 'green' ? 'text-green-600' :
                  activity.color === 'purple' ? 'text-purple-600' :
                  'text-orange-600'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <button className="w-full text-sm font-medium text-climate-blue-600 hover:text-climate-blue-700">
          View all activity →
        </button>
      </div>
    </div>
  )
}

export default RecentActivity
