// Database-aligned types matching actual MySQL schema

export interface User {
  user_id: number;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  year?: string;
  department?: string;
  location?: string;
  rating: number;
  total_ratings: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Book {
  book_id: number;
  title: string;
  author: string;
  edition?: string;
  isbn?: string;
  subject: string;
  publisher?: string;
  publication_year?: number;
  description?: string;
  created_at: string;
}

export interface Listing {
  listing_id: number;
  book_id: number;
  user_id: number;
  condition_type: 'new' | 'good' | 'fair';
  price: number;
  description?: string;
  image_urls?: string; // Comma-separated URLs or JSON array
  status: 'available' | 'pending' | 'sold' | 'removed';
  views: number;
  created_at: string;
  updated_at: string;
  // Joined fields from books table
  title?: string;
  author?: string;
  subject?: string;
  edition?: string;
  // Joined fields from users table
  owner_id?: number;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  owner_rating?: number;
  owner_total_ratings?: number;
  owner_location?: string;
  owner_avatar?: string;
}

export interface BookRequest {
  request_id: number;
  listing_id: number;
  requester_id: number;
  owner_id: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  // Joined fields for display
  book_title?: string;
  book_author?: string;
  book_edition?: string;
  book_subject?: string;
  book_price?: number;
  book_condition?: string;
  requester_name?: string;
  requester_email?: string;
  requester_phone?: string;
  requester_rating?: number;
  requester_location?: string;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  owner_rating?: number;
  owner_location?: string;
}

export interface Transaction {
  transaction_id: number;
  request_id: number;
  listing_id: number;
  buyer_id: number;
  seller_id: number;
  amount: number;
  payment_method?: string;
  notes?: string;
  created_at: string;
}

export interface Review {
  review_id: number;
  transaction_id: number;
  reviewer_id: number;
  reviewed_user_id: number;
  rating: number; // 1-5
  comment?: string;
  created_at: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    listings: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// Form/Filter types
export interface FilterOptions {
  subject?: string;
  condition?: string;
  priceMin?: number;
  priceMax?: number;
  search?: string;
  sortBy?: SortOption;
  page?: number;
  limit?: number;
}

export type SortOption = 'newest' | 'price-low' | 'price-high' | 'popular';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  year?: string;
  department?: string;
  location?: string;
}

export interface CreateListingData {
  title: string;
  author: string;
  edition?: string;
  subject: string;
  isbn?: string;
  publisher?: string;
  publication_year?: number;
  condition: 'new' | 'good' | 'fair';
  price: number;
  description?: string;
  image_urls?: string;
}

export interface CreateRequestData {
  listing_id: number;
  message?: string;
}

export interface CompleteTransactionData {
  amount: number;
  payment_method?: string;
  notes?: string;
}

// Auth types
export interface AuthUser {
  user: User;
  token: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}
