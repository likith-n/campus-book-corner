# BookShare Backend API

Complete REST API for the BookShare - Old Book Exchange System built with Node.js, Express, and MySQL.

## 🚀 Features

- ✅ User authentication with JWT
- ✅ Book listings management (CRUD operations)
- ✅ Request system for buying books
- ✅ Transaction tracking
- ✅ User profiles and ratings
- ✅ Advanced filtering and search
- ✅ Input validation
- ✅ Rate limiting
- ✅ Security headers (Helmet)
- ✅ CORS enabled
- ✅ Error handling

## 📋 Prerequisites

- Node.js 18+ installed
- MySQL 8.0+ installed and running
- npm or yarn package manager

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

The `.env` file is already created. Update it with your MySQL credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bookshare
DB_PORT=3306

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:8080
```

### 3. Database Setup

The database and tables are already created! The `bookshare` database contains:

**Tables:**
- `users` - User accounts and profiles
- `books` - Book information
- `listings` - Book listings with price and condition
- `requests` - Book requests from buyers
- `transactions` - Completed transactions
- `reviews` - User reviews and ratings

**Sample Data:**
- 4 users
- 6 books
- 6 listings
- 3 requests
- 1 transaction

## 🎯 Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:3000`

You should see:
```
🚀 BookShare API Server Started
================================
📡 Server: http://localhost:3000
🌍 Environment: development
💾 Database: bookshare
🔗 Frontend: http://localhost:8080
================================
```

## 📚 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Quick Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login user |
| GET | `/auth/me` | Yes | Get current user |
| GET | `/listings` | No | Get all listings (with filters) |
| GET | `/listings/:id` | No | Get single listing |
| POST | `/listings` | Yes | Create new listing |
| PUT | `/listings/:id` | Yes | Update listing |
| DELETE | `/listings/:id` | Yes | Delete listing |
| GET | `/listings/user/:userId` | No | Get user's listings |
| POST | `/requests` | Yes | Create request |
| GET | `/requests/sent` | Yes | Get sent requests |
| GET | `/requests/received` | Yes | Get received requests |
| PATCH | `/requests/:id/accept` | Yes | Accept request |
| PATCH | `/requests/:id/reject` | Yes | Reject request |
| PATCH | `/requests/:id/complete` | Yes | Complete request |
| DELETE | `/requests/:id` | Yes | Cancel request |
| GET | `/users/:id` | No | Get user profile |
| PUT | `/users/:id` | Yes | Update profile |
| GET | `/users/:id/reviews` | No | Get user reviews |

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Getting a Token

1. Register a new user:
```bash
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@college.edu",
  "password": "password123"
}
```

2. Login:
```bash
POST /api/auth/login
{
  "email": "john@college.edu",
  "password": "password123"
}
```

3. Use the returned token in subsequent requests:
```
Authorization: Bearer <your_token>
```

## 🧪 Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:3000

# Get all listings
curl http://localhost:3000/api/listings

# Get listings with filters
curl "http://localhost:3000/api/listings?subject=Chemistry&condition=good&priceMax=500"

# Register user
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

### Using Postman

1. Import the API endpoints
2. Set base URL: `http://localhost:3000/api`
3. For protected routes, add header:
   - Key: `Authorization`
   - Value: `Bearer <your_token>`

### Using Thunder Client (VS Code Extension)

1. Install Thunder Client extension
2. Create new request
3. Set URL and method
4. Add Authorization header for protected routes

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # MySQL connection pool
├── middleware/
│   ├── auth.js              # JWT authentication
│   └── errorHandler.js      # Error handling
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── listings.js          # Listings CRUD
│   ├── requests.js          # Request management
│   └── users.js             # User profile routes
├── .env                     # Environment variables
├── .gitignore              # Git ignore file
├── server.js               # Main application file
├── package.json            # Dependencies
├── API_DOCUMENTATION.md    # Detailed API docs
└── README.md               # This file
```

## 🔧 Configuration

### Database Connection

Edit `config/database.js` to customize connection settings.

### Security Settings

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend URL
- **Helmet**: Security headers enabled
- **JWT Expiry**: 7 days (configurable in .env)

## 🐛 Common Issues & Solutions

### 1. Database Connection Failed

**Error:** `ER_ACCESS_DENIED_ERROR`

**Solution:**
- Check MySQL is running
- Verify DB_USER and DB_PASSWORD in .env
- Ensure MySQL user has proper permissions

```sql
GRANT ALL PRIVILEGES ON bookshare.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solution:**
- Change PORT in .env to another port (e.g., 3001)
- Or kill the process using port 3000:

Windows:
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Linux/Mac:
```bash
lsof -ti:3000 | xargs kill -9
```

### 3. JWT Token Invalid

