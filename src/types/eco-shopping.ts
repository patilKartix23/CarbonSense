// Eco-Shopping Types and Interfaces

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: ProductCategory;
  subCategory?: string;
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  ecoScore: number; // Environmental impact score (1-100)
  ecoFeatures: EcoFeature[];
  materials: string[];
  certifications: Certification[];
  carbonFootprint: number; // CO2 emissions in kg
  recyclability: number; // Percentage recyclable
  packaging: PackagingInfo;
  vendor: Vendor;
  shippingInfo: ShippingInfo;
  tags: string[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isEcoChoice?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  description: string;
  logo: string;
  rating: number;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  sustainabilityScore: number;
  location: string;
  certifications: string[];
  totalProducts: number;
  joinedDate: string;
}

export interface EcoFeature {
  type: 'organic' | 'recycled' | 'biodegradable' | 'solar-powered' | 'zero-waste' | 'fair-trade' | 'locally-sourced' | 'plastic-free' | 'renewable' | 'compostable';
  description: string;
  icon: string;
  impactDescription: string;
}

export interface Certification {
  name: string;
  description: string;
  logo: string;
  verifiedBy: string;
  expiryDate?: string;
}

export interface PackagingInfo {
  type: 'plastic-free' | 'recycled' | 'biodegradable' | 'minimal' | 'reusable';
  description: string;
  recyclable: boolean;
  compostable: boolean;
}

export interface ShippingInfo {
  freeShipping: boolean;
  estimatedDays: number;
  carbonNeutral: boolean;
  localDelivery: boolean;
  shippingCost: number;
}

export enum ProductCategory {
  CLOTHING = 'clothing',
  BAGS = 'bags',
  KITCHENWARE = 'kitchenware',
  PERSONAL_CARE = 'personal-care',
  HOME_GARDEN = 'home-garden',
  ELECTRONICS = 'electronics',
  TOYS = 'toys',
  FURNITURE = 'furniture',
  FOOD_BEVERAGES = 'food-beverages',
  CLEANING = 'cleaning',
  ACCESSORIES = 'accessories',
  BOOKS_MEDIA = 'books-media'
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  addedAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  priceAdjustment: number;
  stockCount: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  estimatedCarbonOffset: number;
  ecoImpactSummary: EcoImpactSummary;
  updatedAt: string;
}

export interface EcoImpactSummary {
  totalCarbonSaved: number; // kg CO2
  plasticAvoided: number; // grams
  treesPlanted: number;
  waterSaved: number; // liters
  wasteReduced: number; // kg
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  ecoImpact: EcoImpactSummary;
  trackingNumber?: string;
  estimatedDelivery: string;
  orderDate: string;
  deliveredDate?: string;
  notes?: string;
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'credit-card' | 'debit-card' | 'upi' | 'net-banking' | 'wallet' | 'cod';
  name: string;
  details: string; // Masked details like "**** 1234"
  isDefault: boolean;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned'
}

// Educational Content Types
export interface EcoFact {
  id: string;
  title: string;
  content: string;
  category: 'climate' | 'recycling' | 'energy' | 'water' | 'biodiversity' | 'pollution' | 'sustainability';
  impact: string;
  actionTip: string;
  imageUrl?: string;
  sources: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  publishedAt: string;
}

export interface EcoTip {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string; // "5 minutes", "1 hour", etc.
  carbonImpact: number; // Potential CO2 savings in kg/year
  cost: 'free' | 'low' | 'medium' | 'high';
  steps: string[];
  benefits: string[];
  relatedProducts?: string[]; // Product IDs
  imageUrl?: string;
  likes: number;
  implementedCount: number;
  tags: string[];
}

export interface EcoChallenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  category: string;
  duration: number; // Days
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  participants: number;
  completionRate: number;
  tasks: ChallengeTask[];
  rewards: ChallengeReward[];
  startDate: string;
  endDate: string;
  imageUrl?: string;
  carbonImpact: number;
  isActive: boolean;
  featured: boolean;
}

