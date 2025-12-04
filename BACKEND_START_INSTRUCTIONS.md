# Backend Server Start Instructions

## Quick Start

1. **Open a new terminal/command prompt**

2. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

3. **Check if .env file exists:**
   ```bash
   # Windows
   dir .env
   
   # Linux/Mac
   ls .env
   ```

4. **If .env file doesn't exist, create it:**
   ```bash
   # Copy from .env.example if available, or create new one
   ```

5. **Make sure .env has these variables:**
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   FAST2SMS_API_KEY=your_fast2sms_api_key
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

6. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

7. **Start the server:**
   ```bash
   # Using npm script
   npm run dev
   
   # OR directly with node
   node index.js
   ```

8. **You should see:**
   ```
   Server is running at 5000
   ```

## Troubleshooting

### Error: Cannot find module
- Run `npm install` in the backend directory

### Error: MongoDB connection failed
- Check your `MONGODB_URI` in `.env` file
- Make sure MongoDB is running or your MongoDB Atlas connection string is correct

### Error: Port 5000 already in use
- Change `PORT=5000` to another port (e.g., `PORT=5001`) in `.env`
- Update `VITE_BACKEND_URL` in frontend `.env` to match

### Error: FAST2SMS_API_KEY not set
- Get your API key from https://www.fast2sms.com/
- Add it to `.env` file

## Verify Backend is Running

Open browser and go to:
```
http://localhost:5000/api/health
```

You should see: `{"ok":true}`

