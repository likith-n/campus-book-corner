# BookShare API Documentation

Base URL: `http://localhost:3000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "Likith N",
  "email": "likith@college.edu",
  "password": "password123",
  "phone": "9876543210",
  "year": "II year",
  "department": "CSE",
  "location": "Bangalore"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": 1,
    "name": "Likith N",
    "email": "likith@college.edu",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "likith@college.edu",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "user_id": 1,
      "name": "Likith N",
      "email": "likith@college.edu",
      "rating": 4.9,
      "year": "II year",
      "department": "CSE",
      "location": "Bangalore"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User
```http
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "name": "Likith N",
    "email": "likith@college.edu",
    "rating": 4.9,
    "total_ratings": 23
  }
}
```

---

## Listings Endpoints

### Get All Listings (with filters)
```http
GET /api/listings?subject=Chemistry&condition=good&priceMin=100&priceMax=500&sortBy=newest&page=1&limit=20
```

**Query Parameters:**
- `subject` (optional): Filter by subject
- `condition` (optional): new, good, fair
- `priceMin` (optional): Minimum price
- `priceMax` (optional): Maximum price
- `search` (optional): Search in title, author, subject
- `sortBy` (optional): newest, price-low, price-high, popular
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "listings": [
      {
        "listing_id": 1,
        "title": "Organic Chemistry",
        "author": "Solomon & Fryhle",
        "edition": "2nd",
        "subject": "Chemistry",
        "condition_type": "good",
        "price": 450.00,
        "owner_name": "Likith N",
        "owner_rating": 4.9,
        "owner_location": "Bangalore",
        "created_at": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 6,
      "totalPages": 1
    }
  }
}
```

### Get Single Listing
```http
GET /api/listings/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "listing_id": 1,
    "book_id": 1,
    "title": "Organic Chemistry",
    "author": "Solomon & Fryhle",
    "edition": "2nd",
    "subject": "Chemistry",
    "condition_type": "good",
    "price": 450.00,
    "description": "Used for one semester...",
    "image_urls": null,
    "status": "available",
    "views": 15,
    "owner_id": 1,
    "owner_name": "Likith N",
    "owner_email": "likith@college.edu",
    "owner_phone": "9876543210",
    "owner_rating": 4.9,
    "owner_location": "Bangalore"
  }
}
```

### Create Listing
```http
POST /api/listings
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Data Structures in C",
  "author": "Tanenbaum",
  "edition": "4th",
  "subject": "Computer Science",
  "isbn": "9780131204324",
  "publisher": "Pearson",
  "publication_year": 2020,
  "condition": "good",
  "price": 420,
  "description": "Well maintained copy with minimal highlighting"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Listing created successfully",
  "data": {
    "listing_id": 7,
    "book_id": 7
  }
}
```

### Update Listing
```http
PUT /api/listings/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "price": 400,
  "description": "Updated description",
  "status": "available"
}
```

### Delete Listing
```http
DELETE /api/listings/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

### Get User's Listings
```http
GET /api/listings/user/:userId?status=available
```

**Query Parameters:**
- `status` (optional): available, pending, sold, removed, all

---

## Requests Endpoints

### Create Request
```http
POST /api/requests
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "listing_id": 1,
  "message": "Hi! I'm interested in this book. Can we meet tomorrow?"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Request sent successfully",
  "data": {
    "request_id": 4
  }
}
```

### Get Sent Requests
```http
GET /api/requests/sent
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "request_id": 1,
      "message": "Hi! I need this for my semester exam...",
      "status": "pending",
      "listing_id": 1,
      "book_title": "Organic Chemistry",
      "book_author": "Solomon & Fryhle",
      "price": 450.00,
      "owner_name": "Likith N",
      "owner_rating": 4.9,
      "created_at": "2024-01-16T08:00:00.000Z"
    }
  ]
}
```

### Get Received Requests
```http
GET /api/requests/received
```

**Headers:**
```
Authorization: Bearer <token>
```

### Accept Request
```http
PATCH /api/requests/:id/accept
```

**Headers:**
```
Authorization: Bearer <token>
```

### Reject Request
```http
PATCH /api/requests/:id/reject
```

**Headers:**
```
Authorization: Bearer <token>
```

### Complete Request (Create Transaction)
```http
PATCH /api/requests/:id/complete
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 450.00,
  "payment_method": "Cash",
  "notes": "Transaction completed at campus library"
}
```

### Cancel Request
```http
DELETE /api/requests/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

---

## Users Endpoints

### Get User Profile
```http
GET /api/users/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "name": "Likith N",
    "email": "likith@college.edu",
    "year": "II year",
    "department": "CSE",
    "location": "Bangalore",
    "rating": 4.9,
    "total_ratings": 23,
    "stats": {
      "total_listings": 15,
      "active_listings": 8,
      "sold_listings": 7
    }
  }
}
```

### Update Profile
```http
PUT /api/users/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Likith N",
  "phone": "9876543210",
  "year": "III year",
  "department": "CSE",
  "location": "Bangalore"
}
```

### Get User Reviews
```http
GET /api/users/:id/reviews
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (not authorized for this action)
- `404` - Not Found
- `500` - Internal Server Error

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@college.edu",
    "password": "password123",
    "year": "II year",
    "department": "CSE",
    "location": "Bangalore"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@college.edu",
    "password": "password123"
  }'
```

### Get Listings
```bash
curl http://localhost:3000/api/listings?subject=Chemistry&condition=good
```

### Create Listing
```bash
curl -X POST http://localhost:3000/api/listings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Test Book",
    "author": "Test Author",
    "edition": "1st",
    "subject": "Computer Science",
    "condition": "good",
    "price": 500,
    "description": "Test description"
  }'
```