export interface ChallengeTask {
  id: string;
  title: string;
  description: string;
  type: 'action' | 'purchase' | 'share' | 'learn';
  points: number;
  required: boolean;
  completed?: boolean;
  completedAt?: string;
  verificationMethod: 'self-report' | 'photo' | 'purchase' | 'automatic';
}

export interface ChallengeReward {
  type: 'points' | 'badge' | 'discount' | 'coupon' | 'tree-planting';
  value: number | string;
  description: string;
  conditions: string;
}

export interface UserProgress {
  userId: string;
  totalPoints: number;
  level: number;
  badges: Badge[];
  completedChallenges: string[];
  currentChallenges: UserChallenge[];
  ecoImpact: UserEcoImpact;
  streaks: UserStreak[];
  achievements: Achievement[];
  preferences: UserPreferences;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: string;
  category: string;
}

export interface UserChallenge {
  challengeId: string;
  startedAt: string;
  progress: number; // Percentage
  completedTasks: string[];
  status: 'active' | 'completed' | 'failed' | 'paused';
}

export interface UserEcoImpact {
  totalCarbonSaved: number;
  treesPlanted: number;
  plasticAvoided: number;
  waterSaved: number;
  wasteReduced: number;
  renewableEnergyUsed: number;
  sustainableProductsPurchased: number;
  lastUpdated: string;
}

export interface UserStreak {
  type: 'daily-action' | 'weekly-challenge' | 'purchase' | 'learning';
  current: number;
  longest: number;
  lastActivity: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  progress?: number;
  target?: number;
}

export interface UserPreferences {
  categories: ProductCategory[];
  priceRange: {
    min: number;
    max: number;
  };
  ecoFeatures: string[];
  notifications: {
    dailyTips: boolean;
    challenges: boolean;
    deals: boolean;
    orderUpdates: boolean;
  };
  privacy: {
    shareProgress: boolean;
    publicProfile: boolean;
  };
}

// API Response Types
export interface ProductSearchResponse {
  products: Product[];
  totalCount: number;
  page: number;
  limit: number;
  filters: SearchFilters;
  aggregations: SearchAggregations;
}

export interface SearchFilters {
  category?: ProductCategory;
  priceRange?: { min: number; max: number };
  ecoFeatures?: string[];
  rating?: number;
  inStock?: boolean;
  certifications?: string[];
  sortBy?: 'relevance' | 'price-low' | 'price-high' | 'rating' | 'eco-score' | 'newest';
}

export interface SearchAggregations {
  categories: { category: ProductCategory; count: number }[];
  priceRanges: { range: string; count: number }[];
  ecoFeatures: { feature: string; count: number }[];
  certifications: { certification: string; count: number }[];
}

export interface EducationalContentResponse {
  facts: EcoFact[];
  tips: EcoTip[];
  challenges: EcoChallenge[];
  featured: {
    fact: EcoFact;
    tip: EcoTip;
    challenge: EcoChallenge;
  };
}

// Shopping Context Types
export interface ShoppingContextType {
  cart: Cart | null;
  wishlist: Product[];
  recentlyViewed: Product[];
  addToCart: (product: Product, quantity: number, variant?: ProductVariant) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateCartQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  addToRecentlyViewed: (product: Product) => void;
  isLoading: boolean;
  error: string | null;
}

// Component Props Types
export interface ProductCardProps {
  product: Product;
  showQuickAdd?: boolean;
  showWishlist?: boolean;
  showCompare?: boolean;
  size?: 'small' | 'medium' | 'large';
  layout?: 'grid' | 'list';
}

export interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  columns?: number;
  showFilters?: boolean;
  showSort?: boolean;
}

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface CheckoutFormProps {
  cart: Cart;
  onSubmit: (orderData: Partial<Order>) => Promise<void>;
}

export interface EcoImpactDisplayProps {
  impact: EcoImpactSummary;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
}
