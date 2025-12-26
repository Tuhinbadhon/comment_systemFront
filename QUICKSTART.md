# Quick Start Guide

## 🚀 Getting Started in 3 Steps

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

The `.env` file has been created with default settings:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

**⚠️ Important:** Update these URLs to match your backend server if different.

### 3. Start Development Server

```bash
pnpm dev
```

The app will open at: `http://localhost:3000`

---

## 📦 What's Included

### ✅ All Required Features Implemented:

#### Authentication

- [x] JWT-based login and registration
- [x] Protected routes for authenticated users
- [x] Persistent authentication (localStorage)

#### Comment Management

- [x] Create comments (authenticated users only)
- [x] Edit own comments (with authorization check)
- [x] Delete own comments (with authorization check)
- [x] View all comments with pagination

#### Engagement Features

- [x] Like comments (one per user validation)
- [x] Dislike comments (one per user validation)
- [x] Reply to comments (nested threads)

#### Sorting & Filtering

- [x] Sort by newest
- [x] Sort by most liked
- [x] Sort by most disliked

#### Pagination

- [x] Configurable page size (default: 10)
- [x] Smart pagination UI with ellipsis
- [x] Total count display

#### Real-time Updates (Bonus)

- [x] Socket.io integration
- [x] Live comment creation notifications
- [x] Live comment updates
- [x] Live comment deletions
- [x] Live like/dislike updates

#### Technical Requirements

- [x] React 18 with modern features
- [x] Redux Toolkit for state management
- [x] React Router for navigation
- [x] Axios for HTTP requests
- [x] SCSS for styling
- [x] Component-based architecture
- [x] Responsive design (mobile-first)
- [x] Vite for fast development

---

## 🎯 Key Files

| File                               | Purpose                         |
| ---------------------------------- | ------------------------------- |
| `src/App.jsx`                      | Main app component with routing |
| `src/redux/store.js`               | Redux store configuration       |
| `src/redux/slices/authSlice.js`    | Authentication state management |
| `src/redux/slices/commentSlice.js` | Comment state management        |
| `src/utils/socket.js`              | Socket.io real-time connection  |
| `src/pages/Login.jsx`              | Login page                      |
| `src/pages/Register.jsx`           | Registration page               |
| `src/pages/Comments.jsx`           | Main comments page              |
| `src/components/comments/*`        | Comment-related components      |

---

## 🔌 Backend Requirements

This frontend expects the following backend API endpoints:

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Comments

- `GET /api/comments?page=1&limit=10&sortBy=newest` - Get comments
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `POST /api/comments/:id/like` - Like comment
- `POST /api/comments/:id/dislike` - Dislike comment
- `POST /api/comments/:id/reply` - Reply to comment

### Socket.io Events (Expected)

- `comment:created` - New comment created
- `comment:updated` - Comment updated
- `comment:deleted` - Comment deleted
- `comment:liked` - Comment liked
- `comment:disliked` - Comment disliked

---

## 🛠️ Common Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Maintenance
pnpm install          # Install dependencies
pnpm store prune      # Clean pnpm cache
```

---

## 📱 Features Demo Flow

1. **Register/Login** → Navigate to `/register` or `/login`
2. **View Comments** → Automatic redirect to `/comments` after login
3. **Add Comment** → Type in the comment form and submit
4. **Sort Comments** → Use filter buttons (Newest, Most Liked, Most Disliked)
5. **Like/Dislike** → Click 👍 or 👎 buttons
6. **Reply** → Click "Reply" button under any comment
7. **Edit** → Click ✏️ on your own comments
8. **Delete** → Click 🗑️ on your own comments
9. **Pagination** → Navigate through pages at the bottom
10. **Real-time** → Open in multiple tabs to see live updates

---

## 🎨 UI/UX Highlights

- **Clean Design** - Modern, intuitive interface
- **Emoji Icons** - Visual feedback for actions
- **Loading States** - User feedback during operations
- **Error Handling** - Clear error messages
- **Character Counter** - Shows 0/1000 for comments
- **Responsive Layout** - Works on mobile, tablet, desktop
- **Hover Effects** - Interactive elements have visual feedback
- **Color-coded Actions** - Blue for primary, red for delete, etc.

---

## 🔒 Security Features

- JWT token stored in localStorage
- Protected routes check authentication
- Authorization checks for edit/delete
- One like/dislike per user validation
- Input validation (max length, required fields)
- XSS protection through React's built-in escaping

---

## 📊 State Management

The app uses Redux Toolkit with two main slices:

### Auth Slice

- User data
- Login/Register actions
- Token management

### Comment Slice

- Comments list
- Pagination data
- CRUD operations
- Real-time updates

---

## 🚨 Troubleshooting

### "Cannot connect to backend"

→ Check `.env` file has correct `VITE_API_URL`

### "Socket connection failed"

→ Ensure backend Socket.io is running on `VITE_SOCKET_URL`

### "Not authorized"

→ Token might be expired, try logging in again

### Changes not reflecting

→ Restart dev server: `Ctrl+C` then `pnpm dev`

---

**Ready to go! 🎉**
