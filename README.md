# 🔐 MERN Auth – Secure Authentication System

**MERN Auth** is a full-stack authentication application built using the **MERN stack**.  
It supports **user registration**, **account activation**, **login**, **forgot password**, and **reset password** flows.  
Authentication is handled using **JWT**, **cookies**, and secure **token-based flows**.

---

## 📁 Project Structure

```text 
MERN-Auth/
│
├── server/                      # Express API with MongoDB
│   └── src/
│       ├── controllers/         # Auth logic
│       ├── models/              # Mongoose schemas
│       ├── routes/              # API endpoints
│       ├── middleware/          # Auth, error handlers
│       ├── utils/               # Helper functions (email, tokens)
│       ├── config/              # DB and environment configs
│       └── index.ts             # Entry point
│
├── client/                      # React + TypeScript + Vite
│   └── src/
│       ├── pages/               # Page-level components (Login, Register, etc.)
│       ├── components/          # Reusable UI components
│       ├── context/             # Auth context
│       ├── assets/              # Static files (images, styles)
│       └── main.tsx             # App entry
│
└── README.md                    # Project documentation
```

---

## ⚙️ Tech Stack

### 🌐 Frontend
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Axios](https://axios-http.com/)

### 🔧 Backend
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [TypeScript](https://www.typescriptlang.org/)
- [Mongoose](https://mongoosejs.com/)
- [Cookie Parser](https://www.npmjs.com/package/cookie-parser)
- [JWT](https://jwt.io/)

### ☁️ Deployment
- [Render](https://render.com/)
- [Vercel](https://vercel.com/)

---

## 📦 Installation & Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Sarthak0085/MERN-Auth.git
cd MERN-Auth
```

### 2. Setup Backend

```bash
cd server
pnpm install
```

Create `.env` file in `/server`

```bash
PORT = 4000
MONGODB_URI = YOUR_MONGODB_URI 
ACTIVATION_SECRET = 091024122000
RESET_SECRET = 200009102412
ACCESS_TOKEN = 'W=£t9$I!(r[pZ{q^727?jTBpyG1Ol~|d{kd~£^djz>J>`e18B8'
REFRESH_TOKEN = 'Fz{2sC<6Y-6Z0qr]"PjCdA0E7oPYa@K_ya&NJ4ZJ5ynsTj>v_m'
ACCESS_TOKEN_EXPIRES = 1200
REFRESH_TOKEN_EXPIRES = 36
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 465
SMTP_SERVICE = gmail
SMTP_MAIL = YOUR_SMTP_MAIL
SMTP_PASS = YOUR_SMTP_PASSWORD
```

Start the backend server

```bash
pnpm run dev
```

### 2. Setup Frontend

```bash
cd ../client
pnpm install
```

Create `.env` file in `/client`

```bash
VITE_BACKEND_URL = 'http://localhost:4000'
```

Start the frontend

```bash
pnpm run dev
```

App will run at: http://localhost:5173

---

## 📌 Features

- ✅ **User Registration & Login**
- ✉️ **Activate Account** on registration
- 🔐 **Secure JWT Authentication** using **HTTP-only Cookies**
- 🔁 **Forgot Password & Reset Password** functionality
- 🔒 **Protected Routes** (accessible only to authenticated users)

---

## 🧪 Scripts

### Backend:

```bash
pnpm run dev      # Start dev server
pnpm run build    # Build for production
pnpm run format   # Format using Prettier
```

### Frontend:

```bash
pnpm run dev      # Start frontend
pnpm run build    # Build for production
pnpm run lint     # Run ESLint
pnpm run format   # Format using Prettier

```

---

## 🛠️ Tools Used

- [MongoDB Atlas](https://www.mongodb.com/atlas) – Cloud-hosted MongoDB database
- [Cloudinary](https://cloudinary.com/) – Media management and file storage
- [Vercel](https://vercel.com/) / [Render](https://render.com/) – Deployment platforms
- [Zod](https://zod.dev/) – TypeScript-first schema validation
- [ShadCN UI](https://ui.shadcn.dev/) – Beautifully styled React components

---

## 📸 Screenshots

### 🏠 Home Page
![Home](https://mern-auth-vert.vercel.app/screenshot/home.png)

### 🧾 Register Page  
![Register](https://mern-auth-vert.vercel.app/screenshots/register.png)

### 🔑 Login Page  
![Login](=https://mern-auth-vert.vercel.app/screenshots/login.png)

### ✉️ Activate Account Page  
![Activate Account](https://mern-auth-vert.vercel.app/screenshots/activate.png)

### ❓ Forgot Password Page  
![Forgot Password](https://mern-auth-vert.vercel.app/screenshots/forgot-password.png)

### 🔄 Reset Password Page  
![Reset Password](https://mern-auth-vert.vercel.app/screenshots/reset-password.png)

---

## 📬 Contact

Created with ❤️ by **Sarthak**

- 🐙 GitHub: [Sarthak](https://github.com/Sarthak0085)
- 📧 Email: sarth.mahajan2000@gmail.com

