# 🖼️ IMAGE UPLOAD & DISPLAY FIX GUIDE

## ✅ ALL ISSUES FIXED!

### Problems Fixed:
1. ✅ **Multer package added** for file uploads
2. ✅ **Upload middleware created** with validation (max 5 images, 5MB each)
3. ✅ **Backend routes updated** to handle multipart/form-data
4. ✅ **Static file serving** enabled for uploaded images
5. ✅ **Frontend API updated** to send FormData instead of JSON
6. ✅ **Frontend form updated** to include images in submission
7. ✅ **ListingCard updated** to display images from backend
8. ✅ **Fallback image** added for missing images

---

## 🚀 SETUP STEPS

### Step 1: Install Dependencies

```bash
# Navigate to backend folder
cd backend

# Install multer
npm install

# This will install multer from package.json
```

### Step 2: Verify Database Schema

Make sure you're using the `booklistings` table (not `listings`). 

Run this if needed:
```sql
USE bookshare;

-- Check if listing_images table exists
SHOW TABLES LIKE 'listing_images';

-- If it doesn't exist, create it:
CREATE TABLE IF NOT EXISTS listing_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    listing_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES booklistings(listing_id) ON DELETE CASCADE,
    INDEX idx_listing (listing_id),
    INDEX idx_primary (is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Step 3: Create Uploads Folder

The server will auto-create this, but you can create it manually:

```bash
# In backend folder
mkdir uploads
```

### Step 4: Update .env (if needed)

Make sure your backend .env has:
```
PORT=3000
FRONTEND_URL=http://localhost:8080
```

And frontend .env has:
```
VITE_API_URL=http://localhost:3000/api
```

### Step 5: Restart Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd ..
npm run dev
```

---

## 📝 HOW IT WORKS NOW

### 1. **User Uploads Images** (Sell Page)
   - User selects up to 5 images
   - Images are stored in `formData.images` as File objects
   - Validated: max 5MB each, only jpg/png/gif/webp

### 2. **Form Submission**
   - Frontend creates FormData (not JSON)
   - Appends all form fields + image files
   - Sends to `POST /api/listings` with Authorization header

### 3. **Backend Receives**
   - Multer middleware intercepts request
   - Saves images to `backend/uploads/` folder
   - Generates unique filenames: `book-1234567890-randomnumber.jpg`
   - Passes file info to route handler

### 4. **Database Storage**
   - Creates listing in `booklistings` table
   - Stores image paths in `listing_images` table
   - First image marked as `is_primary = true`

### 5. **Image Display**
   - Backend serves images via `/uploads/:filename`
   - Frontend constructs full URL: `http://localhost:3000/uploads/book-xxx.jpg`
   - ListingCard displays image with fallback

---

## 🎨 FILE STRUCTURE

```
campus-book-corner/
├── backend/
│   ├── middleware/
│   │   └── upload.js          ← NEW! Multer config
│   ├── routes/
│   │   └── listings.js        ← UPDATED! Handles file uploads
│   ├── uploads/               ← NEW! Uploaded images stored here
│   │   └── book-*.jpg
│   ├── server.js              ← UPDATED! Serves static files
│   └── package.json           ← UPDATED! Includes multer
└── src/
    ├── services/
    │   └── api.js             ← UPDATED! Sends FormData
    ├── pages/
    │   └── Sell.tsx           ← UPDATED! Includes images in submit
    └── components/
        └── common/
            └── ListingCard.tsx ← UPDATED! Displays images properly
```

---

## 🧪 TESTING

### Test Image Upload:
1. Go to http://localhost:8080/sell
2. Fill in book details
3. Upload 1-5 images (Step 2)
4. Complete all steps and submit
5. Check:
   - Backend console: "✅ Saved X images"
   - Database: SELECT * FROM listing_images;
   - File system: backend/uploads/ folder
   - Frontend: Image should display in listings

### Test Image Display:
1. Go to http://localhost:8080/listings
2. See uploaded book image
3. Click on book to see all images
4. If image fails to load:
   - Check backend console for errors
   - Verify image exists in uploads/ folder
   - Check network tab for 404 errors

---

## 🐛 TROUBLESHOOTING

### Images not uploading?
```bash
# Check backend console for errors
# Common issues:
- Multer not installed: npm install
- Permission denied: chmod 755 uploads/
- Max file size exceeded: Use images under 5MB
```

### Images not displaying?
```bash
# Check:
1. Backend serving uploads: curl http://localhost:3000/uploads/book-xxx.jpg
2. CORS headers allow images: Check Network tab
3. Image paths in DB: SELECT * FROM listing_images;
4. Frontend constructing correct URL
```

### Database errors?
```sql
-- Check tables exist:
SHOW TABLES;

-- Should see: booklistings, listing_images, users, book_requests

-- If listing_images missing, run schema.sql
```

---

## ✨ SUCCESS CHECKLIST

- [ ] Multer installed (`npm list multer` in backend)
- [ ] `uploads/` folder exists in backend
- [ ] `listing_images` table exists in database
- [ ] Backend server running on port 3000
- [ ] Frontend running on port 8080
- [ ] Can upload images in /sell page
- [ ] Images save to `uploads/` folder
- [ ] Images display in listings
- [ ] Console shows "✅ Saved X images"

---

## 🎯 WHAT'S NEW

### Backend Files:
- ✨ `middleware/upload.js` - Multer configuration
- 🔄 `routes/listings.js` - Accepts multipart/form-data
- 🔄 `server.js` - Serves static files from uploads/
- 🔄 `package.json` - Includes multer dependency

### Frontend Files:
- 🔄 `services/api.js` - Sends FormData with images
- 🔄 `pages/Sell.tsx` - Includes images in submission
- 🔄 `components/common/ListingCard.tsx` - Displays backend images

---

## 📞 STILL HAVING ISSUES?

1. Check backend console for errors
2. Check browser console for network errors
3. Verify database connection
4. Make sure ports 3000 and 8080 are not blocked
5. Try uploading a small (< 1MB) JPEG first

Your images should now upload and display correctly! 🎉
