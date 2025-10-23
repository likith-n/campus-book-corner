# BookShare — Old Book Exchange Platform

A modern, accessible, and student-friendly marketplace for buying and selling used academic books. Built with React, TypeScript, Tailwind CSS, and designed with a mobile-first approach.

## 🎯 Project Overview

BookShare connects students to exchange used academic textbooks, helping them save money while promoting sustainability. The platform features an intuitive interface, smart filtering, responsive design, and accessibility-first development.

**Tech Stack:**
- ⚛️ React 18 (Functional components with hooks)
- 🔷 TypeScript
- 🎨 Tailwind CSS (utility-first styling)
- 🛣️ React Router v6
- 🔄 TanStack Query (React Query)
- 🎭 Shadcn/ui components
- ⚡ Vite (Fast build tool)
- 🧪 Jest + React Testing Library (for testing)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn installed
- Git

### Installation & Setup

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd bookshare

# Install dependencies
npm install

# Start development server
npm run dev

# The app will be available at http://localhost:8080
```

### Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## 📁 Project Structure

```
bookshare/
├── src/
│   ├── assets/              # Images and static files
│   │   └── hero-books.jpg
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   │   ├── ListingCard.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── SkeletonLoader.tsx
│   │   ├── layout/          # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/              # Shadcn UI components
│   ├── data/
│   │   └── mockData.ts      # Mock API data
│   ├── hooks/               # Custom React hooks
│   │   └── use-mobile.tsx
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── pages/               # Route pages
│   │   ├── Index.tsx        # Home/Discover page
│   │   ├── Listings.tsx     # Browse books with filters
│   │   ├── ListingDetail.tsx
│   │   ├── Sell.tsx         # Multi-step listing form
│   │   ├── Requests.tsx     # Manage requests
│   │   ├── Profile.tsx      # User profile
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   └── NotFound.tsx
│   ├── types/
│   │   └── index.ts         # TypeScript interfaces
│   ├── App.tsx              # Main app component
│   ├── index.css            # Global styles & design system
│   └── main.tsx             # App entry point
├── public/
│   └── robots.txt
├── index.html
├── tailwind.config.ts       # Tailwind configuration
├── vite.config.ts
├── package.json
└── README.md
```

## 🎨 Design System

### Color Palette

The design system uses HSL colors defined in `src/index.css`:

**Light Mode:**
- Primary: `hsl(221 83% 53%)` - Academic deep blue
- Secondary: `hsl(38 92% 50%)` - Warm amber for CTAs
- Success: `hsl(142 71% 45%)` - Transaction success
- Background: `hsl(0 0% 98%)` - Soft white
- Foreground: `hsl(222 47% 11%)` - Dark text

**Dark Mode:**
- Automatically switches with theme toggle
- Adjusted contrast for readability

### Typography

- **Font Family:** Inter (sans-serif)
- **Headings:** Semibold, tight tracking
- **Body:** Regular weight, antialiased

### Spacing & Shadows

All spacing follows Tailwind's default scale. Custom shadows defined in design tokens:
- `--shadow-card`: Subtle card elevation
- `--shadow-md`: Medium depth
- `--shadow-lg`: High elevation for modals

### Animations

- Fade-in on page load (`animate-fade-in`)
- Card hover: Lift effect with shadow increase
- 200ms transitions for smooth interactions

## 🧩 Key Features

### 1. Home / Discover Page (`/`)
- Hero section with prominent search bar
- Featured listings (4 books)
- "How It Works" section (3 steps)
- Call-to-action for browsing and listing

### 2. Listings Page (`/listings`)
- Grid layout with filtering sidebar
- Filters: Subject, Condition, Price Range
- Sort options: Newest, Price (low/high), Popular
- Mobile: Collapsible filter sheet
- Pagination ready (currently shows all)

### 3. Listing Detail Page (`/listings/:id`)
- Image gallery with multiple photos
- Book details: title, author, edition, subject, condition, price
- Seller info card with rating and location
- Request button opens dialog for messaging
- Breadcrumb navigation

### 4. Sell / Create Listing (`/sell`)
- Multi-step form (4 steps):
  1. Book details (title, author, edition, subject)
  2. Photo upload (drag & drop)
  3. Pricing & condition
  4. Review & publish
- Progress indicator
- Client-side validation
- Image preview

### 5. Requests Page (`/requests`)
- Tabs: Sent vs. Received
- Status badges: Pending, Accepted, Rejected, Completed
- Accept/Decline actions for received requests
- Chat button for sent requests

### 6. Profile Page (`/profile/:userId`)
- User info: name, year, department, rating, location
- Tabs: Active Listings, Sold, Reviews
- Edit profile button (for own profile)
- Empty states with CTAs

### 7. Authentication Pages
- **Login** (`/login`): Email/password + social login placeholder
- **Signup** (`/signup`): Full registration form with optional fields

## 🔌 Mock API & Data

### Mock Endpoints

The app uses in-memory mock data (`src/data/mockData.ts`). In production, replace with real API calls.

**Example Endpoints (Conceptual):**

```
GET    /api/listings?page=1&subject=Chemistry&condition=good
POST   /api/listings
GET    /api/listings/:id
POST   /api/requests
GET    /api/requests?userId=123
GET    /api/users/:userId
```

### Sample Data Structure

**Book Listing:**
```json
{
  "id": "1",
  "title": "Organic Chemistry — 2nd Edition",
  "author": "Solomon & Fryhle",
  "edition": "2nd",
  "subject": "Chemistry",
  "condition": "good",
  "price": 450,
  "description": "Used for one semester. Highlighted chapters: 2, 5, 8...",
  "images": ["/placeholder.svg"],
  "ownerId": "1",
  "ownerName": "Nikhil P.",
  "ownerRating": 4.9,
  "createdAt": "2024-01-15"
}
```

**User:**
```json
{
  "id": "1",
  "name": "Nikhil P.",
  "email": "nikhil@example.com",
  "rating": 4.9,
  "year": "II year",
  "department": "CSE",
  "location": "Bangalore"
}
```

**Request:**
```json
{
  "id": "1",
  "bookId": "1",
  "bookTitle": "Organic Chemistry — 2nd Edition",
  "requesterId": "2",
  "requesterName": "Priya S.",
  "ownerId": "1",
  "status": "pending",
  "message": "Hi! I need this for my semester exam...",
  "createdAt": "2024-01-16"
}
```

### Sample CURL Commands

```bash
# Get all listings
curl http://localhost:8080/api/listings

