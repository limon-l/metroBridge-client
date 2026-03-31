# Backend Integration Guide

## Overview

This guide shows how to integrate the MetroBridge frontend with a backend API. Currently, the application uses localStorage for data persistence. This guide will help you connect it to a real database.

---

## API Endpoints Structure

### Base URL

```
http://localhost:5000/api
```

---

## 1. Community Feed / Posts API

### Get All Posts

```
GET /api/posts
GET /api/posts?limit=20&offset=0
GET /api/posts?userId=xxxxx

Response:
{
  "success": true,
  "data": [
    {
      "_id": "id",
      "content": "Post content",
      "author": {
        "id": "userId",
        "name": "John Doe",
        "avatar": "url"
      },
      "media": [{ url: "image-url", type: "image" }],
      "reactions": { "userId1": "like", "userId2": "love" },
      "commentCount": 5,
      "shareCount": 2,
      "createdAt": "2026-03-31T10:00:00Z",
      "updatedAt": "2026-03-31T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 20,
    "offset": 0
  }
}
```

### Create Post

```
POST /api/posts
Header: Authorization: Bearer token
Body: {
  "content": "Post content",
  "media": ["base64-image-data"] // Optional
}

Response:
{
  "success": true,
  "data": { ...post object }
}
```

### Update Post

```
PUT /api/posts/:postId
Header: Authorization: Bearer token
Body: {
  "content": "Updated content"
}

Response: { success: true, data: {...updated post} }
```

### Delete Post

```
DELETE /api/posts/:postId
Header: Authorization: Bearer token

Response: { success: true, message: "Post deleted" }
```

### Add Reaction

```
POST /api/posts/:postId/react
Header: Authorization: Bearer token
Body: {
  "reaction": "like" // like, love, haha, wow, sad, angry, null (to remove)
}

Response: { success: true, data: {...post with updated reactions} }
```

---

## 2. Comments API

### Get Comments for Post

```
GET /api/posts/:postId/comments

Response:
{
  "success": true,
  "data": [
    {
      "_id": "commentId",
      "postId": "postId",
      "text": "Comment text",
      "author": { id, name, avatar },
      "createdAt": "2026-03-31T10:00:00Z"
    }
  ]
}
```

### Add Comment

```
POST /api/posts/:postId/comments
Header: Authorization: Bearer token
Body: {
  "text": "Comment text"
}

Response: { success: true, data: {...comment} }
```

### Delete Comment

```
DELETE /api/posts/:postId/comments/:commentId
Header: Authorization: Bearer token

Response: { success: true }
```

---

## 3. Messages / Chat API

### Get Conversations

```
GET /api/conversations
Header: Authorization: Bearer token

Response:
{
  "success": true,
  "data": [
    {
      "_id": "conversationId",
      "participants": [
        { id: "id1", name: "Name1" },
        { id: "id2", name: "Name2" }
      ],
      "lastMessage": "message text",
      "lastMessageTime": "2026-03-31T10:00:00Z",
      "unreadCount": 3
    }
  ]
}
```

### Create or Get Conversation

```
POST /api/conversations
Header: Authorization: Bearer token
Body: {
  "participantId": "userId" // The other person in chat
}

Response: { success: true, data: {...conversation} }
```

### Get Messages in Conversation

```
GET /api/conversations/:conversationId/messages
Header: Authorization: Bearer token

Response:
{
  "success": true,
  "data": [
    {
      "_id": "messageId",
      "conversationId": "convId",
      "senderId": "userId",
      "text": "Message text",
      "timestamp": "2026-03-31T10:00:00Z",
      "read": true
    }
  ]
}
```

### Send Message

```
POST /api/conversations/:conversationId/messages
Header: Authorization: Bearer token
Body: {
  "text": "Message text",
  "attachment": "file-url" // Optional
}

Response: { success: true, data: {...message} }
```

### Mark Messages as Read

```
PUT /api/conversations/:conversationId/messages/read
Header: Authorization: Bearer token

Response: { success: true }
```

---

## 4. Appointments API

### Get All Appointments

```
GET /api/appointments
GET /api/appointments?status=pending
GET /api/appointments?mentorId=xxxxx
Header: Authorization: Bearer token

Response:
{
  "success": true,
  "data": [
    {
      "_id": "appointmentId",
      "studentId": "userId",
      "studentName": "Name",
      "mentorId": "mentorId",
      "mentorName": "Mentor Name",
      "date": "2026-04-15",
      "time": "14:00",
      "topic": "React Hooks",
      "status": "pending", // pending, confirmed, completed, cancelled
      "notes": "additional notes",
      "createdAt": "2026-03-31T10:00:00Z"
    }
  ]
}
```

### Create Appointment Request

```
POST /api/appointments
Header: Authorization: Bearer token
Body: {
  "mentorId": "mentorId",
  "date": "2026-04-15",
  "time": "14:00",
  "topic": "React Hooks"
}

Response: { success: true, data: {...appointment} }
```

### Update Appointment Status

```
PUT /api/appointments/:appointmentId
Header: Authorization: Bearer token
Body: {
  "status": "confirmed" // or "declined", "completed", "cancelled"
}

Response: { success: true, data: {...updated appointment} }
```

### Get Mentor Availability

```
GET /api/mentors/:mentorId/availability

Response:
{
  "success": true,
  "data": [
    {
      "day": "Monday",
      "startTime": "14:00",
      "endTime": "18:00",
      "booked": ["14:00-15:00"] // Optional: show booked slots
    }
  ]
}
```

---

## 5. Documents API

### Get All Documents

