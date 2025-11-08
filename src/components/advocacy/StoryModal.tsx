/**
 * Impact Story Detail Modal
 */
import { 
  X, Eye, Heart, Share2, Clock, MapPin, Award
} from 'lucide-react';
import { ImpactStory } from '../../types/advocacy';
import { formatDistanceToNow } from 'date-fns';

interface StoryModalProps {
  story: ImpactStory;
  onClose: () => void;
  onLike: (storyId: number) => void;
}

const StoryModal = ({ story, onClose, onLike }: StoryModalProps) => {
  const getStoryTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'case_study': 'Case Study',
      'interview': 'Interview',
      'day_in_life': 'Day in the Life',
      'youth_activism': 'Youth Activism'
    };
    return types[type] || type;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: story.summary,
        url: window.location.href
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl">
          {/* Header Image */}
          {story.featured_image_url && (
            <div className="relative h-96">
              <img 
                src={story.featured_image_url} 
                alt={story.title}
                className="w-full h-full object-cover"
              />
              {story.featured && (
                <div className="absolute top-4 left-4 px-4 py-2 bg-yellow-400 text-yellow-900 font-bold rounded-full flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  Featured Story
                </div>
              )}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          )}

          <div className="p-8">
            {/* Categories */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                {getStoryTypeLabel(story.story_type)}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                {story.category}
              </span>
              {story.tags && story.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              {story.title}
            </h1>

            {/* Subtitle */}
            {story.subtitle && (
              <p className="text-xl text-gray-600 mb-6">
                {story.subtitle}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center text-gray-600">
                <Eye className="w-5 h-5 mr-2" />
                <span>{story.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Heart className={`w-5 h-5 mr-2 ${story.user_liked ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{story.likes.toLocaleString()} likes</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2" />
                <span>{story.read_time_minutes} min read</span>
              </div>
              {(story.location_description || story.country) && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{story.location_description || story.country}</span>
                </div>
              )}
            </div>

            {/* Featured Person */}
            {story.featured_person_name && (
              <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                <div className="flex items-center">
                  {story.featured_person_photo_url && (
                    <img 
                      src={story.featured_person_photo_url} 
                      alt={story.featured_person_name}
                      className="w-20 h-20 rounded-full mr-4 border-4 border-white shadow-md"
                    />
                  )}
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Featuring</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {story.featured_person_name}
                    </div>
                    {story.featured_person_title && (
                      <div className="text-gray-600 mt-1">
                        {story.featured_person_title}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="mb-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Summary</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                {story.summary}
              </p>
            </div>

            {/* Content */}
            <div className="mb-8">
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-gray-700 leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: story.content }}
                />
              </div>
            </div>

            {/* Gallery */}
            {story.gallery_urls && story.gallery_urls.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {story.gallery_urls.map((url, index) => (
                    <img 
                      key={index}
                      src={url}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Video */}
            {story.video_url && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Video</h3>
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                  <iframe
                    src={story.video_url}
                    className="w-full h-96"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Impact Metrics */}
            {story.impact_metrics && Object.keys(story.impact_metrics).length > 0 && (
              <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Award className="w-6 h-6 mr-2 text-green-600" />
                  Impact Achieved
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(story.impact_metrics).map(([key, value]) => (
                    <div key={key} className="text-center p-4 bg-white rounded-lg shadow">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {value}
                      </div>
                      <div className="text-sm text-gray-600 capitalize">
                        {key.replace(/_/g, ' ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Organization */}
            {story.organization_name && (
              <div className="mb-6 text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Published by</div>
                <div className="text-lg font-semibold text-gray-900">
                  {story.organization_name}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(story.publish_date), { addSuffix: true })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => onLike(story.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center ${
                  story.user_liked
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <Heart className={`w-5 h-5 mr-2 ${story.user_liked ? 'fill-current' : ''}`} />
                {story.user_liked ? 'Liked' : 'Like this story'}
              </button>
              <button
                onClick={handleShare}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryModal;
