# Verixo API Integration Setup

## 🚀 Backend API Deployed

**Live API**: https://verixo-api.onrender.com  
**Health Check**: https://verixo-api.onrender.com/health  
**Base URL**: https://verixo-api.onrender.com/api  

## 📡 Frontend Configuration

The frontend is now configured to use the deployed backend API:

### Production Environment
```env
VITE_API_URL=https://verixo-api.onrender.com/api
```

### Development Environment
Uses Vite proxy to the deployed API for seamless development.

## 📡 API Integration Status

### ✅ **Completed Integrations**

#### **Services API**
- **Endpoint**: `GET /api/server1/services`
- **Status**: ✅ Integrated
- **Features**: 
  - Fetches available USA services
  - Displays real pricing from API
  - Shows service availability

#### **Purchase API**
- **Endpoint**: `POST /api/server1/purchase`
- **Status**: ✅ Integrated
- **Features**:
  - Real number purchasing
  - Returns activation ID and phone number
  - Stores purchased numbers locally

#### **SMS Status API**
- **Endpoint**: `GET /api/server1/status/{id}`
- **Status**: ✅ Integrated
- **Features**:
  - Automatic polling for SMS codes
  - Real-time code display
  - Updates every 15 seconds

#### **Cancel Order API**
- **Endpoint**: `DELETE /api/server1/cancel/{id}`
- **Status**: ✅ Integrated
- **Features**:
  - Cancel purchased numbers
  - Automatic refund processing

## 🔄 How It Works

### 1. **Service Discovery**
- App fetches available services from your API
- Displays services with real pricing
- Shows only available USA services

### 2. **Number Purchase Flow**
```
User clicks "Get Number" 
→ Confirms purchase 
→ API call to /purchase 
→ Number allocated 
→ Stored locally 
→ SMS polling starts
```

### 3. **SMS Code Reception**
```
Purchase complete 
→ Automatic polling every 15s 
→ Check /status/{activation_id} 
→ Display codes when received 
→ Update local storage
```

### 4. **Active Numbers Management**
- Numbers stored in localStorage
- Real-time status updates
- Cancel/refund functionality
- 20-minute expiry tracking

## 🎯 Service Mapping

Your API services are automatically mapped to UI-friendly names:

| API Code | Display Name | Icon | Popular |
|----------|-------------|------|---------|
| `wa` | WhatsApp | 📱 | ✅ |
| `tg` | Telegram | ✈️ | ❌ |
| `ig` | Instagram | 📷 | ❌ |
| `fb` | Facebook | 👥 | ❌ |
| `tw` | Twitter/X | 🐦 | ❌ |
| `tt` | TikTok | 🎵 | ❌ |

## 🔧 Configuration

### API Base URL
```javascript
const API_BASE_URL = 'https://blissdigitals.com/api/server1';
```

### Authentication
```javascript
Authorization: Bearer {your_api_token}
Accept: application/json
```

### Error Handling
- Automatic error message display
- User-friendly error messages
- Retry mechanisms for failed requests

## 📱 Features

### ✅ **Working Features**
- Real service fetching from API
- Live number purchasing
- SMS code polling and display
- Number cancellation with refunds
- Mobile-responsive design
- Copy-to-clipboard functionality
- Real-time status updates

### 🔄 **Local Storage**
Numbers are stored locally to persist across browser sessions:
- Purchase history
- Active numbers
- Received SMS codes
- Expiry tracking

## 🚨 Important Notes

1. **USA Only**: Your API provides USA numbers only
2. **20-minute Expiry**: Numbers expire 20 minutes after purchase
3. **Real-time Polling**: SMS codes are checked every 15 seconds
4. **Local Storage**: Data persists in browser localStorage
5. **No Renewal**: API doesn't support number renewal (20-min limit)

## 🐛 Troubleshooting

### Common Issues

1. **"Authentication failed"**
   - Check your API token in `.env` file
   - Ensure token is valid and active

2. **"Service unavailable"**
   - API might be down
   - Check network connection
   - Verify API endpoint URL

3. **"No services showing"**
   - Check browser console for errors
   - Verify API token permissions
   - Check if API returns services

4. **"SMS codes not appearing"**
   - Codes can take 1-10 minutes to arrive
   - Check browser console for polling errors
   - Verify activation ID is correct

## 📞 Support

If you encounter issues:
1. Check browser console for error messages
2. Verify API token is correct
3. Test API endpoints directly
4. Check network connectivity

## 🎉 Ready to Use!

Your VirtNum platform is now fully integrated with the BlissDigitals API and ready for production use!