```
GET /api/documents
GET /api/documents?category=lecture-notes
GET /api/documents?search=search-term
Header: Authorization: Bearer token

Response:
{
  "success": true,
  "data": [
    {
      "_id": "docId",
      "title": "React Hooks Guide",
      "description": "Comprehensive guide",
      "category": "lecture-notes",
      "uploadedBy": { id, name },
      "fileUrl": "s3-url-or-similar",
      "size": "2.4 MB",
      "uploadedAt": "2026-03-31T10:00:00Z",
      "downloads": 45
    }
  ]
}
```

### Upload Document

```
POST /api/documents
Header: Authorization: Bearer token
Header: Content-Type: multipart/form-data
Body:
  - file: [file]
  - title: "Document Title"
  - description: "Description"
  - category: "lecture-notes"

Response: { success: true, data: {...document} }
```

### Delete Document

```
DELETE /api/documents/:docId
Header: Authorization: Bearer token

Response: { success: true, message: "Document deleted" }
```

### Download Document

```
GET /api/documents/:docId/download
Header: Authorization: Bearer token

Response: File download + increment download counter
```

---

## Frontend Implementation Example

### Example: Replace localStorage with API calls

**Before (localStorage):**

```javascript
// In CommunityFeedPage.jsx
useEffect(() => {
  const savedPosts = localStorage.getItem("posts");
  if (savedPosts) {
    setPosts(JSON.parse(savedPosts));
  }
}, []);
```

**After (API):**

```javascript
useEffect(() => {
  fetchPosts();
}, []);

const fetchPosts = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/posts", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const data = await response.json();
    if (data.success) {
      setPosts(data.data);
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};
```

### Example: Create Post with API

```javascript
const handleCreatePost = async (postData) => {
  try {
    const response = await fetch("http://localhost:5000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        content: postData.content,
        media: postData.media, // Array of base64 or file URLs
      }),
    });

    const data = await response.json();
    if (data.success) {
      // Add new post to local state
      setPosts([data.data, ...posts]);
    }
  } catch (error) {
    console.error("Error creating post:", error);
  }
};
```

---

## Authentication

All protected endpoints require an Authorization header with a JWT token:

```javascript
header: {
  'Authorization': `Bearer ${jwtToken}`
}
```

### Getting the Token

The token should be obtained from your authentication endpoint:

```javascript
POST /api/auth/login
Body: {
  "email": "user@example.com",
  "password": "password"
}

Response: {
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "userId",
    "name": "User Name",
    "email": "user@example.com",
    "role": "student" // student, mentor, admin
  }
}
```

---

## Error Handling

All endpoints follow this error response format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

### Common Error Codes

- `UNAUTHORIZED` - No token or invalid token
- `FORBIDDEN` - User doesn't have permission
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid input data
- `INTERNAL_ERROR` - Server error

### Example Error Handling

```javascript
try {
  const response = await fetch(url);
  const data = await response.json();

  if (!data.success) {
    if (data.error.code === "UNAUTHORIZED") {
      // Redirect to login
      navigate("/login");
    } else {
      // Show error message
      showError(data.error.message);
    }
    return;
  }

  // Process successful response
} catch (error) {
  console.error("Network error:", error);
  showError("Unable to connect to server");
}
```

---

## File Upload Strategy

### Option 1: Direct Upload to S3

```javascript
// Get pre-signed URL from backend
const getPresignedUrl = async (fileName) => {
  const response = await fetch("/api/documents/upload-url", {
    method: "POST",
    body: JSON.stringify({ fileName }),
  });
  return response.json();
};

// Upload directly to S3
const uploadToS3 = async (file, presignedUrl) => {
  const response = await fetch(presignedUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
  return response.ok;
};
```

### Option 2: Multipart Form Data to Backend

```javascript
const uploadDocument = async (file, title, description, category) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("description", description);
  formData.append("category", category);

  const response = await fetch("/api/documents", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: formData, // Don't set Content-Type, browser will set it
  });

  return response.json();
};
```

---

## Real-Time Updates (WebSocket)

For live features like:

- New posts appearing in feed
- Message notifications
- Appointment confirmations

Use WebSocket:

```javascript
// Connect to WebSocket
const ws = new WebSocket("ws://localhost:5000/api/socket");

ws.onopen = () => {
  ws.send(
    JSON.stringify({
      type: "SUBSCRIBE",
      channels: ["feed", "messages", "appointments"],
    }),
  );
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "NEW_POST") {
    setPosts([data.post, ...posts]);
  } else if (data.type === "NEW_MESSAGE") {
    // Update messages
  }
};
```

---

## Rate Limiting

Implement rate limiting to prevent abuse:

```
- 100 requests per minute per user
- 10 posts per hour per user
- 5 MB per document upload
```

The backend should return 429 (Too Many Requests) when limits are exceeded:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 60
  }
}
```

---

## Deployment Checklist

- [ ] Set environment variables (API_URL, etc.)
- [ ] Configure CORS on backend
- [ ] Enable HTTPS
- [ ] Set up API rate limiting
- [ ] Implement caching (Redis)
- [ ] Setup CDN for static files
- [ ] Configure database backups
- [ ] Setup monitoring and logging
- [ ] Create API documentation (Swagger/OpenAPI)
- [ ] Test all endpoints thoroughly
- [ ] Setup CI/CD pipeline
- [ ] Plan for horizontal scaling

---

## Next Steps

1. Choose your backend framework (Express.js, FastAPI, Spring Boot, etc.)
2. Design your database schema (MongoDB, PostgreSQL, MySQL, etc.)
3. Implement all API endpoints from this guide
4. Update frontend to call APIs instead of localStorage
5. Add error handling and validation
6. Implement authentication system
7. Setup file storage (S3, Azure Blob, Firebase Storage)
8. Make the application production-ready
9. Deploy to production
10. Monitor and maintain

---

**Happy coding! 🚀**
