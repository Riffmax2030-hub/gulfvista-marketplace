# Phase 2 API Complete Testing Guide

## Prerequisites
- Backend running at http://localhost:8000
- API Docs available at http://localhost:8000/api/docs
- Use PowerShell or any terminal for curl commands

---

## Test 1: User Registration ✅

### Register User 1 (Buyer)
```powershell
$body = @{
    email = "buyer@gulfvista.properties"
    password = "SecurePassword123!"
    full_name = "Ahmed Buyer"
    phone = "+971-50-111-1111"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/api/v1/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

**Expected Response:**
```json
{
  "id": 1,
  "email": "buyer@gulfvista.properties",
  "full_name": "Ahmed Buyer",
  "role": "buyer",
  "is_agent_verified": false,
  "is_active": true
}
```

---

### Register User 2 (Seller)
```powershell
$body = @{
    email = "seller@gulfvista.properties"
    password = "SecurePassword123!"
    full_name = "Fatima Seller"
    phone = "+971-50-222-2222"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/api/v1/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

**Expected Response:**
```json
{
  "id": 2,
  "email": "seller@gulfvista.properties",
  "full_name": "Fatima Seller",
  "role": "buyer",  // Will need to update to seller in database
  "is_agent_verified": false,
  "is_active": true
}
```

---

## Test 2: User Login ✅

### Login as Buyer
```powershell
$body = @{
    email = "buyer@gulfvista.properties"
    password = "SecurePassword123!"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8000/api/v1/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body

$response.Content | ConvertFrom-Json | ConvertTo-Json
```

**Expected Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "buyer@gulfvista.properties",
    "full_name": "Ahmed Buyer",
    "role": "buyer",
    "is_agent_verified": false,
    "is_active": true
  }
}
```

**📌 SAVE THE ACCESS TOKEN - you'll need it for the next tests!**

---

## Test 3: Get Current User ✅

```powershell
$token = "YOUR_ACCESS_TOKEN_HERE"

Invoke-WebRequest -Uri "http://localhost:8000/api/v1/auth/me" `
  -Method GET `
  -Headers @{"Authorization"="Bearer $token"}
