# Admin Panel Documentation

## Getting Started

The admin panel is a React application built with TypeScript, Vite, and Tailwind CSS.

## Features

- 🔐 JWT Authentication with automatic token refresh
- 👥 User Management (CRUD operations)
- 🛡️ Protected Routes
- 📱 Responsive Design
- ✨ Modern UI with Tailwind CSS

## Pages

### Login (`/login`)
- Email and password authentication
- Form validation
- Error handling

### Dashboard (`/dashboard`)
- Overview page
- Quick access to user management
- User profile display

### Users (`/users`)
- List all users with pagination
- Create new users
- Delete users
- View user details

## Authentication Flow

1. User logs in with email/password
2. Backend returns access token and refresh token
3. Tokens are stored in localStorage
4. Access token is included in all API requests
5. If access token expires, refresh token is used automatically
6. On logout, tokens are cleared

## Protected Routes

All routes except `/login` require authentication. Unauthenticated users are redirected to the login page.

## API Integration

The admin panel uses Axios for API calls with automatic token injection and refresh handling. See `src/lib/api.ts` for the API client configuration.

## Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory, ready to be served by any static file server.
