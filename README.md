# 📱 Verixo - SMS Verification Marketplace

A modern, secure SMS verification service platform that provides virtual phone numbers for receiving verification codes.

## 🌟 Features

### Security
- 🔒 **Enhanced Authentication** - Users must login every time (no auto-login)
- ⏱️ **Auto-Logout** - 30-minute inactivity timeout
- 🛡️ **Session Management** - Automatic session cleanup
- 🔐 **JWT Authentication** - Secure token-based auth
- 🚫 **CORS Protection** - Configured for production security

### User Features
- 📱 **Virtual Phone Numbers** - Purchase numbers from multiple countries
- 💬 **SMS Reception** - Receive verification codes instantly
- 💰 **Wallet System** - Fund wallet and manage balance
- 💳 **Multiple Payment Methods** - Paystack & Flutterwave integration
- 📊 **Dashboard** - Track purchases, balance, and statistics
- 👤 **User Profile** - Manage account settings
- 📧 **Email Notifications** - Welcome emails and notifications

### Admin Features
- 🎛️ **Admin Dashboard** - Manage users and services
- 📈 **Analytics** - View platform statistics
- 🔧 **Service Management** - Configure available services
- 👥 **User Management** - View and manage users

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Integrations
- **Bliss Digitals API** - SMS service provider
- **Paystack** - Payment gateway
- **Flutterwave** - Payment gateway
- **Nodemailer** - Email service

## 📦 Project Structure

```
verixo-sms-verification/
├── frontend/                 # React frontend
│   ├── public/              # Static assets
│   │   └── images/          # Logo and images
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── layout/      # Layout components
│   │   │   └── common/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Utility functions
│   │   │   ├── api.js       # API service
│   │   │   ├── sessionManager.js  # Session management
│   │   │   └── router.js    # Navigation helper
│   │   ├── styles/          # CSS files
│   │   └── constants/       # Constants and configs
│   └── package.json
│
├── backend/                  # Node.js backend
│   ├── controllers/         # Route controllers
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── services/            # Business logic
│   │   ├── blissDigitalsService.js  # SMS API
│   │   ├── paymentService.js        # Payment processing
│   │   └── emailService.js          # Email sending
│   ├── seeders/             # Database seeders
│   └── server.js            # Entry point
│
└── docs/                     # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Bliss Digitals API key
- Paystack account (optional)
- Flutterwave account (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/verixo-sms-verification.git
cd verixo-sms-verification
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.production.template .env
# Edit .env with your credentials
npm start
```

3. **Setup Frontend**
```bash
cd frontend
npm install
cp .env.production .env.development
# Edit .env.development with your API URL
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5174
- Backend: http://localhost:5000

## 🔧 Configuration

### Backend Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
BLISS_DIGITALS_API_KEY=your_api_key
BLISS_DIGITALS_API_URL=https://api.blissdigitals.com
PAYSTACK_SECRET_KEY=your_paystack_secret
FLUTTERWAVE_SECRET_KEY=your_flutterwave_secret
FRONTEND_URL=http://localhost:5174
```

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:5000/api
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
VITE_FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public_key
```

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/register     - Register new user
POST /api/auth/login        - Login user
POST /api/auth/logout       - Logout user
GET  /api/auth/profile      - Get user profile
PUT  /api/auth/profile      - Update profile
```

### Services Endpoints
```
GET  /api/services          - Get all services
GET  /api/services/:id      - Get service details
POST /api/services/purchase - Purchase a number
```

### Payment Endpoints
```
POST /api/payments/initialize  - Initialize payment
POST /api/payments/verify      - Verify payment
GET  /api/payments/history     - Get payment history
```

### Dashboard Endpoints
```
GET /api/dashboard/stats       - Get dashboard statistics
GET /api/dashboard/transactions - Get recent transactions
```

## 🔒 Security Features

### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Token expiration validation
- Session timeout (30 minutes)

### Session Management
- Auto-logout after inactivity
- Activity tracking
- Proper session cleanup
- No persistent auto-login

### API Security
- CORS configuration
- Rate limiting
- Input validation
- Error handling

## 🎨 UI/UX Features

- Responsive design (mobile, tablet, desktop)
- Modern gradient design
- Smooth animations
- Loading states
- Error handling
- Form validation
- Toast notifications

## 📱 Screenshots

### Landing Page
Modern landing page with hero section, features, and pricing.

### Dashboard
User dashboard with wallet balance, statistics, and quick actions.

### Services
Browse and purchase virtual phone numbers from various countries.

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Render/Railway)
1. Connect GitHub repository
2. Configure environment variables
3. Deploy

See [DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md) for detailed instructions.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- Bliss Digitals for SMS API
- Paystack & Flutterwave for payment processing
- MongoDB Atlas for database hosting
- Vercel & Render for hosting

## 📞 Support

For support, email support@verixo.com or join our Slack channel.

## 🔗 Links

- [Live Demo](https://verixo.vercel.app)
- [API Documentation](https://api.verixo.com/docs)
- [User Guide](./docs/USER_GUIDE.md)
- [Admin Guide](./docs/ADMIN_GUIDE.md)

## 📊 Status

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

Made with ❤️ by Verixo Team
