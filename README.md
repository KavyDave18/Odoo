# 🌟 SkillSwap - Community Skill Sharing Platform

A modern web application that enables community members to share and exchange skills with each other. Built with React, TypeScript, and Node.js, SkillSwap creates a vibrant ecosystem where users can teach what they know and learn from others.

## ✨ Features

### 🔐 Authentication & User Management
- **Secure Sign Up/Login**: User registration and authentication with bcrypt password hashing
- **User Profiles**: Comprehensive user profiles with skills, ratings, and swap history
- **Session Management**: Persistent user sessions with localStorage

### 🎯 Skill Discovery & Matching
- **Browse Skills**: Explore available skills in the community
- **Skill Categories**: Organized skill categories (Tech, Creative Arts, Wellness, Languages)
- **Search & Filter**: Find specific skills or users easily
- **User Ratings**: Trust system with user ratings and reviews

### 🤝 Swap Request System
- **Request Swaps**: Send skill swap requests to other users
- **Request Management**: View incoming and outgoing swap requests
- **Accept/Reject**: Manage swap requests with accept/reject functionality
- **Swap Completion**: Track completed swaps and update user statistics

### 📊 Community Features
- **Community Hub**: Detailed community statistics and featured users
- **Progress Tracking**: Community goals and member growth metrics
- **News & Updates**: Community announcements and feature updates
- **Interactive Elements**: Progress bars, tabs, and dynamic content

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Beautiful UI**: Modern design with Tailwind CSS and shadcn/ui components
- **Smooth Animations**: Engaging user experience with CSS animations
- **Dark/Light Mode**: Theme support for user preferences

### 🔧 Admin Features
- **Admin Dashboard**: Comprehensive admin panel for platform management
- **User Management**: Admin tools for user oversight
- **System Statistics**: Platform analytics and insights

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Radix UI** - Headless UI primitives
- **Lucide React** - Beautiful icons
- **React Query** - Data fetching and caching
- **React Hook Form** - Form handling with validation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **JSON File Storage** - Simple, file-based database
- **JWT** - JSON Web Tokens for authentication

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager


## 📁 Project Structure

```
vivid-web-waves-main/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   └── RequestSwapDialog.tsx
│   ├── pages/              # Application pages
│   │   ├── HomePage.tsx
│   │   ├── SignInPage.tsx
│   │   ├── BrowseSkillsPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── RequestsPage.tsx
│   │   ├── AdminPage.tsx
│   │   ├── CommunityHubPage.tsx
│   │   └── NotFound.tsx
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── main.tsx           # Application entry point
├── backend/
│   ├── routes/            # API routes
│   │   ├── auth.js        # Authentication routes
│   │   └── swaps.js       # Swap management routes
│   ├── models/            # Data models
│   ├── index.js           # Server entry point
│   └── package.json
├── public/                # Static assets
└── package.json
```

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get all users (public data)

### Swaps
- `POST /api/swaps/request` - Create swap request
- `GET /api/swaps/incoming/:userId` - Get incoming requests
- `GET /api/swaps/outgoing/:userId` - Get outgoing requests
- `PUT /api/swaps/accept/:requestId` - Accept swap request
- `PUT /api/swaps/reject/:requestId` - Reject swap request
- `PUT /api/swaps/complete/:requestId` - Complete swap

## 🎯 Key Features in Detail

### Community Hub
The Community Hub page (`/community`) showcases:
- **Statistics Dashboard**: Active members, skills offered, swaps completed, average ratings
- **Featured Users**: Top community members with their skills and ratings
- **Skill Categories**: Interactive tabs showing different skill categories
- **Community News**: Latest updates and announcements
- **Progress Tracking**: Visual progress bars for community goals

### Skill Browsing
The Browse Skills page (`/browse`) provides:
- **User Cards**: Detailed user profiles with skills and ratings
- **Skill Filtering**: Filter by skill categories
- **Search Functionality**: Find specific skills or users
- **Request System**: Send swap requests directly from user profiles

### Request Management
The Requests page (`/requests`) offers:
- **Incoming Requests**: View and manage requests from other users
- **Outgoing Requests**: Track your sent requests
- **Request Actions**: Accept, reject, or complete swaps
- **Request History**: View completed and pending swaps

## 🔒 Security Features

- **Password Hashing**: Secure password storage with bcrypt
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured CORS for secure cross-origin requests
- **Error Handling**: Comprehensive error handling and user feedback

## 🎨 UI/UX Highlights

- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Accessibility**: WCAG compliant components with proper ARIA labels
- **Smooth Animations**: CSS transitions and hover effects
- **Loading States**: Proper loading indicators for better UX
- **Toast Notifications**: User-friendly feedback messages

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
# Deploy the dist/ folder to your hosting service
```

### Backend Deployment
```bash
cd backend
npm start
# Deploy to your preferred hosting service (Heroku, Vercel, etc.)
```
## Screen Shots
<img width="1440" height="820" alt="Screenshot 2025-07-12 at 5 34 22 PM" src="https://github.com/user-attachments/assets/cd88fe46-ff9d-424d-b7bb-c0187c7b609c" />
<img width="1440" height="822" alt="Screenshot 2025-07-12 at 5 34 36 PM" src="https://github.com/user-attachments/assets/469fc07d-cab0-4473-b923-7cd561e83ea9" />
<img width="1440" height="821" alt="Screenshot 2025-07-12 at 5 34 47 PM" src="https://github.com/user-attachments/assets/b506393f-f802-47d3-b69f-1cac04fde560" />


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component library
- **Tailwind CSS** for the utility-first CSS framework
- **Radix UI** for accessible UI primitives
- **Vite** for the fast build tool
- **React Query** for efficient data fetching

---

