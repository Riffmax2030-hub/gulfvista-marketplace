# React Components Reference Guide

## Quick Start

```javascript
// All components are located in: frontend/components/
import App from './App';
import Navigation from './components/Navigation';
import PropertyCard from './components/PropertyCard';
// ... etc
```

---

## Component API Reference

### 1. **App.jsx**
Main application component with routing and state management.

**Props**: None (root component)

**State**:
```javascript
- currentPage: string ('home' | 'detail' | 'login' | 'register' | 'dashboard')
- selectedProperty: object | null
- user: object | null
- properties: array
- filteredProperties: array
- loading: boolean
```

**Handlers**:
```javascript
- handleSearch(filters) - Filters properties based on criteria
- handleLogin(userData) - Sets user and navigates to home
- handleRegister(userData) - Sets user and navigates to home
- handleLogout() - Clears user and navigates to home
- handlePropertySelect(property) - Sets selected property and goes to detail page
```

**Usage**:
```javascript
<App />
```

---

### 2. **Navigation.jsx**
Top navigation bar with conditional auth menu.

**Props**:
```javascript
{
  user: { id, email, role } | null,
  onLogout: function,
  onNavClick: function(page)
}
```

**Features**:
- Logo/branding click → home
- Properties button → home
- Dashboard button → dashboard (if logged in)
- Login/Register buttons (if not logged in)
- User email display (if logged in)
- Logout button (if logged in)

**Usage**:
```javascript
<Navigation 
  user={user}
  onLogout={handleLogout}
  onNavClick={(page) => setCurrentPage(page)}
/>
```

---

### 3. **PropertyCard.jsx**
Individual property card component for grid display.

**Props**:
```javascript
{
  property: {
    id: number,
    title: string,
    description: string,
    price: number,
    address: string,
    city: string,
    bedrooms: number,
    bathrooms: number,
    area_sqft: number,
    property_type: string,
    views_count: number,
    price_per_sqft?: number
  },
  onClick: function
}
```

**Display**:
- Image placeholder (house emoji)
- Title (2 lines max)
- Description (2 lines max)
- Price in millions (AED)
- Location (address, city)
- Features: bedrooms, bathrooms, area
- Property type badge
- View count

**Interactions**:
- Hover: scale, border color change, shadow
- Click: calls onClick(property)

**Usage**:
```javascript
<PropertyCard
  property={property}
  onClick={() => handlePropertySelect(property)}
/>
```

---

### 4. **PropertyGrid.jsx**
Grid container for displaying multiple properties.

**Props**:
```javascript
{
  properties: array,
  onPropertyClick: function(property)
}
```

**Features**:
- Responsive grid (1/2/3 columns)
- Maps properties to PropertyCard components
- Empty state message
- Shows property count

**Usage**:
```javascript
<PropertyGrid
  properties={filteredProperties}
  onPropertyClick={handlePropertySelect}
/>
```

---

### 5. **SearchBar.jsx**
Search and filter interface component.

**Props**:
```javascript
{
  onSearch: function(filters)
}
```

**Filters Object** (passed to onSearch):
```javascript
{
  search: string,              // Title/location search
  minPrice: number | null,
  maxPrice: number | null,
  bedrooms: number | null,
  propertyType: string,        // 'apartment' | 'villa' | 'townhouse' | 'land' | 'office'
  city: string
}
```

**Features**:
- Search text input
- Min/Max price inputs
- Bedrooms dropdown (1-5+)
- Property type dropdown
- City text input
- Search button
- Reset button (clears all filters)

**Usage**:
```javascript
<SearchBar onSearch={(filters) => handleSearch(filters)} />
```

---

### 6. **PropertyDetail.jsx**
Full property information display page.

**Props**:
```javascript
{
  property: {
    id, title, description, price, address, city, emirate, country,
    bedrooms, bathrooms, area_sqft, property_type, views_count
  },
  onBack: function
}
```

**Display**:
- Header with back button and title
- Image placeholder
- Description section
- Feature cards (bedrooms, bathrooms, area, city, type, views)
- Location details (address, city, emirate, country)
- Price card (sidebar)
- Contact Agent button
- Save Property button
- Verification badges

**Usage**:
```javascript
<PropertyDetail
  property={selectedProperty}
  onBack={() => setCurrentPage('home')}
/>
```

---

### 7. **LoginForm.jsx**
User login form component.

**Props**:
```javascript
{
  onLogin: function(userData),     // Called with { id, email, role }
  onSwitchToRegister: function
}
```

**Features**:
- Email input
- Password input
- Error message display
- Loading state
- Switch to Register link
- API integration (POST /auth/login)
- Demo mode fallback

**Usage**:
```javascript
<LoginForm
  onLogin={handleLogin}
  onSwitchToRegister={() => setCurrentPage('register')}
/>
```

**Demo Credentials**: Any email/password combination works

---

### 8. **RegisterForm.jsx**
User registration form component.

**Props**:
```javascript
{
  onRegister: function(userData),  // Called with { id, email, role }
  onSwitchToLogin: function
}
```

**Form Fields**:
- Email input
- Account Type dropdown (buyer | seller | agent)
- Agent License number (if agent selected)
- Password input (min 8 chars)
- Confirm Password input
- Submit button

