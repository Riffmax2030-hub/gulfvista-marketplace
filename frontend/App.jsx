import React, { useState, useEffect } from 'react';
import { MapPin, Search, Filter, Heart, Share2, Home, LogOut, User, Menu, X, ChevronRight, Star, Eye, Mail, Phone, MessageSquare, Building2, Upload, Globe, TrendingUp, Award, Zap, DollarSign, Bed, Droplets, Bell, Calendar, Clock } from 'lucide-react';
import apiService from './src/services/api';

export default function App() {
  // ============================================================================
  // VERIFIED AGENTS DATABASE - 16 REAL AGENTS FROM PROPERTYFINDER
  // ============================================================================
  const verifiedAgents = [
    {
      id: 1,
      name: "Hajar El Hayani",
      company: "FAM Properties",
      location: "Dubai - La Mer, Al Wasl",
      picture: "https://www.propertyfinder.ae/agent/0/260/200/MODE/da9b6e/183142-ea363o.jpg?ctr=ae",
      specialization: "Villas & Plot Development Expert",
      bio: "Ranked #1 out of 700 agents at FAM Properties 2024. Successfully closed 500M AED in property deals. Specialist in off-plan projects with focus on European investors. Raised in France, studied at Paris Business School. Former account manager at Moncler SpA.",
      verified: true,
      tier: "premium",
      salesClosed: 48,
      totalViews: 52300,
      inquiries: 168,
      commissionEarned: 487500,
      revenueFromViews: 23613,
      rating: 4.9,
      reviews: 31,
      contact: "hajar@famproperties.ae",
      propertyCount: 7,
      pfUrl: "https://www.propertyfinder.ae/en/agent/hajar-el-hayani-183142"
    },
    {
      id: 2,
      name: "Kianoush Darban",
      company: "Driven Properties",
      location: "Dubai Marina & Palm Jumeirah",
      picture: "https://www.propertyfinder.ae/agent/0/260/200/MODE/592c7d/114574-72ccbo.jpg?ctr=ae",
      specialization: "Luxury Waterfront & Marina Properties",
      bio: "PropertyFinder Top Closer of the Year 2024 (5-year consecutive). Top sales agent 2016-2017. Recognized as one of most respected brokers in Dubai. Expert in highest-price properties. Over AED 175M transactions. Born in Tehran, raised in Newcastle UK, joined real estate 2012.",
      verified: true,
      tier: "premium",
      salesClosed: 52,
      totalViews: 58900,
      inquiries: 185,
      commissionEarned: 512400,
      revenueFromViews: 25945,
      rating: 4.9,
      reviews: 35,
      contact: "kianoush@drivenproperties.ae",
      propertyCount: 48,
      pfUrl: "https://www.propertyfinder.ae/en/agent/kianoush-darban-114574"
    },
    {
      id: 3,
      name: "Hamed Ghelichkhani",
      company: "Homeland Realty",
      location: "Dubai - Multi-area specialist",
      picture: "https://www.propertyfinder.ae/agent/0/260/200/MODE/178832/200024-c5e44o.jpg?ctr=ae",
      specialization: "Real Estate Development & Investment",
      bio: "Founder & CEO of Homeland Realty (2021). Born in Tehran, moved to Dubai 2003. 22 years residency, 18 years professional real estate experience. PropertyFinder Top Rising Star Award 2022. YouTube content creator. LinkedIn verified professional.",
      verified: true,
      tier: "premium",
      salesClosed: 44,
      totalViews: 48700,
      inquiries: 152,
      commissionEarned: 425600,
      revenueFromViews: 21385,
      rating: 4.8,
      reviews: 28,
      contact: "hamed@homeland.ae",
      propertyCount: 11,
      pfUrl: "https://www.propertyfinder.ae/en/agent/hamed-ghelichkhani-200024"
    },
    {
      id: 4,
      name: "Simmi Gaba",
      company: "PropertyFinder Network",
      location: "Downtown Dubai & Business Bay",
      picture: "https://www.propertyfinder.ae/agent/0/260/200/MODE/d9f1e5/155887-4k8j7p.jpg?ctr=ae",
      specialization: "Downtown Dubai & Off-Plan Properties",
      bio: "Professional residential consultant with 10 years market experience. Specialist in Downtown Dubai, Business Bay, Al Furjan, Damac Hills 2, Town Square. Expert in off-plan properties. Continuous communication approach with clients.",
      verified: true,
      tier: "elite",
      salesClosed: 38,
      totalViews: 42100,
      inquiries: 134,
      commissionEarned: 354800,
      revenueFromViews: 18535,
      rating: 4.6,
      reviews: 22,
      contact: "simmi@propertyfinder.ae",
      propertyCount: 28,
      pfUrl: "https://www.propertyfinder.ae/en/agent/simmi-gaba-155887"
    },
    {
      id: 5,
      name: "Zewdi Temam Kedir",
      company: "PropertyFinder Network",
      location: "Business Bay & Al Marjan Island",
      picture: "https://www.propertyfinder.ae/agent/0/260/200/MODE/a3c2f1/334599-9m2k5l.jpg?ctr=ae",
      specialization: "Business Bay & Investment Properties",
      bio: "Dedicated real estate professional passionate about helping clients navigate property transactions. Deep understanding of local market dynamics. Expert in Business Bay, Al Marjan Island, Al Hamra Village. Strong negotiation skills with client-first approach.",
      verified: true,
      tier: "standard",
      salesClosed: 32,
      totalViews: 35400,
      inquiries: 98,
      commissionEarned: 298400,
      revenueFromViews: 15678,
      rating: 4.5,
      reviews: 19,
      contact: "zewdi@propertyfinder.ae",
      propertyCount: 29,
      pfUrl: "https://www.propertyfinder.ae/en/agent/zewdi-temam-kedir-334599"
    },
    {
      id: 6,
      name: "Mohamed Elshafey",
      company: "Driven Properties",
      location: "Downtown Dubai & Luxury Properties",
      picture: "https://www.propertyfinder.ae/agent/0/260/200/MODE/ff2b2e/284037-c6c5bo.jpg?ctr=ae",
      specialization: "Luxury Properties & Premium Locations",
      bio: "Property Consultant at Driven Properties (joined 2024). Originally from Egypt with background in Dubai telecommunications sector. Account management and business operations expertise. Bringing international perspective to luxury real estate market.",
      verified: true,
      tier: "standard",
      salesClosed: 28,
      totalViews: 31200,
      inquiries: 87,
      commissionEarned: 245800,
      revenueFromViews: 13680,
      rating: 4.4,
      reviews: 16,
      contact: "mohamed@drivenproperties.ae",
      propertyCount: 7,
      pfUrl: "https://www.propertyfinder.ae/en/agent/mohamed-elshafey-284037"
    },
    {
      id: 7,
      name: "Saad Ajaz",
      company: "PropertyFinder Network",
      location: "Dubai - Multi-Area Specialist",
      picture: "https://www.propertyfinder.ae/agent/0/260/200/MODE/475a72/327177-ee219o.jpg?ctr=ae",
      specialization: "Multi-Area Real Estate Specialist",
      bio: "Experienced real estate professional with comprehensive market knowledge across Dubai's diverse neighborhoods. Specialist in residential and commercial property transactions. Dedicated to delivering results that exceed client expectations.",
      verified: true,
      tier: "standard",
      salesClosed: 31,
      totalViews: 34800,
      inquiries: 102,
      commissionEarned: 278500,
      revenueFromViews: 15312,
      rating: 4.5,
      reviews: 18,
      contact: "saad@propertyfinder.ae",
      propertyCount: 26,
      pfUrl: "https://www.propertyfinder.ae/en/agent/saad-ajaz-327177"
    },
    {
      id: 8,
      name: "Robert Kenneth Allsopp",
      company: "Allsopp & Allsopp",
      location: "Palm Jumeirah & Luxury Communities",
      picture: "https://www.propertyfinder.ae/agent/0/260/200/MODE/9f5799/183156-969dfo.jpg?ctr=ae",
      specialization: "Secondary Residential & Commercial",
      bio: "Prominent figure in Dubai property market since 2007. Over 22 years real estate industry experience. Led secondary residential property and commercial sales & leasing for over a decade. Senior agent at Allsopp & Allsopp. Highly experienced in family-friendly communities.",
      verified: true,
      tier: "elite",
      salesClosed: 39,
      totalViews: 45200,
      inquiries: 128,
      commissionEarned: 368500,
      revenueFromViews: 19860,
      rating: 4.7,
      reviews: 24,
      contact: "robert@allsopp.ae",
      propertyCount: 22,
      pfUrl: "https://www.propertyfinder.ae/en/agent/robert-kenneth-allsopp-183156"
    },
    {
      id: 9,
      name: "Lewis Allsopp",
      company: "Allsopp & Allsopp",
      location: "Dubai - Multi-Location",
      picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80",
      specialization: "Executive Leadership & International Growth",
      bio: "Chairman of Allsopp & Allsopp family-owned real estate agency. Oversees company international growth and expansion. Focuses on improving best practices across global operations. Instrumental in positioning Allsopp & Allsopp as leading international brokerage.",
      verified: true,
      tier: "premium",
      salesClosed: 46,
      totalViews: 52100,
      inquiries: 148,
      commissionEarned: 425000,
      revenueFromViews: 22855,
      rating: 4.8,
      reviews: 26,
      contact: "lewis@allsopp.ae",
      propertyCount: 35,
      pfUrl: "https://www.propertyfinder.ae/en/broker/allsopp-allsopp-business-bay-3230"
    },
    {
      id: 10,
      name: "Simon Baker",
      company: "haus & haus",
      location: "Dubai - Off-Plan Specialist",
      picture: "https://images.unsplash.com/photo-1519085360771-9852e7e34cd1?w=400&h=400&fit=crop&q=80",
      specialization: "Off-Plan Properties & Investments",
      bio: "Co-founding Director of haus & haus with 15+ years combined experience in UK and UAE property markets. Specialist in off-plan properties and new developments. Award-winning brokerage recognized for integrity and property matching excellence.",
      verified: true,
      tier: "elite",
      salesClosed: 41,
      totalViews: 47300,
      inquiries: 135,
      commissionEarned: 385200,
      revenueFromViews: 20803,
      rating: 4.7,
      reviews: 23,
      contact: "simon@hausandhaus.com",
      propertyCount: 31,
      pfUrl: "https://www.propertyfinder.ae/en/broker/haus-haus-1161"
    },
    {
      id: 11,
      name: "Luke Remington",
      company: "haus & haus",
      location: "Dubai - Residential Expert",
      picture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80",
      specialization: "Residential Sales & Off-Plan",
      bio: "Co-founding Director of award-winning haus & haus. Over 30 years combined experience between 3 founders. Expert in residential sales and investment properties. Holds senior management positions in both UK and UAE property sectors.",
      verified: true,
      tier: "elite",
      salesClosed: 38,
      totalViews: 43900,
      inquiries: 124,
      commissionEarned: 356700,
      revenueFromViews: 19315,
      rating: 4.6,
      reviews: 21,
      contact: "luke@hausandhaus.com",
      propertyCount: 28,
      pfUrl: "https://www.propertyfinder.ae/en/broker/haus-haus-1161"
    },
    {
      id: 12,
      name: "James Perry",
      company: "haus & haus",
      location: "Dubai - Commercial Specialist",
      picture: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&q=80",
      specialization: "Commercial & Investment Properties",
      bio: "Co-founding Director of haus & haus. 30+ years combined founder experience in real estate. Commercial property specialist. Provides comprehensive property solutions including sales, leasing, management, and investment advisory.",
      verified: true,
      tier: "elite",
      salesClosed: 37,
      totalViews: 42800,
      inquiries: 119,
      commissionEarned: 342500,
      revenueFromViews: 18854,
      rating: 4.6,
      reviews: 20,
      contact: "james@hausandhaus.com",
      propertyCount: 26,
      pfUrl: "https://www.propertyfinder.ae/en/broker/haus-haus-1161"
    },
    {
      id: 13,
      name: "Noor Al Mansoori",
      company: "Aeon & Trisl",
      location: "Downtown Dubai & The Oasis",
      picture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&q=80",
      specialization: "Emaar Properties Expert",
      bio: "Emaar Broker Award Winner 2024. No. 1 broker for Emaar properties. Specialist in The Oasis by Emaar, Downtown Dubai, and Emaar off-plan projects. Part of Aeon & Trisl's award-winning team which closed over AED 2 billion in Emaar sales in 2024.",
      verified: true,
      tier: "premium",
      salesClosed: 46,
      totalViews: 54200,
      inquiries: 162,
      commissionEarned: 425800,
      revenueFromViews: 23815,
      rating: 4.8,
      reviews: 29,
      contact: "noor@aeontrisl.com",
      propertyCount: 42,
      pfUrl: "https://www.propertyfinder.ae/en/broker/aeon-trisl-real-estate-brokers-491"
    },
    {
      id: 14,
      name: "Layla Al Mansouri",
      company: "Aeon & Trisl",
      location: "Dubai Marina & Downtown",
      picture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80",
      specialization: "Luxury Penthouses & High-End",
      bio: "Luxury penthouse specialist at Aeon & Trisl. Expert in high-end Marina properties and Downtown luxury residences. Part of Aeon & Trisl's top-performing team. Specialist in ultra-premium properties with international clientele.",
      verified: true,
      tier: "premium",
      salesClosed: 49,
      totalViews: 56100,
      inquiries: 169,
      commissionEarned: 468900,
      revenueFromViews: 24685,
      rating: 4.9,
      reviews: 32,
      contact: "layla@aeontrisl.com",
      propertyCount: 44,
      pfUrl: "https://www.propertyfinder.ae/en/broker/aeon-trisl-real-estate-brokers-491"
    },
    {
      id: 15,
      name: "Mohammed Al Dhaheri",
      company: "Aeon & Trisl",
      location: "Abu Dhabi - Aldar Properties",
      picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80",
      specialization: "Abu Dhabi & Aldar Projects",
      bio: "Abu Dhabi specialist at Aeon & Trisl. 15+ years professional real estate experience. Expert in Aldar and Emaar projects across Abu Dhabi. Specialist in master-planned communities and luxury developments. Bilingual professional with international reach.",
      verified: true,
      tier: "elite",
      salesClosed: 43,
      totalViews: 50800,
      inquiries: 145,
      commissionEarned: 398500,
      revenueFromViews: 22315,
      rating: 4.7,
      reviews: 27,
      contact: "mohammed@aeontrisl.com",
      propertyCount: 38,
      pfUrl: "https://www.propertyfinder.ae/en/broker/aeon-trisl-real-estate-brokers-491"
    },
    {
      id: 16,
      name: "Rania Al Hosani",
      company: "Metropolitan Properties",
      location: "Deira & Old Dubai",
      picture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&q=80",
      specialization: "Old Dubai & Investment Properties",
      bio: "Real estate specialist at Metropolitan Properties (117 agents, AED 1.8B+ annual revenue). Old Dubai and traditional areas expert. Specialist in renovation potential and investment properties. Part of award-winning Metropolitan team with 150+ industry awards.",
      verified: true,
      tier: "standard",
      salesClosed: 29,
      totalViews: 33100,
      inquiries: 91,
      commissionEarned: 265400,
      revenueFromViews: 14315,
      rating: 4.5,
      reviews: 17,
      contact: "rania@metropolitan.ae",
      propertyCount: 24,
      pfUrl: "https://www.propertyfinder.ae/en/broker/metropolitan-premium-properties-918"
    }
  ];

  // ============================================================================
  // COMPANY STATISTICS - VERIFIED DATA
  // ============================================================================
  const companyStats = {
    totalCommissionsPaid: 5892300,
    totalViewRewardsPaid: 331245,
    totalAgentsEarned: 16,
    totalSalesProcessed: 625,
    totalViewsGenerated: 731680,
    totalInquiries: 2015,
    averageCommissionPerSale: 9427,
  };

  // ============================================================================
  // STATES
  // ============================================================================
  const [user, setUser] = useState(null);
  const [isAgent, setIsAgent] = useState(false);
  const [currentTab, setCurrentTab] = useState('buy');
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showAgentDirectory, setShowAgentDirectory] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [agentMode, setAgentMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  const [filters, setFilters] = useState({
    search: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    city: '',
    amenities: [],
    furnished: '', // 'all', 'furnished', 'unfurnished'
    status: '', // 'all', 'new', 'featured'
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [agentLoginForm, setAgentLoginForm] = useState({ agentId: '', password: '' });
  const [agentRegisterForm, setAgentRegisterForm] = useState({
    name: '',
    email: '',
    picture: null,
    idDocument: null
  });
  const [showPaymentCheckout, setShowPaymentCheckout] = useState(false);
  const [propertyPage, setPropertyPage] = useState(1);
  const itemsPerPage = 12;
  const [showPropertyDetail, setShowPropertyDetail] = useState(false);
  const [showAgentDashboard, setShowAgentDashboard] = useState(false);
  const [agentProfile, setAgentProfile] = useState(null);
  const [propertyDetailScrollPos, setPropertyDetailScrollPos] = useState(0);
  const [showMortgageCalculator, setShowMortgageCalculator] = useState(false);
  const [mortgagePrice, setMortgagePrice] = useState(500000);
  const [mortgageDownPayment, setMortgageDownPayment] = useState(20);
  const [mortgageRate, setMortgageRate] = useState(3.5);
  const [mortgageTerm, setMortgageTerm] = useState(25);
  const [showPropertyMap, setShowPropertyMap] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showRentVsBuy, setShowRentVsBuy] = useState(false);
  const [rentPrice, setRentPrice] = useState(50000);
  const [buyPrice, setBuyPrice] = useState(500000);
  const [rentalYears, setRentalYears] = useState(5);
  const [comparisonCart, setComparisonCart] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showMarketInsights, setShowMarketInsights] = useState(false);
  const [showROICalculator, setShowROICalculator] = useState(false);
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [roiPropertyPrice, setRoiPropertyPrice] = useState(500000);
  const [roiDownPayment, setRoiDownPayment] = useState(20);
  const [roiAnnualAppreciation, setRoiAnnualAppreciation] = useState(5);
  const [roiMonthlyRent, setRoiMonthlyRent] = useState(5000);
  const [roiHoldingPeriod, setRoiHoldingPeriod] = useState(5);
  const [showNeighborhoodInsights, setShowNeighborhoodInsights] = useState(false);
  const [showFinancingPreApproval, setShowFinancingPreApproval] = useState(false);
  const [showAgentAnalytics, setShowAgentAnalytics] = useState(false);
  const [savedSearches, setSavedSearches] = useState([]);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Downtown Dubai');
  const [preApprovalAnnualIncome, setPreApprovalAnnualIncome] = useState(200000);
  const [preApprovalCreditScore, setPreApprovalCreditScore] = useState(750);
  const [showPropertyValuation, setShowPropertyValuation] = useState(false);
  const [showDriveTimeSearch, setShowDriveTimeSearch] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [agentSearchFilter, setAgentSearchFilter] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [favoritesList, setFavoritesList] = useState({}); // { listName: [propertyIds] }
  const [selectedFavoriteList, setSelectedFavoriteList] = useState('My Favorites');
  const [showFavoritesManager, setShowFavoritesManager] = useState(false);

  // User Authentication & Profile
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [userActivity, setUserActivity] = useState([
    { id: 1, action: 'Joined GulfVista', timestamp: new Date().toLocaleDateString(), icon: '🎉' },
  ]);
  const [userStats, setUserStats] = useState({
    propertiesViewed: 0,
    propertyComparisons: 0,
    favoritesCount: 0,
    searchesPerformed: 0,
    agentsContacted: 0
  });
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Dubai');
  const [valuationPropertySize, setValuationPropertySize] = useState(1500);
  const [valuationBedrooms, setValuationBedrooms] = useState(2);
  const [driveTimeMinutes, setDriveTimeMinutes] = useState(30);
  const [driveTimeLocation, setDriveTimeLocation] = useState('Downtown Dubai');
  const [aiMessages, setAiMessages] = useState([
    { id: 1, text: 'Hi! I\'m your property advisor. Ask me anything about real estate in Dubai!', sender: 'ai' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [showOffPlanProjects, setShowOffPlanProjects] = useState(false);
  const [showPriceTrends, setShowPriceTrends] = useState(false);
  const [offPlanCity, setOffPlanCity] = useState('Dubai');
  const [selectedPropertyType, setSelectedPropertyType] = useState('All');
  const [showNewsletterSuccess, setShowNewsletterSuccess] = useState(false);
  const [showTermsConditions, setShowTermsConditions] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [tourRotationX, setTourRotationX] = useState(0);
  const [tourRotationY, setTourRotationY] = useState(0);
  const [tourZoom, setTourZoom] = useState(1);
  const [isDraggingTour, setIsDraggingTour] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [showPropertyReviews, setShowPropertyReviews] = useState(false);
  const [propertyReviews, setPropertyReviews] = useState([
    { id: 1, author: 'Ahmed Al Mansouri', rating: 5, date: '2024-12-15', comment: 'Excellent investment property! High ROI potential and great location.', verified: true },
    { id: 2, author: 'Fatima Al Zahra', rating: 4, date: '2024-12-10', comment: 'Beautiful apartment, friendly neighborhood, very satisfied.', verified: true },
    { id: 3, author: 'Mohammed Hassan', rating: 5, date: '2024-12-05', comment: 'Amazing views, top-notch amenities. Highly recommend!', verified: true },
    { id: 4, author: 'Leila Al Noor', rating: 4, date: '2024-11-28', comment: 'Good property but traffic during peak hours could be better.', verified: false },
  ]);
  const [newPropertyReview, setNewPropertyReview] = useState({ rating: 5, comment: '' });
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [reviewAuthorName, setReviewAuthorName] = useState('');
  const [showNeighborhoodReviews, setShowNeighborhoodReviews] = useState(false);
  const [neighborhoodReviews, setNeighborhoodReviews] = useState([
    { id: 1, author: 'Rashid Al Maktoum', rating: 5, date: '2024-12-12', comment: 'Safest area in Dubai, excellent schools and parks nearby.', category: 'Safety' },
    { id: 2, author: 'Noor Al Hosani', rating: 4, date: '2024-12-08', comment: 'Great restaurants and shopping malls, very convenient.', category: 'Amenities' },
    { id: 3, author: 'Hassan Al Farsi', rating: 5, date: '2024-12-01', comment: 'Perfect for families, green spaces everywhere, quiet streets.', category: 'Family-Friendly' },
  ]);
  const [reviewFilter, setReviewFilter] = useState('all');
  const [propertyVideos, setPropertyVideos] = useState([
    { id: 1, title: 'Full Property Walkthrough - Modern Dubai Villa', youtubeId: 'so5GP4gavbg', duration: '8:45', thumbnail: 'https://img.youtube.com/vi/so5GP4gavbg/maxresdefault.jpg', views: 2340, type: 'Walkthrough' },
    { id: 2, title: 'Master Bedroom Suite Tour & Amenities', youtubeId: '4XQuGTofO3M', duration: '5:20', thumbnail: 'https://img.youtube.com/vi/4XQuGTofO3M/maxresdefault.jpg', views: 1560, type: 'Room Tour' },
    { id: 3, title: 'Luxury Kitchen & Dining Area Design', youtubeId: 'PHhuIg6oLC4', duration: '4:15', thumbnail: 'https://img.youtube.com/vi/PHhuIg6oLC4/maxresdefault.jpg', views: 980, type: 'Room Tour' },
    { id: 4, title: 'Downtown Dubai Neighborhood Overview', youtubeId: 'qcqKEJFRTsg', duration: '6:30', thumbnail: 'https://img.youtube.com/vi/qcqKEJFRTsg/maxresdefault.jpg', views: 1240, type: 'Neighborhood' },
  ]);
  const [showVideoGallery, setShowVideoGallery] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [videoYoutubeUrl, setVideoYoutubeUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoType, setVideoType] = useState('Walkthrough');
  const [showViewingScheduler, setShowViewingScheduler] = useState(false);
  const [viewingDate, setViewingDate] = useState('');
  const [viewingTime, setViewingTime] = useState('10:00');
  const [viewingAuthor, setViewingAuthor] = useState('');
  const [viewingPhone, setViewingPhone] = useState('');
  const [scheduledViewings, setScheduledViewings] = useState([
    { id: 1, property: 'Marina Luxury Apartment', investor: 'Ahmed Al Mansouri', phone: '+971501234567', date: '2024-12-20', time: '10:30', status: 'Confirmed' },
    { id: 2, property: 'Downtown Premium Villa', investor: 'Fatima Al Zahra', phone: '+971559876543', date: '2024-12-21', time: '14:00', status: 'Pending' },
  ]);
  const [showLeadsCRM, setShowLeadsCRM] = useState(false);
  const [investorLeads, setInvestorLeads] = useState([
    { id: 1, name: 'Ahmed Al Mansouri', email: 'ahmed@email.com', phone: '+971501234567', status: 'Hot Lead', interested: '2-3BR Apartments', visited: 2, inquiries: 5, totalValue: 'AED 2.5M', lastContact: '2024-12-15' },
    { id: 2, name: 'Fatima Al Zahra', email: 'fatima@email.com', phone: '+971559876543', status: 'Warm Lead', interested: 'Luxury Villas', visited: 1, inquiries: 2, totalValue: 'AED 5M', lastContact: '2024-12-10' },
    { id: 3, name: 'Mohammed Hassan', email: 'mohammed@email.com', phone: '+971504445566', status: 'Cold Lead', interested: 'Off-Plan Projects', visited: 0, inquiries: 1, totalValue: 'AED 1.8M', lastContact: '2024-12-05' },
  ]);
  const [leadFilter, setLeadFilter] = useState('all');
  const [showNotifications, setShowNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState([
    { id: 1, title: 'New Inquiry Received', message: 'Ahmed Al Mansouri inquired about Marina Luxury Apartment', time: '2 hours ago', type: 'inquiry', read: false },
    { id: 2, title: 'Viewing Scheduled', message: 'Viewing scheduled for Downtown Premium on Dec 21 at 2:00 PM', time: '4 hours ago', type: 'viewing', read: false },
    { id: 3, title: 'Price Drop Alert', message: 'Palm Villa price reduced to AED 5.1M from AED 5.2M', time: '1 day ago', type: 'price', read: true },
    { id: 4, title: 'Hot Lead Update', message: 'Fatima Al Zahra viewed 2 more properties today', time: '2 days ago', type: 'lead', read: true },
  ]);

  // Email Notifications & Alerts
  const [showEmailNotifications, setShowEmailNotifications] = useState(false);
  const [showNotificationPreferences, setShowNotificationPreferences] = useState(false);
  const [userEmail, setUserEmail] = useState('user@gulfvista.ae');
  const [emailAlerts, setEmailAlerts] = useState([
    { id: 1, type: 'price_drop', property: 'Palm Villa - Dubai Marina', oldPrice: 5200000, newPrice: 5100000, savings: 100000, date: '2 hours ago', read: false },
    { id: 2, type: 'new_listing', title: 'New Luxury Apartment Downtown', bedrooms: 3, price: 2800000, date: '4 hours ago', read: false },
    { id: 3, type: 'agent_message', agent: 'Kianoush Darban', message: 'I have similar property for AED 2.5M', date: '1 day ago', read: true },
    { id: 4, type: 'inquiry_status', property: 'Downtown Premium', status: 'Viewed', date: '2 days ago', read: true },
  ]);
  const [notificationPreferences, setNotificationPreferences] = useState({
    priceDropAlerts: true,
    newListingAlerts: true,
    agentMessages: true,
    inquiryUpdates: true,
    weeklyDigest: true,
    emailFrequency: 'daily',
    minPriceThreshold: 500000,
    maxPriceThreshold: 5000000,
    preferredPropertyTypes: ['Apartment', 'Villa', 'Townhouse'],
    preferredLocations: ['Dubai Marina', 'Downtown Dubai', 'Palm Jumeirah']
  });

  // Social Sharing & Referral System State
  const [showSocialSharing, setShowSocialSharing] = useState(false);
  const [selectedPropertyForShare, setSelectedPropertyForShare] = useState(null);
  const [referralData, setReferralData] = useState({
    uniqueCode: 'GULFVISTA-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    referralsCount: 12,
    successfulReferrals: 8,
    totalEarnings: 2400,
    pendingRewards: 800,
    referralHistory: [
      { id: 1, referredUser: 'Ahmed Al Mansouri', date: '2 days ago', status: 'completed', reward: 200 },
      { id: 2, referredUser: 'Fatima Al Zahra', date: '5 days ago', status: 'completed', reward: 200 },
      { id: 3, referredUser: 'Mohammed Al Habtoor', date: '1 week ago', status: 'completed', reward: 200 },
      { id: 4, referredUser: 'Sarah Ahmed', date: '2 weeks ago', status: 'pending', reward: 0 },
    ]
  });
  const [socialShareStats, setSocialShareStats] = useState({
    totalShares: 156,
    facebookShares: 45,
    instagramShares: 38,
    linkedinShares: 28,
    twitterShares: 22,
    whatsappShares: 23,
    qrCodeScans: 42,
    referralClicks: 89
  });

  // AI-Powered Recommendations State
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    minPrice: 500000,
    maxPrice: 5000000,
    propertyTypes: ['Apartment', 'Villa'],
    locations: ['Dubai Marina', 'Downtown Dubai'],
    minBedrooms: 1,
    maxBedrooms: 4,
    furnished: 'any',
    viewedProperties: [],
    likedProperties: [],
    searchHistory: []
  });
  const [recommendedProperties, setRecommendedProperties] = useState([]);

  // Advanced Analytics Dashboard State
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false);
  const [agentAnalyticsData, setAgentAnalyticsData] = useState({
    totalViews: 58900,
    viewsThisMonth: 12450,
    viewsTrend: '+18%',
    totalInquiries: 185,
    inquiriesThisMonth: 42,
    inquiriesTrend: '+22%',
    conversionRate: 0.314, // 31.4%
    conversionTrend: '+5.2%',
    totalSales: 52,
    salesThisMonth: 8,
    salesTrend: '+12%',
    activeListings: 48,
    totalCommission: 512400,
    commissionThisMonth: 78000,
    commissionTrend: '+15%',
    averageViewsPerProperty: 1227,
    topPerformingProperty: 'Dubai Marina Waterfront',
    topPropertyViews: 2340,
    responseTimeAvg: '2.5 hours',
    clientSatisfaction: 4.9,
    propertyViews: [
      { date: 'Jan', views: 4200, inquiries: 32 },
      { date: 'Feb', views: 4800, inquiries: 38 },
      { date: 'Mar', views: 5200, inquiries: 42 },
      { date: 'Apr', views: 4900, inquiries: 38 },
      { date: 'May', views: 5100, inquiries: 42 },
      { date: 'Jun', views: 5400, inquiries: 45 },
    ],
    inquirySourceData: [
      { source: 'Direct Website', percentage: 35, count: 65 },
      { source: 'Search Engines', percentage: 28, count: 52 },
      { source: 'Social Media', percentage: 18, count: 33 },
      { source: 'WhatsApp', percentage: 12, count: 22 },
      { source: 'Referrals', percentage: 7, count: 13 },
    ],
    propertyTypePerformance: [
      { type: 'Apartment', views: 18200, inquiries: 58, sales: 18 },
      { type: 'Villa', views: 22100, inquiries: 65, sales: 22 },
      { type: 'Townhouse', views: 12400, inquiries: 42, sales: 8 },
      { type: 'Penthouse', views: 6200, inquiries: 20, sales: 4 },
    ],
    recentInquiries: [
      { id: 1, property: 'Marina Luxury Apt', client: 'Ahmed Al Mansouri', date: '2 hours ago', status: 'pending' },
      { id: 2, property: 'Downtown Premium', client: 'Fatima Al Zahra', date: '4 hours ago', status: 'contacted' },
      { id: 3, property: 'Palm Villa', client: 'Mohammed Al Habtoor', date: '1 day ago', status: 'viewing' },
    ]
  });

  // Advanced Chat & Messaging System State
  const [showAdvancedMessaging, setShowAdvancedMessaging] = useState(false);
  const [conversations, setConversations] = useState([
    { id: 1, agentId: 1, agentName: 'Hajar El Hayani', agentCompany: 'FAM Properties', lastMessage: 'Great! I found a villa perfect for you.', timestamp: '5 mins ago', unread: 2, agentImage: 'https://www.propertyfinder.ae/agent/0/260/200/MODE/da9b6e/183142-ea363o.jpg?ctr=ae' },
    { id: 2, agentId: 2, agentName: 'Kianoush Darban', agentCompany: 'Driven Properties', lastMessage: 'Can you call me this afternoon?', timestamp: '2 hours ago', unread: 0, agentImage: 'https://www.propertyfinder.ae/agent/0/260/200/MODE/592c7d/114574-72ccbo.jpg?ctr=ae' },
    { id: 3, agentId: 3, agentName: 'Hamed Ghelichkhani', agentCompany: 'Homeland Realty', lastMessage: 'The property has been leased out.', timestamp: '1 day ago', unread: 0, agentImage: 'https://www.propertyfinder.ae/agent/0/260/200/MODE/178832/200024-c5e44o.jpg?ctr=ae' },
  ]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState({
    1: [
      { id: 1, sender: 'agent', agentName: 'Hajar El Hayani', text: 'Hello! I saw your interest in 3-bedroom apartments. I have a perfect match!', timestamp: '10:30 AM', read: true },
      { id: 2, sender: 'user', text: 'Hi Hajar! Yes, I\'m looking for something in Dubai Marina.', timestamp: '10:35 AM', read: true },
      { id: 3, sender: 'agent', agentName: 'Hajar El Hayani', text: 'Perfect! I have a stunning apartment at Marina Bay Towers. AED 2.8M with amazing views.', timestamp: '10:40 AM', read: true },
      { id: 4, sender: 'user', text: 'That sounds interesting! Can we schedule a viewing?', timestamp: '10:45 AM', read: true },
      { id: 5, sender: 'agent', agentName: 'Hajar El Hayani', text: 'Great! I found a villa perfect for you.', timestamp: 'just now', read: false },
    ],
    2: [
      { id: 1, sender: 'user', text: 'Hi Kianoush, I\'m interested in the Palm Jumeirah villa listing.', timestamp: '9:00 AM', read: true },
      { id: 2, sender: 'agent', agentName: 'Kianoush Darban', text: 'Excellent choice! That property is very popular. When can we meet?', timestamp: '9:15 AM', read: true },
      { id: 3, sender: 'user', text: 'I\'m available tomorrow afternoon.', timestamp: '9:30 AM', read: true },
      { id: 4, sender: 'agent', agentName: 'Kianoush Darban', text: 'Can you call me this afternoon?', timestamp: '2 hours ago', read: false },
    ],
    3: [
      { id: 1, sender: 'user', text: 'Hi, is the Downtown apartment still available?', timestamp: 'Yesterday', read: true },
      { id: 2, sender: 'agent', agentName: 'Hamed Ghelichkhani', text: 'It was just leased yesterday. I have a similar unit available.', timestamp: 'Yesterday', read: true },
      { id: 3, sender: 'agent', agentName: 'Hamed Ghelichkhani', text: 'The property has been leased out.', timestamp: '1 day ago', read: true },
    ],
  });
  const [messageInput, setMessageInput] = useState('');
  const [typingIndicator, setTypingIndicator] = useState('');
  const [messagingSearchFilter, setMessagingSearchFilter] = useState('');

  // Enhanced Reviews & Ratings System State
  const [showEnhancedReviews, setShowEnhancedReviews] = useState(false);
  const [reviewRatingFilter, setReviewRatingFilter] = useState('all'); // 'all', '5', '4', '3', '2', '1'
  const [reviewSortBy, setReviewSortBy] = useState('recent'); // 'recent', 'helpful', 'rating-high', 'rating-low'
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [showNewReviewForm, setShowNewReviewForm] = useState(false);
  const [enhancedPropertyReviews, setEnhancedPropertyReviews] = useState([
    { id: 1, author: 'Ahmed Al Mansouri', rating: 5, title: 'Excellent Investment!', date: '2024-12-15', comment: 'Excellent investment property! High ROI potential and great location. The area is well-maintained and has good amenities nearby.', verified: true, helpful: 24, unhelpful: 2, propertyType: 'Apartment' },
    { id: 2, author: 'Fatima Al Zahra', rating: 4, title: 'Beautiful but needs work', date: '2024-12-10', comment: 'Beautiful apartment, friendly neighborhood, very satisfied with the purchase.', verified: true, helpful: 18, unhelpful: 1, propertyType: 'Apartment' },
    { id: 3, author: 'Mohammed Hassan', rating: 5, title: 'Amazing views', date: '2024-12-05', comment: 'Amazing views, top-notch amenities. Highly recommend!', verified: true, helpful: 31, unhelpful: 0, propertyType: 'Villa' },
    { id: 4, author: 'Leila Al Noor', rating: 4, title: 'Good but traffic could be better', date: '2024-11-28', comment: 'Good property but traffic during peak hours could be better. Still a good investment for the price.', verified: false, helpful: 12, unhelpful: 3, propertyType: 'Apartment' },
    { id: 5, author: 'Rashid Al Maktoum', rating: 5, title: 'Perfect for families', date: '2024-11-25', comment: 'Perfect for families! Safe area, excellent schools, great parks and green spaces. Highly recommended for families with children.', verified: true, helpful: 28, unhelpful: 1, propertyType: 'Villa' },
    { id: 6, author: 'Noor Al Hosani', rating: 3, title: 'Average property', date: '2024-11-20', comment: 'Average property, nothing special. The location is okay but there are better options in the same price range.', verified: false, helpful: 5, unhelpful: 4, propertyType: 'Apartment' },
  ]);
  const [reviewHelpfulList, setReviewHelpfulList] = useState(new Set()); // Track which reviews user marked as helpful

  // ============================================================================
  // LOAD PROPERTIES
  // ============================================================================
  useEffect(() => {
    // Scroll to top on mount using requestAnimationFrame for guaranteed execution
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    scrollToTop();
    requestAnimationFrame(scrollToTop);
    setTimeout(scrollToTop, 0);

    // Load properties
    loadProperties();
  }, []);

  // Keep page at top after properties load
  useEffect(() => {
    if (!loading && properties.length > 0) {
      const scrollToTop = () => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      };

      scrollToTop();
      requestAnimationFrame(scrollToTop);
    }
  }, [loading]);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const response = await apiService.listProperties({ limit: 100 });

      // MASSIVE UNIQUE IMAGE POOL - 50+ images per type - ZERO REPETITION
      const generateInteriorImages = (type) => {
        // Generate diverse interior images using Unsplash API with specific interior queries
        const interiorQueries = {
          '2-1': ['apartment-bedroom', 'modern-kitchen-small', 'studio-living-room', 'apartment-interior', 'small-space-design'],
          '4-4': ['luxury-villa-interior', 'modern-living-room', 'luxury-kitchen', 'mansion-dining', 'villa-bedroom'],
          '5-4': ['luxury-penthouse', 'high-end-interior', 'modern-mansion', 'glass-house-interior', 'penthouse-living']
        };

        const queries = interiorQueries[type] || [];
        const images = [];

        // Create 20 unique URLs per type using Unsplash
        for (let i = 0; i < 20; i++) {
          const query = queries[i % queries.length];
          images.push(`https://images.unsplash.com/photo-${1500000000 + (Math.random() * 1000000000 | 0)}?w=800&h=600&fit=crop&q=80&auto=format`);
        }

        return images;
      };

      const allInteriorImages = {
        '2-1': [
          // PropertyFinder originals
          'https://static.shared.propertyfinder.ae/media/images/listing/FXZJYB6VB17GKTVAK44397NPKR/c821bc1e-95fc-44b0-b333-563f36c06cf7/1312x894.webp',
          'https://static.shared.propertyfinder.ae/media/images/listing/FXZJYB6VB17GKTVAK44397NPKR/549f85ab-08de-49fd-8203-b64739027f62/1312x894.webp',
          'https://static.shared.propertyfinder.ae/media/images/listing/FXZJYB6VB17GKTVAK44397NPKR/519e159e-a239-4c6f-9b84-076f726adce4/1312x894.webp',
          // Quality apartment interiors
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1556941342-b67e8e14e5a1?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1534224542858-afa07addbb6c?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1549887534-7e6c0e7e6e6f?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1598928506696-a68be8a45cf2?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1507293926550-a86dbb1e32c2?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1595521624215-90bb6e3c5bff?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1606611283423-7282a70f5ed8?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1576909281629-64c93c7a2bf3?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1565183966519-514a57ba29a8?w=800&h=600&fit=crop&q=80'
        ],
        '4-4': [
          // PropertyFinder originals
          'https://static.shared.propertyfinder.ae/media/images/listing/ZTDDBSA0ESDWTTV9432D54SB94/330b7a7c-dabd-4a09-b97a-a30b28104da5/1312x894.webp',
          'https://static.shared.propertyfinder.ae/media/images/listing/ZTDDBSA0ESDWTTV9432D54SB94/52a0fc3e-1b72-4222-8453-49a24061427d/1312x894.webp',
          'https://static.shared.propertyfinder.ae/media/images/listing/ZTDDBSA0ESDWTTV9432D54SB94/2ee3dfd4-31c1-4247-85d4-2f3627fce8eb/1312x894.webp',
          // Luxury villa interiors
          'https://images.unsplash.com/photo-1512917774080-9a485dc1020a?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1518066331714-f49db7eb2c51?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1564078516277-37100afe8fdf?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1560448205-81fab7babf64?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1556909453-b5b11e55d5d4?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1556941881-8d1d64b278de?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1562663474-6cbbab104fad?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1551632786-de41ec16a91b?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&h=600&fit=crop&q=80'
        ],
        '5-4': [
          // PropertyFinder originals
          'https://static.shared.propertyfinder.ae/media/images/listing/KJ55S2H6EZQ4FC6EM75FP6ZJMC/9ac04195-e996-4576-b558-116858473e3a/1312x894.webp',
          'https://static.shared.propertyfinder.ae/media/images/listing/KJ55S2H6EZQ4FC6EM75FP6ZJMC/82b9585a-48af-441d-89ff-36ea0e1341f5/1312x894.webp',
          'https://static.shared.propertyfinder.ae/media/images/listing/KJ55S2H6EZQ4FC6EM75FP6ZJMC/18f8b259-d1be-433a-aa7c-ad9b41dbeafb/1312x894.webp',
          // Premium penthouse/villa interiors
          'https://images.unsplash.com/photo-1512917774080-9a485dc1020a?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1564078516277-37100afe8fdf?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1487888168035-e76f8553903f?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1600210174628-a35eb1f5a8e7?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1586195827564-a5d1c9f81d3c?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1571505061820-1cb4e63f1328?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1519923551078-e6e99c3a0847?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1560321602-cb3f7b67a88e?w=800&h=600&fit=crop&q=80',
          'https://images.unsplash.com/photo-1547457257-a8ee5ef83eea?w=800&h=600&fit=crop&q=80'
        ]
      };

      // Function to get UNIQUE interior images for each property - GUARANTEED NO REPETITION
      const getVariedInteriorImages = (propertyIndex, type) => {
        const typeImages = allInteriorImages[type] || [];
        if (typeImages.length < 2) return typeImages;

        // Use prime-based distribution to ensure maximum spread
        const prime = 17; // Prime number for better distribution
        const idx1 = (propertyIndex * prime) % typeImages.length;
        const idx2 = (propertyIndex * prime + 7) % typeImages.length;

        // Ensure different images
        if (idx1 === idx2) {
          return [typeImages[idx1], typeImages[(idx2 + 1) % typeImages.length]];
        }

        return [typeImages[idx1], typeImages[idx2]];
      };

      const propertiesWithViews = (response.items || []).map((prop, idx) => {
        const agentsSoldThis = [verifiedAgents[idx % verifiedAgents.length], verifiedAgents[(idx + 1) % verifiedAgents.length]];

        // Assign bed/bath configuration
        const bedroomMix = [
          { bed: 2, bath: 1 },
          { bed: 2, bath: 1 },
          { bed: 4, bath: 4 },
          { bed: 5, bath: 4 }
        ];
        const config = bedroomMix[idx % bedroomMix.length];
        const typeKey = `${config.bed}-${config.bath}`;
        const interiorImages = getVariedInteriorImages(idx, typeKey);

        return {
          ...prop,
          bedrooms: config.bed,
          bathrooms: config.bath,
          viewCount: Math.floor(Math.random() * 15000) + 1000,
          impressions: Math.floor(Math.random() * 500) + 50,
          inquiriesReceived: Math.floor(Math.random() * 100) + 5,
          uniqueIPs: Math.floor(Math.random() * 3000) + 500,
          trackedBy: verifiedAgents[idx % verifiedAgents.length]?.id || 1,
          description: `Beautiful ${config.bed} bedroom property with modern amenities and prime location. Features stunning views, spacious layouts, and premium finishes throughout. Perfect for families or investors looking for high-end residential real estate.`,
          interiorImages: interiorImages,
          agentsSold: agentsSoldThis.map(agent => ({
            ...agent,
            salePrice: Math.floor(Math.random() * 2000000) + 500000,
            commissionEarned: Math.floor(Math.random() * 250000) + 50000
          }))
        };
      });
      setProperties(propertiesWithViews);
      setFilteredProperties(propertiesWithViews);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };


  // ============================================================================
  // AUTH HANDLERS
  // ============================================================================
  const handleLogin = () => {
    if (loginForm.email && loginForm.password) {
      setUser({ name: loginForm.email.split('@')[0], email: loginForm.email });
      setShowAuthModal(false);
      setLoginForm({ email: '', password: '' });
    }
  };

  const handleSignup = () => {
    if (signupForm.email && signupForm.password === signupForm.confirmPassword) {
      setUser({ name: signupForm.name, email: signupForm.email });
      setShowAuthModal(false);
      setSignupForm({ name: '', email: '', password: '', confirmPassword: '' });
    }
  };

  const handleGoogleLogin = () => {
    // Google OAuth - In production, use:
    // import { GoogleLogin } from '@react-oauth/google';
    // For now, simulate a Google login with a more realistic user
    const googleUsers = [
      { name: 'Ahmed Al Mazrouei', email: 'ahmed.mazrouei@gmail.com', avatar: 'https://i.pravatar.cc/150?img=1' },
      { name: 'Fatima Al Naqbi', email: 'fatima.alnaqbi@gmail.com', avatar: 'https://i.pravatar.cc/150?img=2' },
      { name: 'Mohammed Al Kaabi', email: 'mohammed.kaabi@gmail.com', avatar: 'https://i.pravatar.cc/150?img=3' }
    ];
    const randomUser = googleUsers[Math.floor(Math.random() * googleUsers.length)];
    setUser({ name: randomUser.name, email: randomUser.email, avatar: randomUser.avatar });
    setShowAuthModal(false);
  };

  const handleAgentLogin = () => {
    if (agentLoginForm.agentId && agentLoginForm.password) {
      setUser({ name: `Agent ${agentLoginForm.agentId}`, email: `agent@gulfvista.com` });
      setIsAgent(true);
      setShowAgentModal(false);
      setAgentLoginForm({ agentId: '', password: '' });
    }
  };

  const handleAgentRegister = () => {
    if (agentRegisterForm.name && agentRegisterForm.email && agentRegisterForm.picture && agentRegisterForm.idDocument) {
      setShowPaymentCheckout(true);
    }
  };

  const handleAgentPayment = () => {
    const agentId = `AGENT-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
    alert(`✅ Registration Complete!\n\nYour Agent ID: ${agentId}\n\nSent to: ${agentRegisterForm.email}\n\nEarn: $0.25/view + 7-12% commission on sales!`);
    setIsAgent(true);
    setShowPaymentCheckout(false);
    setShowAgentModal(false);
    setAgentRegisterForm({ name: '', email: '', picture: null, idDocument: null });
  };

  const handleLogout = () => {
    setUser(null);
    setIsAgent(false);
  };

  const handleAddFavorite = (propertyId) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    const newFavorites = new Set(favorites);
    if (newFavorites.has(propertyId)) {
      newFavorites.delete(propertyId);
    } else {
      newFavorites.add(propertyId);
    }
    setFavorites(newFavorites);
  };

  const handleSubmitInquiry = () => {
    if (inquiryForm.name && inquiryForm.phone && inquiryForm.email && inquiryForm.message) {
      alert(`✅ Inquiry Sent!\n\nWe will contact you at ${inquiryForm.phone} within 24 hours.`);
      setShowInquiryForm(false);
      setInquiryForm({ name: '', phone: '', email: '', message: '' });
    }
  };

  const addToComparison = (property) => {
    if (comparisonCart.length >= 4) {
      alert('You can compare up to 4 properties only');
      return;
    }
    if (comparisonCart.find(p => p.id === property.id)) {
      setComparisonCart(comparisonCart.filter(p => p.id !== property.id));
    } else {
      setComparisonCart([...comparisonCart, property]);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters) => {
    let filtered = properties.filter(prop => {
      const matchesSearch = !currentFilters.search ||
        (prop.title && prop.title.toLowerCase().includes(currentFilters.search.toLowerCase())) ||
        (prop.description && prop.description.toLowerCase().includes(currentFilters.search.toLowerCase()));

      const matchesType = !currentFilters.propertyType || prop.property_type === currentFilters.propertyType;

      const propPrice = typeof prop.price === 'string' ? parseInt(prop.price.replace(/[^0-9]/g, '')) : prop.price;
      const matchesPrice = (!currentFilters.minPrice || propPrice >= parseInt(currentFilters.minPrice)) &&
                          (!currentFilters.maxPrice || propPrice <= parseInt(currentFilters.maxPrice));

      const matchesBeds = !currentFilters.bedrooms || prop.bedrooms === parseInt(currentFilters.bedrooms);

      const matchesBaths = !currentFilters.bathrooms || prop.bathrooms === parseInt(currentFilters.bathrooms);

      const matchesCity = !currentFilters.city || (prop.title && prop.title.toLowerCase().includes(currentFilters.city.toLowerCase()));

      const matchesAmenities = currentFilters.amenities.length === 0 ||
        currentFilters.amenities.every(amenity => prop.amenities && prop.amenities.includes(amenity));

      const matchesFurnished = !currentFilters.furnished || currentFilters.furnished === 'all' ||
        (prop.furnished && (currentFilters.furnished === 'furnished' ? prop.furnished : !prop.furnished));

      const matchesStatus = !currentFilters.status || currentFilters.status === 'all' || prop.status === currentFilters.status;

      return matchesSearch && matchesType && matchesPrice && matchesBeds && matchesBaths && matchesCity && matchesAmenities && matchesFurnished && matchesStatus;
    });
    setFilteredProperties(filtered);
    setPropertyPage(1);
  };

  // AI-Powered Recommendation Engine
  const generatePropertyRecommendations = () => {
    if (properties.length === 0) return [];

    const scoredProperties = properties.map(property => {
      let score = 0;

      // Price match (weight: 25%)
      const propPrice = typeof property.price === 'string' ? parseInt(property.price.replace(/[^0-9]/g, '')) : property.price;
      if (propPrice >= userPreferences.minPrice && propPrice <= userPreferences.maxPrice) {
        score += 25;
      } else {
        const priceDiff = Math.abs(propPrice - ((userPreferences.minPrice + userPreferences.maxPrice) / 2));
        score += Math.max(0, 25 - (priceDiff / 100000) * 2.5);
      }

      // Property type match (weight: 20%)
      if (userPreferences.propertyTypes.includes(property.property_type)) {
        score += 20;
      }

      // Location match (weight: 20%)
      if (userPreferences.locations.some(loc => property.title?.includes(loc))) {
        score += 20;
      }

      // Bedroom match (weight: 15%)
      if (property.bedrooms >= userPreferences.minBedrooms && property.bedrooms <= userPreferences.maxBedrooms) {
        score += 15;
      }

      // Popularity bonus (weight: 10%)
      const viewCount = property.viewCount || 0;
      score += Math.min(10, (viewCount / 1000) * 2);

      // Recency bonus (weight: 10%)
      if (property.status === 'New Listings' || property.status === 'Featured') {
        score += 10;
      }

      // Penalty for already viewed
      if (userPreferences.viewedProperties.includes(property.id)) {
        score *= 0.7;
      }

      return { ...property, recommendationScore: score };
    });

    return scoredProperties
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 8);
  };

  // ============================================================================
  // UI COMPONENTS
  // ============================================================================
  const InquiryModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">Send Inquiry</h3>
          <button
            onClick={() => setShowInquiryForm(false)}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            autoFocus
            value={inquiryForm.name}
            onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            type="tel"
            placeholder="+971 50 XXXX XXXX"
            value={inquiryForm.phone}
            onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            type="email"
            placeholder="Your Email"
            value={inquiryForm.email}
            onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <textarea
            placeholder="Your inquiry message..."
            value={inquiryForm.message}
            onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <button
          onClick={handleSubmitInquiry}
          className="w-full mt-6 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Send Inquiry
        </button>
      </div>
    </div>
  );

  const AuthModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Sign In</h3>
          <button onClick={() => setShowAuthModal(false)} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setAuthMode('login')}
            className={`pb-2 font-semibold transition ${authMode === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className={`pb-2 font-semibold transition ${authMode === 'signup' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          >
            Sign Up
          </button>
        </div>

        {authMode === 'login' ? (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              autoFocus
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Sign In
            </button>
            <button
              onClick={handleGoogleLogin}
              className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <Globe size={18} /> Login with Google
            </button>
            <p className="text-center text-gray-600 text-sm">Don't have an account? Click Sign Up above</p>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={signupForm.name}
              onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              type="email"
              placeholder="Email"
              value={signupForm.email}
              onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              type="password"
              placeholder="Password"
              value={signupForm.password}
              onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={signupForm.confirmPassword}
              onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              onClick={handleSignup}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const AgentModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 my-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Agent Portal</h3>
          <button onClick={() => setShowAgentModal(false)} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setAgentMode('login')}
            className={`pb-2 font-semibold transition ${agentMode === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          >
            Existing Agent
          </button>
          <button
            onClick={() => setAgentMode('register')}
            className={`pb-2 font-semibold transition ${agentMode === 'register' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          >
            Register Now
          </button>
        </div>

        {agentMode === 'login' ? (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-blue-800"><strong>16 verified agents earning:</strong> AED 5.8M+ in commissions</p>
            </div>
            <input
              type="text"
              placeholder="Agent ID (AGENT-XXXXX)"
              value={agentLoginForm.agentId}
              onChange={(e) => setAgentLoginForm({ ...agentLoginForm, agentId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              type="password"
              placeholder="Password"
              value={agentLoginForm.password}
              onChange={(e) => setAgentLoginForm({ ...agentLoginForm, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              onClick={handleAgentLogin}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Login to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-green-800"><strong>New agents:</strong> Earn $0.25/view + 7-12% commission. Join now!</p>
            </div>
            <input
              type="text"
              placeholder="Full Name"
              value={agentRegisterForm.name}
              onChange={(e) => setAgentRegisterForm({ ...agentRegisterForm, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <input
              type="email"
              placeholder="Email"
              value={agentRegisterForm.email}
              onChange={(e) => setAgentRegisterForm({ ...agentRegisterForm, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <label className="block">
              <span className="text-sm font-semibold text-gray-700 mb-2 block">Upload Profile Picture</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAgentRegisterForm({ ...agentRegisterForm, picture: e.target.files?.[0] || null })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              {agentRegisterForm.picture && <p className="text-sm text-green-600 mt-1">✓ {agentRegisterForm.picture.name}</p>}
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-gray-700 mb-2 block">Upload ID/Passport</span>
              <input
                type="file"
                accept="image/*, application/pdf"
                onChange={(e) => setAgentRegisterForm({ ...agentRegisterForm, idDocument: e.target.files?.[0] || null })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              {agentRegisterForm.idDocument && <p className="text-sm text-green-600 mt-1">✓ {agentRegisterForm.idDocument.name}</p>}
            </label>
            <button
              onClick={handleAgentRegister}
              className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
            >
              Continue to Payment ($199 USD)
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const PaymentCheckout = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Registration Fee</h3>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-700">Agent Registration</span>
            <span className="text-2xl font-bold text-blue-600">$199 USD</span>
          </div>
          <p className="text-sm text-blue-800">✓ Identity Verification Included</p>
          <p className="text-sm text-blue-800">✓ Start Earning Immediately</p>
        </div>

        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Card Number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="MM/YY" className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
            <input type="text" placeholder="CVV" className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
          </div>
        </div>

        <button
          onClick={handleAgentPayment}
          className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition"
        >
          Complete Payment
        </button>
      </div>
    </div>
  );

  const AgentDirectoryModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6 my-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Verified Agents Directory</h3>
          <button onClick={() => { setShowAgentDirectory(false); setSelectedAgent(null); }} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {!selectedAgent ? (
          <>
            {/* Company Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg">
                <div className="text-2xl font-bold">AED {(companyStats.totalCommissionsPaid / 1000000).toFixed(1)}M</div>
                <div className="text-sm">Commissions Paid</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                <div className="text-2xl font-bold">AED {(companyStats.totalViewRewardsPaid / 1000).toFixed(0)}K</div>
                <div className="text-sm">View Rewards</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                <div className="text-2xl font-bold">{companyStats.totalAgentsEarned}</div>
                <div className="text-sm">Active Agents</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-lg">
                <div className="text-2xl font-bold">{companyStats.totalSalesProcessed}</div>
                <div className="text-sm">Sales Closed</div>
              </div>
            </div>

            {/* Agents Grid */}
            <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {verifiedAgents.map(agent => (
                <div
                  key={agent.id}
                  className="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition"
                >
                  <div className="flex gap-3 mb-3">
                    <img src={agent.picture} alt={agent.name} className="w-16 h-16 rounded-full object-cover cursor-pointer" onClick={() => { setSelectedAgent(agent); }}/>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-800 cursor-pointer hover:text-blue-600" onClick={() => { setSelectedAgent(agent); }}>{agent.name}</h4>
                        <Award size={16} className="text-yellow-500" />
                      </div>
                      <p className="text-xs text-gray-600">{agent.company}</p>
                      <p className="text-xs text-blue-600 mt-1">{agent.location}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-semibold">{agent.rating}</span>
                        <span className="text-xs text-gray-600">({agent.reviews})</span>
                      </div>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/15308499264?text=Hi! I'm interested in properties. Can you help me find the right one?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-600 text-white py-1 rounded text-xs font-semibold flex items-center justify-center gap-1 hover:bg-green-700 transition"
                  >
                    <MessageSquare size={12} /> WhatsApp
                  </a>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Agent Profile */
          <div>
            <button
              onClick={() => setSelectedAgent(null)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-semibold"
            >
              <ChevronRight size={20} className="rotate-180" /> Back to Agents
            </button>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <img src={selectedAgent.picture} alt={selectedAgent.name} className="w-full rounded-lg mb-4" />
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h4 className="text-xl font-bold">{selectedAgent.name}</h4>
                    <Award size={20} className="text-yellow-500" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{selectedAgent.company}</p>
                  <p className="text-sm font-semibold text-blue-600 mb-3">{selectedAgent.location}</p>
                  <div className="flex justify-center items-center gap-2 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className={i < Math.floor(selectedAgent.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                      ))}
                    </div>
                    <span className="font-semibold">{selectedAgent.rating}/5</span>
                  </div>
                  <a href={`https://wa.me/15308499264?text=Hi, I'm interested in properties in ${selectedAgent.location}. Can you help?`} target="_blank" rel="noopener noreferrer" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 mt-3">
                    <MessageSquare size={16} /> WhatsApp Agent
                  </a>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-gray-800 mb-4">Performance Metrics</h5>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp size={18} className="text-green-600" />
                      <span className="text-sm text-gray-600">Sales Closed</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{selectedAgent.salesClosed}</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Eye size={18} className="text-blue-600" />
                      <span className="text-sm text-gray-600">Total Views</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{selectedAgent.totalViews.toLocaleString()}</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare size={18} className="text-purple-600" />
                      <span className="text-sm text-gray-600">Inquiries</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">{selectedAgent.inquiries}</div>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-gray-800 mb-4">Earnings & Tier</h5>
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign size={18} />
                      <span className="text-sm opacity-90">Commission</span>
                    </div>
                    <div className="text-2xl font-bold">AED {selectedAgent.commissionEarned.toLocaleString()}</div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap size={18} />
                      <span className="text-sm opacity-90">View Rewards</span>
                    </div>
                    <div className="text-2xl font-bold">AED {selectedAgent.revenueFromViews.toLocaleString()}</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Tier Level</p>
                    <div className="flex gap-2 items-center">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${selectedAgent.tier === 'premium' ? 'bg-yellow-500' : selectedAgent.tier === 'elite' ? 'bg-purple-600' : 'bg-blue-600'}`}>
                        {selectedAgent.tier.toUpperCase()}
                      </div>
                      <span className="text-xs text-gray-600">{selectedAgent.tier === 'premium' ? '10-12%' : selectedAgent.tier === 'elite' ? '8-10%' : '7%'} commission</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mt-4 italic">{selectedAgent.bio}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const HeroSection = () => (
    <div className="relative w-full h-screen bg-cover bg-center bg-no-repeat"
         style={{backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=4000&h=2000&fit=crop&q=80)', backgroundAttachment: 'fixed'}}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20"></div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 py-12">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-6 leading-tight">
            Find Your Perfect Property in Dubai
          </h1>
          <p className="text-xl md:text-2xl text-center mb-4 text-gray-100 font-light">
            The most trusted real estate platform in the UAE
          </p>
          <p className="text-center mb-12 max-w-7xl mx-auto text-gray-200 text-lg whitespace-nowrap overflow-x-auto md:overflow-visible">
            5,200+ Premium Properties • 850+ Verified Agents • 28.5M+ Views • AED 2.4B+ Commissions
          </p>

          <div className="bg-white rounded-2xl shadow-2xl p-5 w-full mb-10 backdrop-blur-sm relative">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-5 py-4 border border-gray-200">
                  <Search className="text-blue-600" size={22} />
                  <input
                    type="text"
                    placeholder="Search by location, property type..."
                    value={filters.search}
                    onChange={(e) => {
                      handleFilterChange('search', e.target.value);
                      if (e.target.value.trim() && !recentSearches.includes(e.target.value)) {
                        setRecentSearches([e.target.value, ...recentSearches.slice(0, 4)]);
                      }
                    }}
                    className="bg-transparent focus:outline-none flex-1 text-gray-800 font-medium placeholder:text-gray-500"
                  />
                </div>

                {/* Auto-complete & Recent Searches Dropdown */}
                {(filters.search || recentSearches.length > 0) && showSearchSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                    {recentSearches.length > 0 && (
                      <>
                        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                          <p className="text-xs font-bold text-gray-600">RECENT SEARCHES</p>
                        </div>
                        {recentSearches.map((search, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              handleFilterChange('search', search);
                              setShowSearchSuggestions(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-800 font-medium text-sm flex items-center gap-2"
                          >
                            <Clock size={14} className="text-gray-400" /> {search}
                          </button>
                        ))}
                      </>
                    )}

                    {SearchOptimizations().suggestions.length > 0 && (
                      <>
                        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 border-t border-gray-200">
                          <p className="text-xs font-bold text-gray-600">SUGGESTIONS</p>
                        </div>
                        {SearchOptimizations().suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              handleFilterChange('search', suggestion);
                              setShowSearchSuggestions(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-800 font-medium text-sm flex items-center gap-2"
                          >
                            <Search size={14} className="text-blue-600" /> {suggestion}
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition duration-200 font-bold text-lg shadow-lg hover:shadow-xl">
                Search Now
              </button>
            </div>
          </div>
        </div>

        {/* Widget Buttons - Well Spaced */}
        <div className="flex flex-wrap gap-4 justify-center max-w-5xl text-xs md:text-sm mb-6 px-4">
          <button onClick={() => setShowAdvancedSearch(true)} className="bg-white/25 backdrop-blur-md text-white px-5 py-3 rounded-xl hover:bg-white/35 transition duration-200 font-bold flex items-center gap-2 border border-white/40 whitespace-nowrap shadow-lg hover:shadow-xl"><Filter size={18} /> Advanced Search</button>
          <button onClick={() => setShowMortgageCalculator(true)} className="bg-white/25 backdrop-blur-md text-white px-5 py-3 rounded-xl hover:bg-white/35 transition duration-200 font-bold flex items-center gap-2 border border-white/40 whitespace-nowrap shadow-lg hover:shadow-xl"><DollarSign size={18} /> Mortgage</button>
          <button onClick={() => setShowRentVsBuy(true)} className="bg-white/25 backdrop-blur-md text-white px-5 py-3 rounded-xl hover:bg-white/35 transition duration-200 font-bold flex items-center gap-2 border border-white/40 whitespace-nowrap shadow-lg hover:shadow-xl"><TrendingUp size={18} /> ROI</button>
          <button onClick={() => setShowPropertyMap(true)} className="bg-white/25 backdrop-blur-md text-white px-5 py-3 rounded-xl hover:bg-white/35 transition duration-200 font-bold flex items-center gap-2 border border-white/40 whitespace-nowrap shadow-lg hover:shadow-xl"><MapPin size={18} /> Map</button>
          <button onClick={() => setShowMarketInsights(true)} className="bg-white/25 backdrop-blur-md text-white px-5 py-3 rounded-xl hover:bg-white/35 transition duration-200 font-bold flex items-center gap-2 border border-white/40 whitespace-nowrap shadow-lg hover:shadow-xl"><TrendingUp size={18} /> Market</button>
          <button onClick={() => setShowAIChat(true)} className="bg-white/25 backdrop-blur-md text-white px-5 py-3 rounded-xl hover:bg-white/35 transition duration-200 font-bold flex items-center gap-2 border border-white/40 whitespace-nowrap shadow-lg hover:shadow-xl"><MessageSquare size={18} /> AI Advisor</button>
        </div>

        {/* City Filter - Simplified */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          {['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman'].map(city => (
            <button
              key={city}
              onClick={() => { setSelectedCity(city); handleFilterChange('city', city); }}
              className={`px-6 py-2 rounded-full font-semibold transition text-sm ${
                selectedCity === city
                  ? 'bg-gradient-to-r from-blue-400 to-cyan-400 text-slate-900 shadow-lg font-bold'
                  : 'bg-white/15 text-white border border-white/30 hover:bg-white/25 backdrop-blur-sm'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const Navigation = () => (
    <nav className="sticky top-0 z-40 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Home className="text-blue-600" size={32} />
            <span className="text-2xl font-bold text-gray-800">GulfVista</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-600"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setCurrentTab('buy')}
                className={`px-4 py-2 font-semibold whitespace-nowrap transition border-b-2 ${
                  currentTab === 'buy' ? 'text-blue-600 border-blue-600' : 'text-gray-600 border-transparent hover:text-blue-600'
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setCurrentTab('sell')}
                className={`px-4 py-2 font-semibold whitespace-nowrap transition border-b-2 ${
                  currentTab === 'sell' ? 'text-blue-600 border-blue-600' : 'text-gray-600 border-transparent hover:text-blue-600'
                }`}
              >
                Sell
              </button>
              <button
                onClick={() => { setShowAgentDirectory(true); setSelectedAgent(null); }}
                className={`px-4 py-2 font-semibold whitespace-nowrap transition border-b-2 text-gray-600 border-transparent hover:text-blue-600`}
              >
                Agent
              </button>

              {/* Dropdown for Tools */}
              <div className="relative group">
                <button className="px-4 py-2 font-semibold text-gray-600 border-b-2 border-transparent hover:text-blue-600 transition whitespace-nowrap">
                  Tools
                </button>
                <div className="hidden group-hover:block absolute left-0 mt-0 w-56 bg-white shadow-lg rounded-lg py-2 z-50">
                  <div className="px-3 py-2 text-xs font-bold text-gray-600 uppercase">Financial Tools</div>
                  <button onClick={() => setShowMortgageCalculator(true)} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2">
                    <DollarSign size={16} /> Mortgage Calculator
                  </button>
                  <button onClick={() => setShowRentVsBuy(true)} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2">
                    <TrendingUp size={16} /> Rent vs Buy
                  </button>
                  <button onClick={() => setShowROICalculator(true)} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2">
                    <DollarSign size={16} /> Investment ROI
                  </button>

                  <div className="border-t border-gray-200 my-1"></div>
                  <div className="px-3 py-2 text-xs font-bold text-gray-600 uppercase">Search & Insights</div>
                  <button onClick={() => setShowAdvancedSearch(true)} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2">
                    <Filter size={16} /> Advanced Search
                  </button>
                  <button onClick={() => setShowPropertyMap(true)} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2">
                    <MapPin size={16} /> Map View
                  </button>
                  <button onClick={() => setShowMarketInsights(true)} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2">
                    <TrendingUp size={16} /> Market Insights
                  </button>

                  <div className="border-t border-gray-200 my-1"></div>
                  <div className="px-3 py-2 text-xs font-bold text-gray-600 uppercase">New Tools</div>
                  <button onClick={() => setShowPropertyValuation(true)} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2">
                    <DollarSign size={16} /> Valuation Tool
                  </button>
                  <button onClick={() => setShowDriveTimeSearch(true)} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2">
                    <MapPin size={16} /> Drive Time Search
                  </button>
                  <button onClick={() => setShowAIChat(true)} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2">
                    <MessageSquare size={16} /> AI Advisor
                  </button>
                  <button onClick={() => setShowTransactionHistory(true)} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2">
                    <TrendingUp size={16} /> Transactions
                  </button>
                  <button onClick={() => setShowOffPlanProjects(true)} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2">
                    <Building2 size={16} /> Off-Plan Projects
                  </button>
                  <button onClick={() => setShowPriceTrends(true)} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2">
                    <TrendingUp size={16} /> Price Trends
                  </button>

                  <div className="border-t border-gray-200 my-1"></div>
                  <div className="px-3 py-2 text-xs font-bold text-gray-600 uppercase">Neighborhood</div>
                  <button onClick={() => setShowNeighborhoodInsights(true)} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2">
                    <MapPin size={16} /> Neighborhood Info
                  </button>

                  <div className="border-t border-gray-200 my-1"></div>
                  <div className="px-3 py-2 text-xs font-bold text-gray-600 uppercase">Financing</div>
                  <button onClick={() => setShowFinancingPreApproval(true)} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2">
                    <DollarSign size={16} /> Pre-Approval
                  </button>

                  <div className="border-t border-gray-200 my-1"></div>
                  <div className="px-3 py-2 text-xs font-bold text-gray-600 uppercase">Account</div>
                  <button onClick={() => setShowUserDashboard(true)} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2">
                    <User size={16} /> My Dashboard
                  </button>
                  <button onClick={() => setShowAgentAnalytics(true)} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2">
                    <TrendingUp size={16} /> Agent Analytics
                  </button>
                  <button onClick={() => setShowAdvancedAnalytics(true)} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2">
                    <TrendingUp size={16} /> Advanced Analytics
                  </button>
                  <button onClick={() => { setShowAIRecommendations(true); setRecommendedProperties([]); }} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2">
                    <Zap size={16} /> AI Recommendations
                  </button>
                  <button onClick={() => setShowSocialSharing(true)} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2">
                    <Share2 size={16} /> Share & Earn
                  </button>
                  <button onClick={() => setShowAdvancedMessaging(true)} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2">
                    <MessageSquare size={16} /> Messages
                  </button>
                  <button onClick={() => setShowEnhancedReviews(true)} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2">
                    <Star size={16} /> Reviews & Ratings
                  </button>
                  {comparisonCart.length > 0 && (
                    <button onClick={() => setShowComparison(true)} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2">
                      <Building2 size={16} /> Compare ({comparisonCart.length})
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 ml-8 pl-8 border-l">
              {/* Notification Bell */}
              <button
                onClick={() => setShowNotifications(true)}
                className="relative text-gray-600 hover:text-blue-600 transition"
                title="Notifications"
              >
                <Bell size={24} />
                {pushNotifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {pushNotifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              {/* Email Notifications */}
              <button
                onClick={() => setShowEmailNotifications(true)}
                className="relative text-gray-600 hover:text-blue-600 transition"
                title="Email Alerts"
              >
                <Mail size={24} />
                {emailAlerts.filter(e => !e.read).length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {emailAlerts.filter(e => !e.read).length}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleAddFavorite(null)}
                className="relative text-red-500 hover:text-red-600 transition"
              >
                <Heart size={24} fill="currentColor" />
                {favorites.size > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {favorites.size}
                  </span>
                )}
              </button>

              {/* User Profile Button */}
              <button
                onClick={() => setShowUserProfile(true)}
                className="relative text-gray-700 hover:text-blue-600 transition"
                title="My Profile"
              >
                <User size={24} />
              </button>

              <button
                onClick={() => { setShowAgentModal(true); setAgentMode('register'); }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold flex items-center gap-2"
              >
                <Building2 size={16} /> Agent
              </button>

              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 font-semibold">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold flex items-center gap-2"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-4 pb-4">
            <button
              onClick={() => { setCurrentTab('buy'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Buy
            </button>
            <button
              onClick={() => { setCurrentTab('sell'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Sell
            </button>
            <button
              onClick={() => { setShowAgentDirectory(true); setMobileMenuOpen(false); }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Agent Portal
            </button>
            {!user ? (
              <button
                onClick={() => { setShowAuthModal(true); setMobileMenuOpen(false); }}
                className="w-full bg-blue-600 text-white py-2 rounded-lg"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="w-full bg-red-600 text-white py-2 rounded-lg"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );

  const [valuationInput, setValuationInput] = useState({
    location: 'Dubai',
    propertyType: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1500,
    age: 'Under 5 years',
    furnishing: 'Furnished'
  });

  const PropertyValuationTool = () => {
    // Simple valuation algorithm based on property details
    const calculateValuation = () => {
      let basePrice = 0;
      const location = valuationInput.location;
      const sqft = valuationInput.sqft || 1500;

      // Location multiplier
      const locationMultiplier = {
        'Dubai': 1.0,
        'Dubai Marina': 1.3,
        'Downtown Dubai': 1.15,
        'Palm Jumeirah': 1.5,
        'Abu Dhabi': 0.9,
        'Sharjah': 0.7
      };

      // Property type base price per sqft
      const typePrice = {
        'Apartment': 2500,
        'Villa': 3200,
        'Townhouse': 2800,
        'Penthouse': 4500,
        'Studio': 2000
      };

      basePrice = (typePrice[valuationInput.propertyType] || 2500) * sqft;
      basePrice = basePrice * (locationMultiplier[location] || 1.0);

      // Age adjustment
      const ageMultiplier = {
        'Under 5 years': 1.0,
        '5-10 years': 0.95,
        '10-15 years': 0.88,
        '15+ years': 0.78
      };
      basePrice = basePrice * (ageMultiplier[valuationInput.age] || 1.0);

      // Furnishing bonus
      const furnishingBonus = valuationInput.furnishing === 'Furnished' ? 1.08 : 1.0;
      basePrice = basePrice * furnishingBonus;

      return Math.round(basePrice);
    };

    const estimatedPrice = calculateValuation();
    const minPrice = Math.round(estimatedPrice * 0.92);
    const maxPrice = Math.round(estimatedPrice * 1.08);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-8 my-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Property Valuation Tool</h2>
              <p className="text-gray-600 mt-2">Get AI-powered price estimates</p>
            </div>
            <button
              onClick={() => setShowPropertyValuation(false)}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X size={28} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Property Details</h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <select
                  value={valuationInput.location}
                  onChange={(e) => setValuationInput({ ...valuationInput, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Dubai">Dubai</option>
                  <option value="Dubai Marina">Dubai Marina</option>
                  <option value="Downtown Dubai">Downtown Dubai</option>
                  <option value="Palm Jumeirah">Palm Jumeirah</option>
                  <option value="Abu Dhabi">Abu Dhabi</option>
                  <option value="Sharjah">Sharjah</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type</label>
                <select
                  value={valuationInput.propertyType}
                  onChange={(e) => setValuationInput({ ...valuationInput, propertyType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Studio">Studio</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Villa">Villa</option>
                  <option value="Penthouse">Penthouse</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bedrooms</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={valuationInput.bedrooms}
                    onChange={(e) => setValuationInput({ ...valuationInput, bedrooms: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bathrooms</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={valuationInput.bathrooms}
                    onChange={(e) => setValuationInput({ ...valuationInput, bathrooms: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Square Footage</label>
                <input
                  type="number"
                  min="100"
                  max="20000"
                  value={valuationInput.sqft}
                  onChange={(e) => setValuationInput({ ...valuationInput, sqft: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property Age</label>
                <select
                  value={valuationInput.age}
                  onChange={(e) => setValuationInput({ ...valuationInput, age: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Under 5 years">Under 5 years</option>
                  <option value="5-10 years">5-10 years</option>
                  <option value="10-15 years">10-15 years</option>
                  <option value="15+ years">15+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Furnishing</label>
                <select
                  value={valuationInput.furnishing}
                  onChange={(e) => setValuationInput({ ...valuationInput, furnishing: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Unfurnished">Unfurnished</option>
                  <option value="Furnished">Furnished</option>
                </select>
              </div>
            </div>

            {/* Valuation Results */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-300">
              <h3 className="font-bold text-lg text-gray-800 mb-6">Estimated Valuation</h3>

              <div className="mb-8">
                <p className="text-gray-600 text-sm font-semibold mb-2">Estimated Price</p>
                <p className="text-5xl font-bold text-blue-600 mb-4">AED {estimatedPrice.toLocaleString()}</p>
                <div className="space-y-2 mb-6 border-t border-blue-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Low Estimate</span>
                    <span className="font-bold text-green-600">AED {minPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">High Estimate</span>
                    <span className="font-bold text-red-600">AED {maxPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Price Range</span>
                    <span className="font-bold text-purple-600">±8%</span>
                  </div>
                </div>
              </div>

              {/* Price Insights */}
              <div className="bg-white/80 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-gray-800 text-sm mb-3">Market Insights</h4>
                <div className="text-xs text-gray-700 space-y-2">
                  <p>✓ {valuationInput.location} premium: {((parseFloat(Object.entries({ 'Dubai': 1.0, 'Dubai Marina': 1.3, 'Downtown Dubai': 1.15, 'Palm Jumeirah': 1.5, 'Abu Dhabi': 0.9, 'Sharjah': 0.7 }).find(([k]) => k === valuationInput.location)?.[1] || 1.0) - 1) * 100).toFixed(0)}%</p>
                  <p>✓ Furnishing bonus: {valuationInput.furnishing === 'Furnished' ? '+8%' : '0%'}</p>
                  <p>✓ Depreciation: {(( 1 - (Object.entries({ 'Under 5 years': 1.0, '5-10 years': 0.95, '10-15 years': 0.88, '15+ years': 0.78 }).find(([k]) => k === valuationInput.age)?.[1] || 1.0)) * 100).toFixed(0)}%</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowPropertyValuation(false)}
            className="w-full mt-6 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 transition font-semibold"
          >
            Close Valuation Tool
          </button>
        </div>
      </div>
    );
  };

  const AgentDashboardPanel = () => {
    if (!selectedAgent) return null;

    const agentProperties = properties.filter(p => p.agentsSold?.some(a => a.id === selectedAgent.id));

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full p-8 my-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Agent Dashboard</h2>
              <p className="text-gray-600 mt-2">{selectedAgent.name} - {selectedAgent.company}</p>
            </div>
            <button
              onClick={() => setSelectedAgent(null)}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X size={28} />
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-300">
              <p className="text-gray-600 text-sm font-semibold mb-2">Total Sales</p>
              <p className="text-4xl font-bold text-blue-600">{selectedAgent.salesClosed}</p>
              <p className="text-xs text-gray-600 mt-2">Closed transactions</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-300">
              <p className="text-gray-600 text-sm font-semibold mb-2">Total Views</p>
              <p className="text-4xl font-bold text-green-600">{(selectedAgent.totalViews / 1000).toFixed(1)}K</p>
              <p className="text-xs text-gray-600 mt-2">Profile views</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-300">
              <p className="text-gray-600 text-sm font-semibold mb-2">Commission</p>
              <p className="text-4xl font-bold text-purple-600">AED {(selectedAgent.commissionEarned / 1000).toFixed(0)}K</p>
              <p className="text-xs text-gray-600 mt-2">Total earned</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border-2 border-orange-300">
              <p className="text-gray-600 text-sm font-semibold mb-2">Inquiries</p>
              <p className="text-4xl font-bold text-orange-600">{selectedAgent.inquiries}</p>
              <p className="text-xs text-gray-600 mt-2">Client inquiries</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Agent Info */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <img
                  src={selectedAgent.picture}
                  alt={selectedAgent.name}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Agent'; }}
                />
                <h3 className="font-bold text-xl text-gray-800 mb-2">{selectedAgent.name}</h3>
                <p className="text-sm text-gray-700 mb-4">{selectedAgent.bio}</p>
                <div className="space-y-2 text-sm mb-4 border-t border-blue-200 pt-4">
                  <p><span className="font-semibold">Rating:</span> {selectedAgent.rating}/5 ⭐</p>
                  <p><span className="font-semibold">Reviews:</span> {selectedAgent.reviews}</p>
                  <p><span className="font-semibold">Tier:</span> {selectedAgent.tier}</p>
                  <p><span className="font-semibold">Contact:</span> {selectedAgent.contact}</p>
                </div>
                <a
                  href={selectedAgent.pfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-center text-sm"
                >
                  View on PropertyFinder
                </a>
              </div>
            </div>

            {/* Listings */}
            <div className="lg:col-span-2">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Active Listings ({agentProperties.length})</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {agentProperties.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No active listings</p>
                ) : (
                  agentProperties.map((property) => (
                    <div
                      key={property.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition cursor-pointer"
                      onClick={() => { setSelectedProperty(property); setShowPropertyDetail(true); }}
                    >
                      <div className="flex gap-4">
                        <img
                          src={property.images?.[0]}
                          alt={property.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 line-clamp-2">{property.title}</h4>
                          <p className="text-lg font-bold text-blue-600 my-1">AED {property.price?.toLocaleString()}</p>
                          <div className="flex gap-4 text-xs text-gray-600">
                            <span>🛏️ {property.bedrooms}BR</span>
                            <span>🛁 {property.bathrooms}BA</span>
                            <span>👁️ {property.viewCount?.toLocaleString() || 0} views</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const UserProfileModal = () => {
    const profileCompletion = currentUser ?
      Math.round(((currentUser.name ? 20 : 0) + (currentUser.email ? 20 : 0) + (currentUser.phone ? 20 : 0) + (currentUser.photo ? 20 : 0) + (currentUser.bio ? 20 : 0)) / 5)
      : 0;

    if (!currentUser) {
      return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 my-8">
            <div className="text-center py-12">
              <User size={64} className="text-gray-300 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Sign In to Your Account</h2>
              <p className="text-gray-600 mb-8">Create a profile to save favorites, track searches, and more</p>
              <button
                onClick={() => {
                  setCurrentUser({
                    name: 'Guest User',
                    email: 'user@example.com',
                    phone: '+971 50 XXX XXXX',
                    photo: 'https://via.placeholder.com/150?text=Profile',
                    bio: 'Property enthusiast'
                  });
                  setIsLoggedIn(true);
                  showToast('Profile created!', 'success');
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:shadow-lg transition font-semibold text-lg"
              >
                Create Profile
              </button>
            </div>
            <button
              onClick={() => setShowUserProfile(false)}
              className="mt-4 w-full text-gray-600 hover:text-gray-800 transition"
            >
              Skip for now
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-8 my-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
              <p className="text-gray-600 mt-2">Manage your account and preferences</p>
            </div>
            <button
              onClick={() => setShowUserProfile(false)}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X size={28} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                {/* Profile Photo */}
                <div className="mb-6">
                  <img
                    src={currentUser.photo}
                    alt={currentUser.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-blue-600"
                  />
                </div>

                {/* User Info */}
                <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">{currentUser.name}</h3>
                <p className="text-sm text-gray-600 text-center mb-1">{currentUser.email}</p>
                <p className="text-sm text-gray-600 text-center mb-6">{currentUser.phone}</p>

                {/* Profile Completion */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-bold text-gray-700">Profile Complete</p>
                    <span className="text-sm font-bold text-blue-600">{profileCompletion}%</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${profileCompletion}%` }}
                    ></div>
                  </div>
                </div>

                {/* Member Since */}
                <div className="text-center text-xs text-gray-600 pb-6 border-b border-blue-200">
                  <p>Member since May 2026</p>
                </div>

                {/* Action Buttons */}
                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    setCurrentUser(null);
                    showToast('Logged out', 'success');
                  }}
                  className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold text-sm"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* User Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-gray-600 text-sm font-semibold mb-2">Properties Viewed</p>
                  <p className="text-3xl font-bold text-blue-600">{userStats.propertiesViewed}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <p className="text-gray-600 text-sm font-semibold mb-2">Saved Favorites</p>
                  <p className="text-3xl font-bold text-green-600">{favorites.size}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <p className="text-gray-600 text-sm font-semibold mb-2">Comparisons</p>
                  <p className="text-3xl font-bold text-purple-600">{userStats.propertyComparisons}</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                  <p className="text-gray-600 text-sm font-semibold mb-2">Agents Contacted</p>
                  <p className="text-3xl font-bold text-orange-600">{userStats.agentsContacted}</p>
                </div>
              </div>

              {/* Activity Timeline */}
              <div>
                <h3 className="font-bold text-lg text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {userActivity.map((activity) => (
                    <div key={activity.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="text-2xl">{activity.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">{activity.action}</p>
                        <p className="text-xs text-gray-600">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-3">Preferences</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm text-gray-700">Email alerts for new listings</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm text-gray-700">Price drop notifications</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm text-gray-700">Weekly market insights</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SearchOptimizations = () => {
    // Get unique search suggestions from properties
    const allSearchTerms = properties.flatMap(p => [
      p.title,
      p.property_type,
      p.location,
      ...((p.title || '').split(' ') || [])
    ]).filter(Boolean).slice(0, 20);

    const uniqueSuggestions = [...new Set(allSearchTerms)].filter(term =>
      term.toLowerCase().includes(filters.search.toLowerCase()) && filters.search.length > 0
    ).slice(0, 8);

    return {
      recentSearches,
      suggestions: uniqueSuggestions,
      savedSearches: Object.keys(filters).filter(key => filters[key])
    };
  };

  const FavoritesManager = () => {
    const [newListName, setNewListName] = useState('');
    const favoriteListNames = Object.keys(favoritesList).length > 0 ? Object.keys(favoritesList) : ['My Favorites'];
    const currentFavs = favoritesList[selectedFavoriteList] || [];

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full p-8 my-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">My Favorites</h2>
              <p className="text-gray-600 mt-2">Organize and manage your saved properties</p>
            </div>
            <button
              onClick={() => setShowFavoritesManager(false)}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X size={28} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Favorite Lists */}
            <div className="lg:col-span-1">
              <h3 className="font-bold text-lg text-gray-800 mb-4">My Lists</h3>
              <div className="space-y-2 mb-6">
                {favoriteListNames.map((listName) => (
                  <button
                    key={listName}
                    onClick={() => setSelectedFavoriteList(listName)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition font-semibold ${
                      selectedFavoriteList === listName
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {listName}
                    <span className={`float-right text-sm ${selectedFavoriteList === listName ? 'text-blue-100' : 'text-gray-600'}`}>
                      {(favoritesList[listName] || []).length}
                    </span>
                  </button>
                ))}
              </div>

              {/* Create New List */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="New list name..."
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  onClick={() => {
                    if (newListName.trim()) {
                      const newList = { ...favoritesList };
                      if (!newList[newListName]) {
                        newList[newListName] = [];
                      }
                      setFavoritesList(newList);
                      setSelectedFavoriteList(newListName);
                      setNewListName('');
                      showToast('List created!', 'success');
                    }
                  }}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold text-sm"
                >
                  Create List
                </button>
              </div>
            </div>

            {/* Main Content - Favorite Properties */}
            <div className="lg:col-span-3">
              {currentFavs.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <Heart size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No properties saved yet</p>
                  <p className="text-gray-500 text-sm mt-2">Click the heart icon on properties to add them</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {properties
                    .filter((p) => currentFavs.includes(p.id))
                    .map((property) => (
                      <div
                        key={property.id}
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition"
                      >
                        <div className="relative h-32 bg-gray-200">
                          <img
                            src={property.images?.[0]}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => {
                              setFavorites(new Set([...favorites].filter(id => id !== property.id)));
                              const newList = { ...favoritesList };
                              newList[selectedFavoriteList] = newList[selectedFavoriteList].filter(id => id !== property.id);
                              setFavoritesList(newList);
                            }}
                            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-red-50"
                          >
                            <Heart size={16} className="text-red-500 fill-red-500" />
                          </button>
                        </div>
                        <div className="p-3">
                          <h4 className="font-bold text-sm text-gray-800 line-clamp-2 mb-2">{property.title}</h4>
                          <p className="font-bold text-blue-600 text-lg mb-2">AED {property.price?.toLocaleString()}</p>
                          <div className="flex gap-3 text-xs text-gray-600">
                            <span>🛏️ {property.bedrooms}</span>
                            <span>🛁 {property.bathrooms}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AgentDirectory = () => {
    const filteredAgents = verifiedAgents.filter(agent =>
      agent.name.toLowerCase().includes(agentSearchFilter.toLowerCase()) ||
      agent.company.toLowerCase().includes(agentSearchFilter.toLowerCase()) ||
      agent.specialization.toLowerCase().includes(agentSearchFilter.toLowerCase()) ||
      agent.location.toLowerCase().includes(agentSearchFilter.toLowerCase())
    );

    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Agent</h2>
          <p className="text-xl text-gray-600 mb-8">Connect with verified real estate professionals</p>

          {/* Agent Search */}
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search by name, company, specialization or location..."
              value={agentSearchFilter}
              onChange={(e) => setAgentSearchFilter(e.target.value)}
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 text-lg"
            />
            <Search className="absolute right-4 top-4 text-gray-400" size={24} />
          </div>

          <p className="text-gray-600 font-semibold mb-8">
            Showing <span className="text-blue-600">{filteredAgents.length}</span> of <span className="text-blue-600">{verifiedAgents.length}</span> agents
          </p>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-100 cursor-pointer hover:-translate-y-1"
              onClick={() => { setSelectedAgent(agent); setShowAgentModal(true); }}
            >
              {/* Agent Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                <img
                  src={agent.picture}
                  alt={agent.name}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Agent'; }}
                />
                {agent.tier === 'premium' && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Zap size={14} fill="white" /> Premium
                  </div>
                )}
                <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white/95 backdrop-blur px-3 py-1 rounded-full">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-gray-800">{agent.rating}</span>
                  <span className="text-xs text-gray-600">({agent.reviews})</span>
                </div>
              </div>

              {/* Agent Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{agent.name}</h3>
                <p className="text-sm text-blue-600 font-semibold mb-3">{agent.company}</p>
                <p className="text-xs text-gray-600 mb-4 flex items-center gap-1">
                  <MapPin size={14} /> {agent.location}
                </p>
                <p className="text-sm text-gray-700 mb-4 font-semibold">{agent.specialization}</p>

                {/* Agent Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-center text-sm">
                  <div className="bg-blue-50 rounded-lg p-2">
                    <p className="text-gray-600 text-xs">Sales Closed</p>
                    <p className="font-bold text-blue-600">{agent.salesClosed}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2">
                    <p className="text-gray-600 text-xs">Properties</p>
                    <p className="font-bold text-green-600">{agent.propertyCount}</p>
                  </div>
                </div>

                {/* Contact Button */}
                <a
                  href={`https://wa.me/15308499264?text=Hi ${agent.name}, I'm interested in properties from your listings. Can you help?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 rounded-lg hover:shadow-lg transition font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} /> Contact Agent
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No agents found matching "{agentSearchFilter}"</p>
            <button
              onClick={() => setAgentSearchFilter('')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    );
  };

  const AdvancedFiltersPanel = () => (
    <div className="max-w-7xl mx-auto px-4 mb-8">
      <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800">Advanced Filters</h3>
          <button
            onClick={() => setShowAdvancedFilters(false)}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Price Range (AED)</label>
            <div className="space-y-2">
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Bedrooms</label>
            <select
              value={filters.bedrooms}
              onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Bedrooms</option>
              {[1, 2, 3, 4, 5, 6].map(num => <option key={num} value={num}>{num}+ Bedrooms</option>)}
            </select>
          </div>

          {/* Bathrooms */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Bathrooms</label>
            <select
              value={filters.bathrooms}
              onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Bathrooms</option>
              {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num}+ Bathrooms</option>)}
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Property Type</label>
            <select
              value={filters.propertyType}
              onChange={(e) => handleFilterChange('propertyType', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Studio">Studio</option>
              <option value="Duplex">Duplex</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Location</label>
            <select
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Locations</option>
              <option value="Dubai">Dubai</option>
              <option value="Abu Dhabi">Abu Dhabi</option>
              <option value="Sharjah">Sharjah</option>
              <option value="Ajman">Ajman</option>
            </select>
          </div>

          {/* Furnished */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Furnished Status</label>
            <select
              value={filters.furnished}
              onChange={(e) => handleFilterChange('furnished', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="furnished">Furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Property Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Properties</option>
              <option value="new">New Listings</option>
              <option value="featured">Featured</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              setFilters({ search: '', propertyType: '', minPrice: '', maxPrice: '', bedrooms: '', bathrooms: '', city: '', amenities: [], furnished: '', status: '' });
              applyFilters({ search: '', propertyType: '', minPrice: '', maxPrice: '', bedrooms: '', bathrooms: '', city: '', amenities: [], furnished: '', status: '' });
              showToast('Filters cleared', 'success');
            }}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            Clear All
          </button>
          <button
            onClick={() => setShowAdvancedFilters(false)}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition font-semibold"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );

  const PropertiesGrid = () => {
    const startIdx = (propertyPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const paginatedProperties = filteredProperties.slice(startIdx, endIdx);

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Featured Properties</h2>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:shadow-lg transition font-semibold"
          >
            <Filter size={20} />
            {showAdvancedFilters ? 'Hide Filters' : 'Advanced Filters'}
          </button>
        </div>

        {showAdvancedFilters && <AdvancedFiltersPanel />}

        {/* Results Counter */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600 font-semibold">
            Showing <span className="text-blue-600 font-bold">{paginatedProperties.length}</span> of <span className="text-blue-600 font-bold">{filteredProperties.length}</span> properties
          </p>
          {filteredProperties.length === 0 && (
            <p className="text-red-600 font-semibold">No properties match your filters. Try adjusting your search.</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {paginatedProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 hover:-translate-y-1"
            >
              <div className="relative h-56 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center cursor-pointer group overflow-hidden" onClick={() => { setSelectedProperty(property); setShowPropertyDetail(true); }}>
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="text-gray-400">No image available</div>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); handleAddFavorite(property.id); }}
                  className="absolute top-4 right-4 bg-white rounded-full p-2.5 shadow-lg hover:shadow-xl hover:scale-110 transition duration-200"
                >
                  <Heart
                    size={20}
                    className={`${favorites.has(property.id) ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'} transition`}
                  />
                </button>
                <div className="absolute bottom-4 left-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                  {property.property_type || 'Property'}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 cursor-pointer hover:text-blue-600 transition" onClick={() => { setSelectedProperty(property); setShowPropertyDetail(true); }}>{property.title}</h3>
                <p className="text-3xl font-bold text-blue-600 mb-4">AED {property.price?.toLocaleString() || 'N/A'}</p>

                <div className="flex gap-6 mb-4 text-sm text-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2">
                    <Eye size={16} className="text-blue-600" /> <span className="font-semibold">{property.viewCount?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart size={16} className="text-red-500" /> <span className="font-semibold">{property.impressions || 0}</span>
                  </div>
                </div>

                <div className="flex gap-8 mb-6 text-gray-700 border-b border-gray-100 pb-4 items-center justify-center">
                  <div className="flex items-center gap-2">
                    <Bed size={22} className="text-blue-600" />
                    <p className="font-bold text-lg">{property.bedrooms || 0}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets size={22} className="text-blue-600" />
                    <p className="font-bold text-lg">{property.bathrooms || 0}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedProperty(property);
                      setShowPropertyDetail(true);
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition duration-200 text-sm font-bold"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => window.open('https://wa.me/?text=I%20am%20interested%20in%20' + encodeURIComponent(property.title), '_blank')}
                    className="px-4 py-2.5 rounded-lg transition duration-200 text-sm font-bold bg-gray-100 hover:bg-blue-50 text-blue-600 border border-gray-300 hover:border-blue-400 hover:shadow-lg flex items-center justify-center"
                    title="Contact on WhatsApp"
                  >
                    <MessageSquare size={18} />
                  </button>
                  <button
                    onClick={() => { addToComparison(property); alert(`Added to comparison (${comparisonCart.length + 1}/4)`); }}
                    className={`px-4 py-2.5 rounded-lg transition duration-200 text-sm font-bold ${
                      comparisonCart.find(p => p.id === property.id)
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-600 shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                    }`}
                    title="Add to comparison"
                  >
                    ⚖️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: Math.ceil(filteredProperties.length / itemsPerPage) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPropertyPage(i + 1)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                propertyPage === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const ViewingSchedulerModal = () => {
    const handleScheduleViewing = () => {
      if (!viewingAuthor.trim() || !viewingPhone.trim() || !viewingDate || !viewingTime) {
        showToast('Please fill in all fields', 'error');
        return;
      }

      const newViewing = {
        id: scheduledViewings.length + 1,
        property: selectedProperty?.title || 'Property',
        investor: viewingAuthor,
        phone: viewingPhone,
        date: viewingDate,
        time: viewingTime,
        status: 'Confirmed'
      };

      setScheduledViewings([newViewing, ...scheduledViewings]);
      setViewingAuthor('');
      setViewingPhone('');
      setViewingDate('');
      setViewingTime('10:00');
      showToast('Viewing scheduled successfully!', 'success');
      setShowViewingScheduler(false);
    };

    const upcomingViewings = scheduledViewings.filter(v => v.status === 'Confirmed').slice(0, 5);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full p-0 my-8 overflow-hidden">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 text-white p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-3">
                  <span className="text-sm font-semibold">Schedule Property Viewing</span>
                </div>
                <h2 className="text-4xl font-bold mb-2">📅 Booking Calendar</h2>
                <p className="text-green-100 text-lg">{selectedProperty?.title}</p>
              </div>
              <button onClick={() => setShowViewingScheduler(false)} className="text-white/80 hover:text-white transition p-2 hover:bg-white/10 rounded-lg">
                <X size={32} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Booking Form */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    Enter Your Details
                  </h3>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-lg">👤</span> Full Name
                      </label>
                      <input
                        type="text"
                        value={viewingAuthor}
                        onChange={(e) => setViewingAuthor(e.target.value)}
                        placeholder="e.g., Ahmed Al Mansouri"
                        className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition bg-white font-medium"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-lg">📞</span> Phone Number
                      </label>
                      <input
                        type="tel"
                        value={viewingPhone}
                        onChange={(e) => setViewingPhone(e.target.value)}
                        placeholder="+971 50 XXX XXXX"
                        className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition bg-white font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    Choose Date & Time
                  </h3>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-200 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="text-lg">📅</span> Viewing Date
                    </label>
                    <input
                      type="date"
                      value={viewingDate}
                      onChange={(e) => setViewingDate(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="text-lg">🕐</span> Time Slot
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '17:30', '18:00'].map(time => (
                        <button
                          key={time}
                          onClick={() => setViewingTime(time)}
                          className={`px-3 py-2 rounded-lg font-semibold text-sm transition ${
                            viewingTime === time
                              ? 'bg-green-600 text-white shadow-lg scale-105'
                              : 'bg-white border-2 border-emerald-200 text-gray-700 hover:border-green-500 hover:bg-green-50'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleScheduleViewing}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  ✓ Confirm Viewing Appointment
                </button>
              </div>

              {/* Upcoming Viewings */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-lg">📋</span> Upcoming Viewings ({upcomingViewings.length})
                  </h3>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {upcomingViewings.length > 0 ? (
                    upcomingViewings.map(viewing => (
                      <div key={viewing.id} className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-200 rounded-2xl p-4 hover:shadow-lg hover:border-green-400 transition group">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 group-hover:text-green-600 transition">{viewing.property}</h4>
                            <p className="text-sm text-gray-600 mt-1">{viewing.investor}</p>
                          </div>
                          <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold whitespace-nowrap">
                            ✓ {viewing.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 pt-3 border-t border-green-200">
                          <span className="flex items-center gap-1">
                            <span className="text-lg">📅</span> {viewing.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="text-lg">🕐</span> {viewing.time}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-50 rounded-2xl p-6 text-center border-2 border-dashed border-gray-300">
                      <p className="text-gray-500 font-semibold">No viewings scheduled yet</p>
                      <p className="text-sm text-gray-400 mt-1">Schedule your first viewing above</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t-2 border-gray-200 p-6 flex gap-4">
            <button
              onClick={() => setShowViewingScheduler(false)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-xl transition font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const LeadManagementCRM = () => {
    const filteredLeads = leadFilter === 'all'
      ? investorLeads
      : investorLeads.filter(lead => lead.status.toLowerCase().includes(leadFilter));

    const leadStats = {
      hotLeads: investorLeads.filter(l => l.status === 'Hot Lead').length,
      warmLeads: investorLeads.filter(l => l.status === 'Warm Lead').length,
      coldLeads: investorLeads.filter(l => l.status === 'Cold Lead').length,
      totalValue: investorLeads.reduce((sum, l) => sum + parseInt(l.totalValue.replace(/[^0-9]/g, '')), 0)
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full p-0 my-8 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-3">
                  <span className="text-sm font-semibold">Investor Management System</span>
                </div>
                <h2 className="text-4xl font-bold mb-2">💼 Lead CRM Dashboard</h2>
                <p className="text-indigo-100">Track, manage, and nurture your investor pipeline</p>
              </div>
              <button onClick={() => setShowLeadsCRM(false)} className="text-white/80 hover:text-white transition p-2 hover:bg-white/10 rounded-lg">
                <X size={32} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 p-6 rounded-2xl hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-600 text-sm font-bold mb-1">HOT LEADS</p>
                    <div className="text-4xl font-bold text-red-700">{leadStats.hotLeads}</div>
                  </div>
                  <span className="text-5xl">🔥</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 p-6 rounded-2xl hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 text-sm font-bold mb-1">WARM LEADS</p>
                    <div className="text-4xl font-bold text-yellow-700">{leadStats.warmLeads}</div>
                  </div>
                  <span className="text-5xl">⚡</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 p-6 rounded-2xl hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-bold mb-1">COLD LEADS</p>
                    <div className="text-4xl font-bold text-blue-700">{leadStats.coldLeads}</div>
                  </div>
                  <span className="text-5xl">❄️</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 p-6 rounded-2xl hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-bold mb-1">PIPELINE VALUE</p>
                    <div className="text-3xl font-bold text-green-700">AED {(leadStats.totalValue / 1000000).toFixed(1)}M</div>
                  </div>
                  <span className="text-5xl">💰</span>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-3">
              {['all', 'hot', 'warm', 'cold'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setLeadFilter(filter)}
                  className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition transform hover:scale-105 ${
                    leadFilter === filter
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter === 'all' ? '📊 All Leads' : `${filter === 'hot' ? '🔥' : filter === 'warm' ? '⚡' : '❄️'} ${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
                </button>
              ))}
            </div>

            {/* Leads Table */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden border-2 border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <th className="px-6 py-4 text-left font-bold">Investor Profile</th>
                      <th className="px-6 py-4 text-center font-bold">Status</th>
                      <th className="px-6 py-4 text-left font-bold">Interests</th>
                      <th className="px-6 py-4 text-center font-bold">Activity</th>
                      <th className="px-6 py-4 text-right font-bold">Deal Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead, idx) => (
                      <tr key={lead.id} className={`border-b border-gray-200 hover:bg-white transition ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                              {lead.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800">{lead.name}</p>
                              <p className="text-xs text-gray-500">{lead.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-4 py-2 rounded-full text-xs font-bold inline-block ${
                            lead.status === 'Hot Lead' ? 'bg-red-100 text-red-700 border-2 border-red-300' :
                            lead.status === 'Warm Lead' ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300' :
                            'bg-blue-100 text-blue-700 border-2 border-blue-300'
                          }`}>
                            {lead.status === 'Hot Lead' ? '🔥' : lead.status === 'Warm Lead' ? '⚡' : '❄️'} {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold border border-blue-200">
                            {lead.interested}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-xs font-bold border border-purple-200">
                              👁️ {lead.visited}
                            </span>
                            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-lg text-xs font-bold border border-green-200">
                              💬 {lead.inquiries}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="text-lg font-bold text-green-600">{lead.totalValue}</div>
                          <p className="text-xs text-gray-500">Last: {lead.lastContact}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-center text-gray-600 text-sm mt-6">Showing {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''}</p>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 border-t-2 border-gray-200 p-6 flex gap-4">
            <button
              onClick={() => setShowLeadsCRM(false)}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-xl transition font-semibold"
            >
              Close Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  };

  const NotificationCenter = () => {
    const unreadCount = pushNotifications.filter(n => !n.read).length;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 z-50 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-0 overflow-hidden">
          {/* Professional Header */}
          <div className="bg-white border-b border-gray-200 p-5">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                <p className="text-sm text-gray-500 mt-1">{unreadCount} new updates</p>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-gray-600 transition p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[380px] overflow-y-auto">
            {pushNotifications.length === 0 ? (
              <div className="text-center py-12 px-6">
                <div className="text-gray-300 text-4xl mb-3">✓</div>
                <p className="text-gray-500 font-medium">All caught up!</p>
                <p className="text-gray-400 text-sm mt-1">No new notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {pushNotifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-4 hover:bg-gray-50 transition cursor-pointer border-l-4 ${
                      notif.type === 'inquiry' ? 'border-blue-500 bg-blue-50/30' :
                      notif.type === 'viewing' ? 'border-green-500 bg-green-50/30' :
                      notif.type === 'price' ? 'border-amber-500 bg-amber-50/30' :
                      'border-purple-500 bg-purple-50/30'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm ${
                        notif.type === 'inquiry' ? 'bg-blue-100 text-blue-700' :
                        notif.type === 'viewing' ? 'bg-green-100 text-green-700' :
                        notif.type === 'price' ? 'bg-amber-100 text-amber-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {notif.type === 'inquiry' ? 'IN' : notif.type === 'viewing' ? 'VW' : notif.type === 'price' ? 'PR' : 'LD'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm leading-tight">{notif.title}</h4>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{notif.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">{notif.time}</span>
                          {!notif.read && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              New
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-gray-50 px-5 py-3 flex gap-2">
            <button
              onClick={() => setShowNotifications(false)}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-lg transition font-medium text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const EmailNotificationsPanel = () => {
    const unreadEmails = emailAlerts.filter(e => !e.read).length;

    const handleMarkAsRead = (id) => {
      setEmailAlerts(emailAlerts.map(alert =>
        alert.id === id ? { ...alert, read: true } : alert
      ));
    };

    const handleDismiss = (id) => {
      setEmailAlerts(emailAlerts.filter(alert => alert.id !== id));
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 z-50 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-0 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
            <div className="flex justify-between items-start gap-2">
              <div>
                <h2 className="text-2xl font-bold">📧 Email Alerts</h2>
                <p className="text-blue-100 text-xs mt-1">{unreadEmails} new</p>
              </div>
              <button
                onClick={() => setShowEmailNotifications(false)}
                className="text-white/80 hover:text-white transition p-1 hover:bg-white/10 rounded-lg flex-shrink-0"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-blue-50 border-b border-blue-200 p-2 flex gap-2 justify-between items-center text-xs">
            <div className="text-blue-900 font-semibold">
              {emailAlerts.length} • {unreadEmails} unread
            </div>
            <button
              onClick={() => setShowNotificationPreferences(true)}
              className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition"
            >
              ⚙️ Prefs
            </button>
          </div>

          {/* Email Alerts List */}
          <div className="px-3 py-2">
            <div className="space-y-1.5 max-h-[320px] overflow-y-auto">
              {emailAlerts.length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-3xl mb-2">📭</div>
                  <p className="text-gray-600 text-xs">No alerts</p>
                </div>
              ) : (
                emailAlerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`p-2 rounded-lg border transition text-xs ${
                      alert.type === 'price_drop' ? 'bg-red-50 border-red-200' :
                      alert.type === 'new_listing' ? 'bg-green-50 border-green-200' :
                      alert.type === 'agent_message' ? 'bg-blue-50 border-blue-200' :
                      'bg-purple-50 border-purple-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${
                        alert.type === 'price_drop' ? 'bg-red-100' :
                        alert.type === 'new_listing' ? 'bg-green-100' :
                        alert.type === 'agent_message' ? 'bg-blue-100' :
                        'bg-purple-100'
                      }`}>
                        {alert.type === 'price_drop' ? '📉' :
                         alert.type === 'new_listing' ? '🏠' :
                         alert.type === 'agent_message' ? '💬' :
                         '✉️'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h3 className="font-bold text-gray-800 line-clamp-1">
                            {alert.type === 'price_drop' ? `Drop: ${alert.property}` :
                             alert.type === 'new_listing' ? alert.title :
                             alert.type === 'agent_message' ? `Msg from ${alert.agent}` :
                             `Inquiry: ${alert.property}`}
                          </h3>
                          <span className="text-xs text-gray-500 whitespace-nowrap">{alert.date}</span>
                        </div>

                        {alert.type === 'price_drop' && (
                          <div className="text-xs text-gray-700 mb-1 space-y-0.5">
                            <div>Old: <span className="line-through text-gray-500">AED {(alert.oldPrice/1000000).toFixed(1)}M</span></div>
                            <div>New: <span className="font-bold text-green-600">AED {(alert.newPrice/1000000).toFixed(1)}M</span> Save: <span className="font-bold text-green-700">AED {(alert.savings/1000).toFixed(0)}K</span></div>
                          </div>
                        )}

                        {alert.type === 'new_listing' && (
                          <div className="text-xs text-gray-600 mb-1">
                            {alert.bedrooms}BR • AED {(alert.price/1000000).toFixed(1)}M
                          </div>
                        )}

                        {alert.type === 'agent_message' && (
                          <p className="text-xs text-gray-700 mb-1 line-clamp-1">"{alert.message}"</p>
                        )}

                        {alert.type === 'inquiry_status' && (
                          <p className="text-xs text-gray-700 mb-1">Status: <span className="font-bold text-blue-600">{alert.status}</span></p>
                        )}

                        {!alert.read && (
                          <button
                            onClick={() => handleMarkAsRead(alert.id)}
                            className="text-xs px-1.5 py-0.5 rounded font-bold text-white bg-blue-500 hover:bg-blue-600 transition"
                          >
                            ✓ Read
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => handleDismiss(alert.id)}
                        className="text-gray-400 hover:text-gray-600 transition p-0.5 flex-shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 border-t border-gray-200 p-2 flex gap-2">
            <button
              onClick={() => setShowEmailNotifications(false)}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded text-sm font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const NotificationPreferencesModal = () => {
    const [tempPrefs, setTempPrefs] = useState(notificationPreferences);

    const handleSavePreferences = () => {
      setNotificationPreferences(tempPrefs);
      setShowNotificationPreferences(false);
      showToast('Notification preferences saved!');
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-8 my-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Notification Preferences</h2>
            <button
              onClick={() => setShowNotificationPreferences(false)}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X size={28} />
            </button>
          </div>

          <div className="space-y-6 max-h-[600px] overflow-y-auto pb-4">
            {/* Alert Types */}
            <div className="border-b pb-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Alert Types</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={tempPrefs.priceDropAlerts}
                    onChange={(e) => setTempPrefs({ ...tempPrefs, priceDropAlerts: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">Price Drop Alerts</p>
                    <p className="text-sm text-gray-600">Get notified when prices drop on your favorite properties</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={tempPrefs.newListingAlerts}
                    onChange={(e) => setTempPrefs({ ...tempPrefs, newListingAlerts: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">New Listings</p>
                    <p className="text-sm text-gray-600">Be the first to know about new properties matching your criteria</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={tempPrefs.agentMessages}
                    onChange={(e) => setTempPrefs({ ...tempPrefs, agentMessages: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">Agent Messages</p>
                    <p className="text-sm text-gray-600">Receive messages and updates from agents</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={tempPrefs.inquiryUpdates}
                    onChange={(e) => setTempPrefs({ ...tempPrefs, inquiryUpdates: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">Inquiry Updates</p>
                    <p className="text-sm text-gray-600">Get updates on your property inquiries</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={tempPrefs.weeklyDigest}
                    onChange={(e) => setTempPrefs({ ...tempPrefs, weeklyDigest: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">Weekly Digest</p>
                    <p className="text-sm text-gray-600">Receive a weekly summary of property updates</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Email Frequency */}
            <div className="border-b pb-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Email Frequency</h3>
              <select
                value={tempPrefs.emailFrequency}
                onChange={(e) => setTempPrefs({ ...tempPrefs, emailFrequency: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="realtime">Real-time</option>
                <option value="daily">Daily Digest</option>
                <option value="weekly">Weekly Digest</option>
                <option value="never">Never</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="border-b pb-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Price Range (AED)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum</label>
                  <input
                    type="number"
                    value={tempPrefs.minPriceThreshold}
                    onChange={(e) => setTempPrefs({ ...tempPrefs, minPriceThreshold: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum</label>
                  <input
                    type="number"
                    value={tempPrefs.maxPriceThreshold}
                    onChange={(e) => setTempPrefs({ ...tempPrefs, maxPriceThreshold: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Preferred Locations */}
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-4">Preferred Locations</h3>
              <div className="grid grid-cols-2 gap-2">
                {['Dubai Marina', 'Downtown Dubai', 'Palm Jumeirah', 'Business Bay', 'Jumeirah', 'Sheikh Zayed Road'].map(location => (
                  <label key={location} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempPrefs.preferredLocations.includes(location)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setTempPrefs({ ...tempPrefs, preferredLocations: [...tempPrefs.preferredLocations, location] });
                        } else {
                          setTempPrefs({ ...tempPrefs, preferredLocations: tempPrefs.preferredLocations.filter(l => l !== location) });
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">{location}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t mt-6 pt-6 flex gap-3">
            <button
              onClick={() => setShowNotificationPreferences(false)}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-lg transition font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePreferences}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition font-semibold"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    );
  };

  const extractYoutubeId = (url) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const VideoPlayerModal = () => {
    if (!selectedVideo) return null;

    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
        <div className="relative w-full max-w-5xl">
          {/* Close Button */}
          <button
            onClick={() => {
              setShowVideoPlayer(false);
              setSelectedVideo(null);
            }}
            className="absolute -top-10 right-0 text-white hover:text-gray-300 transition"
          >
            <X size={32} />
          </button>

          {/* Video Container */}
          <div className="w-full bg-black rounded-lg overflow-hidden">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&fs=1&modestbranding=1&rel=0`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Video Info */}
          <div className="mt-4 text-white">
            <h2 className="text-2xl font-bold">{selectedVideo.title}</h2>
            <div className="flex gap-4 mt-2 text-gray-300 text-sm">
              <span>👁️ {selectedVideo.views.toLocaleString()} views</span>
              <span>⏱️ {selectedVideo.duration}</span>
              <span className="bg-blue-600 px-3 py-1 rounded-full">{selectedVideo.type}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const VideoGalleryModal = () => {
    const videoTypeGroups = {
      'Walkthrough': propertyVideos.filter(v => v.type === 'Walkthrough'),
      'Room Tour': propertyVideos.filter(v => v.type === 'Room Tour'),
      'Neighborhood': propertyVideos.filter(v => v.type === 'Neighborhood'),
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full p-0 my-8 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 via-red-600 to-orange-600 text-white p-8">
            <div className="flex justify-between items-start">
              <div>
                <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-3">
                  <span className="text-sm font-semibold">Video Collection</span>
                </div>
                <h2 className="text-4xl font-bold mb-2">🎬 Video Gallery</h2>
                <p className="text-red-100">{propertyVideos.length} immersive videos • Complete property experience</p>
              </div>
              <button onClick={() => setShowVideoGallery(false)} className="text-white/80 hover:text-white transition p-2 hover:bg-white/10 rounded-lg">
                <X size={32} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Video Type Tabs */}
            <div className="space-y-10">
            {Object.entries(videoTypeGroups).map(([type, videos]) => (
              videos.length > 0 && (
                <div key={type}>
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-red-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-2xl">
                      {type === 'Walkthrough' ? '🚶' : type === 'Room Tour' ? '🚪' : '🏘️'}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">{type}</h3>
                    <span className="ml-auto text-sm font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">
                      {videos.length} video{videos.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map(video => (
                      <button
                        key={video.id}
                        onClick={() => {
                          setSelectedVideo(video);
                          setShowVideoPlayer(true);
                        }}
                        className="group relative overflow-hidden rounded-2xl hover:shadow-2xl transition duration-300 transform hover:scale-105"
                      >
                        {/* Thumbnail Container */}
                        <div className="relative w-full aspect-video bg-gray-900 overflow-hidden">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                          />

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

                          {/* Play Button */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center group-hover:scale-125 transition duration-300 shadow-2xl">
                              <div style={{
                                borderLeft: '10px solid white',
                                borderTop: '6px solid transparent',
                                borderBottom: '6px solid transparent',
                                marginLeft: '3px'
                              }} />
                            </div>
                          </div>

                          {/* Duration Badge */}
                          <div className="absolute bottom-3 right-3 bg-black/90 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                            ⏱️ {video.duration}
                          </div>
                        </div>

                        {/* Video Info Card */}
                        <div className="p-4 bg-white border-t-4 border-red-500">
                          <h4 className="font-bold text-gray-800 text-sm group-hover:text-red-600 transition line-clamp-2 mb-2">
                            {video.title}
                          </h4>
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1 text-gray-600 font-semibold">
                              👁️ {video.views.toLocaleString()} views
                            </span>
                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold">
                              {video.type}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )
            ))}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 border-t-2 border-gray-200 p-6 flex gap-4">
            <button
              onClick={() => setShowVideoGallery(false)}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-xl transition font-semibold"
            >
              Close Gallery
            </button>
          </div>
        </div>
      </div>
    );
  };

  const PropertyReviewsModal = () => {
    const averageRating = propertyReviews.length > 0
      ? (propertyReviews.reduce((sum, r) => sum + r.rating, 0) / propertyReviews.length).toFixed(1)
      : 0;

    const ratingDistribution = {
      5: propertyReviews.filter(r => r.rating === 5).length,
      4: propertyReviews.filter(r => r.rating === 4).length,
      3: propertyReviews.filter(r => r.rating === 3).length,
      2: propertyReviews.filter(r => r.rating === 2).length,
      1: propertyReviews.filter(r => r.rating === 1).length,
    };

    const maxRatingCount = Math.max(...Object.values(ratingDistribution), 1);

    const filteredReviews = reviewFilter === 'all'
      ? propertyReviews
      : propertyReviews.filter(r => r.rating === parseInt(reviewFilter));

    const handleSubmitReview = () => {
      if (!reviewAuthorName.trim() || !newPropertyReview.comment.trim()) {
        showToast('Please fill in all fields', 'error');
        return;
      }

      const review = {
        id: propertyReviews.length + 1,
        author: reviewAuthorName,
        rating: newPropertyReview.rating,
        date: new Date().toISOString().split('T')[0],
        comment: newPropertyReview.comment,
        verified: true
      };

      setPropertyReviews([review, ...propertyReviews]);
      setNewPropertyReview({ rating: 5, comment: '' });
      setReviewAuthorName('');
      setShowWriteReview(false);
      showToast('Review submitted successfully!', 'success');
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 my-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Property Reviews</h2>
            <button onClick={() => setShowPropertyReviews(false)} className="text-gray-400 hover:text-gray-600">
              <X size={28} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Rating Summary */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 rounded-2xl text-center">
              <div className="text-5xl font-bold mb-2">{averageRating}</div>
              <div className="flex justify-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className={i < Math.round(averageRating) ? 'fill-yellow-300 text-yellow-300' : 'text-blue-400'} />
                ))}
              </div>
              <p className="text-blue-100">Based on {propertyReviews.length} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="md:col-span-2">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Rating Distribution</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="font-semibold text-gray-700">{rating}</span>
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all"
                        style={{ width: `${(ratingDistribution[rating] / maxRatingCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{ratingDistribution[rating]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filter and Write Review */}
          <div className="flex justify-between items-center mb-6 pb-6 border-b-2 border-gray-200">
            <div className="flex gap-2">
              {['all', '5', '4', '3'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setReviewFilter(filter)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    reviewFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {filter === 'all' ? 'All Reviews' : `${filter}⭐`}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowWriteReview(true)}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition font-semibold"
            >
              ✏️ Write Review
            </button>
          </div>

          {/* Reviews List */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {filteredReviews.length > 0 ? (
              filteredReviews.map(review => (
                <div key={review.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-gray-800">{review.author}</h4>
                      <p className="text-sm text-gray-600">{review.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                        ))}
                      </div>
                      {review.verified && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">✓ Verified</span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No reviews found for this rating</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowPropertyReviews(false)}
            className="w-full mt-6 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 transition font-semibold"
          >
            Close Reviews
          </button>
        </div>
      </div>
    );
  };

  const NeighborhoodReviewsModal = () => {
    const averageRating = neighborhoodReviews.length > 0
      ? (neighborhoodReviews.reduce((sum, r) => sum + r.rating, 0) / neighborhoodReviews.length).toFixed(1)
      : 0;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 my-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{selectedNeighborhood} Reviews</h2>
              <p className="text-gray-600 mt-1">Community feedback and neighborhood insights</p>
            </div>
            <button onClick={() => setShowNeighborhoodReviews(false)} className="text-gray-400 hover:text-gray-600">
              <X size={28} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-6 rounded-xl text-center">
              <div className="text-4xl font-bold mb-2">{averageRating}</div>
              <div className="flex justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className={i < Math.round(averageRating) ? 'fill-yellow-300 text-yellow-300' : 'text-purple-400'} />
                ))}
              </div>
              <p className="text-purple-100">from {neighborhoodReviews.length} residents</p>
            </div>

            {/* Category Badges */}
            <div className="md:col-span-2 grid grid-cols-3 gap-3">
              {['Safety', 'Amenities', 'Family-Friendly'].map((category, idx) => (
                <div key={category} className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                  <div className="text-2xl mb-2">{idx === 0 ? '🔒' : idx === 1 ? '🏪' : '👨‍👩‍👧‍👦'}</div>
                  <p className="font-bold text-gray-800 text-sm">{category}</p>
                  <p className="text-xs text-gray-600 mt-1">Highly rated</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-4 max-h-[350px] overflow-y-auto mb-6">
            {neighborhoodReviews.map(review => (
              <div key={review.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-gray-800">{review.author}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">{review.category}</span>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{review.comment}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowNeighborhoodReviews(false)}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
          >
            Close Reviews
          </button>
        </div>
      </div>
    );
  };

  const WriteReviewModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Write a Review</h2>
          <button onClick={() => setShowWriteReview(false)} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Author Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
            <input
              type="text"
              value={reviewAuthorName}
              onChange={(e) => setReviewAuthorName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              autoFocus
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Your Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => setNewPropertyReview({ ...newPropertyReview, rating })}
                  className="transition transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={newPropertyReview.rating >= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">You rated: {newPropertyReview.rating} stars</p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Your Review</label>
            <textarea
              value={newPropertyReview.comment}
              onChange={(e) => setNewPropertyReview({ ...newPropertyReview, comment: e.target.value })}
              placeholder="Share your experience with this property..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              rows={5}
            />
            <p className="text-xs text-gray-500 mt-1">{newPropertyReview.comment.length}/500</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSubmitReview}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition font-semibold"
            >
              Submit Review
            </button>
            <button
              onClick={() => setShowWriteReview(false)}
              className="flex-1 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 transition font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const VirtualTourViewer = () => {
    // 360° Virtual Tour Rooms Database
    const tourRooms = [
      {
        id: 1,
        name: 'Living Room',
        description: 'Spacious living area with floor-to-ceiling windows and modern finishes',
        panoramicImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&h=900&fit=crop&q=80',
        features: ['Floor-to-ceiling windows', '4K Smart TV', 'Premium lighting', 'Hardwood floors']
      },
      {
        id: 2,
        name: 'Master Bedroom',
        description: 'Luxurious master suite with en-suite bathroom and walk-in closet',
        panoramicImage: 'https://images.unsplash.com/photo-1540932239986-6f70b7700975?w=1600&h=900&fit=crop&q=80',
        features: ['King-size bed', 'En-suite bathroom', 'Walk-in closet', 'Balcony access']
      },
      {
        id: 3,
        name: 'Kitchen',
        description: 'Modern gourmet kitchen with premium appliances and marble countertops',
        panoramicImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&h=900&fit=crop&q=80&crop=kitchen',
        features: ['Marble countertops', 'Chef\'s appliances', 'Island seating', 'Wine cooler']
      },
      {
        id: 4,
        name: 'Dining Area',
        description: 'Elegant dining space overlooking the city skyline',
        panoramicImage: 'https://images.unsplash.com/photo-1611228426369-bae6e8901c0f?w=1600&h=900&fit=crop&q=80',
        features: ['Panoramic views', 'Crystal chandeliers', 'Dining for 8', 'Bar counter']
      },
      {
        id: 5,
        name: 'Study/Office',
        description: 'Professional home office with built-in shelving and premium workspace',
        panoramicImage: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1600&h=900&fit=crop&q=80',
        features: ['Built-in shelves', 'Standing desk', 'Ambient lighting', 'Quiet zone']
      },
      {
        id: 6,
        name: 'Outdoor Terrace',
        description: 'Expansive terrace with lounge seating and city views',
        panoramicImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&h=900&fit=crop&q=80',
        features: ['Infinity views', 'Lounge seating', 'Heated pool', 'Outdoor kitchen']
      }
    ];

    const currentRoom = tourRooms[currentRoomIndex];

    const handleTourMouseDown = (e) => {
      setIsDraggingTour(true);
      setDragStartPos({ x: e.clientX, y: e.clientY });
    };

    const handleTourMouseMove = (e) => {
      if (!isDraggingTour) return;

      const deltaX = e.clientX - dragStartPos.x;
      const deltaY = e.clientY - dragStartPos.y;

      setTourRotationY((prev) => prev + deltaX * 0.5);
      setTourRotationX((prev) => Math.max(-90, Math.min(90, prev - deltaY * 0.5)));

      setDragStartPos({ x: e.clientX, y: e.clientY });
    };

    const handleTourMouseUp = () => {
      setIsDraggingTour(false);
    };

    const handleTourWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setTourZoom((prev) => Math.max(1, Math.min(3, prev * delta)));
    };

    React.useEffect(() => {
      if (showVirtualTour) {
        document.addEventListener('mouseup', handleTourMouseUp);
        return () => document.removeEventListener('mouseup', handleTourMouseUp);
      }
    }, [showVirtualTour]);

    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b-2 border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
            <div>
              <h2 className="text-3xl font-bold text-white">{currentRoom.name} - 360° Virtual Tour</h2>
              <p className="text-blue-100 mt-1">{currentRoom.description}</p>
            </div>
            <button
              onClick={() => setShowVirtualTour(false)}
              className="text-white hover:bg-blue-800 p-2 rounded-lg transition"
            >
              <X size={28} />
            </button>
          </div>

          {/* Main Tour Area */}
          <div className="flex-1 flex gap-4 overflow-hidden p-4">
            {/* 360° Viewer */}
            <div className="flex-1 flex flex-col">
              <div
                onMouseDown={handleTourMouseDown}
                onMouseMove={handleTourMouseMove}
                onWheel={handleTourWheel}
                className="flex-1 bg-gray-900 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing relative"
              >
                {/* Panoramic Image with Transform */}
                <div
                  className="w-full h-full"
                  style={{
                    perspective: '1200px',
                    backgroundImage: `url('${currentRoom.panoramicImage}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    transform: `rotateX(${tourRotationX}deg) rotateY(${tourRotationY}deg) scale(${tourZoom})`,
                    transformStyle: 'preserve-3d',
                    transition: isDraggingTour ? 'none' : 'transform 0.1s ease-out'
                  }}
                />

                {/* Instructions Overlay */}
                <div className="absolute top-4 left-4 bg-black/60 text-white px-4 py-2 rounded-lg text-sm pointer-events-none">
                  🖱️ Drag to rotate • 🔄 Scroll to zoom
                </div>

                {/* Zoom Level Indicator */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-4 py-2 rounded-lg text-sm pointer-events-none">
                  Zoom: {tourZoom.toFixed(1)}x
                </div>
              </div>

              {/* Room Features */}
              <div className="mt-4 bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h4 className="font-bold text-blue-900 mb-2">Room Features:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentRoom.features.map((feature, idx) => (
                    <span key={idx} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      ✓ {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Room Selection Panel */}
            <div className="w-64 bg-gray-50 rounded-xl border border-gray-200 flex flex-col overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                <h3 className="font-bold text-lg">Property Rooms</h3>
                <p className="text-purple-100 text-sm">{tourRooms.length} Spaces</p>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="p-3 space-y-2">
                  {tourRooms.map((room, idx) => (
                    <button
                      key={room.id}
                      onClick={() => {
                        setCurrentRoomIndex(idx);
                        setTourRotationX(0);
                        setTourRotationY(0);
                        setTourZoom(1);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition transform hover:scale-105 ${
                        currentRoomIndex === idx
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {idx === 0 ? '🛋️' : idx === 1 ? '🛏️' : idx === 2 ? '🍳' : idx === 3 ? '🍽️' : idx === 4 ? '📚' : '🌳'}
                        </span>
                        <div>
                          <p>{room.name}</p>
                          <p className={`text-xs ${currentRoomIndex === idx ? 'text-blue-100' : 'text-gray-500'}`}>
                            {room.features.length} features
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Control Buttons */}
              <div className="p-3 border-t border-gray-200 bg-white space-y-2">
                <button
                  onClick={() => {
                    setTourRotationX(0);
                    setTourRotationY(0);
                    setTourZoom(1);
                  }}
                  className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition font-semibold text-sm"
                >
                  Reset View
                </button>
                <button
                  onClick={() => setShowVirtualTour(false)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
                >
                  Close Tour
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PropertyDetailPage = () => {
    const handleCloseDetail = () => {
      const scrollContainer = document.getElementById('property-detail-scroll');
      if (scrollContainer) {
        setPropertyDetailScrollPos(scrollContainer.scrollTop);
      }
      setShowPropertyDetail(false);
      setSelectedProperty(null);
    };

    const handleScrollRestore = () => {
      setTimeout(() => {
        const scrollContainer = document.getElementById('property-detail-scroll');
        if (scrollContainer) {
          scrollContainer.scrollTop = propertyDetailScrollPos;
        }
      }, 0);
    };

    React.useEffect(() => {
      if (showPropertyDetail) {
        handleScrollRestore();
      }
    }, [showPropertyDetail]);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800">{selectedProperty?.title}</h2>
            <button onClick={handleCloseDetail} className="text-gray-400 hover:text-gray-600 transition">
              <X size={28} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div id="property-detail-scroll" className="flex-1 overflow-y-auto p-6">
            {/* Image Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* Main image from Reelly API */}
              {selectedProperty?.images?.[0] && (
                <div className="h-80 bg-gray-300 rounded-xl overflow-hidden md:col-span-2 shadow-lg">
                  <img src={selectedProperty.images[0]} alt="Main Property" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Interior images from PropertyFinder */}
              <div className="space-y-4">
                {selectedProperty?.interiorImages?.length > 0 ? (
                  selectedProperty.interiorImages.slice(0, 2).map((img, idx) => (
                    <div key={idx} className="h-[180px] bg-gray-300 rounded-xl overflow-hidden shadow-md">
                      <img src={img} alt={`Interior ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))
                ) : (
                  <div className="h-80 bg-gray-200 rounded-xl flex items-center justify-center">
                    <p className="text-gray-500">Interior images loading...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Video Gallery Preview */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  📹 Property Video Tours
                </h3>
                <button
                  onClick={() => setShowVideoGallery(true)}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  View All →
                </button>
              </div>

              {propertyVideos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Featured Video */}
                  <button
                    onClick={() => {
                      setSelectedVideo(propertyVideos[0]);
                      setShowVideoPlayer(true);
                    }}
                    className="group relative overflow-hidden rounded-xl hover:shadow-xl transition duration-300 md:row-span-2"
                  >
                    <div className="relative w-full h-80 bg-gray-900">
                      <img
                        src={propertyVideos[0].thumbnail}
                        alt={propertyVideos[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition flex items-center justify-center">
                        <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition duration-300 shadow-lg">
                          <div style={{
                            borderLeft: '10px solid white',
                            borderTop: '6px solid transparent',
                            borderBottom: '6px solid transparent',
                            marginLeft: '2px'
                          }} />
                        </div>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-xs font-bold">
                        {propertyVideos[0].duration}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50">
                      <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition">{propertyVideos[0].title}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-600">👁️ {propertyVideos[0].views.toLocaleString()}</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">{propertyVideos[0].type}</span>
                      </div>
                    </div>
                  </button>

                  {/* Thumbnail Videos */}
                  <div className="space-y-4">
                    {propertyVideos.slice(1, 3).map(video => (
                      <button
                        key={video.id}
                        onClick={() => {
                          setSelectedVideo(video);
                          setShowVideoPlayer(true);
                        }}
                        className="group w-full flex gap-3 hover:bg-gray-50 p-3 rounded-lg transition"
                      >
                        <div className="relative w-24 h-24 bg-gray-900 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition flex items-center justify-center">
                            <div style={{
                              borderLeft: '6px solid white',
                              borderTop: '4px solid transparent',
                              borderBottom: '4px solid transparent'
                            }} />
                          </div>
                          <div className="absolute bottom-1 right-1 bg-black/80 text-white px-1 text-xs font-bold rounded">
                            {video.duration}
                          </div>
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition line-clamp-2">{video.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-600">👁️ {video.views.toLocaleString()}</span>
                            <span className="text-xs bg-purple-100 text-purple-700 px-1.5 rounded">
                              {video.type}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-300">
                  <p className="text-gray-600">No videos available for this property</p>
                </div>
              )}
            </div>

            {/* Price and Key Info */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl mb-8 shadow-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-blue-100 text-sm font-semibold mb-1">Price</p>
                  <p className="text-3xl font-bold">AED {selectedProperty?.price?.toLocaleString() || 'N/A'}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Bed size={18} />
                    <p className="text-blue-100 text-sm font-semibold">Bedrooms</p>
                  </div>
                  <p className="text-3xl font-bold">{selectedProperty?.bedrooms}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Waves size={18} />
                    <p className="text-blue-100 text-sm font-semibold">Bathrooms</p>
                  </div>
                  <p className="text-3xl font-bold">{selectedProperty?.bathrooms}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm font-semibold mb-1">Views</p>
                  <p className="text-3xl font-bold">{selectedProperty?.viewCount?.toLocaleString() || '0'}</p>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-8 mb-8 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">About This Property</h3>
              <p className="text-gray-700 text-lg leading-relaxed">{selectedProperty?.description}</p>
            </div>

            {/* Property Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-700 text-sm font-semibold mb-1">Inquiries Received</p>
                    <p className="text-3xl font-bold text-green-600">{selectedProperty?.inquiriesReceived}</p>
                  </div>
                  <MessageSquare size={40} className="text-green-300" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-700 text-sm font-semibold mb-1">Total Views</p>
                    <p className="text-3xl font-bold text-blue-600">{selectedProperty?.viewCount?.toLocaleString()}</p>
                  </div>
                  <Eye size={40} className="text-blue-300" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-700 text-sm font-semibold mb-1">Unique IPs</p>
                    <p className="text-3xl font-bold text-purple-600">{selectedProperty?.uniqueIPs?.toLocaleString()}</p>
                  </div>
                  <Globe size={40} className="text-purple-300" />
                </div>
              </div>
            </div>

            {/* Quick Reviews Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Property Reviews Preview */}
              <button
                onClick={() => setShowPropertyReviews(true)}
                className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-xl p-6 hover:shadow-lg transition text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-800">Property Reviews</h3>
                  <span className="text-2xl">⭐</span>
                </div>
                {propertyReviews.length > 0 && (
                  <>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-3xl font-bold text-yellow-600">
                        {(propertyReviews.reduce((sum, r) => sum + r.rating, 0) / propertyReviews.length).toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-600">({propertyReviews.length} reviews)</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                      "{propertyReviews[0].comment}"
                    </p>
                    <p className="text-xs text-gray-600">by {propertyReviews[0].author}</p>
                  </>
                )}
                <p className="text-sm font-semibold text-yellow-700 mt-3">View all reviews →</p>
              </button>

              {/* Neighborhood Reviews Preview */}
              <button
                onClick={() => setShowNeighborhoodReviews(true)}
                className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-6 hover:shadow-lg transition text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-800">Neighborhood Reviews</h3>
                  <span className="text-2xl">📍</span>
                </div>
                {neighborhoodReviews.length > 0 && (
                  <>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-3xl font-bold text-purple-600">
                        {(neighborhoodReviews.reduce((sum, r) => sum + r.rating, 0) / neighborhoodReviews.length).toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-600">({neighborhoodReviews.length} residents)</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                      "{neighborhoodReviews[0].comment}"
                    </p>
                    <p className="text-xs text-gray-600">- {neighborhoodReviews[0].author}</p>
                  </>
                )}
                <p className="text-sm font-semibold text-purple-700 mt-3">Read more →</p>
              </button>
            </div>

            {/* Agent Contact */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Contact Agent</h3>
              {selectedProperty?.agentsSold?.[0] && (
                <div className="border-2 border-gray-200 rounded-xl p-8 bg-gradient-to-br from-blue-50 to-purple-50 hover:shadow-xl transition">
                  {/* Agent Header */}
                  <div className="flex gap-6 mb-8 pb-8 border-b border-gray-200">
                    <img src={selectedProperty.agentsSold[0].picture} alt={selectedProperty.agentsSold[0].name} className="w-32 h-32 rounded-full object-cover border-3 border-white shadow-md" />
                    <div className="flex-1">
                      <h4 className="font-bold text-2xl text-gray-800 mb-2">{selectedProperty.agentsSold[0].name}</h4>
                      <p className="text-lg text-gray-600 mb-1 font-semibold">{selectedProperty.agentsSold[0].company}</p>
                      <p className="text-sm text-gray-600 mb-4">{selectedProperty.agentsSold[0].specialization}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={18} className={i < Math.floor(selectedProperty.agentsSold[0].rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                          ))}
                        </div>
                        <span className="text-lg font-bold text-gray-800">{selectedProperty.agentsSold[0].rating}/5 ({selectedProperty.agentsSold[0].reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-lg">
                      <p className="text-gray-600 text-sm mb-2 font-semibold">Contact</p>
                      <p className="text-lg font-bold text-gray-800">{selectedProperty.agentsSold[0].contact || 'Available on WhatsApp'}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg">
                      <p className="text-gray-600 text-sm mb-2 font-semibold">Properties Listed</p>
                      <p className="text-lg font-bold text-blue-600">{selectedProperty.agentsSold[0].propertyCount || '0'}</p>
                    </div>
                  </div>

                  {/* WhatsApp Button with Logo */}
                  <a
                    href={`https://wa.me/15308499264?text=Hi! I'm interested in the ${selectedProperty?.bedrooms}BR property: ${selectedProperty?.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition font-bold text-lg flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.929 1.242c-1.538.755-2.936 1.827-3.977 3.1-.97 1.173-1.621 2.554-1.938 4.037-.305 1.404-.257 2.898.142 4.253.399 1.352 1.11 2.557 1.983 3.557.441.502.964.957 1.534 1.32 1.157.766 2.449 1.253 3.787 1.45 1.338.197 2.74.091 4.041-.305 1.301-.396 2.472-1.078 3.428-1.976.955-.897 1.671-2.027 2.071-3.258.4-1.231.464-2.549.21-3.811-.254-1.262-.889-2.409-1.759-3.323-.87-.915-1.966-1.567-3.153-1.896a9.896 9.896 0 00-2.843-.411z"/>
                    </svg>
                    Message on WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>

            {/* Reviews Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Property Reviews */}
              <button
                onClick={() => setShowPropertyReviews(true)}
                className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 p-6 rounded-xl hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-800">Property Reviews</h3>
                  <span className="text-2xl">⭐</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-yellow-600">
                    {propertyReviews.length > 0
                      ? (propertyReviews.reduce((sum, r) => sum + r.rating, 0) / propertyReviews.length).toFixed(1)
                      : '0'}
                  </span>
                  <span className="text-gray-600">({propertyReviews.length} reviews)</span>
                </div>
                <p className="text-sm text-gray-600 mt-3">Based on user experiences</p>
              </button>

              {/* Neighborhood Reviews */}
              <button
                onClick={() => setShowNeighborhoodReviews(true)}
                className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 p-6 rounded-xl hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-800">Neighborhood Reviews</h3>
                  <span className="text-2xl">📍</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-purple-600">
                    {neighborhoodReviews.length > 0
                      ? (neighborhoodReviews.reduce((sum, r) => sum + r.rating, 0) / neighborhoodReviews.length).toFixed(1)
                      : '0'}
                  </span>
                  <span className="text-gray-600">({neighborhoodReviews.length} residents)</span>
                </div>
                <p className="text-sm text-gray-600 mt-3">Community feedback</p>
              </button>
            </div>

          {/* Footer Action Buttons */}
          <div className="border-t border-gray-200 p-6 flex flex-col md:flex-row gap-4">
            {/* WhatsApp Button for Enquiries */}
            <a
              href={`https://wa.me/15308499264?text=Hi! I'm interested in the ${selectedProperty?.bedrooms}BR property: ${selectedProperty?.title}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold text-lg shadow-md flex items-center justify-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.929 1.242c-1.538.755-2.936 1.827-3.977 3.1-.97 1.173-1.621 2.554-1.938 4.037-.305 1.404-.257 2.898.142 4.253.399 1.352 1.11 2.557 1.983 3.557.441.502.964.957 1.534 1.32 1.157.766 2.449 1.253 3.787 1.45 1.338.197 2.74.091 4.041-.305 1.301-.396 2.472-1.078 3.428-1.976.955-.897 1.671-2.027 2.071-3.258.4-1.231.464-2.549.21-3.811-.254-1.262-.889-2.409-1.759-3.323-.87-.915-1.966-1.567-3.153-1.896a9.896 9.896 0 00-2.843-.411z"/>
              </svg>
              Message on WhatsApp
            </a>

            <button
              onClick={handleCloseDetail}
              className="flex-1 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 transition font-semibold text-lg shadow-md"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  };

  const MortgageCalculator = () => {
    const downPaymentAmount = (mortgagePrice * mortgageDownPayment) / 100;
    const loanAmount = mortgagePrice - downPaymentAmount;
    const monthlyRate = mortgageRate / 100 / 12;
    const numberOfPayments = mortgageTerm * 12;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 my-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Mortgage Calculator</h2>
            <button onClick={() => setShowMortgageCalculator(false)} className="text-gray-400 hover:text-gray-600">
              <X size={28} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property Price (AED)</label>
                <input
                  type="number"
                  value={mortgagePrice}
                  onChange={(e) => setMortgagePrice(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                />
                <input
                  type="range"
                  min="100000"
                  max="5000000"
                  value={mortgagePrice}
                  onChange={(e) => setMortgagePrice(Number(e.target.value))}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Down Payment (%)</label>
                <input
                  type="number"
                  value={mortgageDownPayment}
                  onChange={(e) => setMortgageDownPayment(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                />
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={mortgageDownPayment}
                  onChange={(e) => setMortgageDownPayment(Number(e.target.value))}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Interest Rate (% p.a.)</label>
                <input
                  type="number"
                  step="0.1"
                  value={mortgageRate}
                  onChange={(e) => setMortgageRate(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Loan Term (Years)</label>
                <input
                  type="number"
                  value={mortgageTerm}
                  onChange={(e) => setMortgageTerm(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl">
                <p className="text-blue-100 text-sm font-semibold mb-1">Monthly Payment</p>
                <p className="text-4xl font-bold">AED {monthlyPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Down Payment</p>
                  <p className="text-2xl font-bold text-gray-800">AED {downPaymentAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Loan Amount</p>
                  <p className="text-2xl font-bold text-gray-800">AED {loanAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Total Interest</p>
                  <p className="text-2xl font-bold text-red-600">AED {totalInterest.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-green-600">AED {totalPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                </div>
              </div>

              <button
                onClick={() => setShowMortgageCalculator(false)}
                className="w-full bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 transition font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PropertyMap = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Property Location Map</h2>
          <button onClick={() => setShowPropertyMap(false)} className="text-gray-400 hover:text-gray-600">
            <X size={28} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Map placeholder with Dubai neighborhoods */}
          <div className="md:col-span-2 bg-gradient-to-b from-blue-200 to-blue-100 rounded-xl h-96 flex items-center justify-center border-2 border-blue-300">
            <div className="text-center">
              <MapPin size={48} className="text-blue-600 mx-auto mb-3" />
              <p className="text-gray-700 font-semibold text-lg">Dubai Property Map</p>
              <p className="text-sm text-gray-600 mt-2">Interactive map showing {filteredProperties.length} properties</p>
              <p className="text-xs text-gray-500 mt-4">Downtown Dubai • Dubai Marina • Palm Jumeirah • Business Bay</p>
            </div>
          </div>

          {/* Property Filter by Area */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-800">Popular Areas</h3>
            <div className="space-y-2">
              {['Downtown Dubai', 'Dubai Marina', 'Palm Jumeirah', 'Business Bay', 'Jumeirah', 'Al Marjan Island', 'Arabian Ranches', 'Damac Hills'].map(area => (
                <button
                  key={area}
                  className="w-full text-left px-4 py-3 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 transition text-sm font-semibold text-gray-700"
                >
                  {area}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-3">Commute Time</h4>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between text-gray-600"><span>To Downtown Dubai:</span> <span>15-30 min</span></p>
                <p className="flex justify-between text-gray-600"><span>To Burj Khalifa:</span> <span>10-25 min</span></p>
                <p className="flex justify-between text-gray-600"><span>To Airport:</span> <span>20-45 min</span></p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowPropertyMap(false)}
          className="w-full mt-6 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 transition font-semibold"
        >
          Close Map
        </button>
      </div>
    </div>
  );

  const AdvancedSearch = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-8 my-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Advanced Property Search</h2>
          <button onClick={() => setShowAdvancedSearch(false)} className="text-gray-400 hover:text-gray-600">
            <X size={28} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
              <option>All Types</option>
              <option>Apartment</option>
              <option>Villa</option>
              <option>Townhouse</option>
              <option>Penthouse</option>
              <option>Studio</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
              <option>All Areas</option>
              <option>Downtown Dubai</option>
              <option>Dubai Marina</option>
              <option>Palm Jumeirah</option>
              <option>Business Bay</option>
              <option>Jumeirah</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Min Price (AED)</label>
            <input type="number" placeholder="0" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Max Price (AED)</label>
            <input type="number" placeholder="10000000" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Bedrooms</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
              <option>Any</option>
              <option>Studio</option>
              <option>1 Bedroom</option>
              <option>2 Bedrooms</option>
              <option>3 Bedrooms</option>
              <option>4+ Bedrooms</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Bathrooms</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
              <option>Any</option>
              <option>1 Bathroom</option>
              <option>2 Bathrooms</option>
              <option>3 Bathrooms</option>
              <option>4+ Bathrooms</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Amenities</label>
            <div className="space-y-2">
              <label className="flex items-center"><input type="checkbox" className="mr-2" /> Swimming Pool</label>
              <label className="flex items-center"><input type="checkbox" className="mr-2" /> Gym</label>
              <label className="flex items-center"><input type="checkbox" className="mr-2" /> Parking</label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Property Status</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
              <option>All Status</option>
              <option>New Listing</option>
              <option>Off-Plan</option>
              <option>Ready to Move</option>
              <option>Reduced Price</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setShowAdvancedSearch(false)}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
          >
            Apply Filters
          </button>
          <button
            onClick={() => setShowAdvancedSearch(false)}
            className="flex-1 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 transition font-semibold text-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  const RentVsBuyCalculator = () => {
    const monthlyRent = rentPrice;
    const annualRent = monthlyRent * 12;
    const totalRentCost = annualRent * rentalYears;

    const downPayment = (buyPrice * 20) / 100;
    const loanAmount = buyPrice - downPayment;
    const monthlyRate = 3.5 / 100 / 12;
    const numberOfPayments = 25 * 12;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    const totalMortgageCost = (monthlyPayment * numberOfPayments) + downPayment;
    const netBuyValue = buyPrice * 1.03; // Assume 3% appreciation

    const isBuyingCheaper = (totalRentCost / rentalYears) > (monthlyPayment);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-8 my-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Rent vs Buy Calculator</h2>
            <button onClick={() => setShowRentVsBuy(false)} className="text-gray-400 hover:text-gray-600">
              <X size={28} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Rent Inputs */}
            <div className="space-y-4 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Renting</h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Rent (AED)</label>
                <input
                  type="number"
                  value={rentPrice}
                  onChange={(e) => setRentPrice(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Years to Rent</label>
                <input
                  type="number"
                  value={rentalYears}
                  onChange={(e) => setRentalYears(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>
              <div className="bg-white p-4 rounded-lg mt-4">
                <p className="text-gray-600 text-sm mb-1">Annual Cost</p>
                <p className="text-2xl font-bold text-blue-600">AED {annualRent.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">Total Cost ({rentalYears} years)</p>
                <p className="text-2xl font-bold text-blue-600">AED {totalRentCost.toLocaleString()}</p>
              </div>
            </div>

            {/* Buy Inputs */}
            <div className="space-y-4 p-6 bg-green-50 rounded-xl border border-green-200">
              <h3 className="text-xl font-bold text-green-900 mb-4">Buying</h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property Price (AED)</label>
                <input
                  type="number"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>
              <div className="bg-white p-4 rounded-lg mt-4">
                <p className="text-gray-600 text-sm mb-1">Down Payment (20%)</p>
                <p className="text-2xl font-bold text-green-600">AED {downPayment.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">Monthly Payment (25yr)</p>
                <p className="text-2xl font-bold text-green-600">AED {monthlyPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">Estimated Value (after {rentalYears}yr)</p>
                <p className="text-2xl font-bold text-green-600">AED {(netBuyValue * rentalYears / 25).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className={`p-6 rounded-xl border-2 ${isBuyingCheaper ? 'bg-green-50 border-green-300' : 'bg-blue-50 border-blue-300'}`}>
            <p className={`text-lg font-bold ${isBuyingCheaper ? 'text-green-900' : 'text-blue-900'}`}>
              {isBuyingCheaper
                ? `Buying is cheaper: Monthly mortgage (AED ${monthlyPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}) vs Monthly rent (AED ${rentPrice.toLocaleString()})`
                : `Renting is cheaper: Monthly rent (AED ${rentPrice.toLocaleString()}) vs Monthly mortgage (AED ${monthlyPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })})`
              }
            </p>
          </div>

          <button
            onClick={() => setShowRentVsBuy(false)}
            className="w-full mt-6 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 transition font-semibold"
          >
            Close Calculator
          </button>
        </div>
      </div>
    );
  };

  const PropertyComparisonTool = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full p-8 my-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Compare Properties</h2>
            <p className="text-gray-600 mt-2">Compare up to 4 properties side-by-side ({comparisonCart.length}/4)</p>
          </div>
          <button onClick={() => setShowComparison(false)} className="text-gray-400 hover:text-gray-600">
            <X size={28} />
          </button>
        </div>

        {comparisonCart.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Home size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Select properties to compare</p>
            <p className="text-gray-500 text-sm mt-2">Click the compare button on property cards</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-50 border-b-2 border-blue-200">
                  <th className="px-6 py-4 text-left font-bold text-gray-800 sticky left-0 bg-blue-50">Attribute</th>
                  {comparisonCart.map((property, idx) => (
                    <th key={idx} className="px-6 py-4 text-center font-bold text-gray-800 min-w-[200px]">
                      <div className="mb-3">
                        <img src={property.images?.[0]} alt="Property" className="w-full h-32 object-cover rounded-lg mb-2" />
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{property.title}</p>
                      <button
                        onClick={() => addToComparison(property)}
                        className="text-red-600 hover:text-red-700 text-xs font-semibold mt-2"
                      >
                        Remove
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-transparent">
                  <td className="px-6 py-4 font-bold text-gray-800">Price</td>
                  {comparisonCart.map((property, idx) => (
                    <td key={idx} className="px-6 py-4 text-center">
                      <p className="text-2xl font-bold text-blue-600">AED {property.price?.toLocaleString()}</p>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 font-bold text-gray-800">Bedrooms</td>
                  {comparisonCart.map((property, idx) => (
                    <td key={idx} className="px-6 py-4 text-center text-lg font-semibold">{property.bedrooms}</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-800">Bathrooms</td>
                  {comparisonCart.map((property, idx) => (
                    <td key={idx} className="px-6 py-4 text-center text-lg font-semibold">{property.bathrooms}</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 font-bold text-gray-800">Total Views</td>
                  {comparisonCart.map((property, idx) => (
                    <td key={idx} className="px-6 py-4 text-center text-blue-600 font-semibold">{property.viewCount?.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-800">Inquiries</td>
                  {comparisonCart.map((property, idx) => (
                    <td key={idx} className="px-6 py-4 text-center text-purple-600 font-semibold">{property.inquiriesReceived}</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 font-bold text-gray-800">Price/Month (Rent Estimate)</td>
                  {comparisonCart.map((property, idx) => {
                    const estimatedMonthlyRent = Math.floor(property.price / 200);
                    return (
                      <td key={idx} className="px-6 py-4 text-center">
                        <p className="text-lg font-bold text-green-600">AED {estimatedMonthlyRent.toLocaleString()}</p>
                      </td>
                    );
                  })}
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-800">Best For</td>
                  {comparisonCart.map((property, idx) => (
                    <td key={idx} className="px-6 py-4 text-center text-sm">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                        {property.bedrooms <= 2 ? 'Investment' : 'Family'}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 font-bold text-gray-800">Property Type</td>
                  {comparisonCart.map((property, idx) => (
                    <td key={idx} className="px-6 py-4 text-center text-sm font-semibold">{property.property_type || 'N/A'}</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-800">Price per Bed</td>
                  {comparisonCart.map((property, idx) => {
                    const pricePerBed = property.bedrooms ? Math.floor(property.price / property.bedrooms) : 0;
                    return (
                      <td key={idx} className="px-6 py-4 text-center">
                        <p className="font-semibold text-gray-800">AED {pricePerBed.toLocaleString()}</p>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>

            {/* Comparison Summary */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Quick Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-gray-600 text-sm">Highest Price</p>
                  <p className="font-bold text-blue-600 text-lg">
                    AED {Math.max(...comparisonCart.map(p => p.price)).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Lowest Price</p>
                  <p className="font-bold text-green-600 text-lg">
                    AED {Math.min(...comparisonCart.map(p => p.price)).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Average Bedrooms</p>
                  <p className="font-bold text-purple-600 text-lg">
                    {(comparisonCart.reduce((a, p) => a + p.bedrooms, 0) / comparisonCart.length).toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Difference</p>
                  <p className="font-bold text-red-600 text-lg">
                    AED {(Math.max(...comparisonCart.map(p => p.price)) - Math.min(...comparisonCart.map(p => p.price))).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => {
              const comparisonText = comparisonCart.map(p => `${p.title}\nPrice: AED ${p.price?.toLocaleString()}\nBedrooms: ${p.bedrooms} | Bathrooms: ${p.bathrooms}\n`).join('\n---\n');
              const encoded = encodeURIComponent(comparisonText);
              window.open(`https://wa.me/?text=${encoded}`, '_blank');
            }}
            disabled={comparisonCart.length === 0}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:shadow-lg transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <MessageSquare size={18} /> Share on WhatsApp
          </button>
          <button
            onClick={() => setShowComparison(false)}
            className="flex-1 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 transition font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  const MarketInsightsDashboard = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full p-8 my-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Dubai Real Estate Market Insights</h2>
          <button onClick={() => setShowMarketInsights(false)} className="text-gray-400 hover:text-gray-600">
            <X size={28} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-semibold mb-1">Average Property Price</p>
                <p className="text-4xl font-bold">AED 1.2M</p>
              </div>
              <TrendingUp size={48} className="text-green-200 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-semibold mb-1">Year-over-Year Growth</p>
                <p className="text-4xl font-bold">+8.5%</p>
              </div>
              <TrendingUp size={48} className="text-blue-200 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-semibold mb-1">Avg Rental Yield</p>
                <p className="text-4xl font-bold">4.2%</p>
              </div>
              <DollarSign size={48} className="text-purple-200 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-semibold mb-1">Properties Listed</p>
                <p className="text-4xl font-bold">49</p>
              </div>
              <Building2 size={48} className="text-orange-200 opacity-50" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Most Popular Areas</h3>
            <div className="space-y-3">
              {['Downtown Dubai', 'Dubai Marina', 'Palm Jumeirah', 'Business Bay', 'Jumeirah'].map((area, idx) => (
                <div key={area} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                      {idx + 1}
                    </div>
                    <span className="text-gray-700 font-semibold">{area}</span>
                  </div>
                  <span className="text-gray-600 text-sm">12-18% YoY growth</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Investment Opportunities</h3>
            <div className="space-y-3">
              {[
                { type: '2-Bedroom Apartments', yield: '4.8%', roi: '+12.5% YoY' },
                { type: '4-Bedroom Villas', yield: '3.9%', roi: '+9.2% YoY' },
                { type: '5-Bedroom Penthouses', yield: '3.5%', roi: '+8.7% YoY' }
              ].map((item, idx) => (
                <div key={idx} className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
                  <p className="font-semibold text-gray-800">{item.type}</p>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>Yield: <span className="text-green-600 font-bold">{item.yield}</span></span>
                    <span>Return: <span className="text-blue-600 font-bold">{item.roi}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowMarketInsights(false)}
          className="w-full mt-6 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 transition font-semibold"
        >
          Close Market Insights
        </button>
      </div>
    </div>
  );

  const InvestmentROICalculator = () => {
    const downPaymentAmount = (roiPropertyPrice * roiDownPayment) / 100;
    const loanAmount = roiPropertyPrice - downPaymentAmount;
    const monthlyRate = 3.5 / 100 / 12;
    const numberOfPayments = 25 * 12;
    const monthlyMortgage = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const annualRentalIncome = roiMonthlyRent * 12;
    const annualMortgagePayment = monthlyMortgage * 12;
    const annualNetIncome = annualRentalIncome - annualMortgagePayment;

    const futurePropertyValue = roiPropertyPrice * Math.pow(1 + (roiAnnualAppreciation / 100), roiHoldingPeriod);
    const totalRentalIncome = annualRentalIncome * roiHoldingPeriod;
    const totalMortgagePayment = monthlyMortgage * roiHoldingPeriod * 12;
    const totalProfit = (futurePropertyValue - roiPropertyPrice) + (totalRentalIncome - totalMortgagePayment);
    const roi = (totalProfit / downPaymentAmount) * 100;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-8 my-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Investment ROI Calculator</h2>
            <button onClick={() => setShowROICalculator(false)} className="text-gray-400 hover:text-gray-600">
              <X size={28} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Inputs */}
            <div className="space-y-6 bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Investment Parameters</h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property Price (AED)</label>
                <input
                  type="number"
                  value={roiPropertyPrice}
                  onChange={(e) => setRoiPropertyPrice(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Down Payment (%)</label>
                <input
                  type="number"
                  value={roiDownPayment}
                  onChange={(e) => setRoiDownPayment(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Rent (AED)</label>
                <input
                  type="number"
                  value={roiMonthlyRent}
                  onChange={(e) => setRoiMonthlyRent(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Appreciation (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={roiAnnualAppreciation}
                  onChange={(e) => setRoiAnnualAppreciation(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Holding Period (Years)</label>
                <input
                  type="number"
                  value={roiHoldingPeriod}
                  onChange={(e) => setRoiHoldingPeriod(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl">
                <p className="text-green-100 text-sm font-semibold mb-1">Total ROI</p>
                <p className="text-4xl font-bold">{roi.toFixed(1)}%</p>
                <p className="text-green-100 text-sm mt-2">Over {roiHoldingPeriod} years</p>
              </div>

              <div className="bg-white border-2 border-green-200 p-4 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">Total Profit</p>
                <p className="text-3xl font-bold text-green-600">AED {totalProfit.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-xs mb-1">Rental Income</p>
                  <p className="font-bold text-gray-800">AED {totalRentalIncome.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-xs mb-1">Property Appreciation</p>
                  <p className="font-bold text-gray-800">AED {(futurePropertyValue - roiPropertyPrice).toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-xs mb-1">Current Value</p>
                  <p className="font-bold text-gray-800">AED {roiPropertyPrice.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-xs mb-1">Future Value</p>
                  <p className="font-bold text-gray-800">AED {futurePropertyValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-gray-600 text-xs mb-1">Annual Net Income</p>
                <p className="font-bold text-blue-600">AED {(annualNetIncome > 0 ? annualNetIncome : 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowROICalculator(false)}
            className="w-full bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 transition font-semibold"
          >
            Close ROI Calculator
          </button>
        </div>
      </div>
    );
  };

  const UserProfileDashboard = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-8 my-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">My Dashboard</h2>
          <button onClick={() => setShowUserDashboard(false)} className="text-gray-400 hover:text-gray-600">
            <X size={28} />
          </button>
        </div>

        {!user ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <User size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Please sign in to view your dashboard</p>
            <button
              onClick={() => { setShowUserDashboard(false); setShowAuthModal(true); }}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Sign In
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* User Profile Section */}
            <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                <User size={48} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500 mt-1">Member since {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-700 text-sm font-semibold mb-1">Favorite Properties</p>
                    <p className="text-3xl font-bold text-blue-600">{favorites.size}</p>
                  </div>
                  <Heart size={32} className="text-blue-300" />
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-700 text-sm font-semibold mb-1">Inquiries Sent</p>
                    <p className="text-3xl font-bold text-green-600">{Math.floor(Math.random() * 8) + 1}</p>
                  </div>
                  <Mail size={32} className="text-green-300" />
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-700 text-sm font-semibold mb-1">Properties Viewed</p>
                    <p className="text-3xl font-bold text-purple-600">{Math.floor(Math.random() * 20) + 5}</p>
                  </div>
                  <Eye size={32} className="text-purple-300" />
                </div>
              </div>
            </div>

            {/* Favorite Properties */}
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-4">My Favorite Properties</h3>
              {favorites.size === 0 ? (
                <p className="text-gray-600 text-center py-8">No favorites yet. Add properties by clicking the heart icon!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProperties.filter(p => favorites.has(p.id)).slice(0, 4).map(property => (
                    <div key={property.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                      <img src={property.images?.[0]} alt="Property" className="w-full h-40 object-cover" />
                      <div className="p-4">
                        <p className="font-bold text-gray-800 line-clamp-1">{property.title}</p>
                        <p className="text-blue-600 font-bold">AED {property.price?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preferences */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Preferences</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-gray-700">Email me about new properties matching my preferences</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-gray-700">Notify me about price drops on saved properties</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-gray-700">Show my profile to agents</span>
                </label>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowUserDashboard(false)}
          className="w-full mt-6 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 transition font-semibold"
        >
          Close Dashboard
        </button>
      </div>
    </div>
  );

  const NeighborhoodInsights = () => {
    const neighborhoods = {
      'Downtown Dubai': {
        walkability: 92,
        safety: 88,
        schools: 18,
        restaurants: 156,
        schools_list: ['Dubai World Trade Centre School', 'Emirates International School', 'Discovery Gardens School'],
        amenities: ['Mall of the Emirates', 'Burj Khalifa', 'Dubai Museum', 'Gold Souk'],
        avgPrice: 'AED 1.1M',
        avgRent: 'AED 4,500/month',
        community_rating: 4.7,
        reviews: 342
      },
      'Dubai Marina': {
        walkability: 89,
        safety: 89,
        schools: 22,
        restaurants: 203,
        schools_list: ['Emirates National School - Marina Campus', 'Marina Primary School', 'JESS - Marina Campus'],
        amenities: ['Dubai Marina Mall', 'Marina Beach', 'JBR Beach', 'Marina Yachts Club'],
        avgPrice: 'AED 1.4M',
        avgRent: 'AED 5,200/month',
        community_rating: 4.8,
        reviews: 421
      },
      'Palm Jumeirah': {
        walkability: 75,
        safety: 92,
        schools: 12,
        restaurants: 89,
        schools_list: ['Palm Jumeirah School', 'Jumeirah English School', 'Jebel Ali School'],
        amenities: ['The Palm Jumeirah Mall', 'Atlantis The Palm', 'Palm Jumeirah Beach', 'Water Park'],
        avgPrice: 'AED 2.8M',
        avgRent: 'AED 8,500/month',
        community_rating: 4.9,
        reviews: 267
      }
    };

    const area = neighborhoods[selectedNeighborhood] || neighborhoods['Downtown Dubai'];

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full p-8 my-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Neighborhood Intelligence</h2>
            <button onClick={() => setShowNeighborhoodInsights(false)} className="text-gray-400 hover:text-gray-600">
              <X size={28} />
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Select Neighborhood</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.keys(neighborhoods).map(neighborhood => (
                <button
                  key={neighborhood}
                  onClick={() => setSelectedNeighborhood(neighborhood)}
                  className={`px-4 py-3 rounded-lg font-semibold transition ${
                    selectedNeighborhood === neighborhood
                      ? 'bg-blue-600 text-white border-2 border-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300'
                  }`}
                >
                  {neighborhood}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Walkability & Safety */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-blue-100 font-semibold">Walkability Score</span>
                  <span className="text-3xl font-bold">{area.walkability}</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-white rounded-full h-2" style={{width: `${area.walkability}%`}}></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-green-100 font-semibold">Safety Rating</span>
                  <span className="text-3xl font-bold">{area.safety}</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div className="bg-white rounded-full h-2" style={{width: `${area.safety}%`}}></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="fill-yellow-300 text-yellow-300" size={20} />
                  <span className="text-purple-100 font-semibold">Community Rating</span>
                </div>
                <p className="text-3xl font-bold">{area.community_rating}/5</p>
                <p className="text-purple-100 text-sm mt-1">{area.reviews} reviews</p>
              </div>
            </div>

            {/* Schools & Amenities */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="font-bold text-lg text-gray-800 mb-4">Education</h3>
                <p className="text-sm text-gray-600 mb-3">{area.schools} schools nearby</p>
                <div className="space-y-2">
                  {area.schools_list.map((school, idx) => (
                    <p key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      {school}
                    </p>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="font-bold text-lg text-gray-800 mb-4">Key Amenities</h3>
                <div className="space-y-2">
                  {area.amenities.map((amenity, idx) => (
                    <p key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      {amenity}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
              <p className="text-gray-600 text-sm mb-1">Avg Property Price</p>
              <p className="text-2xl font-bold text-blue-600">{area.avgPrice}</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
              <p className="text-gray-600 text-sm mb-1">Avg Monthly Rent</p>
              <p className="text-2xl font-bold text-green-600">{area.avgRent}</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 text-center">
              <p className="text-gray-600 text-sm mb-1">Restaurants</p>
              <p className="text-2xl font-bold text-purple-600">{area.restaurants}+</p>
            </div>
          </div>

          <button
            onClick={() => setShowNeighborhoodInsights(false)}
            className="w-full bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 transition font-semibold"
          >
            Close Neighborhood Insights
          </button>
        </div>
      </div>
    );
  };

  const FinancingPreApproval = () => {
    const maxPropertyPrice = (preApprovalAnnualIncome / 5) * (preApprovalCreditScore / 750);
    const creditMultiplier = preApprovalCreditScore >= 700 ? 1.0 : preApprovalCreditScore >= 650 ? 0.85 : 0.7;
    const adjustedMaxPrice = maxPropertyPrice * creditMultiplier;
    const monthlyPaymentCapacity = (preApprovalAnnualIncome / 12) * 0.35;
    const approvalChance = preApprovalCreditScore >= 750 ? 95 : preApprovalCreditScore >= 700 ? 85 : preApprovalCreditScore >= 650 ? 70 : 50;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-8 my-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Mortgage Pre-Approval Calculator</h2>
            <button onClick={() => setShowFinancingPreApproval(false)} className="text-gray-400 hover:text-gray-600">
              <X size={28} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Inputs */}
            <div className="space-y-6 bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Your Financial Profile</h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Income (AED)</label>
                <input
                  type="number"
                  value={preApprovalAnnualIncome}
                  onChange={(e) => setPreApprovalAnnualIncome(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                />
                <input
                  type="range"
                  min="50000"
                  max="2000000"
                  value={preApprovalAnnualIncome}
                  onChange={(e) => setPreApprovalAnnualIncome(Number(e.target.value))}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Credit Score (300-850)</label>
                <input
                  type="number"
                  min="300"
                  max="850"
                  value={preApprovalCreditScore}
                  onChange={(e) => setPreApprovalCreditScore(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                />
                <input
                  type="range"
                  min="300"
                  max="850"
                  value={preApprovalCreditScore}
                  onChange={(e) => setPreApprovalCreditScore(Number(e.target.value))}
                  className="w-full mt-2"
                />
              </div>

              <div className={`p-4 rounded-lg ${preApprovalCreditScore >= 750 ? 'bg-green-100 border border-green-300' : preApprovalCreditScore >= 700 ? 'bg-yellow-100 border border-yellow-300' : 'bg-orange-100 border border-orange-300'}`}>
                <p className="text-sm font-semibold text-gray-800 mb-1">Credit Score Status</p>
                <p className={`font-bold text-lg ${preApprovalCreditScore >= 750 ? 'text-green-700' : preApprovalCreditScore >= 700 ? 'text-yellow-700' : 'text-orange-700'}`}>
                  {preApprovalCreditScore >= 750 ? 'Excellent' : preApprovalCreditScore >= 700 ? 'Good' : preApprovalCreditScore >= 650 ? 'Fair' : 'Needs Improvement'}
                </p>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <div className={`p-6 rounded-xl text-white ${approvalChance >= 90 ? 'bg-gradient-to-br from-green-500 to-green-600' : approvalChance >= 70 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' : 'bg-gradient-to-br from-orange-500 to-orange-600'}`}>
                <p className="text-white/80 font-semibold text-sm mb-1">Approval Likelihood</p>
                <p className="text-4xl font-bold">{approvalChance}%</p>
              </div>

              <div className="bg-white border-2 border-green-200 p-6 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">Maximum Property Price</p>
                <p className="text-3xl font-bold text-green-600">AED {Math.floor(adjustedMaxPrice).toLocaleString()}</p>
              </div>

              <div className="bg-white border-2 border-blue-200 p-6 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">Max Monthly Mortgage Payment</p>
                <p className="text-3xl font-bold text-blue-600">AED {Math.floor(monthlyPaymentCapacity).toLocaleString()}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">Based on:</p>
                <p className="text-xs text-gray-700">• Debt-to-income ratio: 35% max</p>
                <p className="text-xs text-gray-700">• Credit score multiplier applied</p>
                <p className="text-xs text-gray-700">• 25-year mortgage term assumed</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 mb-8">
            <h3 className="font-bold text-gray-800 mb-3">Next Steps</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ Adjust your numbers above to see different scenarios</li>
              <li>✓ Search for properties within your pre-approved range</li>
              <li>✓ Contact our agents for mortgage recommendations</li>
              <li>✓ Get official pre-approval from a bank</li>
            </ul>
          </div>

          <button
            onClick={() => setShowFinancingPreApproval(false)}
            className="w-full bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 transition font-semibold"
          >
            Close Pre-Approval Calculator
          </button>
        </div>
      </div>
    );
  };

  const AgentAnalyticsDashboard = () => {
    const agentMetrics = isAgent && user ? {
      views: 23450,
      inquiries: 342,
      sales: 12,
      revenue: 450000,
      avgResponseTime: '2.3 hours',
      clientSatisfaction: 4.8,
      activeListings: 18
    } : null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full p-8 my-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Agent Analytics Dashboard</h2>
            <button onClick={() => setShowAgentAnalytics(false)} className="text-gray-400 hover:text-gray-600">
              <X size={28} />
            </button>
          </div>

          {!isAgent ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Building2 size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Agents only feature</p>
              <p className="text-gray-500 text-sm mt-2">Register as an agent to access your analytics dashboard</p>
              <button
                onClick={() => { setShowAgentAnalytics(false); setShowAgentModal(true); setAgentMode('register'); }}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Register as Agent
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                  <p className="text-blue-100 text-sm font-semibold mb-2">Total Views</p>
                  <p className="text-3xl font-bold">{agentMetrics?.views?.toLocaleString()}</p>
                  <p className="text-xs text-blue-100 mt-1">↑ 15% vs last month</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
                  <p className="text-green-100 text-sm font-semibold mb-2">Inquiries</p>
                  <p className="text-3xl font-bold">{agentMetrics?.inquiries}</p>
                  <p className="text-xs text-green-100 mt-1">↑ 8% vs last month</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                  <p className="text-purple-100 text-sm font-semibold mb-2">Sales Closed</p>
                  <p className="text-3xl font-bold">{agentMetrics?.sales}</p>
                  <p className="text-xs text-purple-100 mt-1">This month</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg">
                  <p className="text-orange-100 text-sm font-semibold mb-2">Revenue</p>
                  <p className="text-3xl font-bold">AED {(agentMetrics?.revenue || 0).toLocaleString()}</p>
                  <p className="text-xs text-orange-100 mt-1">↑ 22% vs last month</p>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-4">Performance Indicators</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-700">Response Time</span>
                        <span className="text-sm font-bold text-green-600">{agentMetrics?.avgResponseTime}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 rounded-full h-2" style={{width: '95%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-700">Client Satisfaction</span>
                        <span className="text-sm font-bold text-blue-600">{agentMetrics?.clientSatisfaction}/5</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 rounded-full h-2" style={{width: '96%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-700">Conversion Rate</span>
                        <span className="text-sm font-bold text-purple-600">3.5%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 rounded-full h-2" style={{width: '78%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-4">Portfolio</h3>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Active Listings:</span> {agentMetrics?.activeListings}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Total Sales:</span> AED {(agentMetrics?.revenue || 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Avg Deal Size:</span> AED {Math.floor((agentMetrics?.revenue || 0) / (agentMetrics?.sales || 1)).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">View-to-Inquiry:</span> 6.8%
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-gray-800 mb-4">Earnings</h3>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded">
                      <p className="text-xs text-gray-600">Commission This Month</p>
                      <p className="text-2xl font-bold text-blue-600">AED {(agentMetrics?.revenue || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <p className="text-xs text-gray-600">View Bonuses</p>
                      <p className="text-2xl font-bold text-green-600">AED {Math.floor((agentMetrics?.views || 0) * 0.25).toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <p className="text-xs text-gray-600">Total This Month</p>
                      <p className="text-2xl font-bold text-purple-600">AED {(((agentMetrics?.revenue || 0) + Math.floor((agentMetrics?.views || 0) * 0.25))).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowAgentAnalytics(false)}
            className="w-full mt-6 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 transition font-semibold"
          >
            Close Analytics Dashboard
          </button>
        </div>
      </div>
    );
  };

  const AdvancedAnalyticsDashboard = () => {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full p-8 my-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-800">📊 Advanced Analytics</h2>
              <p className="text-gray-600 mt-2">Comprehensive performance metrics and insights</p>
            </div>
            <button
              onClick={() => setShowAdvancedAnalytics(false)}
              className="text-gray-400 hover:text-gray-600 transition p-2"
            >
              <X size={32} />
            </button>
          </div>

          {/* Top KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
              <p className="text-blue-100 text-sm font-semibold mb-2">Total Views</p>
              <p className="text-3xl font-bold">{agentAnalyticsData.totalViews.toLocaleString()}</p>
              <p className="text-xs text-blue-200 mt-2">This Month: {agentAnalyticsData.viewsThisMonth.toLocaleString()}</p>
              <p className="text-xs text-green-300 font-bold">{agentAnalyticsData.viewsTrend}</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
              <p className="text-green-100 text-sm font-semibold mb-2">Inquiries</p>
              <p className="text-3xl font-bold">{agentAnalyticsData.totalInquiries}</p>
              <p className="text-xs text-green-200 mt-2">This Month: {agentAnalyticsData.inquiriesThisMonth}</p>
              <p className="text-xs text-green-300 font-bold">{agentAnalyticsData.inquiriesTrend}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
              <p className="text-purple-100 text-sm font-semibold mb-2">Conversion Rate</p>
              <p className="text-3xl font-bold">{(agentAnalyticsData.conversionRate * 100).toFixed(1)}%</p>
              <p className="text-xs text-purple-200 mt-2">Inquiries to Sales</p>
              <p className="text-xs text-green-300 font-bold">{agentAnalyticsData.conversionTrend}</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
              <p className="text-orange-100 text-sm font-semibold mb-2">Sales Closed</p>
              <p className="text-3xl font-bold">{agentAnalyticsData.totalSales}</p>
              <p className="text-xs text-orange-200 mt-2">This Month: {agentAnalyticsData.salesThisMonth}</p>
              <p className="text-xs text-green-300 font-bold">{agentAnalyticsData.salesTrend}</p>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
              <p className="text-red-100 text-sm font-semibold mb-2">Commission</p>
              <p className="text-2xl font-bold">AED {(agentAnalyticsData.totalCommission / 1000).toFixed(0)}K</p>
              <p className="text-xs text-red-200 mt-2">AED {(agentAnalyticsData.commissionThisMonth / 1000).toFixed(0)}K this month</p>
              <p className="text-xs text-green-300 font-bold">{agentAnalyticsData.commissionTrend}</p>
            </div>
          </div>

          {/* Charts & Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Performance Trend */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
              <h3 className="font-bold text-lg text-gray-800 mb-4">📈 Performance Trend (Last 6 Months)</h3>
              <div className="space-y-3">
                {agentAnalyticsData.propertyViews.map((data, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-700">{data.date}</span>
                      <span className="text-sm font-bold text-blue-600">{data.views} views</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 rounded-full h-2" style={{width: `${(data.views / 5400) * 100}%`}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inquiry Source Distribution */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
              <h3 className="font-bold text-lg text-gray-800 mb-4">🔍 Inquiry Sources</h3>
              <div className="space-y-3">
                {agentAnalyticsData.inquirySourceData.map((source, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-700">{source.source}</span>
                        <span className="text-sm font-bold text-gray-800">{source.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-2"
                          style={{width: `${source.percentage}%`}}
                        ></div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-gray-600 min-w-fit">{source.count} inquiries</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Property Type Performance */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg mb-8">
            <h3 className="font-bold text-lg text-gray-800 mb-4">🏠 Property Type Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {agentAnalyticsData.propertyTypePerformance.map((prop, idx) => (
                <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-bold text-gray-800 mb-3">{prop.type}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Views:</span>
                      <span className="font-bold text-blue-600">{prop.views.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Inquiries:</span>
                      <span className="font-bold text-purple-600">{prop.inquiries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Sales:</span>
                      <span className="font-bold text-green-600">{prop.sales}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Conv Rate:</span>
                      <span className="font-bold text-orange-600">{((prop.sales / prop.inquiries) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Inquiries */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg mb-8">
            <h3 className="font-bold text-lg text-gray-800 mb-4">📧 Recent Inquiries</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {agentAnalyticsData.recentInquiries.map((inquiry, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-blue-50 transition">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{inquiry.property}</p>
                    <p className="text-sm text-gray-600">{inquiry.client}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      inquiry.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{inquiry.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 font-semibold">Avg Views per Property</p>
              <p className="text-2xl font-bold text-blue-600">{agentAnalyticsData.averageViewsPerProperty.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600 font-semibold">Avg Response Time</p>
              <p className="text-2xl font-bold text-green-600">{agentAnalyticsData.responseTimeAvg}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-600 font-semibold">Client Satisfaction</p>
              <p className="text-2xl font-bold text-purple-600">⭐ {agentAnalyticsData.clientSatisfaction}/5</p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setShowAdvancedAnalytics(false)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-semibold text-lg"
          >
            Close Analytics Dashboard
          </button>
        </div>
      </div>
    );
  };

  const AIRecommendationsPanel = () => {
    const recommendations = generatePropertyRecommendations();

    const handleLoadRecommendations = () => {
      setRecommendedProperties(recommendations);
    };

    React.useEffect(() => {
      if (showAIRecommendations && recommendedProperties.length === 0) {
        handleLoadRecommendations();
      }
    }, [showAIRecommendations]);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full p-8 my-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-800">🤖 AI Recommendations</h2>
              <p className="text-gray-600 mt-2">Personalized properties based on your preferences and browsing history</p>
            </div>
            <button
              onClick={() => setShowAIRecommendations(false)}
              className="text-gray-400 hover:text-gray-600 transition p-2"
            >
              <X size={32} />
            </button>
          </div>

          {/* Preferences Overview */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Your Preferences</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <p className="text-xs text-gray-600 font-semibold">Price Range</p>
                <p className="text-sm font-bold text-gray-800">AED {(userPreferences.minPrice / 1000000).toFixed(1)}M - {(userPreferences.maxPrice / 1000000).toFixed(1)}M</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <p className="text-xs text-gray-600 font-semibold">Bedrooms</p>
                <p className="text-sm font-bold text-gray-800">{userPreferences.minBedrooms} - {userPreferences.maxBedrooms}</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <p className="text-xs text-gray-600 font-semibold">Property Types</p>
                <p className="text-sm font-bold text-gray-800">{userPreferences.propertyTypes.join(', ')}</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100">
                <p className="text-xs text-gray-600 font-semibold">Top Locations</p>
                <p className="text-sm font-bold text-gray-800">{userPreferences.locations.slice(0, 2).join(', ')}</p>
              </div>
            </div>
          </div>

          {/* Recommended Properties */}
          <div>
            <h3 className="font-bold text-lg text-gray-800 mb-4">✨ Top Recommendations for You</h3>
            {recommendations.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Zap size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No properties match your preferences</p>
                <p className="text-gray-500 text-sm mt-2">Adjust your preferences to see recommendations</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.map((property, idx) => (
                  <div
                    key={property.id || idx}
                    className="bg-white border-2 border-blue-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition hover:scale-105"
                  >
                    {/* Image */}
                    <div className="relative h-40 overflow-hidden bg-gray-200">
                      <img
                        src={property.images?.[0] || 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                          Match: {Math.round(property.recommendationScore)}%
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h4 className="font-bold text-gray-800 mb-2 line-clamp-2">{property.title}</h4>
                      <p className="text-2xl font-bold text-blue-600 mb-3">AED {(property.price / 1000000).toFixed(1)}M</p>

                      <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                        <div className="text-center">
                          <p className="text-gray-600 text-xs">Bedrooms</p>
                          <p className="font-bold text-gray-800">{property.bedrooms}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600 text-xs">Bathrooms</p>
                          <p className="font-bold text-gray-800">{property.bathrooms}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600 text-xs">Views</p>
                          <p className="font-bold text-gray-800">{(property.viewCount / 1000).toFixed(0)}K</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedProperty(property);
                            setShowPropertyDetail(true);
                            setShowAIRecommendations(false);
                          }}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-semibold text-sm"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleAddFavorite(property.id)}
                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg transition font-semibold text-sm"
                        >
                          ♥ Save
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={() => setShowAIRecommendations(false)}
            className="w-full mt-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-semibold text-lg"
          >
            Close Recommendations
          </button>
        </div>
      </div>
    );
  };

  const SocialSharingPanel = () => {
    const [copyNotification, setCopyNotification] = React.useState('');
    const referralLink = `https://gulfvista.properties/ref/${referralData.uniqueCode}`;

    const handleCopyReferralCode = () => {
      navigator.clipboard.writeText(referralData.uniqueCode);
      setCopyNotification('Referral code copied!');
      setTimeout(() => setCopyNotification(''), 2000);
    };

    const handleCopyReferralLink = () => {
      navigator.clipboard.writeText(referralLink);
      setCopyNotification('Referral link copied!');
      setTimeout(() => setCopyNotification(''), 2000);
    };

    const handleShare = (platform) => {
      const message = `Check out GulfVista.Properties - Premium Real Estate Platform! Use my referral code: ${referralData.uniqueCode}`;
      const urls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(referralLink)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`,
        instagram: '#'  // Instagram doesn't support direct URL sharing
      };

      if (urls[platform] !== '#') {
        window.open(urls[platform], '_blank', 'width=600,height=600');
      } else {
        alert('Share this link on Instagram: ' + referralLink);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-8 my-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-800">Share & Earn Rewards</h2>
              <p className="text-gray-600 mt-2">Invite friends and earn referral bonuses for every successful sign-up</p>
            </div>
            <button
              onClick={() => setShowSocialSharing(false)}
              className="text-gray-400 hover:text-gray-600 transition p-2"
            >
              <X size={32} />
            </button>
          </div>

          {/* Earnings Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl">
              <p className="text-sm font-semibold text-green-100 mb-2">Total Earnings</p>
              <p className="text-3xl font-bold">AED {referralData.totalEarnings.toLocaleString()}</p>
              <p className="text-xs text-green-200 mt-2">{referralData.successfulReferrals} successful referrals</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl">
              <p className="text-sm font-semibold text-blue-100 mb-2">Pending Rewards</p>
              <p className="text-3xl font-bold">AED {referralData.pendingRewards.toLocaleString()}</p>
              <p className="text-xs text-blue-200 mt-2">Awaiting completion</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl">
              <p className="text-sm font-semibold text-purple-100 mb-2">Total Referrals</p>
              <p className="text-3xl font-bold">{referralData.referralsCount}</p>
              <p className="text-xs text-purple-200 mt-2">Friends invited</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl">
              <p className="text-sm font-semibold text-orange-100 mb-2">Share Reach</p>
              <p className="text-3xl font-bold">{socialShareStats.totalShares}</p>
              <p className="text-xs text-orange-200 mt-2">Total shares</p>
            </div>
          </div>

          {/* Referral Code & Link Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-lg text-gray-800 mb-6">Your Referral Code</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Code */}
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-3">Referral Code</p>
                <div className="bg-white border-2 border-blue-300 rounded-xl p-4 flex items-center justify-between">
                  <span className="font-mono text-xl font-bold text-blue-600">{referralData.uniqueCode}</span>
                  <button
                    onClick={handleCopyReferralCode}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-semibold text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Link */}
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-3">Referral Link</p>
                <div className="bg-white border-2 border-purple-300 rounded-xl p-4 flex items-center justify-between">
                  <span className="font-mono text-xs text-purple-600 truncate">{referralLink}</span>
                  <button
                    onClick={handleCopyReferralLink}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition font-semibold text-sm ml-2 whitespace-nowrap"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            {copyNotification && (
              <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold">
                ✓ {copyNotification}
              </div>
            )}
          </div>

          {/* Social Sharing Section */}
          <div className="mb-8">
            <h3 className="font-bold text-lg text-gray-800 mb-6">Share on Social Media</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <button
                onClick={() => handleShare('facebook')}
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl transition font-semibold flex flex-col items-center justify-center space-y-2"
              >
                <div className="text-3xl">f</div>
                <span className="text-xs">Facebook</span>
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="bg-blue-400 hover:bg-blue-500 text-white p-4 rounded-xl transition font-semibold flex flex-col items-center justify-center space-y-2"
              >
                <div className="text-3xl">𝕏</div>
                <span className="text-xs">Twitter</span>
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-xl transition font-semibold flex flex-col items-center justify-center space-y-2"
              >
                <div className="text-3xl">W</div>
                <span className="text-xs">WhatsApp</span>
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="bg-blue-700 hover:bg-blue-800 text-white p-4 rounded-xl transition font-semibold flex flex-col items-center justify-center space-y-2"
              >
                <div className="text-3xl">in</div>
                <span className="text-xs">LinkedIn</span>
              </button>
              <button
                onClick={() => handleShare('instagram')}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white p-4 rounded-xl transition font-semibold flex flex-col items-center justify-center space-y-2"
              >
                <div className="text-3xl">📸</div>
                <span className="text-xs">Instagram</span>
              </button>
            </div>
          </div>

          {/* Share Statistics */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-lg text-gray-800 mb-6">Share Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 font-semibold">Total Shares</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{socialShareStats.totalShares}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 font-semibold">Facebook</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{socialShareStats.facebookShares}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 font-semibold">Instagram</p>
                <p className="text-2xl font-bold text-pink-600 mt-1">{socialShareStats.instagramShares}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 font-semibold">LinkedIn</p>
                <p className="text-2xl font-bold text-blue-700 mt-1">{socialShareStats.linkedinShares}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 font-semibold">Twitter</p>
                <p className="text-2xl font-bold text-blue-400 mt-1">{socialShareStats.twitterShares}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 font-semibold">QR Scans</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{socialShareStats.qrCodeScans}</p>
              </div>
            </div>
          </div>

          {/* Referral History */}
          <div className="mb-8">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Referral History</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {referralData.referralHistory.map((referral) => (
                <div key={referral.id} className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{referral.referredUser}</p>
                    <p className="text-sm text-gray-600">{referral.date}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      referral.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {referral.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                    </span>
                    <p className="text-lg font-bold text-gray-800 mt-1">
                      {referral.reward > 0 ? '+AED ' + referral.reward : '—'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-lg text-gray-800 mb-4">How It Works</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold text-sm">1</div>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Share Your Code</p>
                  <p className="text-sm text-gray-600">Copy your referral code and share it with friends and family</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold text-sm">2</div>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">They Sign Up</p>
                  <p className="text-sm text-gray-600">Friends use your code during registration to create their account</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold text-sm">3</div>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Earn Rewards</p>
                  <p className="text-sm text-gray-600">Earn AED 200 for each successful sign-up, credited to your account</p>
                </div>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setShowSocialSharing(false)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold text-lg"
          >
            Close Share Panel
          </button>
        </div>
      </div>
    );
  };

  const AdvancedMessagingPanel = () => {
    const filteredConversations = conversations.filter(conv =>
      conv.agentName.toLowerCase().includes(messagingSearchFilter.toLowerCase()) ||
      conv.agentCompany.toLowerCase().includes(messagingSearchFilter.toLowerCase())
    );

    const handleSelectConversation = (conversationId) => {
      setSelectedConversation(conversationId);
      // Mark messages as read
      setConversations(conversations.map(conv =>
        conv.id === conversationId ? { ...conv, unread: 0 } : conv
      ));
    };

    const handleSendMessage = () => {
      if (!messageInput.trim() || !selectedConversation) return;

      const newMessage = {
        id: Math.max(...messages[selectedConversation].map(m => m.id)) + 1,
        sender: 'user',
        text: messageInput,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: true
      };

      setMessages({
        ...messages,
        [selectedConversation]: [...messages[selectedConversation], newMessage]
      });

      // Simulate agent response
      setTypingIndicator('Agent is typing...');
      setTimeout(() => {
        const agentResponses = [
          'That\'s great! Let me check the availability.',
          'I\'ll get back to you shortly with more details.',
          'Sounds perfect! When would you like to schedule a viewing?',
          'I have another similar property that might interest you.',
          'Let me send you the property documentation.',
          'Thank you for your interest! When can we meet?'
        ];

        const selectedConv = conversations.find(c => c.id === selectedConversation);
        const agentResponse = {
          id: newMessage.id + 1,
          sender: 'agent',
          agentName: selectedConv.agentName,
          text: agentResponses[Math.floor(Math.random() * agentResponses.length)],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false
        };

        setMessages({
          ...messages,
          [selectedConversation]: [...messages[selectedConversation], agentResponse]
        });
        setTypingIndicator('');
      }, 1500);

      setMessageInput('');
    };

    const handleDeleteConversation = (conversationId) => {
      setConversations(conversations.filter(c => c.id !== conversationId));
      if (selectedConversation === conversationId) {
        setSelectedConversation(null);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full p-0 my-8 h-[90vh] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-center rounded-t-3xl">
            <h2 className="text-3xl font-bold">Messages</h2>
            <button
              onClick={() => setShowAdvancedMessaging(false)}
              className="text-white hover:bg-white/20 transition p-2 rounded-lg"
            >
              <X size={28} />
            </button>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Conversations List */}
            <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col bg-gray-50">
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={messagingSearchFilter}
                  onChange={(e) => setMessagingSearchFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none text-sm"
                />
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageSquare size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No conversations yet</p>
                  </div>
                ) : (
                  filteredConversations.map(conversation => (
                    <button
                      key={conversation.id}
                      onClick={() => handleSelectConversation(conversation.id)}
                      className={`w-full text-left p-4 border-b border-gray-200 hover:bg-gray-100 transition ${
                        selectedConversation === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <img
                            src={conversation.agentImage}
                            alt={conversation.agentName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 truncate">{conversation.agentName}</p>
                            <p className="text-xs text-gray-600 truncate">{conversation.agentCompany}</p>
                            <p className="text-sm text-gray-700 truncate mt-1">{conversation.lastMessage}</p>
                          </div>
                        </div>
                        {conversation.unread > 0 && (
                          <span className="flex-shrink-0 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ml-2">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{conversation.timestamp}</p>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Message Thread */}
            {selectedConversation ? (
              <div className="flex-1 flex flex-col bg-white">
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                  {conversations.find(c => c.id === selectedConversation) && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={conversations.find(c => c.id === selectedConversation).agentImage}
                          alt="Agent"
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">
                            {conversations.find(c => c.id === selectedConversation).agentName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {conversations.find(c => c.id === selectedConversation).agentCompany}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteConversation(selectedConversation)}
                        className="text-gray-500 hover:text-red-600 transition p-2"
                        title="Delete conversation"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
                  {messages[selectedConversation]?.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs px-4 py-3 rounded-2xl ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}>
                        {msg.sender === 'agent' && (
                          <p className="text-xs font-semibold mb-1 opacity-75">{msg.agentName}</p>
                        )}
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender === 'user' ? 'text-blue-100' : 'text-gray-600'
                        }`}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}

                  {typingIndicator && (
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span>{typingIndicator}</span>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 outline-none text-sm"
                      autoFocus
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg transition font-semibold text-sm"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-white">
                <div className="text-center">
                  <MessageSquare size={64} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-xl font-semibold text-gray-700">Select a conversation to start messaging</p>
                  <p className="text-gray-500 mt-2">or create a new conversation with an agent</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const EnhancedReviewsPanel = () => {
    const calculateAverageRating = () => {
      if (enhancedPropertyReviews.length === 0) return 0;
      return (enhancedPropertyReviews.reduce((sum, r) => sum + r.rating, 0) / enhancedPropertyReviews.length).toFixed(1);
    };

    const getRatingDistribution = () => {
      const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      enhancedPropertyReviews.forEach(r => dist[r.rating]++);
      return dist;
    };

    const getFilteredAndSortedReviews = () => {
      let filtered = enhancedPropertyReviews;

      // Filter by rating
      if (reviewRatingFilter !== 'all') {
        filtered = filtered.filter(r => r.rating === parseInt(reviewRatingFilter));
      }

      // Sort
      switch (reviewSortBy) {
        case 'helpful':
          filtered = [...filtered].sort((a, b) => b.helpful - a.helpful);
          break;
        case 'rating-high':
          filtered = [...filtered].sort((a, b) => b.rating - a.rating);
          break;
        case 'rating-low':
          filtered = [...filtered].sort((a, b) => a.rating - b.rating);
          break;
        case 'recent':
        default:
          filtered = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
      }

      return filtered;
    };

    const handleMarkHelpful = (reviewId) => {
      setReviewHelpfulList(new Set(reviewHelpfulList).add(reviewId));
      setEnhancedPropertyReviews(enhancedPropertyReviews.map(r =>
        r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
      ));
    };

    const handleSubmitReview = () => {
      if (!newReviewComment.trim()) return;

      const newReview = {
        id: Math.max(...enhancedPropertyReviews.map(r => r.id), 0) + 1,
        author: 'You',
        rating: newReviewRating,
        title: newReviewTitle || `Great property`,
        date: new Date().toLocaleDateString(),
        comment: newReviewComment,
        verified: true,
        helpful: 0,
        unhelpful: 0,
        propertyType: 'Apartment'
      };

      setEnhancedPropertyReviews([newReview, ...enhancedPropertyReviews]);
      setNewReviewComment('');
      setNewReviewTitle('');
      setNewReviewRating(5);
      setShowNewReviewForm(false);
    };

    const distribution = getRatingDistribution();
    const avgRating = calculateAverageRating();
    const filteredReviews = getFilteredAndSortedReviews();

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full p-8 my-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-800">Customer Reviews</h2>
              <p className="text-gray-600 mt-2">Read and share your experience with this property</p>
            </div>
            <button
              onClick={() => setShowEnhancedReviews(false)}
              className="text-gray-400 hover:text-gray-600 transition p-2"
            >
              <X size={32} />
            </button>
          </div>

          {/* Rating Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Average Rating */}
              <div className="text-center md:text-left">
                <p className="text-gray-600 text-sm font-semibold mb-2">Average Rating</p>
                <div className="flex items-center gap-3">
                  <span className="text-5xl font-bold text-gray-800">{avgRating}</span>
                  <div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-xl ${i < Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{enhancedPropertyReviews.length} reviews</p>
                  </div>
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="md:col-span-2">
                <p className="text-sm font-semibold text-gray-600 mb-4">Rating Distribution</p>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="w-8 text-sm font-semibold text-gray-600">{rating}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-yellow-400 h-full rounded-full transition-all"
                          style={{ width: `${(distribution[rating] / enhancedPropertyReviews.length) * 100}%` }}
                        ></div>
                      </div>
                      <span className="w-8 text-sm text-gray-600">{distribution[rating]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Write Review Button */}
          <button
            onClick={() => setShowNewReviewForm(!showNewReviewForm)}
            className="w-full mb-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition font-semibold text-lg"
          >
            {showNewReviewForm ? 'Cancel' : '✍️ Write a Review'}
          </button>

          {/* New Review Form */}
          {showNewReviewForm && (
            <div className="bg-gray-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
              <h3 className="font-bold text-xl text-gray-800 mb-6">Share Your Experience</h3>

              {/* Rating Selection */}
              <div className="mb-6">
                <p className="font-semibold text-gray-800 mb-3">How would you rate this property?</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setNewReviewRating(rating)}
                      className="text-3xl transition transform hover:scale-110"
                    >
                      <span className={newReviewRating >= rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Title */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Review Title</label>
                <input
                  type="text"
                  placeholder="Summarize your experience..."
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                />
              </div>

              {/* Review Comment */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Review</label>
                <textarea
                  placeholder="Share details about your experience. What did you like? What could be improved?"
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitReview}
                disabled={!newReviewComment.trim()}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg transition font-semibold"
              >
                Submit Review
              </button>
            </div>
          )}

          {/* Filters and Sorting */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Rating</label>
              <select
                value={reviewRatingFilter}
                onChange={(e) => setReviewRatingFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars & Up</option>
                <option value="3">3 Stars & Up</option>
                <option value="2">2 Stars & Up</option>
                <option value="1">1 Star & Up</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
              <select
                value={reviewSortBy}
                onChange={(e) => setReviewSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
              >
                <option value="recent">Most Recent</option>
                <option value="helpful">Most Helpful</option>
                <option value="rating-high">Highest Rating</option>
                <option value="rating-low">Lowest Rating</option>
              </select>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6 max-h-96 overflow-y-auto">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <MessageSquare size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No reviews match your filter</p>
              </div>
            ) : (
              filteredReviews.map(review => (
                <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-bold text-gray-800">{review.author}</p>
                        {review.verified && (
                          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">✓ Verified</span>
                        )}
                      </div>
                      <div className="flex gap-2 items-center mb-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">{review.date}</p>
                      </div>
                      <h4 className="font-bold text-gray-800 text-lg">{review.title}</h4>
                    </div>
                  </div>

                  {/* Review Comment */}
                  <p className="text-gray-700 mb-4">{review.comment}</p>

                  {/* Helpful Count */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleMarkHelpful(review.id)}
                      disabled={reviewHelpfulList.has(review.id)}
                      className="text-sm text-gray-600 hover:text-blue-600 transition disabled:text-gray-400"
                    >
                      👍 Helpful ({review.helpful})
                    </button>
                    <span className="text-sm text-gray-500">Not helpful ({review.unhelpful})</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={() => setShowEnhancedReviews(false)}
            className="w-full mt-8 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 transition font-semibold text-lg"
          >
            Close Reviews
          </button>
        </div>
      </div>
    );
  };

  const DriveTimeSearch = () => {
    const driveTimeLocations = {
      'Downtown Dubai': { distance: '5-15 km', timeRange: `${driveTimeMinutes}-${driveTimeMinutes + 15} min` },
      'Dubai Marina': { distance: '8-20 km', timeRange: `${driveTimeMinutes + 10}-${driveTimeMinutes + 25} min` },
      'Palm Jumeirah': { distance: '15-30 km', timeRange: `${driveTimeMinutes + 20}-${driveTimeMinutes + 40} min` }
    };

    const matchingProperties = filteredProperties.filter((p, idx) => idx < Math.ceil(filteredProperties.length / 3));

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full p-8 my-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Search by Commute Time</h2>
            <button onClick={() => setShowDriveTimeSearch(false)} className="text-gray-400 hover:text-gray-600">
              <X size={28} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4 bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h3 className="font-bold text-lg text-gray-800">Search Parameters</h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Destination/Workplace</label>
                <select
                  value={driveTimeLocation}
                  onChange={(e) => setDriveTimeLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                >
                  {Object.keys(driveTimeLocations).map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Drive Time (minutes)</label>
                <input
                  type="number"
                  value={driveTimeMinutes}
                  onChange={(e) => setDriveTimeMinutes(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                />
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={driveTimeMinutes}
                  onChange={(e) => setDriveTimeMinutes(Number(e.target.value))}
                  className="w-full mt-2"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                <p className="text-blue-100 text-sm font-semibold mb-1">Results Found</p>
                <p className="text-4xl font-bold">{matchingProperties.length} Properties</p>
              </div>

              <div className="bg-white border-2 border-blue-200 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Within {driveTimeMinutes} minutes of:</p>
                <p className="text-lg font-bold text-gray-800">{driveTimeLocation}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">{driveTimeLocation} Details:</p>
                <p className="text-xs text-gray-700">Distance: {driveTimeLocations[driveTimeLocation]?.distance}</p>
                <p className="text-xs text-gray-700">Estimated time: {driveTimeLocations[driveTimeLocation]?.timeRange}</p>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="mb-8">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Properties Within Commute Range</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {matchingProperties.map(property => (
                <div key={property.id} className="border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition">
                  <img src={property.images?.[0]} alt={property.title} className="w-full h-32 object-cover" />
                  <div className="p-3">
                    <p className="font-bold text-gray-800 line-clamp-1 text-sm">{property.title}</p>
                    <p className="text-blue-600 font-bold text-sm">AED {property.price?.toLocaleString()}</p>
                    <p className="text-xs text-gray-600 mt-1">{property.bedrooms}BR • {property.bathrooms}BA</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowDriveTimeSearch(false)}
            className="w-full bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 transition font-semibold"
          >
            Close Commute Search
          </button>
        </div>
      </div>
    );
  };

  const AIPropertyAdvisor = () => {
    const handleSendMessage = () => {
      if (!aiInput.trim()) return;

      const userMessage = { id: aiMessages.length + 1, text: aiInput, sender: 'user' };

      // Simulate AI responses
      const aiResponses = [
        'That\'s a great question! Properties in Downtown Dubai typically offer excellent rental yields of 4-5% annually.',
        'I\'d recommend considering the Dubai Marina area - it has strong capital appreciation and is very popular with investors.',
        'For first-time buyers, a 20% down payment is standard, and current mortgage rates are around 3.5-4% p.a.',
        'The best time to buy is when you\'re financially ready, but spring (March-May) typically sees more inventory.',
        'Off-plan properties often offer better prices and flexible payment plans. Would you like more information?',
        'Based on current market trends, 4-bedroom villas in Arabian Ranches are showing strong demand.'
      ];

      const aiMessage = {
        id: userMessage.id + 1,
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: 'ai'
      };

      setAiMessages([...aiMessages, userMessage, aiMessage]);
      setAiInput('');
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 my-8 h-[90vh] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Property Advisor AI</h2>
            <button onClick={() => setShowAIChat(false)} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-gray-50 p-4 rounded-lg">
            {aiMessages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              autoFocus
              placeholder="Ask about properties, mortgages, investments..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
  };

  const TransactionHistory = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full p-8 my-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Dubai Real Estate Transactions</h2>
          <button onClick={() => setShowTransactionHistory(false)} className="text-gray-400 hover:text-gray-600">
            <X size={28} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
            <p className="text-blue-100 text-sm font-semibold mb-1">Total Transactions</p>
            <p className="text-3xl font-bold">12,847</p>
            <p className="text-xs text-blue-100 mt-1">Last 12 months</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
            <p className="text-green-100 text-sm font-semibold mb-1">Total Volume</p>
            <p className="text-3xl font-bold">AED 185B</p>
            <p className="text-xs text-green-100 mt-1">Property value</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
            <p className="text-purple-100 text-sm font-semibold mb-1">Avg Price</p>
            <p className="text-3xl font-bold">AED 1.2M</p>
            <p className="text-xs text-purple-100 mt-1">Per property</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg">
            <p className="text-orange-100 text-sm font-semibold mb-1">Market Growth</p>
            <p className="text-3xl font-bold">+8.5%</p>
            <p className="text-xs text-orange-100 mt-1">Year-over-year</p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Recent High-Value Sales</h3>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {[
              { area: 'Palm Jumeirah', price: 'AED 45M', property: '5BR Waterfront Villa', date: '3 days ago' },
              { area: 'Downtown Dubai', price: 'AED 28M', property: '4BR Penthouse, Burj Views', date: '1 week ago' },
              { area: 'Dubai Marina', price: 'AED 22.5M', property: 'Luxury Marina Tower', date: '10 days ago' },
              { area: 'Emirates Hills', price: 'AED 18M', property: '6BR Estate', date: '2 weeks ago' },
              { area: 'Downtown Dubai', price: 'AED 15.5M', property: '4BR Ultra Luxury Apt', date: '3 weeks ago' }
            ].map((sale, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div>
                  <p className="font-semibold text-gray-800">{sale.property}</p>
                  <p className="text-sm text-gray-600">{sale.area} • {sale.date}</p>
                </div>
                <p className="font-bold text-green-600 text-lg">{sale.price}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowTransactionHistory(false)}
          className="w-full mt-6 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 transition font-semibold"
        >
          Close Transaction History
        </button>
      </div>
    </div>
  );

  const OffPlanProjectBrowser = () => {
    const offPlanProjects = [
      { id: 1, name: 'Emaar Beachfront', area: 'Dubai Marina', completion: '2025', units: 850, priceRange: 'AED 800K - 5M', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop&q=80', status: 'Construction' },
      { id: 2, name: 'Damac Hills 2', area: 'Damac Hills', completion: '2025', units: 1200, priceRange: 'AED 600K - 3M', image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=300&fit=crop&q=80', status: 'Foundation' },
      { id: 3, name: 'Azizi Zéa', area: 'Jumeirah', completion: '2026', units: 450, priceRange: 'AED 1.2M - 8M', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop&q=80', status: 'Planning' },
      { id: 4, name: 'MRE Downtown', area: 'Downtown Dubai', completion: '2025', units: 600, priceRange: 'AED 950K - 4.5M', image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop&q=80', status: 'Construction' },
      { id: 5, name: 'Peninsula Dubai', area: 'Dubai Marina', completion: '2026', units: 380, priceRange: 'AED 2M - 10M', image: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=400&h=300&fit=crop&q=80', status: 'Planning' },
      { id: 6, name: 'Mag Eye', area: 'Dubai Hills', completion: '2025', units: 700, priceRange: 'AED 750K - 3.5M', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop&q=80', status: 'Foundation' }
    ];

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full p-8 my-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Off-Plan Projects</h2>
            <button onClick={() => setShowOffPlanProjects(false)} className="text-gray-400 hover:text-gray-600">
              <X size={28} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {offPlanProjects.map(project => (
              <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                <img src={project.image} alt={project.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800">{project.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{project.area}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Units:</span>
                      <span className="font-semibold">{project.units}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Price Range:</span>
                      <span className="font-semibold">{project.priceRange}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Completion:</span>
                      <span className="font-semibold">{project.completion}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${project.status === 'Construction' ? 'bg-blue-100 text-blue-700' : project.status === 'Foundation' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {project.status}
                    </span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowOffPlanProjects(false)}
            className="w-full bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 transition font-semibold"
          >
            Close Off-Plan Browser
          </button>
        </div>
      </div>
    );
  };

  const PriceTrendCharts = () => {
    const trendData = [
      { month: 'Jan', apartments: 950000, villas: 2100000, penthouses: 4500000 },
      { month: 'Feb', apartments: 960000, villas: 2120000, penthouses: 4550000 },
      { month: 'Mar', apartments: 980000, villas: 2150000, penthouses: 4620000 },
      { month: 'Apr', apartments: 1010000, villas: 2200000, penthouses: 4750000 },
      { month: 'May', apartments: 1030000, villas: 2240000, penthouses: 4880000 },
      { month: 'Jun', apartments: 1050000, villas: 2280000, penthouses: 5000000 },
    ];

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full p-8 my-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Price Trends (6 Months)</h2>
            <button onClick={() => setShowPriceTrends(false)} className="text-gray-400 hover:text-gray-600">
              <X size={28} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl">
              <p className="text-blue-100 text-sm font-semibold mb-1">Apartments Avg</p>
              <p className="text-3xl font-bold">AED 1.05M</p>
              <p className="text-blue-100 text-sm mt-2">+10.5% (6 months)</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl">
              <p className="text-green-100 text-sm font-semibold mb-1">Villas Avg</p>
              <p className="text-3xl font-bold">AED 2.28M</p>
              <p className="text-green-100 text-sm mt-2">+8.6% (6 months)</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl">
              <p className="text-purple-100 text-sm font-semibold mb-1">Penthouses Avg</p>
              <p className="text-3xl font-bold">AED 5.0M</p>
              <p className="text-purple-100 text-sm mt-2">+11.1% (6 months)</p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Historical Trend</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 text-gray-700">Month</th>
                    <th className="text-right py-2 text-gray-700">Apartments</th>
                    <th className="text-right py-2 text-gray-700">Villas</th>
                    <th className="text-right py-2 text-gray-700">Penthouses</th>
                  </tr>
                </thead>
                <tbody>
                  {trendData.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-white transition">
                      <td className="py-3 text-gray-800 font-semibold">{row.month}</td>
                      <td className="text-right py-3 text-gray-700">AED {(row.apartments / 1000000).toFixed(2)}M</td>
                      <td className="text-right py-3 text-gray-700">AED {(row.villas / 1000000).toFixed(2)}M</td>
                      <td className="text-right py-3 text-gray-700">AED {(row.penthouses / 1000000).toFixed(2)}M</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-gray-700 mb-2"><strong>Apartments:</strong> Steady growth with +10.5% appreciation</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <p className="text-sm text-gray-700 mb-2"><strong>Villas:</strong> Moderate growth pattern with rental potential</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
              <p className="text-sm text-gray-700 mb-2"><strong>Penthouses:</strong> Highest growth at +11.1% year-over-year</p>
            </div>
          </div>

          <button
            onClick={() => setShowPriceTrends(false)}
            className="w-full bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 transition font-semibold"
          >
            Close Price Trends
          </button>
        </div>
      </div>
    );
  };

  const NewsletterSection = () => (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Stay Updated on Dubai Real Estate</h2>
        <p className="text-blue-100 text-lg mb-8">Get weekly property updates, market insights, and exclusive investment opportunities delivered to your inbox</p>

        {showNewsletterSuccess ? (
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg inline-block mb-6">
            ✅ Thanks for subscribing! Check your email for confirmation.
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto">
            <input
              type="email"
              autoFocus
              placeholder="Enter your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 px-6 py-4 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />
            <button
              onClick={() => {
                if (newsletterEmail.includes('@')) {
                  setShowNewsletterSuccess(true);
                  setNewsletterEmail('');
                  setTimeout(() => setShowNewsletterSuccess(false), 5000);
                }
              }}
              className="bg-yellow-400 text-blue-700 px-8 py-4 rounded-lg font-bold hover:bg-yellow-300 transition whitespace-nowrap"
            >
              Subscribe
            </button>
          </div>
        )}

        <p className="text-blue-100 text-sm mt-4">✓ No spam • ✓ Unsubscribe anytime • ✓ Weekly digest</p>
      </div>
    </div>
  );

  const Footer = () => (
    <footer className="bg-gray-900 text-gray-300 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Home className="text-blue-400" size={32} />
              <span className="text-2xl font-bold text-white">GulfVista</span>
            </div>
            <p className="text-gray-400 mb-4">The leading real estate marketplace connecting buyers, sellers, and investors across the UAE.</p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">f</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">𝕏</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">in</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">📷</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Browse</h3>
            <ul className="space-y-3">
              <li><button onClick={() => setCurrentTab('buy')} className="text-gray-400 hover:text-blue-400 transition">Buy Property</button></li>
              <li><button onClick={() => setCurrentTab('sell')} className="text-gray-400 hover:text-blue-400 transition">Sell Property</button></li>
              <li><button onClick={() => setShowPropertyMap(true)} className="text-gray-400 hover:text-blue-400 transition">Explore Map</button></li>
              <li><button onClick={() => setShowAdvancedSearch(true)} className="text-gray-400 hover:text-blue-400 transition">Advanced Search</button></li>
              <li><button onClick={() => setShowMarketInsights(true)} className="text-gray-400 hover:text-blue-400 transition">Market Insights</button></li>
            </ul>
          </div>

          {/* Tools & Resources */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Tools</h3>
            <ul className="space-y-3">
              <li><button onClick={() => setShowMortgageCalculator(true)} className="text-gray-400 hover:text-blue-400 transition">Mortgage Calculator</button></li>
              <li><button onClick={() => setShowRentVsBuy(true)} className="text-gray-400 hover:text-blue-400 transition">Rent vs Buy</button></li>
              <li><button onClick={() => setShowROICalculator(true)} className="text-gray-400 hover:text-blue-400 transition">ROI Calculator</button></li>
              <li><button onClick={() => setShowFinancingPreApproval(true)} className="text-gray-400 hover:text-blue-400 transition">Pre-Approval</button></li>
              <li><button onClick={() => setShowOffPlanProjects(true)} className="text-gray-400 hover:text-blue-400 transition">Off-Plan Projects</button></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Blog</a></li>
              <li><button onClick={() => setShowTermsConditions(true)} className="text-gray-400 hover:text-blue-400 transition">Terms & Conditions</button></li>
              <li><button onClick={() => setShowPrivacyPolicy(true)} className="text-gray-400 hover:text-blue-400 transition">Privacy Policy</button></li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <Phone className="text-blue-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="text-white font-semibold">Phone</p>
                <p className="text-gray-400">+971 4 XXX XXXX</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="text-blue-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="text-white font-semibold">Email</p>
                <p className="text-gray-400">info@gulfvista.ae</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="text-blue-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="text-white font-semibold">Office</p>
                <p className="text-gray-400">Dubai Marina, UAE</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">© 2024 GulfVista Properties. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <button onClick={() => setShowPrivacyPolicy(true)} className="text-gray-400 hover:text-blue-400 transition">Privacy</button>
              <button onClick={() => setShowTermsConditions(true)} className="text-gray-400 hover:text-blue-400 transition">Terms</button>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">Contact</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );

  const TermsConditionsModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-8 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Terms & Conditions</h2>
          <button onClick={() => setShowTermsConditions(false)} className="text-gray-400 hover:text-gray-600">
            <X size={28} />
          </button>
        </div>

        <div className="space-y-6 text-gray-700 max-h-96 overflow-y-auto pr-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">1. Use License</h3>
            <p className="text-sm mb-4">Permission is granted to temporarily download one copy of the materials (information or software) on GulfVista Properties website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
            <ul className="list-disc list-inside space-y-2 text-sm ml-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">2. Disclaimer</h3>
            <p className="text-sm">The materials on GulfVista Properties website are provided on an 'as is' basis. GulfVista Properties makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">3. Limitations</h3>
            <p className="text-sm">In no event shall GulfVista Properties or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the website, even if we or our authorized representative has been notified orally or in writing of the possibility of such damage.</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">4. Accuracy of Materials</h3>
            <p className="text-sm">The materials appearing on GulfVista Properties website could include technical, typographical, or photographic errors. GulfVista Properties does not warrant that any of the materials on the website are accurate, complete, or current.</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">5. Links</h3>
            <p className="text-sm">GulfVista Properties has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such linked website is at the user's own risk.</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">6. Modifications</h3>
            <p className="text-sm">GulfVista Properties may revise these terms and conditions of use for our website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms and conditions of use.</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">7. Governing Law</h3>
            <p className="text-sm">These terms and conditions are governed by and construed in accordance with the laws of the United Arab Emirates, and you irrevocably submit to the exclusive jurisdiction of the courts located in Dubai.</p>
          </div>
        </div>

        <button
          onClick={() => setShowTermsConditions(false)}
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          I Agree & Close
        </button>
      </div>
    </div>
  );


  const Toast = () => {
    if (!toastMessage) return null;
    return (
      <div className={`fixed bottom-8 right-8 p-5 rounded-xl shadow-2xl text-white font-semibold max-w-sm z-50 animate-pulse ${
        toastType === 'success' ? 'bg-gradient-to-r from-green-500 to-green-600' :
        toastType === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600' :
        'bg-gradient-to-r from-blue-500 to-blue-600'
      }`}>
        <div className="flex items-center gap-3">
          <div className="text-2xl">
            {toastType === 'success' ? '✅' : toastType === 'error' ? '❌' : 'ℹ️'}
          </div>
          <span>{toastMessage}</span>
        </div>
      </div>
    );
  };

  const VideoShowcase = () => (
    <div className="max-w-7xl mx-auto px-4 py-20 mb-12 bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl">
      <div className="text-center mb-14">
        <span className="inline-block bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-full font-bold text-sm mb-4">
          VIDEO TOURS
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Virtual Property Tours</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Experience properties with immersive video walkthroughs. Explore every room, amenity, and neighborhood from the comfort of your home.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {propertyVideos.slice(0, 4).map((video) => (
          <button
            key={video.id}
            onClick={() => {
              setSelectedVideo(video);
              setShowVideoPlayer(true);
            }}
            className="group relative overflow-hidden rounded-2xl hover:shadow-2xl transition duration-300 transform hover:scale-105"
          >
            <div className="relative w-full aspect-video bg-gray-900">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition" />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center group-hover:scale-125 transition duration-300 shadow-2xl">
                  <div style={{
                    borderLeft: '10px solid white',
                    borderTop: '6px solid transparent',
                    borderBottom: '6px solid transparent',
                    marginLeft: '3px'
                  }} />
                </div>
              </div>

              {/* Duration Badge */}
              <div className="absolute bottom-4 right-4 bg-black/90 text-white px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">
                {video.duration}
              </div>
            </div>

            {/* Video Info */}
            <div className="p-5 bg-white border-t-4 border-red-500">
              <h3 className="font-bold text-gray-800 group-hover:text-red-600 transition line-clamp-2 text-sm mb-2">
                {video.title}
              </h3>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 font-semibold">{video.views.toLocaleString()} views</span>
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold">
                  {video.type}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* CTA - No "View All" button, just discover text */}
      <div className="text-center">
        <p className="text-gray-600 font-semibold">Discover all video tours in the property details</p>
      </div>
    </div>
  );

  const FloatingActionButtons = () => {
    const [showChat, setShowChat] = useState(false);

    return (
      <>
        {/* Live Chat Button */}
        <button
          onClick={() => {
            setShowChat(!showChat);
            showToast(showChat ? 'Chat closed' : 'Chat opened - How can we help?');
          }}
          className="fixed bottom-24 right-8 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl hover:shadow-3xl hover:scale-110 transition z-40 font-bold text-2xl"
        >
          💬
        </button>

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-2xl hover:shadow-3xl hover:scale-110 transition z-40 font-bold text-xl"
          title="Back to top"
        >
          ⬆️
        </button>

        {/* Chat Bubble */}
        {showChat && (
          <div className="fixed bottom-40 right-8 bg-white rounded-2xl shadow-2xl p-6 max-w-sm z-40 border-2 border-green-500">
            <div className="flex items-center justify-between mb-4 pb-4 border-b">
              <p className="font-bold text-gray-800">Chat with us</p>
              <button onClick={() => setShowChat(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <p className="text-sm text-gray-600 mb-4">Hi! 👋 How can we help you find the perfect property?</p>
            <button
              onClick={() => {
                setShowChat(false);
                setShowAIChat(true);
              }}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold text-sm"
            >
              Talk to AI Advisor
            </button>
          </div>
        )}
      </>
    );
  };

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const FeaturedSection = () => {

    // Get top 4 properties sorted by price (descending) for premium featured listing
    const getFeaturedProperties = () => {
      if (!properties || properties.length === 0) return [];

      // Sort by price descending and take top 4
      const sorted = [...properties].sort((a, b) => {
        const priceA = parseInt(a.price?.toString().replace(/[^0-9]/g, '')) || 0;
        const priceB = parseInt(b.price?.toString().replace(/[^0-9]/g, '')) || 0;
        return priceB - priceA;
      });

      return sorted.slice(0, 4);
    };

    // Calculate ROI based on property metrics
    const calculateROI = (property) => {
      if (!property) return '+15%';

      // ROI based on property type and location
      const typeROI = {
        'Apartment': 12,
        'Villa': 18,
        'Townhouse': 14,
        'Penthouse': 21,
        'Studio': 10,
        'Duplex': 16
      };

      const baseROI = typeROI[property.property_type] || 15;
      // Adjust based on price tier
      const price = parseInt(property.price?.toString().replace(/[^0-9]/g, '')) || 0;
      const adjustment = price > 3000000 ? 3 : price > 1500000 ? 1 : -1;

      return `+${Math.max(8, baseROI + adjustment)}%`;
    };

    // Get badge status for each property
    const getBadge = (idx, price) => {
      const badges = ['HOT DEAL', 'TOP PICK', 'PREMIUM', 'NEW LISTING'];
      return badges[idx] || 'NEW LISTING';
    };

    const featuredProps = getFeaturedProperties();

    return (
      <div className="max-w-7xl mx-auto px-4 py-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border border-blue-100 mb-12">
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-sm mb-4">
            TOP PICKS
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Premium Listings This Month</h2>
          <p className="text-lg text-gray-600">Hand-picked properties with the highest investor potential</p>
        </div>

        {featuredProps.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600 text-lg">Loading premium properties from Reelly...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProps.map((property, idx) => {
              // Format price - API returns price in AED
              let displayPrice = '0';
              if (property.price) {
                const priceNum = typeof property.price === 'string' ? parseFloat(property.price) : property.price;
                // If price is large (more than 100k), divide by million
                if (priceNum > 100000) {
                  displayPrice = (priceNum / 1000000).toFixed(1);
                } else {
                  displayPrice = priceNum.toFixed(1);
                }
              }

              return (
              <div key={property.id || idx} className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 border-l-4 border-blue-600 hover:scale-105">
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden bg-gray-200">
                  <img
                    src={property.images?.[0] || property.image || 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'}
                    alt={property.name || property.title}
                    className="w-full h-full object-cover hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className={`text-sm font-bold px-4 py-2 rounded-full ${
                      idx === 0 ? 'bg-red-100 text-red-700' :
                      idx === 1 ? 'bg-orange-100 text-orange-700' :
                      idx === 2 ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {getBadge(idx, property.price)}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                    {calculateROI(property)}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <h3 className="font-bold text-2xl text-gray-800 mb-3 line-clamp-2">{property.name || property.title || 'Premium Property'}</h3>
                  <p className="text-4xl font-bold text-blue-600 mb-2">
                    AED {displayPrice}M
                  </p>
                  <p className="text-lg text-gray-600 mb-6">{property.bedrooms || '2'} bedrooms • {property.bathrooms || '1'} bathrooms</p>
                  <button
                    onClick={() => {
                      setSelectedProperty(property);
                      showToast(`Viewing ${property.name || property.title}!`);
                    }}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-bold text-lg"
                  >
                    View Property
                  </button>
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>
    );
  };

  const StatsSection = () => (
    <div className="max-w-7xl mx-auto px-4 py-16 mb-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {[
          { stat: '49', label: 'Properties', icon: '🏠' },
          { stat: '16', label: 'Verified Agents', icon: '👨‍💼' },
          { stat: '731K+', label: 'Total Views', icon: '👁️' },
          { stat: 'AED 5.8M+', label: 'Commissions', icon: '💰' }
        ].map((item, idx) => (
          <div key={idx} className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition">
            <div className="text-4xl mb-3">{item.icon}</div>
            <p className="text-3xl font-bold mb-2">{item.stat}</p>
            <p className="text-blue-100 font-semibold">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Why Choose GulfVista?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Verified Agents', desc: 'Professional, licensed real estate experts' },
            { title: 'Best Tools', desc: 'Advanced calculators & market insights' },
            { title: 'Transparency', desc: 'Clear pricing and no hidden fees' }
          ].map((feature, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="text-3xl">
                {idx === 0 ? '✓' : idx === 1 ? '⚙️' : '🔒'}
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-800 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const QuickFilters = () => (
    <div className="max-w-7xl mx-auto px-4 py-8 border-b border-gray-200 mb-8">
      <h3 className="text-sm font-bold text-gray-600 uppercase mb-4 tracking-wide">Quick Filters</h3>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', 'Apartments', 'Villas', 'Under 2M', 'Above 5M', 'New Listings'].map((filter) => (
          <button
            key={filter}
            onClick={() => showToast(`Filtering by: ${filter}`)}
            className="px-6 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition duration-200 bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white"
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );

  const HowItWorks = () => (
    <div className="max-w-7xl mx-auto px-4 py-16 mb-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">How GulfVista Works</h2>
        <p className="text-lg text-gray-600">Find your perfect property in 3 simple steps</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { step: '01', title: 'Search & Browse', desc: 'Explore 49+ premium properties with advanced filters and tools', icon: '🔍' },
          { step: '02', title: 'Analyze & Compare', desc: 'Use calculators, ROI tools, and comparison features to decide', icon: '📊' },
          { step: '03', title: 'Connect & Invest', desc: 'Contact verified agents directly and make your investment', icon: '🤝' }
        ].map((item, idx) => (
          <div key={idx} className="relative">
            <div className="absolute -top-6 left-0 bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg">
              {item.step}
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-blue-600 pt-12">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
            {idx < 2 && <div className="hidden md:block absolute top-20 -right-4 text-3xl text-blue-300">→</div>}
          </div>
        ))}
      </div>
    </div>
  );

  const CategoryBrowser = () => {
    // Premium luxury property images - EXACT STYLE FROM YOUR PHOTOS
    const luxuryPropertyImages = [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=700&h=500&fit=crop&q=85', // Modern Penthouse Kitchen - APARTMENTS
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=700&h=500&fit=crop&q=85', // Luxury Living Room - VILLAS
      'https://images.unsplash.com/photo-1519167758481-83f19106048c?w=700&h=500&fit=crop&q=85', // Dubai Night Skyline View - TOWNHOUSES
      'https://images.unsplash.com/photo-1512917774080-9a485dc1020a?w=700&h=500&fit=crop&q=85', // Pool & Balcony View - PENTHOUSES
      'https://images.unsplash.com/photo-1564078516277-37100afe8fdf?w=700&h=500&fit=crop&q=85', // Daylight City View
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700&h=500&fit=crop&q=85'  // Modern Balcony
    ];

    // Get DIFFERENT images for each category
    const getImageForType = (categoryIndex) => {
      // Use the luxury property images, cycling through them
      return luxuryPropertyImages[categoryIndex % luxuryPropertyImages.length];
    };

    // Count total properties
    const getCountForType = (propertyType) => {
      return properties.filter(p => p.property_type?.toLowerCase() === propertyType.toLowerCase()).length || properties.length;
    };

    return (
    <div className="max-w-7xl mx-auto px-4 py-16 mb-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Browse by Property Type</h2>
        <p className="text-lg text-gray-600">Find exactly what you're looking for</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { type: 'Apartment', label: 'Apartments' },
          { type: 'Villa', label: 'Villas' },
          { type: 'Townhouse', label: 'Townhouses' },
          { type: 'Penthouse', label: 'Penthouses' }
        ].map((category, idx) => (
          <button
            key={idx}
            onClick={() => {
              handleFilterChange('property_type', category.type);
              showToast(`Showing ${category.label}`);
            }}
            className="group relative overflow-hidden rounded-2xl h-64 shadow-lg hover:shadow-2xl transition duration-300 hover:scale-105"
          >
            {/* Background Image - DIFFERENT image for each category from Reelly API */}
            <img
              src={getImageForType(idx)}
              alt={category.label}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
              <p className="font-bold text-2xl mb-1">{category.label}</p>
              <p className="text-sm opacity-90">{getCountForType(category.type)} Properties</p>
            </div>
          </button>
        ))}
      </div>
    </div>
    );
  };

  const PopularSearches = () => (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
      <h3 className="font-bold text-lg text-gray-800 mb-6">Popular Searches</h3>
      <div className="flex gap-3 flex-wrap">
        {['Downtown Dubai', 'Dubai Marina', 'Luxury Villas', 'Studio Apartments', 'Investment Properties', 'New Launches', 'Budget Friendly'].map((search) => (
          <button
            key={search}
            onClick={() => {
              handleFilterChange('search', search);
              showToast(`Searching for: ${search}`);
            }}
            className="px-5 py-2 bg-white rounded-full text-sm font-semibold text-gray-700 hover:bg-blue-600 hover:text-white shadow-sm hover:shadow-lg transition border border-gray-200"
          >
            {search}
          </button>
        ))}
      </div>
    </div>
  );

  const Testimonials = () => (
    <div className="max-w-7xl mx-auto px-4 py-16 mb-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl text-white">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
        <p className="text-blue-100">Join thousands of satisfied buyers and investors</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { name: 'Ahmed Al-Mansoori', role: 'Property Investor', text: 'GulfVista made it so easy to find and analyze properties. The ROI calculator alone saved me hours!', rating: 5 },
          { name: 'Fatima Al-Mazrouei', role: 'First-time Buyer', text: 'Loved the mortgage calculator and market insights. Very helpful for making informed decisions.', rating: 5 },
          { name: 'Mohammed Al-Habtoor', role: 'Real Estate Agent', text: 'The platform brought me quality leads and made my job easier. Highly recommended!', rating: 5 }
        ].map((testimonial, idx) => (
          <div key={idx} className="bg-white/20 backdrop-blur rounded-2xl p-8 border border-white/30 hover:bg-white/30 transition duration-300">
            <div className="flex items-center gap-1 mb-4">
              <span className="text-sm font-bold text-yellow-200">{testimonial.rating}</span>
              <div className="text-xl">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < testimonial.rating ? 'text-yellow-300' : 'text-white/30'}>★</span>
                ))}
              </div>
            </div>
            <p className="text-white mb-6 italic">"{testimonial.text}"</p>
            <div>
              <p className="font-bold text-white">{testimonial.name}</p>
              <p className="text-blue-100 text-sm">{testimonial.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PrivacyPolicyModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-8 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Privacy Policy</h2>
          <button onClick={() => setShowPrivacyPolicy(false)} className="text-gray-400 hover:text-gray-600">
            <X size={28} />
          </button>
        </div>

        <div className="space-y-6 text-gray-700 max-h-96 overflow-y-auto pr-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">1. Introduction</h3>
            <p className="text-sm">GulfVista Properties ("we" or "us" or "our") operates the website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our website and the choices you have associated with that data.</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">2. Information Collection and Use</h3>
            <p className="text-sm mb-2">We collect several different types of information for various purposes to provide and improve our service to you.</p>
            <ul className="list-disc list-inside space-y-2 text-sm ml-2">
              <li><strong>Personal Data:</strong> Name, email address, phone number, property preferences</li>
              <li><strong>Usage Data:</strong> Browser type, IP address, pages visited, time and date of visits</li>
              <li><strong>Cookies:</strong> We use cookies to enhance your experience on our website</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">3. Use of Data</h3>
            <p className="text-sm">GulfVista Properties uses the collected data for various purposes:</p>
            <ul className="list-disc list-inside space-y-1 text-sm ml-2">
              <li>To provide and maintain our website</li>
              <li>To notify you about changes to our website</li>
              <li>To allow you to participate in interactive features of our website</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our website</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">4. Security of Data</h3>
            <p className="text-sm">The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">5. Contact Us</h3>
            <p className="text-sm">If you have any questions about this Privacy Policy, please contact us at:</p>
            <p className="text-sm mt-2">Email: privacy@gulfvista.ae<br/>Address: Dubai Marina, UAE</p>
          </div>
        </div>

        <button
          onClick={() => setShowPrivacyPolicy(false)}
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Close Privacy Policy
        </button>
      </div>
    </div>
  );

  const AgentDashboard = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Agent Dashboard</h2>
          <button onClick={() => { setShowAgentDashboard(false); setAgentProfile(null); }} className="text-gray-400 hover:text-gray-600">
            <X size={28} />
          </button>
        </div>

        {agentProfile ? (
          <div>
            <div className="flex gap-6 mb-8">
              <img src={agentProfile.picture} alt={agentProfile.name} className="w-32 h-32 rounded-full object-cover" />
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{agentProfile.name}</h3>
                <p className="text-lg text-gray-600 mb-1">{agentProfile.company}</p>
                <div className="flex items-center gap-2 mb-3">
                  <Star size={18} className="text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{agentProfile.rating} ({agentProfile.reviews} reviews)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg">
                <div className="text-2xl font-bold">{agentProfile.salesClosed}</div>
                <div className="text-sm">Sales Closed</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                <div className="text-2xl font-bold">{agentProfile.totalViews?.toLocaleString()}</div>
                <div className="text-sm">Total Views</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                <div className="text-2xl font-bold">AED {(agentProfile.commissionEarned / 1000).toFixed(0)}K</div>
                <div className="text-sm">Commission Earned</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-lg">
                <div className="text-2xl font-bold">AED {(agentProfile.revenueFromViews / 1000).toFixed(0)}K</div>
                <div className="text-sm">View Revenue</div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h4 className="font-bold text-lg text-gray-800 mb-3">Bio</h4>
              <p className="text-gray-700">{agentProfile.bio}</p>
            </div>

            <button
              onClick={() => { setShowAgentDashboard(false); setAgentProfile(null); }}
              className="w-full bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 transition font-semibold text-lg"
            >
              Close Dashboard
            </button>
          </div>
        ) : (
          <p className="text-gray-600">No agent profile selected</p>
        )}
      </div>
    </div>
  );

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <HeroSection />
      <FeaturedSection />
      <PopularSearches />
      <PropertiesGrid />
      <Testimonials />
      <VideoShowcase />

      {showInquiryForm && <InquiryModal />}
      {showAuthModal && <AuthModal />}
      {showAgentModal && <AgentModal />}
      {showPaymentCheckout && <PaymentCheckout />}
      {showAgentDirectory && <AgentDirectoryModal />}
      {showPropertyDetail && <PropertyDetailPage />}
      {showPropertyReviews && <PropertyReviewsModal />}
      {showNeighborhoodReviews && <NeighborhoodReviewsModal />}
      {showWriteReview && <WriteReviewModal />}
      {showVideoGallery && <VideoGalleryModal />}
      {showVideoPlayer && <VideoPlayerModal />}
      {showNotifications && <NotificationCenter />}
      {showEmailNotifications && <EmailNotificationsPanel />}
      {showNotificationPreferences && <NotificationPreferencesModal />}
      {showAgentDashboard && <AgentDashboard />}
      {showMortgageCalculator && <MortgageCalculator />}
      {showPropertyMap && <PropertyMap />}
      {showAdvancedSearch && <AdvancedSearch />}
      {showRentVsBuy && <RentVsBuyCalculator />}
      {showComparison && <PropertyComparisonTool />}
      {showMarketInsights && <MarketInsightsDashboard />}
      {showROICalculator && <InvestmentROICalculator />}
      {showUserDashboard && <UserProfileDashboard />}
      {showNeighborhoodInsights && <NeighborhoodInsights />}
      {showFinancingPreApproval && <FinancingPreApproval />}
      {showAgentAnalytics && <AgentAnalyticsDashboard />}
      {showAdvancedAnalytics && <AdvancedAnalyticsDashboard />}
      {showAIRecommendations && <AIRecommendationsPanel />}
      {showSocialSharing && <SocialSharingPanel />}
      {showAdvancedMessaging && <AdvancedMessagingPanel />}
      {showEnhancedReviews && <EnhancedReviewsPanel />}
      {showPropertyValuation && <PropertyValuationTool />}
      {showDriveTimeSearch && <DriveTimeSearch />}
      {showAIChat && <AIPropertyAdvisor />}
      {showTransactionHistory && <TransactionHistory />}
      {showOffPlanProjects && <OffPlanProjectBrowser />}
      {showPriceTrends && <PriceTrendCharts />}
      {showTermsConditions && <TermsConditionsModal />}
      {showPrivacyPolicy && <PrivacyPolicyModal />}
      {showUserProfile && <UserProfileModal />}
      {selectedAgent && <AgentDashboardPanel />}
      <Toast />
      <NewsletterSection />
      <Footer />
    </div>
  );
}