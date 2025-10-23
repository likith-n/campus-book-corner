export interface Book {
  id: string;
  title: string;
  author: string;
  edition: string;
  subject: string;
  condition: "new" | "good" | "fair";
  price: number;
  description: string;
  images: string[];
  ownerId: string;
  ownerName: string;
  ownerRating: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  rating: number;
  year: string;
  department: string;
  location: string;
}

export interface BookRequest {
  id: string;
  bookId: string;
  bookTitle: string;
  requesterId: string;
  requesterName: string;
  ownerId: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  message: string;
  createdAt: string;
}

export interface FilterOptions {
  subject: string[];
  condition: string[];
  priceMin: number;
  priceMax: number;
}

export type SortOption = "newest" | "price-low" | "price-high" | "popular";
