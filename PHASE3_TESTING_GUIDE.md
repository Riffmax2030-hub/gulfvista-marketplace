# Phase 3 Frontend Testing Guide

**Status**: Ready for Testing  
**Frontend Components**: 9/9 Complete ✅  
**Testing Scope**: Full React application with mock data  

---

## Quick Start - Run the Frontend Locally

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

**Output**:
```
  VITE v5.0.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 3: Open in Browser
```
http://localhost:5173/
```

---

## Testing Checklist

### ✅ Home Page (Property Grid)

**Visual Verification**:
- [ ] Page loads without errors
- [ ] Dark theme displays correctly (slate background)
- [ ] Header shows "Find Your Perfect Property"
- [ ] Search bar is visible with all 6 filter inputs
- [ ] Property grid shows 5 properties in cards
- [ ] Grid is responsive (1 column on mobile, 2 on tablet, 3 on desktop)

**Property Card Verification**:
- [ ] Each card shows:
  - [ ] House emoji image placeholder
  - [ ] Property title
  - [ ] Property description (2 lines max)
  - [ ] Price in millions (AED)
  - [ ] Location (address, city)
  - [ ] Feature icons (bedrooms, bathrooms, area)
  - [ ] Property type badge
  - [ ] View count

**Hover Effects**:
- [ ] Hover over property card
- [ ] Card scales up slightly
- [ ] Border color changes to amber
- [ ] Shadow appears/expands

**Navigation**:
- [ ] Click logo → returns to home
- [ ] Click "Properties" button → stays on home
- [ ] Click "Login" button → goes to login page
- [ ] Click "Register" button → goes to register page

---

### ✅ Search & Filter

**Search Text Filter**:
- [ ] Enter "villa" in search box
- [ ] Click Search
- [ ] Only villa properties appear (1 result)
- [ ] Other properties hidden

**Price Range Filter**:
- [ ] Enter Min Price: 2000000
- [ ] Enter Max Price: 4000000
- [ ] Click Search
- [ ] Only properties in range appear (3 properties)

**Bedroom Filter**:
- [ ] Select "3 Bedrooms" dropdown
- [ ] Click Search
- [ ] Only 3-bedroom properties appear (1 property)

**Property Type Filter**:
- [ ] Select "apartment" from Property Type dropdown
- [ ] Click Search
- [ ] Only apartment properties appear (2 properties)

**City Filter**:
- [ ] Enter "Dubai" in City field
- [ ] Click Search
- [ ] All Dubai properties appear (5 properties - all match)

**Combined Filters**:
- [ ] Set Min Price: 1000000
- [ ] Set Bedrooms: 2
- [ ] Click Search
- [ ] Results show only 2+ bedroom properties over 1M AED

**Reset Filters**:
- [ ] With any filters applied, click "Reset"
- [ ] All 5 properties reappear
- [ ] Filter inputs are cleared

---

### ✅ Property Detail Page

**Navigate to Detail**:
- [ ] Click on any property card
- [ ] Redirected to property detail page
- [ ] URL shows detail page (component changes)

**Detail Page Content**:
- [ ] Property title displays in header
- [ ] Back button visible and functional
- [ ] Large image placeholder shows
- [ ] Property description visible
- [ ] Feature cards show:
  - [ ] Bedrooms with bed emoji
  - [ ] Bathrooms with shower emoji
  - [ ] Area with ruler emoji
  - [ ] City with pin emoji
  - [ ] Property type badge
  - [ ] View count with eye emoji

**Right Sidebar**:
- [ ] Price card shows "AED X.XM"
- [ ] Total price shown below in AED
- [ ] "Contact Agent" button visible
- [ ] "Save Property" button visible
- [ ] Property ID shown
- [ ] Verification badges shown (Active, Verified, Professional)

**Location Details**:
- [ ] Address shown
- [ ] City shown
- [ ] Emirate shown
- [ ] Country shown (default "UAE")

**Back Button**:
- [ ] Click back button
- [ ] Returns to home page
- [ ] Property grid visible again

---

### ✅ Authentication - Login

**Navigate to Login**:
- [ ] Click "Login" button in navigation
- [ ] Login form appears centered on page
- [ ] Form shows:
  - [ ] "Welcome Back" heading
  - [ ] Email input
  - [ ] Password input
  - [ ] "Sign In" button
  - [ ] "Sign up" link

**Demo Login (Any credentials work)**:
- [ ] Enter email: `demo@example.com`
- [ ] Enter password: `password123`
- [ ] Click "Sign In"
- [ ] Form submits (no error)
- [ ] User logged in
- [ ] Redirected to home page

**Navigation After Login**:
- [ ] User email visible in navigation
- [ ] "Dashboard" button appears in nav
- [ ] "Logout" button appears in nav
- [ ] "Login" and "Register" buttons disappear

**Test Invalid Login** (Demo still accepts):
- [ ] Log out first
- [ ] Return to login page
- [ ] Enter email: `test@test.com`
- [ ] Enter password: `xyz`
- [ ] Click Sign In
- [ ] Still logs in (demo mode)

**Switch to Register**:
- [ ] On login page, click "Sign up" link
- [ ] Redirected to register page

---

### ✅ Authentication - Register

**Navigate to Register**:
- [ ] Click "Register" button in navigation
- [ ] Register form appears
- [ ] Form shows:
  - [ ] "Create Account" heading
  - [ ] Email input
  - [ ] Account Type dropdown
  - [ ] Password input (min 8 chars shown)
  - [ ] Confirm Password input
  - [ ] "Create Account" button
  - [ ] "Sign in" link

**Account Type - Buyer**:
- [ ] Select "Buyer" from dropdown
- [ ] Agent license field NOT visible
- [ ] Fill form:
  - [ ] Email: `buyer@example.com`
  - [ ] Password: `TestPassword123`
  - [ ] Confirm: `TestPassword123`
- [ ] Click "Create Account"
- [ ] User registered and logged in
- [ ] Redirected to home

**Account Type - Seller**:
- [ ] Click Register again (or log out first)
- [ ] Select "Seller" dropdown
- [ ] Agent license field NOT visible
- [ ] Fill form with seller details
- [ ] Create account
- [ ] User registered with seller role

**Account Type - Agent**:
- [ ] Click Register again
- [ ] Select "Agent" dropdown
- [ ] Agent License field NOW VISIBLE
- [ ] Try to submit without license
- [ ] Error shown: "Agent license number is required"
- [ ] Enter license: `AGENT123456`
- [ ] Fill other fields
- [ ] Create account
- [ ] User registered as agent

**Validation - Password Mismatch**:
- [ ] Enter password: `TestPassword123`
- [ ] Enter confirm: `DifferentPassword`
- [ ] Click "Create Account"
- [ ] Error shown: "Passwords do not match"

**Validation - Short Password**:
- [ ] Enter password: `short`
- [ ] Enter confirm: `short`
- [ ] Click "Create Account"
- [ ] Error shown: "Password must be at least 8 characters"

**Switch to Login**:
- [ ] On register page, click "Sign in" link
- [ ] Redirected to login page

---

### ✅ User Dashboard

**Navigate to Dashboard**:
- [ ] Log in with any credentials
- [ ] Click "Dashboard" in navigation
- [ ] Dashboard page appears

**Dashboard Statistics**:
- [ ] Welcome section shows user email
- [ ] "Your Properties" count shows
- [ ] "Total Value" shows in AED millions
- [ ] "Total Views" count shows
- [ ] All stats displayed correctly

**Dashboard for Buyer**:
- [ ] No "Add New Property" button
- [ ] Empty state message shows: "No Properties Yet"
- [ ] Message says: "Start exploring properties or contact an agent"

**Dashboard for Seller/Agent**:
- [ ] "Add New Property" button visible
- [ ] Click button → form expands
- [ ] Form shows all 13 fields:
  - [ ] Property Title (required)
  - [ ] Property Type dropdown
  - [ ] Price input (required)
  - [ ] Bedrooms input (required)
  - [ ] Bathrooms input
  - [ ] Area input
  - [ ] Address input
  - [ ] City input
  - [ ] Emirate dropdown
  - [ ] Description textarea
  - [ ] "List Property" button

**Add Property Form Validation**:
- [ ] Try to submit without title
- [ ] Error shown: "Please fill in required fields"
- [ ] Try to submit without price
- [ ] Error shown: "Please fill in required fields"
- [ ] Try to submit without bedrooms
- [ ] Error shown: "Please fill in required fields"

**Add Property Successfully**:
- [ ] Fill all required fields:
  - [ ] Title: `Beautiful 3BR Villa`
  - [ ] Type: `Villa`
  - [ ] Price: `2500000`
  - [ ] Bedrooms: `3`
  - [ ] Bathrooms: `2`
  - [ ] Area: `3500`
  - [ ] Address: `Test Address`
  - [ ] City: `Dubai`
  - [ ] Emirate: `Dubai`
  - [ ] Description: `Test property description`
- [ ] Click "List Property"
- [ ] Form closes
- [ ] New property appears in property grid
- [ ] Price shows as "AED 2.5M"
- [ ] All details display correctly

**Delete Property**:
- [ ] Find newly added property
- [ ] Click "🗑 Delete" button
- [ ] Property removed from list
- [ ] Property count updates

**Edit Button**:
- [ ] Edit button is visible (not functional yet)

---

### ✅ Responsive Design Testing

**Mobile (375px width)**:
```bash
# Open DevTools (F12)
# Click device toolbar icon
# Select iPhone 12
```

**Verification**:
- [ ] Grid shows 1 column
- [ ] All text readable
- [ ] Buttons clickable
- [ ] Navigation collapses or adapts
- [ ] Forms stack vertically
- [ ] Images scale properly
- [ ] No horizontal scroll

**Tablet (768px width)**:
```bash
# Select iPad from device toolbar
```

**Verification**:
- [ ] Grid shows 2 columns
- [ ] Layout optimized for tablet
- [ ] All content visible
- [ ] No overflow

**Desktop (1920px width)**:
```bash
# Resize browser to full width
```

**Verification**:
- [ ] Grid shows 3 columns
- [ ] Max-width container centered
- [ ] Proper spacing
- [ ] Professional layout

---

### ✅ Dark Theme & Colors

**Color Verification**:
- [ ] Background is dark slate (not pure black)
- [ ] Text is light (white/gray)
- [ ] Accent color is amber (not orange)
- [ ] Hover effects use amber
- [ ] Shadows are subtle
- [ ] No white backgrounds
- [ ] No light text on light backgrounds

**Theme Consistency**:
- [ ] All pages use same color scheme
- [ ] Buttons consistently styled
- [ ] Cards have consistent borders
- [ ] Icons use emoji (no broken images)

---

### ✅ Error Handling

**No Properties Found**:
- [ ] Search for: `nonexistent`
- [ ] Click Search
- [ ] Empty state shows: "No Properties Found"
- [ ] Message says: "Try adjusting your search filters"

**API Connection Failure** (Test later with Phase 2):
- [ ] When backend is down
- [ ] Forms should still work in demo mode
- [ ] Error message shows connection issue
- [ ] App continues to function

**Form Errors**:
- [ ] Missing required fields show error
- [ ] Invalid email shows error
- [ ] Password mismatch shows error
- [ ] Error messages are clear and helpful

---

### ✅ Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Chromium ✅
- [ ] Firefox ✅
- [ ] Safari ✅
- [ ] Edge ✅

**Verification**:
- [ ] No console errors
- [ ] No broken styles
- [ ] All interactions work
- [ ] Forms submit properly

---

## Test Scenarios

### Scenario 1: Complete User Journey (Buyer)
1. Load home page
2. Search for villa properties
3. Filter by price (1M-3M)
4. Click on villa property
5. View property details
6. Return to home
7. Click Login
8. Login as buyer
9. View Dashboard (empty state)
10. Logout

### Scenario 2: Complete User Journey (Seller)
1. Load home page
2. Click Register
3. Select "Seller" account type
4. Register new account
5. Click Dashboard
6. Add new property (fill all fields)
7. Verify property appears in grid
8. Click property to see details
9. Return to Dashboard
10. Delete property
11. Logout

### Scenario 3: Search & Filter Combinations
1. Search: "villa"
2. Filter by bedrooms: 4
3. Filter by price: 2M-5M
4. Reset and verify all properties reappear
5. Try different filter combinations
6. Verify results are accurate

### Scenario 4: Mobile Experience
1. Resize to mobile (375px)
2. Navigate through all pages
3. Test all buttons are clickable
4. Verify forms are usable
5. Check property grid layout
6. Test navigation menu

---

## Expected Properties (Mock Data)

| # | Title | Type | Price | BR | BA | Area | City |
|---|-------|------|-------|----|----|------|------|
| 1 | Luxury Villa in Arabian Ranches | Villa | AED 3.5M | 4 | 3 | 4500 | Dubai |
| 2 | Modern Apartment in Dubai Marina | Apartment | AED 1.8M | 2 | 2 | 1200 | Dubai |
| 3 | Spacious Townhouse in JBR | Townhouse | AED 2.2M | 3 | 2 | 2000 | Dubai |
| 4 | Premium Office in Downtown Dubai | Office | AED 0.85M | 0 | 1 | 800 | Dubai |
| 5 | Luxury Penthouse in DIFC | Apartment | AED 5.2M | 4 | 4 | 5000 | Dubai |

---

## Known Limitations

1. **Edit Property**: Edit button not implemented (placeholder)
2. **Contact Agent**: Contact Agent button not connected (placeholder)
3. **Save Property**: Save Property button not connected (placeholder)
4. **API Integration**: All API calls fall back to demo mode
5. **Image Upload**: No real image upload (placeholder emoji used)
6. **Email Verification**: No email verification in demo mode

These will be implemented in Phase 4 and Phase 5.

---

## Debugging Tips

### Check Console for Errors
```bash
# Open DevTools: F12
# Go to Console tab
# Look for red error messages
```

### Check Network Requests
```bash
# DevTools → Network tab
# Perform actions
# Look for failed requests (red)
```

### Test Local Storage
```bash
# DevTools → Application tab
# Expand "Local Storage"
# Check for "token" and "user" keys
# Verify data is stored correctly
```

### React DevTools
```bash
# Install React DevTools extension
# Inspect component props
# Check state values
# Verify re-renders
```

---

## Performance Testing

**Lighthouse Audit**:
1. Open DevTools (F12)
2. Click "Lighthouse" tab
3. Select "Desktop"
4. Click "Analyze page load"
5. Review scores for:
   - Performance
   - Accessibility
   - Best Practices
   - SEO

**Expected Performance**: Should load in under 2 seconds

---

## When Done Testing

✅ All tests pass  
✅ No console errors  
✅ All features working  
✅ Responsive design verified  
✅ Ready for Phase 4  

**Report Results**: Note any issues or feature requests for Phase 4

---

## Testing Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Home Page | ⬜ Not tested | Ready for testing |
| Property Grid | ⬜ Not tested | Ready for testing |
| Search & Filter | ⬜ Not tested | Ready for testing |
| Property Detail | ⬜ Not tested | Ready for testing |
| Login | ⬜ Not tested | Ready for testing |
| Register | ⬜ Not tested | Ready for testing |
| Dashboard | ⬜ Not tested | Ready for testing |
| Responsive Design | ⬜ Not tested | Ready for testing |
| Dark Theme | ⬜ Not tested | Ready for testing |
| Performance | ⬜ Not tested | Ready for testing |

**Legend**: ⬜ = Not tested yet, ✅ = Passing, ❌ = Failing

---

**Start Testing**: `npm run dev` and go to `http://localhost:5173/`

**Report Issues**: Use this guide to document any bugs or unexpected behavior

---

**Last Updated**: May 20, 2026  
**Frontend Version**: 1.0.0  
**Testing Status**: Ready ✅
