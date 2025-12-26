# Backend API Requirements

This document outlines all the API endpoints that the frontend expects from the backend.

## Base URL

```
http://localhost:5000/api
```

Configure in `.env` file as `VITE_API_URL`

## Authentication Endpoints

### Register User

```http
POST /auth/register
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123"
}

Success Response (201):
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "jwt_token_here"
}

Error Response (400):
{
  "message": "User already exists" | "Invalid input"
}
```

### Login User

```http
POST /auth/login
Content-Type: application/json

Request Body:
{
  "identifier": "john@example.com | +1234567890",
  "password": "password123"
}

Note: `identifier` can be either an email address or a phone number; backend should accept either and authenticate accordingly.

Success Response (200):
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "jwt_token_here"
}

Error Response (401):
{
  "message": "Invalid credentials"
}
```

## Comment Endpoints

### Get Comments (with Pagination & Sorting)

```http
GET /comments?page=1&limit=10&sortBy=newest
Authorization: Bearer {jwt_token}

Query Parameters:
- page: number (default: 1)
- limit: number (default: 10)
- sortBy: 'newest' | 'mostLiked' | 'mostDisliked'

Success Response (200):
{
  "comments": [
    {
      "_id": "comment_id",
      "text": "This is a comment",
      "user": {
        "_id": "user_id",
        "name": "John Doe",
        "username": "johndoe"
      },
      "likes": ["user_id1", "user_id2"],
      "dislikes": ["user_id3"],
      "replies": [
        {
          "_id": "reply_id",
          "text": "This is a reply",
          "user": {
            "_id": "user_id",
            "name": "Jane Doe"
          },
          "createdAt": "2025-12-26T10:00:00Z"
        }
      ],
      "createdAt": "2025-12-26T10:00:00Z",
      "updatedAt": "2025-12-26T10:00:00Z"
    }
  ],
  "currentPage": 1,
  "totalPages": 5,
  "totalComments": 50
}

Error Response (401):
{
  "message": "Not authorized"
}
```

### Create Comment

```http
POST /comments
Authorization: Bearer {jwt_token}
Content-Type: application/json

Request Body:
{
  "content": "This is my comment"
}

Success Response (201):
{
  "_id": "comment_id",
  "content": "This is my comment",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "username": "johndoe"
  },
  "likes": [],
  "dislikes": [],
  "replies": [],
  "createdAt": "2025-12-26T10:00:00Z",
  "updatedAt": "2025-12-26T10:00:00Z"
}

Error Response (400):
{
  "message": "Text is required"
}

Error Response (401):
{
  "message": "Not authorized"
}
```

### Update Comment

```http
PUT /comments/:id
Authorization: Bearer {jwt_token}
Content-Type: application/json

Request Body:
{
  "content": "Updated comment text"
}

Success Response (200):
{
  "_id": "comment_id",
  "text": "Updated comment text",
  "user": {...},
  "likes": [...],
  "dislikes": [...],
  "replies": [...],
  "createdAt": "2025-12-26T10:00:00Z",
  "updatedAt": "2025-12-26T11:00:00Z"
}

Error Response (403):
{
  "message": "Not authorized to update this comment"
}

Error Response (404):
{
  "message": "Comment not found"
}
```

### Delete Comment

```http
DELETE /comments/:id
Authorization: Bearer {jwt_token}

Success Response (200):
{
  "message": "Comment deleted successfully"
}

Error Response (403):
{
  "message": "Not authorized to delete this comment"
}

Error Response (404):
{
  "message": "Comment not found"
}
```

### Like Comment

```http
POST /comments/:id/like
Authorization: Bearer {jwt_token}

Success Response (200):
{
  "_id": "comment_id",
  "text": "Comment text",
  "user": {...},
  "likes": ["user_id1", "user_id2", "current_user_id"],
  "dislikes": [],
  "replies": [...],
  "createdAt": "2025-12-26T10:00:00Z",
  "updatedAt": "2025-12-26T11:00:00Z"
}

Behavior:
- If user hasn't liked: Add user to likes array
- If user has liked: Remove user from likes array (toggle)
- If user has disliked: Remove from dislikes, add to likes

Error Response (404):
{
  "message": "Comment not found"
}
```

### Dislike Comment

