import React, { useState, useEffect } from 'react';
import { MapPin, Search, Filter, Heart, Share2, Home, LogOut, User, Menu, X, ChevronRight, Star, Eye, Mail, Phone, MessageSquare, Building2, Upload, Globe } from 'lucide-react';
import apiService from './src/services/api';

export default function App() {
  // ============================================================================
  // STATES
  // ============================================================================
  const [user, setUser] = useState(null);
  const [isAgent, setIsAgent] = useState(false);
  const [currentTab, setCurrentTab] = useState('rent');
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [agentMode, setAgentMode] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  const [filters, setFilters] = useState({
    search: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    city: '',
  });

  // Inquiry Form
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  // Login Form
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  // Agent Forms
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

  // ============================================================================
  // LOAD PROPERTIES
  // ============================================================================
  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const response = await apiService.listProperties({ limit: 100 });
      const shuffledProperties = shuffleArray(response.items || []);
      setProperties(shuffledProperties);
      setFilteredProperties(shuffledProperties);
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
    alert('Google login integration needed');
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
    } else {
      alert('Please fill all fields and upload documents');
    }
  };

  const handleAgentPayment = () => {
    const agentId = `AGENT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    alert(`✅ Registration Complete!\n\nYour Agent ID: ${agentId}\n\nSent to: ${agentRegisterForm.email}`);
    setUser({ name: agentRegisterForm.name, email: agentRegisterForm.email });
    setIsAgent(true);
    setShowPaymentCheckout(false);
    setShowAgentModal(false);
    setAgentRegisterForm({ name: '', email: '', picture: null, idDocument: null });
  };

  const handleLogout = () => {
    setUser(null);
    setIsAgent(false);
  };

  const handleAddFavorite = (propId) => {
    const newFav = new Set(favorites);
    if (newFav.has(propId)) {
      newFav.delete(propId);
    } else {
      newFav.add(propId);
    }
    setFavorites(newFav);
  };

  // ============================================================================
  // SUBMIT INQUIRY
  // ============================================================================
  const handleSubmitInquiry = () => {
    if (inquiryForm.name && inquiryForm.email && inquiryForm.phone) {
      alert(`✅ Inquiry Sent!\n\nWe'll contact you at ${inquiryForm.email}`);
      setShowInquiryForm(false);
      setInquiryForm({ name: '', phone: '', email: '', message: '' });
    } else {
      alert('Please fill all required fields');
    }
  };

  // ============================================================================
  // FILTERS
  // ============================================================================
  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...filters, [filterKey]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters) => {
    let filtered = properties;

    if (currentFilters.search) {
      const searchLower = currentFilters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(searchLower) ||
        p.address?.toLowerCase().includes(searchLower)
      );
    }

    if (currentFilters.propertyType) {
      filtered = filtered.filter(p => p.property_type === currentFilters.propertyType);
    }

    if (currentFilters.minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(currentFilters.minPrice));
    }

    if (currentFilters.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(currentFilters.maxPrice));
    }

    if (currentFilters.bedrooms) {
      filtered = filtered.filter(p => p.bedrooms === parseInt(currentFilters.bedrooms));
    }

    setFilteredProperties(filtered);
    setPropertyPage(1);
  };

  const getPaginatedProperties = () => {
    const startIndex = (propertyPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProperties.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(filteredProperties.length / itemsPerPage);
  };

  // ============================================================================
  // INQUIRY FORM MODAL
  // ============================================================================
  const InquiryModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          onClick={() => setShowInquiryForm(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Interested in this property?</h2>
        <p className="text-gray-600 text-sm mb-6">{selectedProperty?.title}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              placeholder="Your Name"
              value={inquiryForm.name}
              onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
            <input
              type="tel"
              placeholder="+971 50 XXX XXXX"
              value={inquiryForm.phone}
              onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={inquiryForm.email}
              onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Inquiries / Message</label>
            <textarea
              placeholder="Tell us more about your interest..."
              value={inquiryForm.message}
              onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            onClick={handleSubmitInquiry}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mt-4"
          >
            Send Inquiry
          </button>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // AUTH MODAL
  // ============================================================================
  const AuthModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">GulfVista</h1>
          <p className="text-sm text-gray-600">Sign in to save favorites and make inquiries</p>
        </div>

        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 pb-4 font-semibold transition ${authMode === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className={`flex-1 pb-4 font-semibold transition ${authMode === 'signup' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          >
            Sign Up
          </button>
        </div>

        {authMode === 'login' && (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Sign In
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <Globe size={20} /> Login with Google
            </button>
          </div>
        )}

        {authMode === 'signup' && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={signupForm.name}
              onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="email"
              placeholder="Email"
              value={signupForm.email}
              onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="password"
              placeholder="Password"
              value={signupForm.password}
              onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={signupForm.confirmPassword}
              onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              onClick={handleSignup}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Create Account
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <Globe size={20} /> Sign up with Google
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // ============================================================================
  // AGENT MODAL
  // ============================================================================
  const AgentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative max-h-96 overflow-y-auto">
        <button
          onClick={() => setShowAgentModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 sticky"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Agent Portal</h2>

        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setAgentMode('login')}
            className={`flex-1 pb-4 font-semibold transition text-sm ${agentMode === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          >
            Existing Agent
          </button>
          <button
            onClick={() => setAgentMode('register')}
            className={`flex-1 pb-4 font-semibold transition text-sm ${agentMode === 'register' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          >
            Register Now
          </button>
        </div>

        {agentMode === 'login' && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Agent ID"
              value={agentLoginForm.agentId}
              onChange={(e) => setAgentLoginForm({ ...agentLoginForm, agentId: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="password"
              placeholder="Password"
              value={agentLoginForm.password}
              onChange={(e) => setAgentLoginForm({ ...agentLoginForm, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              onClick={handleAgentLogin}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Login
            </button>
          </div>
        )}

        {agentMode === 'register' && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={agentRegisterForm.name}
              onChange={(e) => setAgentRegisterForm({ ...agentRegisterForm, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="email"
              placeholder="Email"
              value={agentRegisterForm.email}
              onChange={(e) => setAgentRegisterForm({ ...agentRegisterForm, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            <label className="block text-sm font-medium text-gray-700">Upload Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAgentRegisterForm({ ...agentRegisterForm, picture: e.target.files?.[0] })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />

            <label className="block text-sm font-medium text-gray-700">Upload ID / Passport</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setAgentRegisterForm({ ...agentRegisterForm, idDocument: e.target.files?.[0] })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />

            <button
              onClick={handleAgentRegister}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Continue to Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // ============================================================================
  // PAYMENT CHECKOUT MODAL
  // ============================================================================
  const PaymentCheckout = () => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          onClick={() => setShowPaymentCheckout(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Agent Registration Fee</h2>
        <p className="text-gray-600 text-sm mb-6">Complete your agent membership</p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Registration Fee</span>
            <span className="font-semibold">$199 USD</span>
          </div>
          <div className="border-t pt-2 flex justify-between">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-blue-600 text-lg">$199 USD</span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Card Number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="MM/YY"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="text"
              placeholder="CVV"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <button
          onClick={handleAgentPayment}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Complete Payment
        </button>
      </div>
    </div>
  );

  // ============================================================================
  // MODERN NAVIGATION
  // ============================================================================
  const Navigation = () => (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="text-blue-600" size={28} />
            <span className="text-2xl font-bold text-blue-600">GulfVista</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#rent" className="text-gray-700 hover:text-blue-600 font-medium transition">Rent</a>
            <a href="#lease" className="text-gray-700 hover:text-blue-600 font-medium transition">Lease</a>
            <a href="#insights" className="text-gray-700 hover:text-blue-600 font-medium transition">Insights</a>
            <a href="#agents" className="text-gray-700 hover:text-blue-600 font-medium transition">Find Agents</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative text-gray-600 hover:text-red-600 transition">
              <Heart size={24} />
              {favorites.size > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.size}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        <div className="border-t bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex gap-6 overflow-x-auto">
            <button
              onClick={() => setCurrentTab('rent')}
              className={`px-4 py-2 font-semibold whitespace-nowrap transition border-b-2 ${
                currentTab === 'rent' ? 'text-blue-600 border-blue-600' : 'text-gray-600 border-transparent hover:text-blue-600'
              }`}
            >
              🔑 Rent
            </button>
            <button
              onClick={() => setCurrentTab('lease')}
              className={`px-4 py-2 font-semibold whitespace-nowrap transition border-b-2 ${
                currentTab === 'lease' ? 'text-blue-600 border-blue-600' : 'text-gray-600 border-transparent hover:text-blue-600'
              }`}
            >
              📋 Lease
            </button>
            <button
              onClick={() => setShowAgentModal(true)}
              className={`px-4 py-2 font-semibold whitespace-nowrap transition border-b-2 text-gray-600 border-transparent hover:text-blue-600`}
            >
              🏢 Agent
            </button>
          </div>
        </div>
      </nav>
    </>
  );

  // ============================================================================
  // HERO SECTION WITH SKYSCRAPER
  // ============================================================================
  const HeroSection = () => (
    <div className="relative h-96 md:h-96 bg-cover bg-center"
         style={{backgroundImage: 'url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&h=500&fit=crop)'}}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20"></div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Find Your Dream Property
        </h1>
        <p className="text-lg md:text-xl text-center mb-8 max-w-2xl">
          Discover premium properties across the Gulf region
        </p>

        <div className="bg-white rounded-lg shadow-xl p-4 w-full max-w-2xl">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3">
              <Search className="text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by location..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="bg-transparent outline-none flex-1 text-gray-700"
              />
            </div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // PROPERTIES GRID
  // ============================================================================
  const PropertiesGrid = () => {
    const paginatedProperties = getPaginatedProperties();
    const totalPages = getTotalPages();

    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-lg mb-4">Refine Your Search</h3>
          <div className="grid md:grid-cols-5 gap-4">
            <select
              value={filters.propertyType}
              onChange={(e) => handleFilterChange('propertyType', e.target.value)}
              className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="townhouse">Townhouse</option>
            </select>
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <select
              value={filters.bedrooms}
              onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
              className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">All Bedrooms</option>
              <option value="2">2 Beds</option>
              <option value="3">3 Beds</option>
              <option value="4">4 Beds</option>
            </select>
            <input
              type="text"
              placeholder="City"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Properties</h2>
        <p className="text-gray-600 mb-8">Browse our premium collection</p>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-600">Loading properties...</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {paginatedProperties.map((prop) => (
                <div key={prop.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition">
                  <div className="relative h-48 bg-gray-200">
                    {prop.images && prop.images[0] ? (
                      <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                        <Building2 size={48} className="text-blue-400" />
                      </div>
                    )}

                    <button
                      onClick={() => {
                        if (!user) {
                          setShowAuthModal(true);
                        } else {
                          handleAddFavorite(prop.id);
                        }
                      }}
                      className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-red-50 transition shadow-lg"
                    >
                      <Heart
                        size={20}
                        className={favorites.has(prop.id) ? 'text-red-600 fill-red-600' : 'text-gray-400'}
                      />
                    </button>

                    <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-lg font-bold">
                      ${(prop.price / 1000000).toFixed(1)}M
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{prop.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{prop.description}</p>

                    <div className="flex gap-4 text-sm font-semibold text-gray-700 mb-4">
                      <span>🛏️ {prop.bedrooms !== null ? prop.bedrooms : '—'}</span>
                      <span>🚿 {prop.bathrooms !== null ? prop.bathrooms : '—'}</span>
                    </div>

                    <button
                      onClick={() => {
                        if (!user) {
                          setShowAuthModal(true);
                        } else {
                          setSelectedProperty(prop);
                          setShowInquiryForm(true);
                        }
                      }}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={18} /> Make an Inquiry
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setPropertyPage(page)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        propertyPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navigation />
      <HeroSection />
      <PropertiesGrid />

      {showAuthModal && <AuthModal />}
      {showAgentModal && <AgentModal />}
      {showPaymentCheckout && <PaymentCheckout />}
      {showInquiryForm && selectedProperty && <InquiryModal />}
    </div>
  );
}
