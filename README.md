# 🛒 SETU - Surplus Exchange Trading Unit

A full-stack e-commerce platform for trading surplus products with admin approval workflow.

## 🌟 Features

- **Multi-Role System**: Admin, Agency (Seller), Customer
- **Product Management**: Add, edit, approve, and manage products
- **Order Processing**: Complete order workflow with status tracking
- **Document Verification**: Agency verification system
- **Analytics Dashboard**: Sales and product performance metrics
- **Messaging System**: Built-in communication
- **Watchlist**: Save favorite products
- **Responsive Design**: Works on all devices

## 🏗️ Tech Stack

### Frontend
- React 19
- React Router DOM 6
- Axios
- Vite

### Backend
- Node.js
- Express 5
- MongoDB with Mongoose
- JWT Authentication
- Multer (File uploads)
- bcryptjs (Password hashing)

### Database
- MongoDB Atlas

## 📁 Project Structure

```
SETU/
├── backend/
│   ├── controllers/      # Business logic
│   ├── middleware/       # Auth middleware
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   ├── scripts/         # Utility scripts
│   ├── uploads/         # File uploads
│   ├── server.js        # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API services
│   │   └── assets/      # Static files
│   ├── public/
│   └── package.json
├── DEPLOYMENT_GUIDE.md  # Deployment instructions
└── README.md
```

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/setu-platform.git
cd setu-platform
```

### 2. Setup Backend

```bash
cd backend
npm install

# Copy environment file and update values
cp .env.example .env
# Edit .env with your values

# Seed admin user (optional)
node scripts/seedAdmin.js

# Start backend server
npm run dev
```

Backend will run on: http://localhost:5000

### 3. Setup Frontend

```bash
cd frontend
npm install

# Copy environment file
cp .env.example .env
# Edit .env if needed (default: http://localhost:5000)

# Start frontend
npm run dev
```

Frontend will run on: http://localhost:5173

## 🔐 Default Admin Credentials

After running the seed script:
- **Email**: admin@setu.com
- **Password**: admin123

⚠️ **Important**: Change these credentials immediately in production!

## 🌐 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Quick Deploy Summary

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy Backend** to Render
   - Sign up at https://render.com
   - Connect GitHub repository
   - Set environment variables
   - Deploy

3. **Deploy Frontend** to Vercel
   - Sign up at https://vercel.com
   - Connect GitHub repository
   - Set `VITE_API_URL` to backend URL
   - Deploy

## 📊 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products/all` - Get all approved products
- `GET /api/products/my-products` - Get agency products
- `POST /api/products` - Add new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status

### Admin
- `GET /api/admin/pending-products` - Get pending products
- `GET /api/admin/all-products` - Get all products
- `PUT /api/admin/products/:id/approve` - Approve product
- `PUT /api/admin/products/:id/reject` - Reject product
- `GET /api/admin/users` - Get all users
- `GET /api/admin/analytics` - Get platform analytics

## 👥 User Roles

### Customer
- Browse products
- Add to watchlist
- Place orders
- Track orders
- Message sellers

### Agency (Seller)
- Submit verification documents
- Add products (pending approval)
- Manage inventory
- Process orders
- View analytics

### Admin
- Approve/reject agencies
- Approve/reject products
- Manage users
- View platform analytics
- Moderate content

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm run dev  # Uses Vite HMR
```

### Build for Production
```bash
# Frontend
cd frontend
npm run build
# Output in: dist/

# Backend
cd backend
# No build needed, runs directly with Node.js
```

## 📝 Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `node scripts/seedAdmin.js` - Create admin user

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Ensure all environment variables are set
- Check if port 5000 is available

### Frontend can't connect to backend
- Verify `VITE_API_URL` is correct
- Check if backend is running
- Check browser console for CORS errors

### Database connection fails
- Verify MongoDB Atlas whitelist (add `0.0.0.0/0`)
- Check database user credentials
- Ensure connection string is correct

## 📦 Dependencies

### Backend
- express: ^5.2.1
- mongoose: ^9.1.6
- jsonwebtoken: ^9.0.3
- bcryptjs: ^3.0.3
- cors: ^2.8.6
- dotenv: ^17.2.4
- multer: ^1.4.5-lts.1

### Frontend
- react: ^19.2.0
- react-router-dom: ^6.20.0
- axios: ^1.6.2
- vite: ^8.0.0-beta.13

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📧 Contact

For questions or support, please contact the development team.

---

**Made with ❤️ for surplus product trading**
