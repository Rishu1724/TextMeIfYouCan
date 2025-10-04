# 🏥 Health Check Endpoints

This document describes the health check endpoints available in the application to help with deployment verification.

## Backend Health Check

### Endpoint
```
GET /health
```

### Response
```json
{
  "status": "OK",
  "timestamp": "2023-05-15T10:30:45.123Z",
  "uptime": 1234.567
}
```

### Purpose
- Verify that the backend server is running
- Check server uptime
- Confirm basic HTTP connectivity

### Usage
After deploying your backend, visit:
```
https://your-backend-url.com/health
```

You should see a JSON response indicating the server is healthy.

## Frontend Health Check

The frontend application will show errors in the browser console if:
1. Environment variables are not set correctly
2. API calls are failing
3. WebSocket connections are not established
4. Firebase configuration is incorrect

### Browser Console Check
1. Open your deployed application in a browser
2. Press F12 to open Developer Tools
3. Go to the Console tab
4. Look for error messages

### Common Health Indicators

#### ✅ Healthy Application
- No errors in browser console
- User can login/register
- Chat messages load
- Online status indicators work
- Real-time features function

#### ❌ Unhealthy Application
- "Missing or insufficient permissions" errors (Firebase)
- "WebSocket connection failed" errors
- "404 Not Found" errors for API endpoints
- White screen or blank page
- Environment variable warnings

## Debugging Checklist

When troubleshooting deployment issues:

1. **Check Backend Health**:
   ```
   curl https://your-backend-url.com/health
   ```

2. **Verify Environment Variables**:
   - Check all required variables are set in Netlify dashboard
   - Check all required variables are set in backend hosting platform

3. **Test API Endpoints**:
   ```
   curl https://your-backend-url.com/api/test-endpoint
   ```

4. **Check WebSocket Connection**:
   - Look for Socket.IO connection messages in browser console
   - Check for "connect" and "disconnect" events

5. **Verify Firebase Configuration**:
   - Check Firebase project settings
   - Verify service account credentials
   - Confirm Firestore security rules are deployed

## Monitoring

For production deployments, consider setting up:
- Uptime monitoring for the `/health` endpoint
- Error tracking (e.g., Sentry)
- Performance monitoring
- Log aggregation