**Validation**:
- Passwords must match
- Password min 8 characters
- Agent license required for agent accounts

**Features**:
- Error message display
- Loading state
- Switch to Login link
- API integration (POST /auth/register)
- Demo mode fallback

**Usage**:
```javascript
<RegisterForm
  onRegister={handleRegister}
  onSwitchToLogin={() => setCurrentPage('login')}
/>
```

---

### 9. **Dashboard.jsx**
User property management dashboard.

**Props**:
```javascript
{
  user: {
    id: number,
    email: string,
    role: 'buyer' | 'seller' | 'agent'
  },
  userProperties: array
}
```

**Statistics Section**:
- Welcome message
- Property count
- Total value (AED millions)
- Total views

**Add Property Form** (Sellers/Agents only):
- Property title (required)
- Property type dropdown
- Price input (required)
- Bedrooms input (required)
- Bathrooms input
- Area input
- Address input
- City input
- Emirate dropdown
- Description textarea

**Features**:
- Form validation
- Price per sqft calculation
- Dynamic property list update
- Delete property button
- Edit button (placeholder)
- Empty state message (for buyers or new sellers)

**Usage**:
```javascript
<Dashboard
  user={user}
  userProperties={properties.filter(p => p.owner_id === user.id)}
/>
```

---

## Data Flow Patterns

### Search & Filter Flow
```
SearchBar
  ↓ (onSearch)
App (handleSearch)
  ↓ (updates filteredProperties)
PropertyGrid
  ↓ (properties prop)
PropertyCard[] (display filtered results)
```

### Property Detail Flow
```
PropertyCard
  ↓ (onClick)
App (handlePropertySelect)
  ↓ (setCurrentPage('detail'))
PropertyDetail
  ↓ (display property info)
```

### Authentication Flow
```
LoginForm / RegisterForm
  ↓ (onLogin / onRegister)
App (handleLogin / handleRegister)
  ↓ (setUser)
Navigation (user prop)
  ↓ (show Dashboard/Logout)
```

---

## Styling Patterns

### Dark Theme
```javascript
// Container backgrounds
'bg-slate-800'        // Card background
'bg-slate-900'        // Section background
'bg-slate-950'        // Page background

// Text colors
'text-white'          // Primary text
'text-gray-300'       // Secondary text
'text-gray-400'       // Tertiary text

// Borders
'border border-slate-700'
'border border-slate-600'
```

### Accent Colors
```javascript
// Amber (primary accent)
'bg-amber-500'        // Button background
'text-amber-500'      // Text/icon accent
'border-amber-500'    // Border accent

// Hover states
'hover:bg-amber-600'
'hover:border-amber-500'
'hover:shadow-lg hover:shadow-amber-500/20'
```

### Responsive Classes
```javascript
// Mobile first
'grid-cols-1'         // Mobile: 1 column
'md:grid-cols-2'      // Tablet: 2 columns
'lg:grid-cols-3'      // Desktop: 3 columns

// Spacing
'px-4 py-2'           // Padding
'gap-4 gap-6'         // Grid/flex gaps
'mb-6'                // Margin bottom
```

---

## Common Patterns

### Form Input Pattern
```javascript
<input
  type="text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Enter value..."
  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
/>
```

### Button Pattern
```javascript
<button
  onClick={handleClick}
  disabled={loading}
  className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-700 text-white font-semibold rounded transition"
>
  {loading ? 'Loading...' : 'Click Me'}
</button>
```

### Card Pattern
```javascript
<div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
  {/* Content */}
</div>
```

---

## Error Handling

All components include:
- Error state management
- Error message display
- Fallback to demo mode (API calls)
- Form validation feedback
- User-friendly error messages

---

## Browser Storage

Components use `localStorage`:
- `token`: JWT authentication token
- `user`: User object (id, email, role)

Example:
```javascript
localStorage.setItem('token', data.access_token);
localStorage.setItem('user', JSON.stringify(data.user));
```

---

## Performance Considerations

- Components use React.memo for optimization (can be added)
- Filters run client-side (fast, no API calls needed)
- Mock data minimizes API dependencies
- CSS is pre-compiled via Tailwind
- Responsive design uses CSS media queries

---

## Testing Checklist

- [ ] All components render without errors
- [ ] Props are passed correctly
- [ ] Click handlers trigger callbacks
- [ ] Forms validate and submit
- [ ] Search/filter logic works
- [ ] Authentication flow is smooth
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Dark theme displays correctly
- [ ] Hover states work
- [ ] Empty states display

---

## Integration Notes

**To connect to Phase 2 Backend**:
1. Update API URLs in LoginForm and RegisterForm
2. Update PropertyGrid to fetch from `/api/v1/properties`
3. Update Dashboard to use API endpoints
4. Remove mock data or use as fallback

**Current Endpoints Used**:
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /api/v1/properties` - List properties
- `POST /api/v1/properties` - Create property (Dashboard)

All components gracefully fall back to demo mode if API fails.

---

**Last Updated**: May 20, 2026  
**Frontend Version**: 1.0.0  
**React Version**: 18.2.0
