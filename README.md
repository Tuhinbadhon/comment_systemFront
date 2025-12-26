# Comment System - Frontend

A modern, feature-rich comment system built with React + Vite, Redux Toolkit, and Socket.io for real-time updates.

## �️ Default Admin Credentials


## 🚀 Features

### Core Features

- ✅ **User Authentication** - JWT-based login and registration (register requires phone; login accepts email or phone)
- ✅ **Create Comments** - Authenticated users can post comments
- ✅ **Edit Comments** - Users can edit their own comments
- ✅ **Delete Comments** - Users can delete their own comments
- ✅ **Like/Dislike** - One action per user per comment validation
- ✅ **Reply to Comments** - Nested comment threads
- ✅ **Real-time Updates** - Pusher integration for live updates
- ✅ **Sorting** - Sort by newest, most liked, most disliked
- ✅ **Pagination** - Efficient data loading with page navigation
- ✅ **Responsive Design** - Works seamlessly on all devices

### Technical Features

- ⚡ **Vite** - Lightning-fast build tool and dev server
- 🔄 **Redux Toolkit** - Efficient state management
- 🎨 **SCSS** - Advanced styling with variables and mixins
- 🔌 **Pusher** - Real-time publishing and subscribing via Pusher Channels
- 🛡️ **Protected Routes** - Route guards for authenticated pages
- 📱 **Mobile-First** - Responsive design for all screen sizes

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **pnpm** (v8 or higher) - Install with: `npm install -g pnpm`
- A running backend API (see backend repository)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Frontend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:

   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

   **Important:** Make sure these URLs match your backend server configuration.

## 🚀 Running the Application

### Development Mode

```bash
pnpm dev
```

The application will open at `http://localhost:5173` (Vite default) or the host/port configured in your environment.

### Production Build

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

## 📁 Project Structure

```
Frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── comments/
│   │   │   ├── CommentForm.jsx
│   │   │   ├── CommentItem.jsx
│   │   │   ├── CommentList.jsx
│   │   │   ├── CommentFilters.jsx
│   │   │   ├── Pagination.jsx
│   │   │   └── *.scss
│   │   └── layout/
│   │       ├── Navbar.jsx
│   │       └── Navbar.scss
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Comments.jsx
│   │   └── *.scss
│   ├── redux/
│   │   ├── store.js
│   │   └── slices/
│   │       ├── authSlice.js
│   │       └── commentSlice.js
│   ├── utils/
│   │   └── socket.js
│   ├── styles/
│   │   ├── index.scss
│   │   └── App.scss
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

## 🔑 Key Components

### Authentication

- **Login/Register Pages** - User authentication with form validation
- **Protected Routes** - Route guards that redirect unauthenticated users
- **JWT Token Management** - Stored in localStorage, sent with API requests

### Comment Management

- **CommentForm** - Create new comments with character limit (1000)
- **CommentList** - Display paginated list of comments
- **CommentItem** - Individual comment with actions (edit, delete, like, dislike, reply)
- **CommentFilters** - Sort comments by different criteria
- **Pagination** - Navigate through pages of comments

### Real-time Updates

- **Socket.io Integration** - Live updates when comments are created, updated, or deleted
- **Automatic Synchronization** - All connected users see changes instantly

## 🔄 State Management

### Redux Slices

#### Auth Slice

- User registration and login
- Logout functionality
- User state persistence

#### Comment Slice

- Fetch comments with pagination and sorting
- Create, update, and delete comments
- Like and dislike comments
- Reply to comments
- Real-time updates integration

## 🎨 Styling

The application uses **SCSS** with a modular approach:

- **Variables** - Colors, spacing, and breakpoints
- **Mixins** - Reusable style patterns
- **Component-scoped styles** - Each component has its own SCSS file
- **Responsive design** - Mobile-first approach with media queries

## 🔌 API Integration

### Endpoints Used

```javascript
// Authentication
POST /api/auth/register
POST /api/auth/login

// Comments
GET    /api/comments?page=1&limit=10&sortBy=newest
POST   /api/comments
PUT    /api/comments/:id
DELETE /api/comments/:id
POST   /api/comments/:id/like
POST   /api/comments/:id/dislike
POST   /api/comments/:id/reply
```

### API response example

```json
{
  "success": true,
  "data": [
    /* array of comment objects */
  ],
  "page": 1,
  "pages": 5,
  "total": 42
}
```

### Pusher events (payload examples)

- `comment:created` → `{ "comment": { /* comment object */ }, "parentComment": null }
`- `comment:updated` → `{ "comment": { /* comment object */ } }`
- `comment:deleted` → `{ "commentId": "<id>" }`
- `comment:liked` → `{ "commentId": "<id>", "likeCount": 10, "dislikeCount": 2 }`
- `comment:disliked` → `{ "commentId": "<id>", "likeCount": 10, "dislikeCount": 3 }`
- `comment:reply` → `{ "reply": { /* reply object */ }, "parentCommentId": "<id>" }`

## 🔐 Environment Variables

| Variable              | Description          | Example                     |
| --------------------- | -------------------- | --------------------------- |
| `VITE_API_URL`        | Backend API base URL | `http://localhost:5000/api` |
| `VITE_PUSHER_KEY`     | Pusher app key       | `your-pusher-key`           |
| `VITE_PUSHER_CLUSTER` | Pusher cluster       | `mt1`                       |

**Note:** All environment variables in Vite must be prefixed with `VITE_`. If your backend uses Socket.io instead of Pusher, you can still define `VITE_SOCKET_URL` for socket server URL.

## 📱 Responsive Breakpoints

```scss
// Mobile: < 768px
// Tablet: 768px - 1024px
// Desktop: > 1024px
```

## ⚡ Performance Optimizations

- **Vite** - Faster build times and HMR
- **Code Splitting** - Lazy loading of routes
- **Memoization** - React.memo for expensive components
- **Debouncing** - For search and filter operations
- **Pagination** - Reduced data transfer

## 🧪 Testing

```bash
# Run tests (if configured)
pnpm test
```

## 🐛 Troubleshooting

### Common Issues

1. **Cannot connect to backend**

   - Verify `.env` file has correct API URL
   - Ensure backend server is running
   - Check for CORS configuration on backend

2. **Socket connection fails**

   - Verify `VITE_SOCKET_URL` in `.env`
   - Check backend Socket.io configuration
   - Ensure JWT token is valid

3. **Build errors**
   - Clear node_modules: `rm -rf node_modules && pnpm install`
   - Clear Vite cache: `rm -rf node_modules/.vite`
   - Clear pnpm cache: `pnpm store prune`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is part of a technical assessment task.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- React team for the amazing library
- Redux Toolkit for simplified state management
- Vite for the blazing fast build tool
- Socket.io for real-time capabilities

## 📞 Support

For issues and questions:

- Create an issue in the repository
- Contact: your.email@example.com

## �🔮 Future Enhancements

- [ ] Comment search functionality
- [ ] User profiles with avatar images
- [ ] Comment attachments (images, files)
- [ ] Rich text editor for comments
- [ ] Email notifications
- [ ] Dark mode theme
- [ ] Multi-language support (i18n)
- [ ] Comment moderation features
- [ ] User mentions (@username)
- [ ] Emoji reactions

---

**Happy Coding! 🚀**

# comment_systemFront
