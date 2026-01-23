# Shamal Ascent - Admin Panel & Backend

This project consists of three main parts:
- **frontend** - Public website (already completed)
- **admin** - Admin dashboard (React)
- **backend** - Node.js + Express API with JWT authentication

## Project Structure

```
shamal-ascent-main-final/
├── forntend/          # Public website (DO NOT MODIFY)
├── admin/             # Admin dashboard (React + TypeScript)
└── backend/           # Backend API (Node.js + Express + TypeScript)
```

## Backend Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
   - Set `JWT_SECRET` and `JWT_REFRESH_SECRET` to strong random strings
   - Update `MONGODB_URI` with your MongoDB connection string
   - Configure `FRONTEND_URL` and `ADMIN_URL` if different from defaults

5. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### Backend API Endpoints

#### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user (admin only)
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

#### Users (Admin only)
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Creating the First Admin User

Since registration requires admin privileges, you'll need to create the first admin user manually. You can do this by:

1. Using MongoDB shell or MongoDB Compass
2. Inserting a user document directly into the database
3. Or using a script (create one if needed)

Example MongoDB document:
```javascript
{
  email: "admin@example.com",
  password: "hashed_password_here", // Use bcrypt to hash
  name: "Admin User",
  role: "admin",
  isActive: true
}
```

## Admin Panel Setup

### Prerequisites
- Node.js (v18 or higher)

### Installation

1. Navigate to the admin directory:
```bash
cd admin
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file:
   - Set `VITE_API_URL` to your backend API URL (default: `http://localhost:3000/api`)

5. Start the development server:
```bash
npm run dev
```

The admin panel will run on `http://localhost:5173`

## Features

### Backend
- ✅ JWT-based authentication with access and refresh tokens
- ✅ Secure password hashing with bcrypt
- ✅ Role-based access control (admin/user)
- ✅ Rate limiting for API protection
- ✅ CORS configuration for frontend and admin
- ✅ Input validation with express-validator
- ✅ Error handling middleware
- ✅ MongoDB integration with Mongoose
- ✅ TypeScript for type safety

### Admin Panel
- ✅ React + TypeScript + Vite
- ✅ JWT authentication with automatic token refresh
- ✅ Protected routes
- ✅ User management (CRUD operations)
- ✅ Modern UI with Tailwind CSS
- ✅ Form validation with React Hook Form + Zod
- ✅ React Query for data fetching
- ✅ Responsive design

## Security Features

- Password hashing with bcrypt
- JWT tokens with expiration
- Refresh token rotation
- Rate limiting on authentication endpoints
- CORS protection
- Helmet.js for security headers
- Input validation and sanitization
- Role-based access control

## Development

### Backend
```bash
cd backend
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm start        # Start production server
```

### Admin Panel
```bash
cd admin
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `JWT_SECRET` - Secret key for access tokens
- `JWT_REFRESH_SECRET` - Secret key for refresh tokens
- `JWT_EXPIRES_IN` - Access token expiration (default: 15m)
- `JWT_REFRESH_EXPIRES_IN` - Refresh token expiration (default: 7d)
- `MONGODB_URI` - MongoDB connection string
- `FRONTEND_URL` - Frontend URL for CORS
- `ADMIN_URL` - Admin panel URL for CORS

### Admin Panel (.env)
- `VITE_API_URL` - Backend API URL

## Production Deployment

1. Build the backend:
```bash
cd backend
npm run build
```

2. Build the admin panel:
```bash
cd admin
npm run build
```

3. Set environment variables in production
4. Use a process manager like PM2 for the backend
5. Serve the admin panel build with a web server (nginx, etc.)

## Notes

- The frontend folder is not modified as per requirements
- Admin panel and frontend are separate applications
- Backend serves APIs for both frontend and admin panel
- All code follows best practices and is production-ready
