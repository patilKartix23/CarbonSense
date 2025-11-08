/**
 * Impact Story Card Component
 */
import { Eye, Heart, Share2, Clock, MapPin, Award } from 'lucide-react';
import { ImpactStory } from '../../types/advocacy';
import { formatDistanceToNow } from 'date-fns';

interface ImpactStoryCardProps {
  story: ImpactStory;
  onView: () => void;
  onLike: () => void;
}

const ImpactStoryCard = ({ story, onView, onLike }: ImpactStoryCardProps) => {
  const getStoryTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'case_study': 'Case Study',
      'interview': 'Interview',
      'day_in_life': 'Day in the Life',
      'youth_activism': 'Youth Activism'
    };
    return types[type] || type;
  };

  const getStoryTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'case_study': 'bg-blue-100 text-blue-700',
      'interview': 'bg-purple-100 text-purple-700',
      'day_in_life': 'bg-pink-100 text-pink-700',
      'youth_activism': 'bg-orange-100 text-orange-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group cursor-pointer">
      {/* Featured Image */}
      {story.featured_image_url && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={story.featured_image_url} 
            alt={story.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {story.featured && (
            <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full flex items-center">
              <Award className="w-3 h-3 mr-1" />
              Featured
            </div>
          )}
        </div>
      )}
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStoryTypeColor(story.story_type)}`}>
            {getStoryTypeLabel(story.story_type)}
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            {story.category}
          </span>
        </div>

        {/* Title */}
        <h3 
          className="text-xl font-bold text-gray-900 mb-2 hover:text-green-600 transition-colors line-clamp-2"
          onClick={onView}
        >
          {story.title}
        </h3>

        {/* Subtitle */}
        {story.subtitle && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-1">
            {story.subtitle}
          </p>
        )}

        {/* Summary */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {story.summary}
        </p>

        {/* Featured Person */}
        {story.featured_person_name && (
          <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
            {story.featured_person_photo_url && (
              <img 
                src={story.featured_person_photo_url} 
                alt={story.featured_person_name}
                className="w-10 h-10 rounded-full mr-3"
              />
            )}
            <div>
              <div className="text-sm font-medium text-gray-900">
                {story.featured_person_name}
              </div>
              {story.featured_person_title && (
                <div className="text-xs text-gray-500">
                  {story.featured_person_title}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Impact Metrics */}
        {story.impact_metrics && Object.keys(story.impact_metrics).length > 0 && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <div className="text-xs font-medium text-green-900 mb-2">Impact</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(story.impact_metrics).slice(0, 3).map(([key, value]) => (
                <span key={key} className="text-xs text-green-700">
                  <strong>{value}</strong> {key.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {story.views}
            </span>
            <span className="flex items-center">
              <Heart className={`w-4 h-4 mr-1 ${story.user_liked ? 'fill-red-500 text-red-500' : ''}`} />
              {story.likes}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {story.read_time_minutes} min read
            </span>
          </div>
        </div>

        {/* Location */}
        {(story.location_description || story.country) && (
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-1" />
            {story.location_description || story.country}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onView}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Read Story
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              story.user_liked
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-5 h-5 ${story.user_liked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Share functionality
              if (navigator.share) {
                navigator.share({
                  title: story.title,
                  text: story.summary,
                  url: window.location.href
                });
              }
            }}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Organization */}
        {story.organization_name && (
          <div className="mt-3 text-xs text-gray-500 text-center">
            By {story.organization_name}
          </div>
        )}

        {/* Publish Date */}
        <div className="mt-2 text-xs text-gray-500 text-center">
          Published {formatDistanceToNow(new Date(story.publish_date), { addSuffix: true })}
        </div>
      </div>
    </div>
  );
};

export default ImpactStoryCard;
