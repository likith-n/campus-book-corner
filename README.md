# Campus Book Corner

A complete full-stack web application for managing a campus bookstore with user authentication, book management, shopping cart, and order processing.

## Features

### User Features
- User Registration and Login
- Browse books by category
- Search books by title, author, or ISBN
- Add books to shopping cart
- Place orders
- View order history

### Admin Features
- Add new books to inventory
- Delete books
- Manage orders (update status)
- View all users
- View all orders

## Database Schema

### Tables

1. **users**
   - user_id (INT, PRIMARY KEY, AUTO_INCREMENT)
   - username (VARCHAR(50), UNIQUE, NOT NULL)
   - email (VARCHAR(100), UNIQUE, NOT NULL)
   - password (VARCHAR(255), NOT NULL)
   - full_name (VARCHAR(100), NOT NULL)
   - phone (VARCHAR(15))
   - address (TEXT)
   - role (ENUM: 'student', 'admin')
   - created_at (TIMESTAMP)

2. **books**
   - book_id (INT, PRIMARY KEY, AUTO_INCREMENT)
   - title (VARCHAR(255), NOT NULL)
   - author (VARCHAR(100), NOT NULL)
   - isbn (VARCHAR(20), UNIQUE)
   - category (VARCHAR(50))
   - price (DECIMAL(10, 2), NOT NULL)
   - quantity (INT)
   - description (TEXT)
   - publisher (VARCHAR(100))
   - publication_year (INT)
   - created_at (TIMESTAMP)

3. **orders**
   - order_id (INT, PRIMARY KEY, AUTO_INCREMENT)
   - user_id (INT, FOREIGN KEY)
   - order_date (TIMESTAMP)
   - total_amount (DECIMAL(10, 2), NOT NULL)
   - status (ENUM: 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled')

4. **order_items**
   - order_item_id (INT, PRIMARY KEY, AUTO_INCREMENT)
   - order_id (INT, FOREIGN KEY)
   - book_id (INT, FOREIGN KEY)
   - quantity (INT, NOT NULL)
   - price (DECIMAL(10, 2), NOT NULL)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server (v8.0 or higher)
- Web browser

### Step 1: Database Setup

1. Open MySQL Workbench or MySQL Command Line
2. Run the SQL script to create database and tables:
   ```bash
   mysql -u root -p < backend/database.sql
   ```
   Or manually execute the queries in `backend/database.sql`

### Step 2: Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Open the `.env` file
   - Update the MySQL credentials:
     ```
     DB_USER=root
     DB_PASSWORD=your_mysql_password
     ```

4. Start the backend server:
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:5000`

### Step 3: Frontend Setup

1. Open the `frontend` folder
2. Open `index.html` in your web browser
   - You can use Live Server extension in VS Code, or
   - Simply double-click `index.html` to open in browser

## Default Login Credentials

### Admin Account
- Username: `admin`
- Password: `admin123`

### Student Account
- Username: `john_doe`
- Password: `student123`

## API Endpoints

### Books
- GET `/api/books` - Get all books
- GET `/api/books/:id` - Get book by ID
- GET `/api/books/search/:query` - Search books
- GET `/api/books/category/:category` - Get books by category
- POST `/api/books` - Add new book (Admin)
- PUT `/api/books/:id` - Update book (Admin)
- DELETE `/api/books/:id` - Delete book (Admin)

### Users
- GET `/api/users` - Get all users
- GET `/api/users/:id` - Get user by ID
- POST `/api/users/register` - Register new user
- POST `/api/users/login` - User login
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user

### Orders
- GET `/api/orders` - Get all orders
- GET `/api/orders/:id` - Get order by ID
- GET `/api/orders/user/:userId` - Get orders by user
- POST `/api/orders` - Create new order
- PUT `/api/orders/:id/status` - Update order status
- DELETE `/api/orders/:id` - Cancel order

## Project Structure

```
campus-book-corner/
├── backend/
│   ├── routes/
│   │   ├── bookRoutes.js
│   │   ├── userRoutes.js
│   │   └── orderRoutes.js
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── database.sql
└── frontend/
    ├── index.html
    ├── styles.css
    └── script.js
```

## Technologies Used

### Backend
- Node.js
- Express.js
- MySQL2
- CORS
- dotenv

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- Fetch API

## Usage Guide

### For Students
1. Register a new account or login with existing credentials
2. Browse available books on the Books page
3. Search for specific books or filter by category
4. Add books to your cart
5. Review your cart and place order
6. View your order history in My Orders section

### For Admin
1. Login with admin credentials
2. Access Admin Dashboard
3. Manage Books:
   - Add new books with all details
   - Delete books from inventory
4. Manage Orders:
   - View all orders
   - Update order status
5. View all registered users

## Troubleshooting

### Backend Issues
- **Port already in use**: Change the PORT in `.env` file
- **Database connection failed**: Check MySQL credentials in `.env`
- **CORS errors**: Ensure CORS is enabled in `server.js`

### Frontend Issues
- **API calls failing**: Check if backend server is running on port 5000
- **Login not working**: Verify database has sample users
- **Books not loading**: Check browser console for errors

## Notes

- Passwords are stored in plain text for demonstration purposes. In production, use bcrypt for password hashing.
- The application uses localStorage for cart persistence
- Admin features are only accessible to users with admin role
- Sample data is automatically inserted when running database.sql

## Future Enhancements
- Password encryption with bcrypt
- JWT authentication
- File upload for book images
- Payment gateway integration
- Email notifications for orders
- Book reviews and ratings
- Wishlist functionality
- Advanced search filters

## Support

For issues or questions, please check:
1. MySQL is running and accessible
2. Backend server is running on port 5000
3. Frontend is properly connecting to backend
4. All dependencies are installed

## License

This project is created for educational purposes.
