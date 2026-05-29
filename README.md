<<<<<<< HEAD
# Portfolio Project

Full-stack portfolio with React.js frontend and Node.js + Express.js backend.

---

## Tech Stack

**Frontend:** React.js, Axios, React Router DOM, Vite  
**Backend:** Node.js, Express.js, MongoDB, Mongoose, Nodemailer

---

## Folder Structure

```
portfolio/
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.js
│       ├── api.js
│       ├── components/
│       │   └── Navbar.jsx
│       └── pages/
│           ├── Home.jsx
│           └── Contact.jsx
│
└── backend/
    ├── server.js
    ├── package.json
    ├── .env.example
    ├── config/
    │   ├── db.js
    │   └── mailer.js
    ├── models/
    │   └── Contact.js
    ├── controllers/
    │   └── contactController.js
    └── routes/
        └── contactRoutes.js
```

---

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/portfolio
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_RECEIVER=your_email@gmail.com
```

> **Gmail App Password:** Go to your Google Account → Security → 2-Step Verification → App Passwords → Generate one for "Mail".

Start the backend:

```bash
# Development (auto-restarts on change)
npm run dev

# Production
npm start
```

Backend runs at: `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## API Reference

### POST /api/contact

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Hello",
  "message": "Your message here"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Message sent successfully!",
  "data": { ... }
}
```

**Error Response (400 / 500):**
```json
{
  "success": false,
  "error": "All fields are required."
}
```

---

## MongoDB Schema

```js
{
  name:      String  (required)
  email:     String  (required)
  subject:   String  (required)
  message:   String  (required)
  createdAt: Date    (auto)
  updatedAt: Date    (auto)
}
```

---

## How It Works

1. User fills the Contact form in React
2. Axios sends a POST request to `http://localhost:5000/api/contact`
3. Express validates the fields
4. Mongoose saves the data to MongoDB
5. Nodemailer sends an email notification
6. React shows a success or error message

---

## Notes

- Make sure MongoDB is running locally before starting the backend
- For cloud MongoDB, replace `MONGO_URI` with your MongoDB Atlas connection string
- The frontend is intentionally plain — add your own design later
=======
# SopanParnatePortfolio
Modern full-stack developer portfolio built with React, Node.js, Express, and MongoDB.
>>>>>>> 37a2f73f12e269cc3c4804378ac5809123949f9f