```http
POST /comments/:id/dislike
Authorization: Bearer {jwt_token}

Success Response (200):
{
  "_id": "comment_id",
  "text": "Comment text",
  "user": {...},
  "likes": [],
  "dislikes": ["user_id1", "current_user_id"],
  "replies": [...],
  "createdAt": "2025-12-26T10:00:00Z",
  "updatedAt": "2025-12-26T11:00:00Z"
}

Behavior:
- If user hasn't disliked: Add user to dislikes array
- If user has disliked: Remove user from dislikes array (toggle)
- If user has liked: Remove from likes, add to dislikes

Error Response (404):
{
  "message": "Comment not found"
}
```

### Reply to Comment

```http
POST /comments/:id/reply
Authorization: Bearer {jwt_token}
Content-Type: application/json

Request Body:
{
  "content": "This is my reply"
}

Success Response (201):
{
  "_id": "comment_id",
  "content": "Original comment",
  "user": {...},
  "likes": [...],
  "dislikes": [...],
  "replies": [
    {
      "_id": "reply_id",
      "content": "This is my reply",
      "user": {
        "_id": "current_user_id",
        "name": "Current User"
      },
      "createdAt": "2025-12-26T12:00:00Z"
    }
  ],
  "createdAt": "2025-12-26T10:00:00Z",
  "updatedAt": "2025-12-26T12:00:00Z"
}

Error Response (404):
{
  "message": "Comment not found"
}
```

## Socket.io Events (Real-time)

### Server URL

```
http://localhost:5000
```

Configure in `.env` file as `VITE_SOCKET_URL`

### Connection

```javascript
// Frontend connects with JWT token
io(SOCKET_URL, {
  auth: {
    token: user.token,
  },
});
```

### Events the Frontend Listens To

#### comment:created

```javascript
// Emitted when any user creates a comment
socket.on("comment:created", (comment) => {
  // comment object same structure as GET /comments response
});
```

#### comment:updated

```javascript
// Emitted when any user updates a comment
socket.on("comment:updated", (comment) => {
  // Updated comment object
});
```

#### comment:deleted

```javascript
// Emitted when any user deletes a comment
socket.on("comment:deleted", (commentId) => {
  // Just the comment ID as string
});
```

#### comment:liked

```javascript
// Emitted when any user likes a comment
socket.on("comment:liked", (comment) => {
  // Updated comment with new likes array
});
```

#### comment:disliked

```javascript
// Emitted when any user dislikes a comment
socket.on("comment:disliked", (comment) => {
  // Updated comment with new dislikes array
});
```

## Data Models

### User Object

```typescript
{
  _id: string,
  name: string,
  username?: string,
  email: string,
  token?: string  // Only in auth responses
}
```

### Comment Object

```typescript
{
  _id: string,
  text: string,
  user: User | string,  // Populated user object or user ID
  likes: string[],      // Array of user IDs
  dislikes: string[],   // Array of user IDs
  replies: Reply[],
  createdAt: string,    // ISO date string
  updatedAt: string     // ISO date string
}
```

### Reply Object

```typescript
{
  _id: string,
  text: string,
  user: User,           // Populated user object
  createdAt: string     // ISO date string
}
```

## Validation Rules

### Comment Text

- Required: Yes
- Min length: 1
- Max length: 500 characters
- Type: String

### Reply Text

- Required: Yes
- Min length: 1
- Max length: 500 characters
- Type: String

### User Email

- Required: Yes
- Format: Valid email
- Unique: Yes

### User Password

- Required: Yes
- Min length: 6 characters

### User Name

- Required: Yes
- Min length: 2 characters

## CORS Configuration Required

The backend must allow:

```javascript
{
  origin: 'http://localhost:3000',
  credentials: true
}
```

## MongoDB Atlas Access

Ensure MongoDB Atlas allows connections from all IPs:

- Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

## Error Handling

All error responses should follow this format:

```json
{
  "message": "Error description here"
}
```

## Authorization Rules

1. **Create Comment**: Any authenticated user
2. **Update Comment**: Only comment owner
3. **Delete Comment**: Only comment owner
4. **Like/Dislike**: Any authenticated user (once per comment)
5. **Reply**: Any authenticated user

## Testing the Backend

Use these curl commands to test:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Get Comments
curl -X GET "http://localhost:5000/api/comments?page=1&limit=10&sortBy=newest" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create Comment
curl -X POST http://localhost:5000/api/comments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"Test comment"}'
```

## Important Notes

1. All authenticated endpoints require `Authorization: Bearer {token}` header
2. User ID from JWT should match the user performing actions
3. Sorting should be case-insensitive
4. Pagination should handle edge cases (page > totalPages)
5. Socket.io should verify JWT token on connection
6. Like/dislike should be idempotent (multiple clicks toggle)

---

**This frontend is ready to integrate with any backend following these specifications.**
