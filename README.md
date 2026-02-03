# Task Management System

A robust full-stack application for managing tasks, users, and notifications. Built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **User Authentication**: Secure registration and login with JWT and email verification (OTP).
- **Profile Management**: Update user profile and upload profile pictures.
- **Task Management**: Create, read, update, and delete tasks. Attach images to tasks.
- **Collaborative Features**: Request system and Notifications to stay updated.
- **Security**: Password hashing with Bcrypt, protected routes, and secure API endpoints.
- **Responsive Design**: User-friendly interface built with React.

## Tech Stack

### Frontend
- **React.js**: (v19) Library for building user interfaces.
- **React Router**: For navigation and routing.
- **Axios**: For making HTTP requests to the backend.
- **React Icons**: For UI icons.

### Backend
- **Node.js & Express.js**: Server-side runtime and framework.
- **MongoDB & Mongoose**: NoSQL database and object modeling.
- **JWT (JSON Web Tokens)**: For secure authentication.
- **Nodemailer**: For sending emails (verification, notifications).
- **Multer & Cloudinary**: For handling file uploads and storage.

## Getting Started

Follow these instructions to get a copy of the project running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- An account on [Cloudinary](https://cloudinary.com/) (for image hosting)
- An Email service account (e.g., Gmail) for sending system emails.

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Backend Setup**
   
   Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   # Server Configuration
   PORT=5000
   
   # Database Configuration
   MONGO_URI=your_mongodb_connection_string
   
   # Authentication
   JWT_SECRET=your_jwt_secret_key
   
   # Email Configuration (Nodemailer)
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Frontend URL (for CORS and links)
   FRONTEND_URL=http://localhost:3000
   ```

3. **Frontend Setup**

   Navigate to the frontend directory and install dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

   Create a `.env` file in the `frontend` directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```
   *Note: Ensure the port in `REACT_APP_API_URL` matches your backend `PORT`.*

### Running the Application

1. **Start the Backend Server**
   
   From the `backend` directory:
   ```bash
   npm start
   # Or for development:
   npm run dev
   ```
   The server will start on port 5000 (or your defined PORT).

2. **Start the Frontend Application**
   
   From the `frontend` directory:
   ```bash
   npm start
   ```
   The application will run on `http://localhost:3000`.

## API Overview

The backend exposes several RESTful endpoints:

- **Auth**: `/api/users/register`, `/api/users/login`, `/api/users/verify-email`, etc.
- **Users**: `/api/users/getUser`, `/api/users/update-profile`.
- **Tasks**: `/api/tasks` (GET all, POST create), `/api/tasks/:id` (GET, PATCH, DELETE).
- **Requests**: `/api/requests` endpoints.
- **Notifications**: `/api/notifications` endpoints.

## License

This project is licensed under the ISC License.
