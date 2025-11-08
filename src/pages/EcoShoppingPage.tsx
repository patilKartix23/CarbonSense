import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Filter, 
  Leaf, 
  Award, 
  Star,
  ShoppingCart,
  Lightbulb,
  BookOpen,
  Trophy,
  Zap,
  Recycle,
  TreePine
} from 'lucide-react';
import { 
  Product, 
  Cart, 
  EcoFact, 
  EcoTip, 
  EcoChallenge
} from '../types/eco-shopping';
import ecoShoppingAPI from '../api/eco-shopping';

const EcoShoppingPage: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'shop' | 'education' | 'challenges'>('shop');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Filters state
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange] = useState({ min: 0, max: 5000 });
  const [selectedEcoFeatures, setSelectedEcoFeatures] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevance');

  // Educational content state
  const [dailyFact, setDailyFact] = useState<EcoFact | null>(null);
  const [ecoTips, setEcoTips] = useState<EcoTip[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<EcoChallenge[]>([]);

  // Load initial data
  useEffect(() => {
    loadProducts();
    loadCart();
    loadEducationalContent();
  }, []);

  // Load products when filters change
  useEffect(() => {
    loadProducts();
  }, [searchQuery, selectedCategory, priceRange, selectedEcoFeatures, sortBy]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const result = await ecoShoppingAPI.searchProducts({
        query: searchQuery,
        category: selectedCategory,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        ecoFeatures: selectedEcoFeatures,
        sortBy: sortBy,
        limit: 12
      });
      
      if (result) {
        setProducts(result.products);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCart = async () => {
    try {
      const cartData = await ecoShoppingAPI.getCart();
      if (cartData) {
        setCart(cartData);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const loadEducationalContent = async () => {
    try {
      const content = await ecoShoppingAPI.getEducationalContent();
      if (content) {
        setDailyFact(content.featured.fact);
        setEcoTips(content.tips);
        setActiveChallenges(content.challenges);
      }
    } catch (error) {
      console.error('Failed to load educational content:', error);
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      const updatedCart = await ecoShoppingAPI.addToCart(product.id, 1);
      if (updatedCart) {
        setCart(updatedCart);
        // Show success message (you could add a toast notification here)
        console.log('Product added to cart successfully');
      }
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    }
  };

  const categories = [
    { 
      id: '', 
      name: 'All Categories', 
      icon: '🌍',
      image: 'https://images.unsplash.com/photo-1573767291321-c0af2e6d6f9c?w=100&h=60&fit=crop&crop=center'
    },
    { 
      id: 'clothing', 
      name: 'Sustainable Clothing', 
      icon: '👕',
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100&h=60&fit=crop&crop=center'
    },
    { 
      id: 'kitchenware', 
      name: 'Eco Kitchenware', 
      icon: '🍽️',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=60&fit=crop&crop=center'
    },
    { 
      id: 'home-garden', 
      name: 'Home & Garden', 
      icon: '🏠',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=60&fit=crop&crop=center'
    },
    { 
      id: 'personal-care', 
      name: 'Personal Care', 
      icon: '🧴',
      image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=100&h=60&fit=crop&crop=center'
    },
    { 
      id: 'accessories', 
      name: 'Accessories', 
      icon: '👜',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=60&fit=crop&crop=center'
    },
    { 
      id: 'books-media', 
      name: 'Books & Media', 
      icon: '📚',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&h=60&fit=crop&crop=center'
    },
    { 
      id: 'electronics', 
      name: 'Green Electronics', 
      icon: '⚡',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=100&h=60&fit=crop&crop=center'
    },
  ];

  const ecoFeatures = [
    { id: 'organic', name: 'Organic', icon: '🌱' },
    { id: 'recycled', name: 'Recycled', icon: '♻️' },
    { id: 'biodegradable', name: 'Biodegradable', icon: '🌍' },
    { id: 'solar-powered', name: 'Solar Powered', icon: '☀️' },
    { id: 'plastic-free', name: 'Plastic Free', icon: '🚫' },
    { id: 'fair-trade', name: 'Fair Trade', icon: '🤝' },
  ];

  // Product Card Component
  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2">
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
            Eco Score: {product.ecoScore}
          </span>
        </div>
        {product.isEcoChoice && (
          <div className="absolute top-2 right-2">
            <Award className="w-5 h-5 text-yellow-500" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{product.rating} ({product.reviewCount})</span>
          </div>
          <div className="text-right">
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
            )}
            <div className="text-lg font-bold text-gray-900">₹{product.price}</div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {product.ecoFeatures.slice(0, 2).map((feature, index) => (
            <span key={index} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
              {feature.icon} {feature.type}
            </span>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => handleAddToCart(product)}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </button>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  // Education Card Component
  const EducationCard: React.FC<{ title: string; content: string; icon: React.ReactNode; type: string }> = 
    ({ title, content, icon, type }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-green-100 rounded-lg">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{type}</span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Leaf className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">EcoMarket</h1>
                <p className="text-sm text-gray-600">Sustainable Shopping & Learning</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {cart && (
                <div className="relative">
                  <ShoppingBag className="w-6 h-6 text-gray-600" />
                  {cart.totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.totalItems}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'shop', name: 'Shop', icon: ShoppingBag },
              { id: 'education', name: 'Learn', icon: BookOpen },
              { id: 'challenges', name: 'Challenges', icon: Trophy }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'shop' && (
          <div>
            {/* Search and Filters */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1 max-w-lg">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search eco-friendly products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                  </button>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="relevance">Most Relevant</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="eco-score">Best Eco Score</option>
                  </select>
                </div>
              </div>

              {/* Categories */}
              <div className="mt-6">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg border transition-colors min-w-[140px] ${
                        selectedCategory === category.id
                          ? 'bg-green-100 border-green-300 text-green-800'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-8 h-5 object-cover rounded"
                      />
                      <div className="text-left">
                        <div className="flex items-center space-x-1">
                          <span>{category.icon}</span>
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Eco Features Filter */}
              {showFilters && (
                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-3">Eco Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {ecoFeatures.map((feature) => (
                      <button
                        key={feature.id}
                        onClick={() => {
                          setSelectedEcoFeatures(prev => 
                            prev.includes(feature.id)
                              ? prev.filter(f => f !== feature.id)
                              : [...prev, feature.id]
                          );
                        }}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                          selectedEcoFeatures.includes(feature.id)
                            ? 'bg-green-100 border-green-300 text-green-800'
                            : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span>{feature.icon}</span>
                        <span>{feature.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading ? (
                Array(8).fill(0).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                    <div className="w-full h-48 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))
              ) : (
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>

            {/* Cart Summary */}
            {cart && cart.totalItems > 0 && (
              <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">Cart Summary</h3>
                  <span className="text-sm text-gray-600">{cart.totalItems} items</span>
                </div>
                <div className="text-lg font-bold text-gray-900 mb-3">₹{cart.subtotal}</div>
                
                {cart.ecoImpactSummary && (
                  <div className="bg-green-50 rounded-lg p-3 mb-3">
                    <h4 className="text-sm font-medium text-green-800 mb-2">Your Eco Impact:</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center space-x-1">
                        <TreePine className="w-3 h-3 text-green-600" />
                        <span>{cart.ecoImpactSummary.treesPlanted} trees</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Recycle className="w-3 h-3 text-green-600" />
                        <span>{cart.ecoImpactSummary.plasticAvoided}g plastic saved</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Checkout
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'education' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Learn About Sustainability</h2>
              <p className="text-gray-600">Discover daily eco-facts, practical tips, and build sustainable habits.</p>
            </div>

            {/* Daily Fact Highlight */}
            {dailyFact && (
              <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-6 text-white mb-8">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">💡 Daily Eco-Fact</h3>
                    <h4 className="text-lg font-semibold mb-2">{dailyFact.title}</h4>
                    <p className="text-green-100 mb-3">{dailyFact.content}</p>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                      <p className="text-sm font-medium">💚 Action Tip: {dailyFact.actionTip}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Educational Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {ecoTips.map((tip) => (
                <EducationCard
                  key={tip.id}
                  title={tip.title}
                  content={tip.description}
                  icon={<Zap className="w-6 h-6 text-green-600" />}
                  type="Eco Tip"
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Eco Challenges</h2>
              <p className="text-gray-600">Join challenges, earn points, and make a positive impact on the environment.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeChallenges.map((challenge) => (
                <div key={challenge.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{challenge.title}</h3>
                        <p className="text-gray-600 text-sm">{challenge.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-900">{challenge.points} pts</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{challenge.participants}</div>
                        <div className="text-xs text-blue-600">Participants</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{challenge.completionRate}%</div>
                        <div className="text-xs text-green-600">Completion Rate</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{challenge.duration} days</span>
                        <span>•</span>
                        <span className="capitalize">{challenge.difficulty}</span>
                      </div>
                      
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        Join Challenge
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EcoShoppingPage;
