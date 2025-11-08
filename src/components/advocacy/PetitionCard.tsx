/**
 * Petition Card Component
 */
import { MapPin, Users, Clock, TrendingUp, CheckCircle, ExternalLink } from 'lucide-react';
import { Petition } from '../../types/advocacy';
import { formatDistanceToNow } from 'date-fns';

interface PetitionCardProps {
  petition: Petition;
  onView: () => void;
  onSign: () => void;
}

const PetitionCard = ({ petition, onView, onSign }: PetitionCardProps) => {
  const progress = Math.min(petition.progress_percentage, 100);
  const daysLeft = petition.deadline 
    ? Math.ceil((new Date(petition.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
      {petition.image_url && (
        <img 
          src={petition.image_url} 
          alt={petition.title}
          className="w-full h-48 object-cover"
        />
      )}
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                {petition.category}
              </span>
              {petition.victory && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Victory!
                </span>
              )}
              {petition.trending_score && petition.trending_score > 10 && (
                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-green-600 cursor-pointer" onClick={onView}>
              {petition.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {petition.description}
        </p>

        {/* Organization */}
        <div className="flex items-center mb-4">
          {petition.organization_logo_url && (
            <img 
              src={petition.organization_logo_url} 
              alt={petition.organization_name}
              className="w-8 h-8 rounded-full mr-2"
            />
          )}
          <div>
            <div className="text-sm font-medium text-gray-900">
              {petition.organization_name}
              {petition.organization_verified && (
                <CheckCircle className="inline-block w-4 h-4 ml-1 text-blue-500" />
              )}
            </div>
            <div className="text-xs text-gray-500">
              Target: {petition.target}
            </div>
          </div>
        </div>

        {/* Location */}
        {(petition.city || petition.country) && (
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-1" />
            {petition.is_global ? 'Global' : `${petition.city || ''} ${petition.country || ''}`.trim()}
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              <Users className="inline-block w-4 h-4 mr-1" />
              {petition.current_signatures.toLocaleString()} signatures
            </span>
            <span className="text-sm text-gray-600">
              Goal: {petition.goal_signatures.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full transition-all ${
                progress >= 100 ? 'bg-yellow-500' : 'bg-green-600'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {progress.toFixed(1)}% of goal
          </div>
        </div>

        {/* Deadline */}
        {daysLeft !== null && (
          <div className={`flex items-center text-sm mb-4 ${
            daysLeft <= 7 ? 'text-red-600 font-medium' : 'text-gray-600'
          }`}>
            <Clock className="w-4 h-4 mr-1" />
            {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onView}
            className="flex-1 px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors"
          >
            View Details
          </button>
          {!petition.user_signed && !petition.victory && petition.status === 'active' && (
            <button
              onClick={onSign}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Sign Petition
            </button>
          )}
          {petition.user_signed && (
            <div className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium text-center flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Signed
            </div>
          )}
        </div>

        {/* External Link */}
        {petition.external_url && (
          <a
            href={petition.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center text-sm text-gray-600 hover:text-green-600"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            View on external site
          </a>
        )}
      </div>
    </div>
  );
};

export default PetitionCard;
