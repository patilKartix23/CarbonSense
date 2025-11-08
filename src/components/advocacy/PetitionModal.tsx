/**
 * Petition Detail Modal
 */
import { useState, useEffect } from 'react';
import { 
  X, Users, Clock, MapPin, CheckCircle, TrendingUp, ExternalLink, Target
} from 'lucide-react';
import { Petition, PetitionUpdate } from '../../types/advocacy';
import { getPetitionUpdates } from '../../api/advocacy';
import { formatDistanceToNow } from 'date-fns';

interface PetitionModalProps {
  petition: Petition;
  onClose: () => void;
  onSign: (petitionId: number, comment?: string) => void;
}

const PetitionModal = ({ petition, onClose, onSign }: PetitionModalProps) => {
  const [comment, setComment] = useState('');
  const [updates, setUpdates] = useState<PetitionUpdate[]>([]);
  const progress = Math.min(petition.progress_percentage, 100);

  useEffect(() => {
    loadUpdates();
  }, [petition.id]);

  const loadUpdates = async () => {
    try {
      const data = await getPetitionUpdates(petition.id);
      setUpdates(data);
    } catch (error) {
      console.error('Error loading updates:', error);
    }
  };

  const handleSign = () => {
    onSign(petition.id, comment || undefined);
    onClose();
  };

  const daysLeft = petition.deadline 
    ? Math.ceil((new Date(petition.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

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
          {petition.image_url && (
            <div className="relative h-64">
              <img 
                src={petition.image_url} 
                alt={petition.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          )}

          <div className="p-8">
            {/* Categories & Status */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                {petition.category}
              </span>
              {petition.victory && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Victory!
                </span>
              )}
              {petition.trending_score && petition.trending_score > 10 && (
                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Trending
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {petition.title}
            </h2>

            {/* Organization */}
            <div className="flex items-center mb-6">
              {petition.organization_logo_url && (
                <img 
                  src={petition.organization_logo_url} 
                  alt={petition.organization_name}
                  className="w-12 h-12 rounded-full mr-3"
                />
              )}
              <div>
                <div className="text-lg font-medium text-gray-900">
                  {petition.organization_name}
                  {petition.organization_verified && (
                    <CheckCircle className="inline-block w-5 h-5 ml-1 text-blue-500" />
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  <Target className="inline-block w-4 h-4 mr-1" />
                  Target: {petition.target}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center text-green-700 mb-1">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Signatures</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {petition.current_signatures.toLocaleString()}
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center text-blue-700 mb-1">
                  <Target className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Goal</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {petition.goal_signatures.toLocaleString()}
                </div>
              </div>
              {daysLeft !== null && (
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center text-orange-700 mb-1">
                    <Clock className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Days Left</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {daysLeft > 0 ? daysLeft : 0}
                  </div>
                </div>
              )}
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center text-purple-700 mb-1">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Location</span>
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {petition.is_global ? 'Global' : `${petition.city || petition.country}`}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progress to goal
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {progress.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all ${
                    progress >= 100 ? 'bg-yellow-500' : 'bg-green-600'
                  }`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Description</h3>
              <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                {petition.description}
              </div>
            </div>

            {/* Victory Message */}
            {petition.victory && petition.victory_description && (
              <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
                <h3 className="text-lg font-bold text-yellow-900 mb-2 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Victory Achieved!
                </h3>
                <p className="text-yellow-900">{petition.victory_description}</p>
              </div>
            )}

            {/* Decision Maker Response */}
            {petition.decision_maker_response && (
              <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-400 rounded-lg">
                <h3 className="text-lg font-bold text-blue-900 mb-2">
                  Response from {petition.target}
                </h3>
                <p className="text-blue-900">{petition.decision_maker_response}</p>
              </div>
            )}

            {/* Updates */}
            {updates.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Updates</h3>
                <div className="space-y-4">
                  {updates.map((update) => (
                    <div key={update.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{update.title}</h4>
                        {update.milestone && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                            Milestone
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-2">{update.content}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{update.signatures_at_time.toLocaleString()} signatures at time</span>
                        <span>{formatDistanceToNow(new Date(update.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sign Form */}
            {!petition.user_signed && !petition.victory && petition.status === 'active' && (
              <div className="mb-6 p-6 bg-green-50 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Sign This Petition</h3>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment (optional)"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
                />
                <button
                  onClick={handleSign}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors"
                >
                  Sign Petition
                </button>
              </div>
            )}

            {petition.user_signed && (
              <div className="mb-6 p-6 bg-gray-100 rounded-lg text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <p className="text-lg font-semibold text-gray-900">
                  You've signed this petition!
                </p>
              </div>
            )}

            {/* External Link */}
            {petition.external_url && (
              <a
                href={petition.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center text-green-600 hover:text-green-700 font-medium"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                View on external site
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetitionModal;
