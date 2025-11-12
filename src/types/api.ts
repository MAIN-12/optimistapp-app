// ===============================
// ENUMS
// ===============================

export enum MessageType {
  POSITIVE = 'POSITIVE',
  PRAYER = 'PRAYER',
  ENCOURAGEMENT = 'ENCOURAGEMENT',
  GRATITUDE = 'GRATITUDE',
  MOTIVATION = 'MOTIVATION',
  SUPPORT = 'SUPPORT',
  ANNOUNCEMENT = 'ANNOUNCEMENT'
}

// ===============================
// POST INTERFACES
// ===============================

export interface CreatePostRequest {
  content: string;
  type?: MessageType;
  circleId?: string;
  categoryId?: string;
  isAnonymous?: boolean;
  isPinned?: boolean;
}

export interface UpdatePostRequest {
  content?: string;
  type?: MessageType;
  circleId?: string;
  categoryId?: string;
  isAnonymous?: boolean;
  isPinned?: boolean;
}

export interface PostResponse {
  id: string;
  content: string;
  type: MessageType;
  authorId: string;
  circleId?: string;
  categoryId?: string;
  isAnonymous: boolean;
  isDaily: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    name?: string;
    nickname?: string;
    picture?: string;
  };
  circle?: {
    id: string;
    name: string;
    description?: string;
    icon?: string;
  };
  category?: {
    id: string;
    name: string;
    description?: string;
    icon?: string;
  };
  _count?: {
    comments: number;
    reacts: number;
    favorites: number;
  };
}

export interface PostsListResponse {
  posts: PostResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ===============================
// QUERY PARAMETERS
// ===============================

export interface PostsQueryParams {
  page?: number;
  limit?: number;
  authorId?: string;
  circleId?: string;
  categoryId?: string;
  type?: MessageType;
  isAnonymous?: boolean;
  isPinned?: boolean;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'reacts' | 'comments';
  sortOrder?: 'asc' | 'desc';
}

// ===============================
// API ERROR RESPONSES
// ===============================

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}

export interface ValidationError extends ApiError {
  validationErrors: Array<{
    field: string;
    message: string;
  }>;
}