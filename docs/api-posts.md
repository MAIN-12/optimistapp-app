# Posts API Documentation

This document provides information about the Posts API endpoints for the OptimistApp feed system.

## Base URL

All API endpoints are prefixed with `/api/v1`

## Authentication

All endpoints require authentication via Auth0. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/posts` | Get all posts with pagination and filtering |
| POST | `/api/v1/posts` | Create a new post |
| GET | `/api/v1/posts/{id}` | Get a specific post by ID |
| PUT | `/api/v1/posts/{id}` | Update a specific post (author only) |
| DELETE | `/api/v1/posts/{id}` | Delete a specific post (author only) |

## Data Models

### Message Types

Posts can be categorized by the following types:

- `POSITIVE` - General positive messages (default)
- `PRAYER` - Prayer requests or spiritual content
- `ENCOURAGEMENT` - Encouraging messages for others
- `GRATITUDE` - Expressions of gratitude
- `MOTIVATION` - Motivational content
- `SUPPORT` - Support and help messages
- `ANNOUNCEMENT` - Important announcements

### Post Object

```typescript
{
  "id": "string (uuid)",
  "content": "string (max 2000 chars)",
  "type": "MessageType",
  "authorId": "string (uuid)",
  "circleId": "string (uuid) | null",
  "categoryId": "string (uuid) | null",
  "isAnonymous": "boolean",
  "isDaily": "boolean",
  "isPinned": "boolean",
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)",
  "author": {
    "id": "string",
    "name": "string | null",
    "nickname": "string | null",
    "picture": "string | null"
  },
  "circle": {
    "id": "string",
    "name": "string",
    "description": "string | null",
    "icon": "string | null"
  } | null,
  "category": {
    "id": "string",
    "name": "string",
    "description": "string | null",
    "icon": "string | null"
  } | null,
  "_count": {
    "comments": "number",
    "reacts": "number",
    "favorites": "number"
  }
}
```

## API Usage Examples

### 1. Get All Posts

```bash
curl -X GET "http://localhost:3000/api/v1/posts?page=1&limit=20&type=POSITIVE" \
  -H "Authorization: Bearer <your-token>"
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `authorId` (optional): Filter by author UUID
- `circleId` (optional): Filter by circle UUID
- `categoryId` (optional): Filter by category UUID
- `type` (optional): Filter by message type
- `isAnonymous` (optional): Filter anonymous posts (true/false)
- `isPinned` (optional): Filter pinned posts (true/false)
- `search` (optional): Search in post content
- `sortBy` (optional): Sort field (createdAt, updatedAt, reacts, comments)
- `sortOrder` (optional): Sort direction (asc, desc)

### 2. Create a New Post

```bash
curl -X POST "http://localhost:3000/api/v1/posts" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "content": "Today I am grateful for all the wonderful people in my life!",
    "type": "GRATITUDE",
    "isAnonymous": false
  }'
```

### 3. Get a Specific Post

```bash
curl -X GET "http://localhost:3000/api/v1/posts/123e4567-e89b-12d3-a456-426614174000" \
  -H "Authorization: Bearer <your-token>"
```

### 4. Update a Post

```bash
curl -X PUT "http://localhost:3000/api/v1/posts/123e4567-e89b-12d3-a456-426614174000" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "content": "Updated: Today I am grateful for all the wonderful people in my life!",
    "isPinned": true
  }'
```

### 5. Delete a Post

```bash
curl -X DELETE "http://localhost:3000/api/v1/posts/123e4567-e89b-12d3-a456-426614174000" \
  -H "Authorization: Bearer <your-token>"
```

## Error Responses

All errors follow a consistent format:

```json
{
  "error": "Error Type",
  "message": "Human readable error message",
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

For validation errors, an additional `validationErrors` array is included:

```json
{
  "error": "Bad Request",
  "message": "Validation failed",
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "validationErrors": [
    {
      "field": "content",
      "message": "Content is required"
    }
  ]
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `422` - Unprocessable Entity (validation error)
- `500` - Internal Server Error

## Pagination

List endpoints return paginated results:

```json
{
  "posts": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Security Considerations

- Only authenticated users can access the API
- Users can only update/delete their own posts
- Content is validated for length and safety
- Anonymous posts hide author information but are still tracked internally
- All operations are logged for audit purposes

## Rate Limiting

Currently no rate limiting is implemented, but it's recommended for production:

- Reading posts: 100 requests per minute
- Creating posts: 10 requests per minute
- Updating posts: 20 requests per minute
- Deleting posts: 5 requests per minute

## Development Notes

This API is built with:
- Next.js 15 App Router
- Prisma ORM with PostgreSQL
- Auth0 for authentication
- TypeScript for type safety
- Swagger/OpenAPI for documentation

For the complete interactive API documentation, visit `/api-doc` when the server is running.