```

**Expected Response:** Same as user object above

---

## Test 4: Create Property (As Seller)

First, update the seller role in database. Open another terminal:

```powershell
# Connect to PostgreSQL
docker exec -it gulfvista-db psql -U gulfvista -d gulfvista_dev -c "UPDATE users SET role = 'seller' WHERE email = 'seller@gulfvista.properties';"
```

Login as seller:

```powershell
$body = @{
    email = "seller@gulfvista.properties"
    password = "SecurePassword123!"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8000/api/v1/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body

$sellerToken = ($response.Content | ConvertFrom-Json).access_token
$sellerToken  # Display to verify
```

### Create First Property
```powershell
$propertyBody = @{
    title = "Luxury Villa in Arabian Ranches"
    description = "Beautiful 4-bedroom villa with swimming pool and garden"
    property_type = "villa"
    price = 3500000
    address = "Plot 152, Arabian Ranches"
    city = "Dubai"
    emirate = "Dubai"
    bedrooms = 4
    bathrooms = 3
    area_sqft = 4500
    furnishing = "unfurnished"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/api/v1/properties" `
  -Method POST `
  -Headers @{"Authorization"="Bearer $sellerToken"; "Content-Type"="application/json"} `
  -Body $propertyBody
```

**Expected Response:**
```json
{
  "id": 1,
  "title": "Luxury Villa in Arabian Ranches",
  "description": "Beautiful 4-bedroom villa with swimming pool and garden",
  "property_type": "villa",
  "price": 3500000,
  "currency": "AED",
  "address": "Plot 152, Arabian Ranches",
  "city": "Dubai",
  "bedrooms": 4,
  "bathrooms": 3,
  "area_sqft": 4500,
  "owner_id": 2,
  "is_active": true,
  "views_count": 0
}
```

### Create Second Property
```powershell
$propertyBody2 = @{
    title = "Modern Apartment in Dubai Marina"
    description = "Stunning 2-bedroom apartment with sea view"
    property_type = "apartment"
    price = 1800000
    address = "Marina Tower, Dubai Marina"
    city = "Dubai"
    emirate = "Dubai"
    bedrooms = 2
    bathrooms = 2
    area_sqft = 1200
    furnishing = "furnished"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/api/v1/properties" `
  -Method POST `
  -Headers @{"Authorization"="Bearer $sellerToken"; "Content-Type"="application/json"} `
  -Body $propertyBody2
```

### Create Third Property
```powershell
$propertyBody3 = @{
    title = "Spacious Townhouse in JBR"
    description = "3-bedroom townhouse with private parking"
    property_type = "townhouse"
    price = 2200000
    address = "JBR Community, Dubai Marina"
    city = "Dubai"
    emirate = "Dubai"
    bedrooms = 3
    bathrooms = 2
    area_sqft = 2000
    furnishing = "semi-furnished"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/api/v1/properties" `
  -Method POST `
  -Headers @{"Authorization"="Bearer $sellerToken"; "Content-Type"="application/json"} `
  -Body $propertyBody3
```

---

## Test 5: List All Properties (Public)

```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/properties" `
  -Method GET
```

**Expected Response:**
```json
{
  "items": [
    { "id": 1, "title": "Luxury Villa in Arabian Ranches", ... },
    { "id": 2, "title": "Modern Apartment in Dubai Marina", ... },
    { "id": 3, "title": "Spacious Townhouse in JBR", ... }
  ],
  "total": 3,
  "page": 1,
  "page_size": 20
}
```

---

## Test 6: Search Properties

### Search by Title
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/properties?search=villa" `
  -Method GET
```

**Expected:** Returns villa property

### Filter by Price Range
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/properties?min_price=1500000&max_price=2500000" `
  -Method GET
```

**Expected:** Returns properties in that price range

### Filter by Bedrooms
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/properties?bedrooms=2" `
  -Method GET
```

**Expected:** Returns 2-bedroom apartment

### Filter by City
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/properties?city=Dubai" `
  -Method GET
```

**Expected:** Returns all Dubai properties

### Combined Filters
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/properties?property_type=apartment&min_price=1000000&max_price=2000000&bedrooms=2" `
  -Method GET
```

---

## Test 7: Get Property Details

```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/properties/1" `
  -Method GET
```

**Expected Response:**
```json
{
  "id": 1,
  "title": "Luxury Villa in Arabian Ranches",
  "description": "Beautiful 4-bedroom villa with swimming pool and garden",
  ...
  "views_count": 1  // Should increment
}
```

---

## Test 8: Update Property (Owner Only)

```powershell
$updateBody = @{
    title = "Luxury Villa in Arabian Ranches - Updated"
    description = "Beautiful 4-bedroom villa with swimming pool, garden, and gym"
    property_type = "villa"
    price = 3400000  # Reduced price
    address = "Plot 152, Arabian Ranches"
    city = "Dubai"
    emirate = "Dubai"
    bedrooms = 4
    bathrooms = 3
    area_sqft = 4500
    furnishing = "unfurnished"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/api/v1/properties/1" `
  -Method PUT `
  -Headers @{"Authorization"="Bearer $sellerToken"; "Content-Type"="application/json"} `
  -Body $updateBody
```

**Expected:** Property updated successfully

---

## Test 9: Test Authorization (Negative Test)

Try to update property as different user (should fail):

```powershell
# Login as buyer first
$buyerResponse = Invoke-WebRequest -Uri "http://localhost:8000/api/v1/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body (@{email="buyer@gulfvista.properties"; password="SecurePassword123!"} | ConvertTo-Json)

$buyerToken = ($buyerResponse.Content | ConvertFrom-Json).access_token

# Try to update seller's property
$updateBody = @{
    title = "Hacked Title"
    description = "This should fail"
    property_type = "villa"
    price = 1
    address = "Test"
    city = "Test"
    emirate = "Test"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/api/v1/properties/1" `
  -Method PUT `
  -Headers @{"Authorization"="Bearer $buyerToken"; "Content-Type"="application/json"} `
  -Body $updateBody
```

**Expected Error:**
```json
{
  "detail": "You can only update your own properties"
}
```

---

## Test 10: Get User's Properties

```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/users/me/properties" `
  -Method GET `
  -Headers @{"Authorization"="Bearer $sellerToken"}
```

**Expected:** Returns all properties owned by the seller

---

## Test 11: Delete Property

```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/properties/3" `
  -Method DELETE `
  -Headers @{"Authorization"="Bearer $sellerToken"}
```

**Expected Response:**
```json
{
  "message": "Property deleted successfully"
}
```

### Verify Deletion (Property should no longer appear in list)
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/properties" -Method GET
```

---

## Test 12: Statistics Endpoint

```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/stats" -Method GET
```

**Expected Response:**
```json
{
  "total_properties": 2,  // After deletion
  "total_users": 2,
  "total_agents": 0,
  "platform": "gulfvista.properties"
}
```

---

## Test 13: Error Handling

### Test Invalid Email on Login
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body (@{email="nonexistent@test.com"; password="wrong"} | ConvertTo-Json)
```

**Expected Error:**
```json
{
  "detail": "Invalid email or password"
}
```

### Test Duplicate Registration
```powershell
$body = @{
    email = "buyer@gulfvista.properties"
    password = "NewPassword123!"
    full_name = "Duplicate Buyer"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/api/v1/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

**Expected Error:**
```json
{
  "detail": "Email already registered"
}
```

---

## Summary of Tests

✅ **Test 1-3:** Authentication (Register, Login, Get User)
✅ **Test 4:** Create Properties (CRUD Create)
✅ **Test 5-7:** List, Search, Filter, and Retrieve Properties
✅ **Test 8:** Update Property (CRUD Update)
✅ **Test 9:** Authorization Checks
✅ **Test 10:** User Dashboard
✅ **Test 11:** Delete Property (CRUD Delete)
✅ **Test 12:** Statistics
✅ **Test 13:** Error Handling

---

## All Phase 2 Features Verified ✅

Once you complete all tests above:
- Authentication system ✅
- Property CRUD ✅
- Search & Filtering ✅
- Authorization/Permission ✅
- User Dashboard ✅
- Error Handling ✅

**Ready for Phase 3: React Frontend Components!**
