# RA2311003030325 — Logging Middleware Assessment

> **Author:** aryxncoder  
> **Stack:** Node.js + Express (backend) · React (frontend)  
> **Feature:** Full logging middleware that ships structured logs to an external API

---

## 📁 Project Structure

```
RA2311003030325/
├── .gitignore
├── README.md
│
├── question1-backend/
│   ├── package.json
│   ├── .env.example          ← copy to .env
│   └── src/
│       ├── index.js          ← Express entry point
│       ├── middleware/
│       │   └── requestLogger.js   ← attach ID, log req/res, error handler
│       ├── routes/
│       │   ├── productRoutes.js
│       │   └── logRoutes.js       ← relay endpoint for frontend
│       ├── controllers/
│       │   └── productController.js
│       ├── services/
│       │   └── productService.js
│       └── utils/
│           └── logger.js          ← Logger class (all levels)
│
└── question2-frontend/
    ├── package.json
    ├── public/index.html
    └── src/
        ├── App.js
        ├── index.js
        ├── components/
        │   ├── ProductCard.js
        │   ├── ProductForm.js
        │   └── LogPanel.js        ← live log viewer
        ├── hooks/
        │   └── useProducts.js
        ├── pages/                 ← reserved for future pages
        ├── services/
        │   ├── loggerService.js   ← frontend Logger
        │   └── productAPI.js
        ├── styles/
        │   └── App.css
        └── utils/                 ← reserved
```

---

## ⚙️ Setup & Run

### Prerequisites
- Node.js v18+
- npm v9+

### 1. Clone & Enter

```bash
git clone https://github.com/aryxncoder/RA2311003030325.git
cd RA2311003030325
```

### 2. Backend

```bash
cd question1-backend
cp .env.example .env        # edit PORT if needed
npm install
npm run dev                 # nodemon (auto-reload)
# OR: npm start             # plain node
```

Server starts at **http://localhost:5000**

### 3. Frontend

```bash
cd ../question2-frontend
npm install
npm start                   # React dev server
```

App opens at **http://localhost:3000**  
(The `"proxy": "http://localhost:5000"` in package.json handles CORS automatically.)

---

## 🔌 API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET    | `/api/products`      | List all products |
| GET    | `/api/products/:id`  | Get product by ID |
| POST   | `/api/products`      | Create product |
| PUT    | `/api/products/:id`  | Update product |
| DELETE | `/api/products/:id`  | Delete product |
| POST   | `/api/logs`          | Log relay (frontend → external API) |

### POST `/api/products` — Body
```json
{
  "name": "Gaming Mouse",
  "price": 2999,
  "category": "Electronics",
  "stock": 50
}
```

### POST `/api/logs` — Body (forwarded to external API)
```json
{
  "stack": "frontend",
  "level": "info",
  "package": "component",
  "message": "User clicked Add Product"
}
```

---

## 🧪 Postman / cURL Tests

```bash
# 1. Health check
curl http://localhost:5000/

# 2. Get all products
curl http://localhost:5000/api/products

# 3. Create product
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Wireless Mouse","price":1299,"category":"Electronics","stock":30}'

# 4. Update product
curl -X PUT http://localhost:5000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price":4599,"stock":8}'

# 5. Delete product
curl -X DELETE http://localhost:5000/api/products/3

# 6. Send a log directly
curl -X POST http://localhost:5000/api/logs \
  -H "Content-Type: application/json" \
  -d '{"stack":"backend","level":"warn","package":"route","message":"Manual test log"}'
```

---

## 📤 Push to GitHub

```bash
# From the root RA2311003030325 folder
git init
git add .
git commit -m "feat: complete logging middleware solution"
git branch -M main
git remote add origin https://github.com/aryxncoder/RA2311003030325.git
git push -u origin main
```

---

## 🏗️ Architecture

```
React App
  │
  ├─ loggerService.js  ──POST /api/logs──►  Backend Relay  ──►  External Log API
  │                                                              (20.207.122.201)
  └─ productAPI.js     ──REST calls──►  Express Routes
                                           │
                                     requestLogger.js (middleware)
                                           │
                                     Controller → Service → In-Memory DB
                                           │
                                     logger.js  ──POST──►  External Log API
```

**Log levels used per layer:**

| Layer | Levels Used |
|-------|-------------|
| Middleware (req/res) | info, warn, error, fatal |
| Route | debug |
| Controller (handler) | debug, warn, error |
| Service | debug, info, warn |
| Frontend component | debug, info, warn |
| Frontend hook | debug, info, error |
| Frontend page | debug, info, warn |
| Frontend api | debug, info, warn, error |
