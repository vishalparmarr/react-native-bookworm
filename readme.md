# 🐛 Bookworm - Your Personal Book Recommendation App

Bookworm is a modern, cross-platform application that helps readers discover their next favorite book through personalized recommendations, community insights, and intelligent matching algorithms.

## 🌟 Features

- **Personalized Book Recommendations**: Get book suggestions based on your reading history and preferences
- **Mobile App**: Access your reading list and recommendations on the go
- **User Reviews & Ratings**: Share your thoughts and see what others think about books
- **Reading List Management**: Keep track of books you want to read, are currently reading, or have finished
- **Book Discovery**: Find new books through various categories, genres, and trending lists
- **Social Features**: Connect with other readers and share recommendations

## 🏗️ Project Structure

The project is organized into two main components:

```
bookworm-app/
├── backend/         # Backend API server
└── mobile/         # Mobile application (iOS & Android)
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- React Native development environment
- MongoDB (v4.4 or higher)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Rename a `.env.example` to `.env` file and change the necessary environment variables:
   ```
    PORT=3000
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
    API_URL=
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Mobile App Setup

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Rename a `api.example.js` file to `api.js`:

4. Start the application:
     ```bash
     npm start
     ```


## 🛠️ Technologies Used

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB
  - JWT for authentication

- **Mobile**:
  - React Native
  - Zustand for state management
  - React Navigation