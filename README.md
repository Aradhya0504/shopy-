# Shopy (E-Commerce Full Stack)

## 🚀 Project Overview
Shopy is a full-stack e-commerce platform.
- Backend: Node.js + Express + MongoDB + JWT authentication
- Frontend: React + Vite + Redux + Tailwind
- Features: product catalog, categories, cart, wishlist, reviews, orders, user roles (customer/admin), checkout flow

## 🧭 What an interviewer should notice
1. Full REST API design with token-based auth and role-based guards.
2. Modular architecture: controllers, models, routes, middleware.
3. Rich e-commerce workflow: cart → checkout/order → admin order status updates.
4. Secure auth: hashed passwords, JWT, protected endpoints.
5. Redux-toolkit global state in React for products/cart/auth/order.
6. Clean UI components and routing via `react-router-dom`.
7. CI-friendly scripts and local seeding via `/backend/utils/seeder.js`.

## 📁 Repo layout
- `shopy-backend/` API server
- `shopy-frontend/` React SPA

### Full repository file structure
```
shopy/
├── README.md
├── shopy-backend/
│   ├── .env
│   ├── .git/
│   ├── .gitignore
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── categoryController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   ├── reviewController.js
│   │   └── wishlistController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   ├── cart.js
│   │   ├── category.js
│   │   ├── order.js
│   │   ├── product.js
│   │   ├── review.js
│   │   ├── user.js
│   │   └── wishlist.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── wishlistRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── seeder.js
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   └── node_modules/
└── shopy-frontend/
    ├── .env
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    ├── public/
    │   ├── favicon.svg
    │   └── icons.svg
    ├── src/
    │   ├── App.jsx
    │   ├── index.css
    │   ├── main.jsx
    │   ├── components/
    │   │   ├── Footer.jsx
    │   │   ├── Loader.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── ProductCard.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── AdminDashboard.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Orders.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── Products.jsx
    │   │   ├── Profile.jsx
    │   │   └── Register.jsx
    │   ├── redux/
    │   │   ├── store.js
    │   │   └── slices/
    │   │       ├── authSlice.js
    │   │       ├── cartSlice.js
    │   │       ├── orderSlice.js
    │   │       └── productSlice.js
    │   ├── services/
    │   │   └── api.js
    │   └── utils/
    └── node_modules/
```

## 🛠️ Backend (API)
### stack
- Node.js, Express
- MongoDB + Mongoose
- JSON Web Tokens (`jsonwebtoken`)
- `bcryptjs` for password security
- `dotenv`, `cors`, `nodemon`

### key endpoints
- `POST /api/auth/register` (register) 
- `POST /api/auth/login` (login)
- `GET /api/auth/profile` (user info)
- `/api/products` CRUD + search
- `/api/categories` admin CRUD
- `/api/cart` add/update/remove/clear
- `/api/wishlist` add/remove/clear
- `/api/orders` create myorders/get order/update status
- `/api/reviews/:productId` add/update/delete
- `/api/admin/*` stats/users/orders for admin role

### admin security
- `roleMiddleware` ensures `admin` enters restricted routes (user management, global orders, delivery status)

### setup
1. `cd shopy-backend`
2. `npm install`
3. create `.env`:
   - `PORT=5000`
   - `MONGO_URI=<mongodb connection string>`
   - `JWT_SECRET=<strong secret>`
4. `npm run dev`
5. optional seeding: `npm run seed`

## ⚛️ Frontend (UI)
### stack
- React + Vite
- Redux Toolkit (slices: auth, product, cart, order)
- `axios` for API calls
- `react-router-dom` protected routing
- `react-icons`, `react-toastify`, Tailwind ready

### setup
1. `cd shopy-frontend`
2. `npm install`
3. `npm run dev`
4. default URL: `http://localhost:5173`

### user flow
- register/login
- browse products + category filter
- add to cart/wishlist
- place order / pay / track
- profile + order history

## 🧪 Quality & testing pointers
- clearly separated logic for controllers and routes
- robust error handling (404 + global error middleware)
- payload validation can be added in future (e.g. `express-validator`)
- missing but desirable: unit tests using Jest + supertest

## 💡 Demo commands
- backend console: `cd shopy-backend && npm run dev`
- frontend console: `cd shopy-frontend && npm run dev`

## 📌 Git commands (for final delivery)
```bash
cd c:\Users\aradh\Desktop\shopy\shopy-backend
git status
git add .
git commit -m "Add Shopy project code"
# Add remote once if needed:
# git remote add origin <your-repo-url>
git pull --rebase origin main
git push origin main
```

> Replace `main` with your branch name if different.
