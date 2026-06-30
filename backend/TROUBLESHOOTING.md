# 🔧 STEP-BY-STEP TROUBLESHOOTING GUIDE

## YOUR CURRENT ERROR
```
curl http://localhost:3000/api/listings
{"success":false,"message":"Server error fetching listings"}
```

Let's fix this together! Follow these steps **IN ORDER**.

---

## ✅ STEP 1: Test Database Connection

### Run the test file I created:

```bash
# Open Command Prompt
cd C:\Users\HP\OneDrive\Desktop\campus-book-corner\backend

# Run the test
node test-db.js
```

### What to look for:

**✅ SUCCESS looks like this:**
```
🔌 Connecting to database...
Host: localhost
User: root
Database: bookshare
Port: 3306

🔍 Testing connection...
✅ Connection successful!

📊 Testing simple queries...
✅ Users count: 4
✅ Books count: 6
✅ Listings count: 6

🔗 Testing JOIN query...
✅ JOIN query returned 2 results
Sample result: {
  "listing_id": 1,
  "price": 450,
  ...
}

✅✅✅ ALL TESTS PASSED! ✅✅✅
```

**❌ FAILURE looks like this:**
```
❌❌❌ ERROR DETECTED ❌❌❌
Error message: Access denied for user 'root'@'localhost'
```

---

### 📊 RESULT: What happened when you ran `node test-db.js`?

**Option A: All tests passed ✅**
→ Go to **STEP 2**

**Option B: Error about password/access denied ❌**
→ Go to **FIX 1: Password Issue**

**Option C: Error about database not found ❌**
→ Go to **FIX 2: Database Issue**

**Option D: Other error ❌**
→ Copy the ENTIRE error message and tell me

---

## FIX 1: Password Issue

### Check your .env file:

```bash
# Open backend\.env in Notepad
notepad C:\Users\HP\OneDrive\Desktop\campus-book-corner\backend\.env
```

**Make sure it looks like this:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YourActualPasswordHere
DB_NAME=bookshare
DB_PORT=3306
```

**IMPORTANT:** 
- Replace `YourActualPasswordHere` with your REAL MySQL password
- NO quotes around the password
- NO spaces before or after the =

### Test your password:

```bash
# Try logging into MySQL
mysql -u root -p
# Type your password and press Enter

# If it works, you'll see:
mysql>

# Type this:
exit;
```

**Did MySQL login work?**
- ✅ YES → Update .env with this password, then run `node test-db.js` again
- ❌ NO → Your password is wrong. Reset it or use the correct one

---

## FIX 2: Database Issue

### Create/verify database:

```bash
# Login to MySQL
mysql -u root -p

# Check if bookshare exists
SHOW DATABASES;

# If bookshare is NOT in the list, create it:
CREATE DATABASE bookshare;

# Use the database
USE bookshare;

# Check tables
SHOW TABLES;
```

**You should see these 6 tables:**
- books
- listings  
- requests
- reviews
- transactions
- users

**If tables are missing**, the database wasn't created properly.

Tell me: **Which tables are missing?**

---

## ✅ STEP 2: Check Backend Logs

### Stop and restart your backend:

```bash
# In your backend terminal, press: Ctrl + C

# Restart with:
npm run dev
```

### Look at the startup logs:

**✅ GOOD logs look like:**
```
✅ Database connected successfully
🚀 BookShare API Server Started
================================
📡 Server: http://localhost:3000
💾 Database: bookshare
================================
```

**❌ BAD logs look like:**
```
❌ Database connection failed: ER_ACCESS_DENIED_ERROR
```

---

### 📊 RESULT: What do you see when backend starts?

**Option A: "Database connected successfully" ✅**
→ Go to **STEP 3**

**Option B: Error message ❌**
→ Copy the error and tell me

---

## ✅ STEP 3: Test API with Better Error Messages

### The listings.js file now has better error logging.

### Try the curl command again:

```bash
curl http://localhost:3000/api/listings
```

### Check your BACKEND TERMINAL for detailed error:

You should now see something like:
```
❌ Get listings error: [Error message here]
Error details: {
  message: '...',
  code: '...',
  sqlMessage: '...'
}
```

---

### 📊 RESULT: What error appears in backend terminal?

Copy the **ENTIRE error** from the backend terminal and tell me.

---

## ✅ STEP 4: Test Simpler Endpoint

### Let's test if basic database queries work:

```bash
# Try this simpler endpoint
curl http://localhost:3000/api/users/1
```

**What happens?**
- ✅ Returns user data → Database works, issue is with listings query
- ❌ Same error → Database connection issue

---

## 🔍 COMMON ISSUES & SOLUTIONS

### Issue #1: "Cannot find module 'mysql2'"

**Solution:**
```bash
cd backend
npm install mysql2
npm run dev
```

---

### Issue #2: "ER_NO_SUCH_TABLE: Table 'bookshare.listings' doesn't exist"

**Solution:** Database tables weren't created.

```sql
mysql -u root -p
USE bookshare;
SHOW TABLES;
```

If tables are missing, **tell me** and I'll help recreate them.

---

### Issue #3: "ECONNREFUSED"

**Solution:** MySQL service not running.

```bash
# Windows
net start MySQL80

# Check if it's running
mysql -u root -p
```

---

### Issue #4: Blank/empty response

**Check:**
1. Is backend actually running? (check terminal)
2. Correct port? (should be 3000)
3. Try: `curl http://localhost:3000` (health check)

---

## 📝 INFORMATION I NEED FROM YOU

To help you faster, please tell me:

### 1. Result of test-db.js:
```
Paste the output here
```

### 2. Backend startup logs:
```
Paste what you see when you run: npm run dev
```

### 3. Backend error when you curl:
```
Paste error from backend terminal after running curl command
```

### 4. MySQL test:
```bash
# Run this and tell me result:
mysql -u root -p
# (enter password)
USE bookshare;
SHOW TABLES;
SELECT COUNT(*) FROM listings;
```

Paste result:
```
Result here
```

---

## 🎯 QUICK DIAGNOSTIC

Run these commands and tell me the results:

```bash
# Test 1: Node version
node --version

# Test 2: MySQL service
net start MySQL80

# Test 3: MySQL login
mysql -u root -p
# (type password)
SHOW DATABASES;
exit;

# Test 4: Backend test
cd C:\Users\HP\OneDrive\Desktop\campus-book-corner\backend
node test-db.js

# Test 5: Backend start
npm run dev
# Leave it running

# Test 6: API test (new terminal)
curl http://localhost:3000
curl http://localhost:3000/api/listings
```

---

## 💡 NEXT STEPS

### Once you run these tests, tell me:

1. ✅ or ❌ for test-db.js
2. ✅ or ❌ for backend startup
3. The EXACT error message you see
4. Whether MySQL login works

Then I can give you the **EXACT FIX** for your specific issue! 🚀

---

**🔴 START HERE:** Run `node test-db.js` first and tell me what happens!