# Get listings with filters
curl "http://localhost:8080/api/listings?subject=Chemistry&condition=good&priceMax=500"

# Create a new listing
curl -X POST http://localhost:8080/api/listings \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Data Structures in C",
    "author": "Tanenbaum",
    "edition": "4th",
    "subject": "Computer Science",
    "condition": "good",
    "price": 420,
    "description": "Well maintained copy"
  }'

# Send a book request
curl -X POST http://localhost:8080/api/requests \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": "1",
    "message": "Interested in buying. Can we meet?"
  }'
```

## ♿ Accessibility Features

- ✅ **Semantic HTML:** `<header>`, `<main>`, `<nav>`, `<article>`, `<footer>`
- ✅ **ARIA labels:** All interactive elements have descriptive labels
- ✅ **Alt text:** Meaningful descriptions for all images
- ✅ **Keyboard navigation:** Full keyboard support with visible focus states
- ✅ **Color contrast:** Meets WCAG AA standards (4.5:1 for text)
- ✅ **Screen reader friendly:** Toast notifications with `role="status"`
- ✅ **Form validation:** Clear error messages and required field indicators

### Keyboard Shortcuts

- `Tab` / `Shift+Tab`: Navigate between interactive elements
- `Enter`: Activate buttons and links
- `Escape`: Close modals and dialogs
- Arrow keys: Navigate through dropdowns and selects

## 📱 Responsive Design

### Breakpoints

- **Mobile:** ≤640px (single column, hamburger menu)
- **Tablet:** 641px - 1024px (2-column grid)
- **Desktop:** ≥1025px (3-4 column grid, sidebar filters)

### Mobile Optimizations

- Collapsible navigation menu
- Filter panel in slide-out sheet
- Touch-friendly button sizes (min 44x44px)
- Optimized image loading with placeholders
- Stacked card layouts

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Sample Tests

**ListingCard Component Test:**
```typescript
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ListingCard from '@/components/common/ListingCard';

