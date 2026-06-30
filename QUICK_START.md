# 🚀 Quick Start Reference Card

## Starting the Application

### Backend (Terminal 1)
```bash
cd backend
npm run dev
```
Server: http://localhost:3000

### Frontend (Terminal 2)
```bash
npm run dev
```
App: http://localhost:8080

---

## Quick Commands

### Backend
```bash
npm start          # Production mode
npm run dev        # Development mode (auto-reload)
```

### Frontend
```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## API Quick Reference

### Base URL
```
http://localhost:3000/api
```

### Common Endpoints
```bash
# Get all listings
GET /listings

# Get with filters
GET /listings?subject=Chemistry&condition=good&priceMax=500

# Register user
POST /auth/register
Body: { name, email, password, year, department, location }

# Login
POST /auth/login
Body: { email, password }

# Create listing (requires auth)
POST /listings
Headers: Authorization: Bearer <token>
Body: { title, author, edition, subject, condition, price }

# Create request (requires auth)
POST /requests
Headers: Authorization: Bearer <token>
Body: { listing_id, message }
```

---

## Database Quick Access

```bash
# Connect to MySQL
mysql -u root -p

# Select database
USE bookshare;

# View tables
SHOW TABLES;

# View users
SELECT * FROM users;

# View listings
SELECT * FROM listings;

# View requests
SELECT * FROM requests;
```

---

## Test Credentials

After creating password hash:

```
Email: likith@college.edu
Password: USE bookshare;

ALTER TABLE listings 
MODIFY COLUMN condition_type ENUM('new', 'like-new', 'good', 'fair', 'acceptable') NOT NULL;
```

Create hash:
```bash
cd backend
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('password123', 10));"
```

Update database:
```sql
UPDATE users SET password_hash = 'YOUR_HASH' WHERE email = 'likith@college.edu';
```

---

## Project Structure

```
campus-book-corner/
├── backend/           # Node.js + Express API
│   ├── routes/        # API endpoints
│   ├── config/        # Database config
│   └── .env           # Environment variables
├── src/               # React frontend
│   ├── pages/         # Route components
│   ├── components/    # Reusable components
│   └── services/      # API integration
└── .env               # Frontend config
```

---

## Common Issues

### Database connection failed
✅ Check MySQL is running
✅ Verify credentials in backend/.env
✅ Check DB_PASSWORD is correct

### Port already in use
✅ Kill process or change port in .env

### CORS errors
✅ Ensure backend is running
✅ Check FRONTEND_URL in backend/.env

### 401 Unauthorized
✅ Check token is in localStorage
✅ Add Authorization header: Bearer <token>

---

## URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:8080 |
| Backend | http://localhost:3000 |
| API Docs | http://localhost:3000 |
| MySQL | localhost:3306 |

---

## File Locations

| File | Purpose |
|------|---------|
| backend/.env | Backend config |
| .env | Frontend config |
| backend/server.js | Main server |
| src/App.tsx | Main React app |
| src/services/api.js | API integration |

---

## Git Commands

```bash
git status              # Check changes
git add .               # Stage all changes
git commit -m "msg"     # Commit changes
git push origin main    # Push to remote
```

---

## Useful VS Code Extensions

- Thunder Client (API testing)
- MySQL (database management)
- ESLint (code linting)
- Prettier (code formatting)
- GitLens (git integration)

---

**Need detailed help?** See SETUP_GUIDE.md  
**API documentation?** See backend/API_DOCUMENTATION.md
