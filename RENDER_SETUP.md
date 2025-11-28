# Render Deployment Setup Guide

## Problem: "Failed to load products" on Render

If you're seeing "Failed to load products. Please try again later." on Render, it's likely because the frontend cannot connect to the backend.

## Solution: Set Environment Variables in Render

### For Frontend Service (on Render):

1. Go to your **Frontend** service dashboard on Render
2. Navigate to **Environment** tab
3. Add the following environment variable:

```
VITE_BACKEND_URL=https://your-backend-service.onrender.com
```

Replace `your-backend-service.onrender.com` with your actual backend service URL.

**Example:**
```
VITE_BACKEND_URL=https://sarees-backend.onrender.com
```

4. **Redeploy** the frontend service after adding the environment variable

### For Backend Service (on Render):

Make sure these environment variables are set:

1. `MONGODB_URI` - Your MongoDB connection string
2. `RAZORPAY_KEY_ID` - Razorpay key ID (if using payments)
3. `RAZORPAY_KEY_SECRET` - Razorpay key secret (if using payments)
4. `JWT_SECRET` - Secret key for JWT tokens
5. `GOOGLE_CLIENT_ID` - Google OAuth client ID (if using Google login)
6. `GOOGLE_CLIENT_SECRET` - Google OAuth client secret (if using Google login)

### CORS Configuration

The backend is configured to allow requests from:
- `http://localhost:5173` (local development)
- `http://localhost:5174` (local development)
- `https://sarees-frontend.onrender.com`
- `https://sarees-jwhn.onrender.com`
- `https://sareesansaar-1.onrender.com`
- `https://sareesansaaar-1.onrender.com`

If your frontend URL is different, add it to `backend/index.js` in the `allowedOrigins` array.

## Testing

After setting the environment variables:

1. **Redeploy both services** (frontend and backend)
2. Check browser console for any CORS errors
3. Check backend logs for incoming requests
4. Verify the API URL in browser Network tab matches your backend URL

## Troubleshooting

### Still seeing errors?

1. **Check backend is running**: Visit `https://your-backend.onrender.com/api/health` - should return `{"ok":true}`

2. **Check CORS**: Open browser DevTools → Network tab → Look for CORS errors

3. **Check environment variable**: In Render frontend service, verify `VITE_BACKEND_URL` is set correctly

4. **Check backend logs**: Look for "CORS BLOCKED" messages in backend logs

5. **Verify URLs match**: Frontend `VITE_BACKEND_URL` should match backend service URL exactly (including https://)