test('renders listing card with book details', () => {
  const mockBook = {
    id: '1',
    title: 'Test Book',
    author: 'Test Author',
    price: 100,
    condition: 'good',
    // ... other required fields
  };

  render(
    <BrowserRouter>
      <ListingCard book={mockBook} />
    </BrowserRouter>
  );

  expect(screen.getByText('Test Book')).toBeInTheDocument();
  expect(screen.getByText('₹100')).toBeInTheDocument();
});
```

**SearchBar Component Test:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '@/components/common/SearchBar';

test('calls onSearch with query when form is submitted', () => {
  const handleSearch = jest.fn();
  render(<SearchBar onSearch={handleSearch} />);

  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'Chemistry' } });
  fireEvent.submit(input.closest('form'));

  expect(handleSearch).toHaveBeenCalledWith('Chemistry');
});
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Deployment Platforms

**Netlify:**
1. Connect your GitHub repo
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

**Vercel:**
1. Import your Git repository
2. Vercel auto-detects Vite settings
3. Deploy with one click

**Manual Deployment:**
```bash
npm run build
# Upload the dist/ folder to your hosting provider
```

### Environment Variables

For production, create a `.env.production` file:

```
VITE_API_BASE_URL=https://api.bookshare.com
VITE_IMAGE_CDN=https://cdn.bookshare.com
```

## 🔒 Security & Safety

### Input Validation

- All form inputs are validated client-side
- Price inputs limited to reasonable ranges
- File uploads restricted to images only (max 10MB)
- XSS protection via React's built-in escaping

### Safety Tips (User-Facing)

Displayed in footer and help sections:
- Meet in public places on campus
- Inspect books before payment
- Use university email for verification
- Report suspicious activity

## 🎯 Demo Script (Local QA)

### Test Scenario 1: Browse and Search
1. Visit `http://localhost:8080`
2. Use the hero search bar to search "Chemistry"
3. Navigate to `/listings`
4. Apply filters: Subject = "Chemistry", Condition = "Good"
5. Click on a listing to view details

### Test Scenario 2: Create a Listing
1. Click "List Your Books" or navigate to `/sell`
2. Fill in Step 1: Book details (title, author, edition, subject)
3. Step 2: Upload sample images (any image files)
4. Step 3: Select condition and enter price
5. Step 4: Review and publish
6. Verify success toast and redirect to `/listings`

### Test Scenario 3: Send a Request
1. Go to any listing detail page
2. Click "Request This Book"
3. Enter a message in the dialog
4. Submit request
5. Check `/requests` page to see the sent request

### Test Scenario 4: Dark Mode Toggle
1. Click the moon/sun icon in header
2. Verify smooth theme transition
3. Check that all colors and contrasts work in dark mode

### Test Scenario 5: Mobile Responsiveness
1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on iPhone 12 Pro, iPad, and desktop sizes
4. Verify hamburger menu, filter sheet, and touch targets

## 🎨 Design Tokens (CSS Variables)

Located in `src/index.css`:

```css
:root {
  /* Colors */
  --primary: 221 83% 53%;
  --secondary: 38 92% 50%;
  --success: 142 71% 45%;
  --background: 0 0% 98%;
  --foreground: 222 47% 11%;
  
  /* Shadows */
  --shadow-card: 0 2px 8px rgb(0 0 0 / 0.08);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  /* Spacing */
  --radius: 0.75rem;
}
```

Designers can customize these values to match brand guidelines.

## 📦 Dependencies

### Production Dependencies
- `react`, `react-dom` - Core React
- `react-router-dom` - Client-side routing
- `@tanstack/react-query` - Data fetching & caching
- `tailwindcss` - Utility-first CSS
- `@radix-ui/*` - Accessible UI primitives
- `lucide-react` - Icon library
- `sonner` - Toast notifications
- `zod` - Schema validation

### Dev Dependencies
- `vite` - Build tool
- `typescript` - Type safety
- `eslint` - Code linting
- `@vitejs/plugin-react-swc` - Fast React refresh

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Guidelines

- `feat: add listing filter by price range`
- `fix: resolve mobile menu not closing`
- `chore: update dependencies`
- `docs: improve README setup instructions`
- `test: add listingcard component tests`

## 📄 License

This project is built for educational purposes as a student marketplace MVP.

## 🙏 Acknowledgments

- Design inspiration: Airbnb, Goodreads, OLX
- UI Components: Shadcn/ui
- Icons: Lucide React
- Fonts: Inter (Google Fonts)

---

**Built with ❤️ for students, by students.**

For questions or support, reach out to the development team or open an issue on GitHub.
