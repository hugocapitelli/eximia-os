export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  progress?: number; // 0-100
  status: 'reading' | 'available' | 'loaned' | 'overdue';
  loanedTo?: string;
  daysRemaining?: number; // For profile view
  category?: string;
  rating?: number;
  addedDate?: string;
}

export interface User {
  name: string;
  avatarUrl: string;
  email: string;
  memberSince: string;
  stats: {
    booksRead: number;
    readingNow: number;
    avgTime: string;
  };
}

export interface Loan {
  bookId: string;
  personName: string;
  personAvatar?: string; // Color or Url
  personInitials: string;
  loanDate: string;
  returnDate: string;
  status: 'returned' | 'active' | 'archived';
}
