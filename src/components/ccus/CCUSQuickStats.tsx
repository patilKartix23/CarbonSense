import React from 'react';
import { 
  TrendingUp, 
  Factory, 
  MapPin, 
  DollarSign,
  Target
} from 'lucide-react';

interface CCUSQuickStatsProps {
  data?: {
    totalCapturePotential: number;
    activeProjects: number;
    storageCapacityUsed: number;
    carbonCreditsGenerated: number;
  };
}

const CCUSQuickStats: React.FC<CCUSQuickStatsProps> = ({ data }) => {
  const defaultData = {
    totalCapturePotential: 1250,
    activeProjects: 23,
    storageCapacityUsed: 15.7,
    carbonCreditsGenerated: 89456
  };

  const stats = data || defaultData;

  const quickStats = [
    {
      name: 'CO₂ Capture Potential',
      value: `${stats.totalCapturePotential.toLocaleString()} kt`,
      change: '+12%',
      changeType: 'increase' as const,
      icon: Factory,
      color: 'blue'
    },
    {
      name: 'Active CCUS Projects',
      value: stats.activeProjects.toString(),
      change: '+3 this month',
      changeType: 'increase' as const,
      icon: Target,
      color: 'green'
    },
    {
      name: 'Storage Capacity Used',
      value: `${stats.storageCapacityUsed}%`,
      change: '+2.1%',
      changeType: 'increase' as const,
      icon: MapPin,
      color: 'purple'
    },
    {
      name: 'Carbon Credits Generated',
      value: `₹${(stats.carbonCreditsGenerated / 1000).toFixed(0)}k`,
      change: '+18%',
      changeType: 'increase' as const,
      icon: DollarSign,
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-500 text-blue-600 bg-blue-50',
      green: 'bg-green-500 text-green-600 bg-green-50',
      purple: 'bg-purple-500 text-purple-600 bg-purple-50',
      orange: 'bg-orange-500 text-orange-600 bg-orange-50'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {quickStats.map((stat) => {
        const Icon = stat.icon;
        const [, textColor, iconBgColor] = getColorClasses(stat.color).split(' ');
        
        return (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`inline-flex items-center text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${iconBgColor}`}>
                <Icon className={`w-6 h-6 ${textColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CCUSQuickStats;
