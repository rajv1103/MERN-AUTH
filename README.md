
# 🔐 MERN Auth System — CleverVault

A secure, full-stack authentication system built with the MERN stack (MongoDB, Express, React, Node.js) featuring cookie-based JWT auth, email OTP verification, password reset, and a clean Tailwind-powered UI. Built for production-grade security and developer clarity 🚀

---

## 🧩 Tech Stack

**Frontend**:  
- React (Vite)  
- Tailwind CSS  
- React Router DOM  

**Backend**:  
- Node.js + Express  
- MongoDB + Mongoose  
- JWT (httpOnly cookies)  
- Nodemailer / Resend (for OTP emails)  

---

## ✨ Features

- ✅ User Registration with hashed passwords  
- 🔐 Login with JWT stored in secure cookies  
- 📬 Email OTP verification (6-digit code)  
- 🔁 Password reset via OTP  
- 🧠 Middleware-based user extraction (no manual userId/email in frontend)  
- 👤 Profile fetch via token-authenticated route  
- 🧪 Robust error handling and guest fallback  
- 🎨 Responsive UI with Tailwind and animated components  
- 📦 Modular backend with config folder for DB, mail, and environment setup  

---

## 📁 Folder Structure

```
client/
├── src/
│   ├── components/ (Layout, MockCard)
│   ├── pages/ (Login, Register, Profile, Verify, ForgotReset)
│   ├── App.jsx, main.jsx, index.css
backend/
├── controllers/
├── routes/
├── middleware/
├── config/
├── models/
├── server.js
```

---

## ⚙️ Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/rajv1103/MERN-AUTH.git
cd MERN-AUTH
```

### 2. Backend setup
```bash
cd backend
npm install
# Create .env file:
PORT=3000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
FRONTEND_ORIGIN=http://localhost:5173
npm run dev
```

### 3. Frontend setup
```bash
cd ../client
npm install
# Create .env file:
VITE_API_BASE=http://localhost:3000/api
npm run dev
```

---

## 🔄 Auth Flow Summary

1. **Register** → stores user with hashed password  
2. **Login** → sets JWT in httpOnly cookie  
3. **Verify OTP** → activates account  
4. **Forgot Password** → sends OTP  
5. **Reset Password** → updates securely  
6. **Profile** → fetched via middleware-authenticated route  

---

## 🛠 Commands

```bash
# Backend
npm run dev

# Frontend
npm run dev

# Git recovery (if needed)
git reflog
git checkout <commit-hash> -- client
```

---

## 🚧 Future Improvements

- 🔗 Magic link login  
- 🧑‍💼 Role-based access control  
- 🧪 Unit + E2E tests  
- ☁️ Docker + CI/CD pipeline  
- 🌐 OAuth (Google, GitHub) integration  

---

## ❤️ Built By

**Raj Verma** — passionate about secure backend architecture, modular design, and clean deployment workflows.  
Let’s build something clever together!