**Error:** `Invalid or expired token`

**Solution:**
- Token might have expired (7 days by default)
- Login again to get a new token
- Check JWT_SECRET matches between requests

### 4. Validation Errors

**Error:** `Valid email is required`

**Solution:**
- Check request body matches the required format
- Ensure Content-Type header is `application/json`
- Verify all required fields are provided

## 🚀 Deployment

### Deploy to Railway

1. Create account on Railway.app
2. Create new project from GitHub repo
3. Add MySQL database
4. Set environment variables
5. Deploy automatically

### Deploy to AWS EC2

1. Launch EC2 instance (Ubuntu)
2. Install Node.js and MySQL
3. Clone repository
4. Install dependencies
5. Configure environment
6. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js --name bookshare-api
pm2 save
pm2 startup
```

## 📊 Database Schema

### Users Table
```sql
user_id (PK), name, email (UNIQUE), password_hash, phone, 
avatar_url, year, department, location, rating, total_ratings,
created_at, updated_at, is_active
```

### Books Table
```sql
book_id (PK), title, author, edition, isbn, subject, 
publisher, publication_year, description, created_at
```

### Listings Table
```sql
listing_id (PK), book_id (FK), user_id (FK), condition_type,
price, description, image_urls, status, views,
created_at, updated_at
```

### Requests Table
```sql
request_id (PK), listing_id (FK), requester_id (FK), 
owner_id (FK), message, status, created_at, updated_at
```

### Transactions Table
```sql
transaction_id (PK), request_id (FK), listing_id (FK),
buyer_id (FK), seller_id (FK), amount, transaction_date,
payment_method, notes
```

### Reviews Table
```sql
review_id (PK), transaction_id (FK), reviewer_id (FK),
reviewed_user_id (FK), rating, comment, created_at
```

## 🔄 Connecting Frontend to Backend

### Update Frontend API Base URL

Edit your frontend code to use the backend API:

**Create `src/services/api.js`:**
```javascript
const API_BASE_URL = 'http://localhost:3000/api';

export const api = {
  // Auth
  register: (data) => fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  login: (data) => fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  // Listings
  getListings: (params) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE_URL}/listings?${query}`)
      .then(res => res.json());
  },

  getListing: (id) => fetch(`${API_BASE_URL}/listings/${id}`)
    .then(res => res.json()),

  createListing: (data, token) => fetch(`${API_BASE_URL}/listings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  // Requests
  createRequest: (data, token) => fetch(`${API_BASE_URL}/requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  getSentRequests: (token) => fetch(`${API_BASE_URL}/requests/sent`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json()),

  getReceivedRequests: (token) => fetch(`${API_BASE_URL}/requests/received`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json())
};
```

## 📝 Sample API Workflow

### 1. User Registration and Login

```javascript
// Register
const registerData = {
  name: "Likith N",
  email: "likith@college.edu",
  password: "password123",
  year: "II year",
  department: "CSE",
  location: "Bangalore"
};

const response = await api.register(registerData);
const { token } = response.data;

// Store token in localStorage
localStorage.setItem('token', token);
```

### 2. Create a Listing

```javascript
const listingData = {
  title: "Organic Chemistry",
  author: "Solomon & Fryhle",
  edition: "2nd",
  subject: "Chemistry",
  condition: "good",
  price: 450,
  description: "Used for one semester"
};

const token = localStorage.getItem('token');
const response = await api.createListing(listingData, token);
```

### 3. Browse and Filter Listings

```javascript
// Get all available Chemistry books under ₹500
const params = {
  subject: 'Chemistry',
  priceMax: 500,
  sortBy: 'price-low',
  page: 1,
  limit: 20
};

const response = await api.getListings(params);
const { listings, pagination } = response.data;
```

### 4. Request a Book

```javascript
const requestData = {
  listing_id: 1,
  message: "Hi! I'm interested in this book. Can we meet tomorrow?"
};

const token = localStorage.getItem('token');
const response = await api.createRequest(requestData, token);
```

## 🎓 Learning Resources

### Node.js & Express
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

### MySQL
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [SQL Tutorial](https://www.w3schools.com/sql/)

### JWT Authentication
- [JWT.io](https://jwt.io/)
- [JWT Best Practices](https://blog.logrocket.com/jwt-authentication-best-practices/)

### REST API Design
- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)

## 📞 Support

For issues or questions:
1. Check the [API Documentation](./API_DOCUMENTATION.md)
2. Review Common Issues section
3. Check database connection
4. Verify environment variables

## 📄 License

This project is created for educational purposes as part of the BookShare initiative.

## 👨‍💻 Author

**Likith N**  
USN: U25UV23T029046

---

**Happy Coding! 🚀**
