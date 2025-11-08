/**
 * Advocacy Page - Petitions and Impact Stories
 */
import { useState, useEffect } from 'react';
import { 
  FileText, 
  TrendingUp, 
  Heart,
  Search,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getPetitions,
  getImpactStories,
  getTrendingPetitions,
  signPetition,
  likeStory,
  getAdvocacyStats,
  getCategories
} from '../api/advocacy';
import { Petition, ImpactStory, AdvocacyStats } from '../types/advocacy';
import PetitionCard from '../components/advocacy/PetitionCard';
import ImpactStoryCard from '../components/advocacy/ImpactStoryCard';
import PetitionModal from '../components/advocacy/PetitionModal';
import StoryModal from '../components/advocacy/StoryModal';

type TabType = 'petitions' | 'stories';

const AdvocacyPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('petitions');
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [stories, setStories] = useState<ImpactStory[]>([]);
  const [trendingPetitions, setTrendingPetitions] = useState<Petition[]>([]);
  const [stats, setStats] = useState<AdvocacyStats | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState('trending');
  const [selectedPetition, setSelectedPetition] = useState<Petition | null>(null);
  const [selectedStory, setSelectedStory] = useState<ImpactStory | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab, selectedCategory, sortBy]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load stats and categories
      const [statsData, categoriesData] = await Promise.all([
        getAdvocacyStats(),
        getCategories()
      ]);
      setStats(statsData);
      setCategories(categoriesData);

      if (activeTab === 'petitions') {
        const [petitionsData, trendingData] = await Promise.all([
          getPetitions({
            category: selectedCategory || undefined,
            sort_by: sortBy,
            status: 'active'
          }),
          getTrendingPetitions(5)
        ]);
        setPetitions(petitionsData);
        setTrendingPetitions(trendingData);
      } else {
        const storiesData = await getImpactStories({
          category: selectedCategory || undefined,
          sort_by: sortBy
        });
        setStories(storiesData);
      }
    } catch (error) {
      console.error('Error loading advocacy data:', error);
      toast.error('Failed to load advocacy data');
    } finally {
      setLoading(false);
    }
  };

  const handleSignPetition = async (petitionId: number, comment?: string) => {
    try {
      await signPetition(petitionId, {
        comment,
        share_name_publicly: true
      });
      toast.success('Petition signed successfully!');
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to sign petition');
    }
  };

  const handleLikeStory = async (storyId: number) => {
    try {
      await likeStory(storyId);
      toast.success('Story liked!');
      loadData();
    } catch (error) {
      toast.error('Failed to like story');
    }
  };

  const filteredPetitions = petitions.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStories = stories.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-emerald-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              🌍 Climate Advocacy & Action
            </h1>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              Join millions making real change. Sign petitions, read inspiring stories, 
              and be part of the global movement for climate action.
            </p>
            
            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold">{stats.total_petitions}</div>
                  <div className="text-sm text-green-100">Total Petitions</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold">{stats.victories}</div>
                  <div className="text-sm text-green-100">Victories Won</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold">
                    {(stats.total_signatures / 1000).toFixed(1)}K
                  </div>
                  <div className="text-sm text-green-100">Total Signatures</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold">{stats.user_advocacy_points}</div>
                  <div className="text-sm text-green-100">Your Points</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setActiveTab('petitions')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'petitions'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FileText className="inline-block w-5 h-5 mr-2" />
            Petitions
          </button>
          <button
            onClick={() => setActiveTab('stories')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'stories'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Heart className="inline-block w-5 h-5 mr-2" />
            Impact Stories
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </h3>
              
              {/* Category Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="trending">Trending</option>
                  <option value="recent">Most Recent</option>
                  <option value="signatures">Most Signatures</option>
                  {activeTab === 'petitions' && <option value="deadline">Deadline</option>}
                  {activeTab === 'stories' && <option value="popular">Most Popular</option>}
                </select>
              </div>
            </div>

            {/* Trending Petitions (sidebar) */}
            {activeTab === 'petitions' && trendingPetitions.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
                  Trending Now
                </h3>
                <div className="space-y-3">
                  {trendingPetitions.map((petition) => (
                    <button
                      key={petition.id}
                      onClick={() => setSelectedPetition(petition)}
                      className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                        {petition.title}
                      </div>
                      <div className="text-xs text-gray-600">
                        {petition.current_signatures.toLocaleString()} signatures
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <div>
                {activeTab === 'petitions' ? (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Active Petitions
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {filteredPetitions.length} petition{filteredPetitions.length !== 1 ? 's' : ''} found
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      {filteredPetitions.map((petition) => (
                        <PetitionCard
                          key={petition.id}
                          petition={petition}
                          onView={() => setSelectedPetition(petition)}
                          onSign={() => handleSignPetition(petition.id)}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Impact Stories
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {filteredStories.length} stor{filteredStories.length !== 1 ? 'ies' : 'y'} found
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredStories.map((story) => (
                        <ImpactStoryCard
                          key={story.id}
                          story={story}
                          onView={() => setSelectedStory(story)}
                          onLike={() => handleLikeStory(story.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedPetition && (
        <PetitionModal
          petition={selectedPetition}
          onClose={() => setSelectedPetition(null)}
          onSign={handleSignPetition}
        />
      )}
      {selectedStory && (
        <StoryModal
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
          onLike={handleLikeStory}
        />
      )}
    </div>
  );
};

export default AdvocacyPage;
