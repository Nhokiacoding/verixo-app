# Verixo - SMS Verification Platform

Modern SMS verification platform frontend built with React, Vite, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Nhokiacoding/verixo-app.git
cd verixo-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**

Create `.env.development` for local development:
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Verixo
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxx
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxx
```

Create `.env.production` for production:
```env
VITE_API_URL=https://your-backend.onrender.com/api
VITE_APP_NAME=Verixo
VITE_PAYSTACK_PUBLIC_KEY=pk_live_xxx
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_LIVE-xxx
```

4. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:5173`

## 🏗️ Build for Production

```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/      # React components
│   ├── auth/       # Authentication components
│   ├── common/     # Reusable components
│   ├── dashboard/  # Dashboard components
│   ├── icons/      # Icon components
│   └── layout/     # Layout components
├── constants/       # App constants
├── pages/          # Page components
│   ├── admin/      # Admin pages
│   ├── dashboard/  # User dashboard
│   ├── home/       # Landing page
│   └── services/   # Services pages
├── styles/         # CSS files
├── utils/          # Utility functions
├── App.jsx         # Main app component
└── main.jsx        # Entry point
```

## 🎨 Features

- **Modern UI**: Clean, responsive design with smooth animations
- **Authentication**: Complete auth flow (login, register, email verification, password reset)
- **Dashboard**: User dashboard with wallet, transactions, and stats
- **Admin Panel**: Comprehensive admin management
- **Payment Integration**: Paystack and Flutterwave integration
- **Service Management**: Browse and purchase SMS verification services
- **Responsive Design**: Mobile-first approach
- **Session Management**: Secure session handling

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel --prod
```

3. **Configure Environment Variables**
   - Go to Vercel Dashboard
   - Add environment variables
   - Redeploy

### Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`
3. **Environment Variables**: Add in Netlify dashboard

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | ✅ |
| `VITE_APP_NAME` | Application name | ✅ |
| `VITE_PAYSTACK_PUBLIC_KEY` | Paystack public key | ✅ |
| `VITE_FLUTTERWAVE_PUBLIC_KEY` | Flutterwave public key | ✅ |

## 📱 Pages

### Public Pages
- `/` - Landing page
- `/login` - User login
- `/register` - User registration
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset form

### Protected Pages
- `/dashboard` - User dashboard
- `/services` - Available services
- `/transactions` - Transaction history
- `/profile` - User profile

### Admin Pages
- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/services` - Service management
- `/admin/transactions` - Transaction management

## 🎨 Styling

The app uses:
- **Tailwind CSS**: Utility-first CSS framework
- **Custom CSS**: Additional styles in `src/styles/`
- **Animations**: Smooth transitions and effects

## 🔒 Security Features

- **Session Management**: Secure token storage
- **Protected Routes**: Authentication required for sensitive pages
- **Input Validation**: Client-side validation
- **HTTPS Only**: Enforced in production
- **XSS Protection**: React's built-in protection

## 🐛 Troubleshooting

### API Connection Issues
- Check `VITE_API_URL` is correct
- Ensure backend is running and accessible
- Check browser console for CORS errors

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

### Environment Variables Not Working
- Ensure variables start with `VITE_`
- Restart dev server after changing `.env`
- Check variables are set in deployment platform

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📄 License

ISC License

## 🆘 Support

- GitHub Issues: [Create an issue](https://github.com/Nhokiacoding/verixo-app/issues)
- Email: support@verixo.com

---

**Built with ❤️ by the Verixo Team**
