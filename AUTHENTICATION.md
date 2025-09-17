# MongoDB API Authentication

This document describes the status-based authentication system implemented for all MongoDB APIs in the CRM POC application.

## Overview

All MongoDB API endpoints (`/api/mongo/*`) now require authentication using a Bearer token with status-based authorization.

## Authentication Format

### Headers Required
```
Authorization: Bearer <token>
```

### Token Format
```
<status>_<userid>
```

**Examples:**
- `active_123` - Active user with ID 123
- `admin_456` - Admin user with ID 456
- `premium_789` - Premium user with ID 789
- `user_101` - Regular user with ID 101

## Valid User Statuses

| Status | Description | Permissions |
|--------|-------------|-------------|
| `user` | Regular user | Basic CRUD operations |
| `active` | Active user | Basic CRUD operations |
| `premium` | Premium user | All operations except admin-only |
| `admin` | Administrator | All operations including delete |

## Protected Endpoints

### All MongoDB Routes
All routes under `/api/mongo/` require authentication:

- `GET /api/mongo/health` - MongoDB health check
- `GET /api/mongo/customers` - Get all customers
- `POST /api/mongo/customers` - Create customer
- `PUT /api/mongo/customers/:id` - Update customer
- `PATCH /api/mongo/customers/:id` - Partial update customer
- `DELETE /api/mongo/customers/:id` - **Admin only** - Delete customer
- `GET /api/mongo/customers/date-range` - Get customers by date range
- `POST /api/mongo/lead` - Create lead

### Admin-Only Routes
- `DELETE /api/mongo/customers/:id` - Requires admin status

## Usage Examples

### Valid Request
```bash
curl -X GET http://localhost:3000/api/mongo/customers \
  -H "Authorization: Bearer active_123"
```

### Create Lead with Authentication
```bash
curl -X POST http://localhost:3000/api/mongo/lead \
  -H "Authorization: Bearer user_456" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "leadsource": "Website",
    "leadcomments": "Interested in premium plan"
  }'
```

### Admin Delete Operation
```bash
curl -X DELETE http://localhost:3000/api/mongo/customers/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer admin_789"
```

## Error Responses

### Missing Authorization Header
```json
{
  "status": "error",
  "message": "Authorization header is required",
  "code": "MISSING_AUTH_HEADER"
}
```

### Invalid Token Format
```json
{
  "status": "error",
  "message": "Invalid token format. Expected: status_userid",
  "code": "INVALID_TOKEN_FORMAT"
}
```

### Invalid Status
```json
{
  "status": "error",
  "message": "Invalid user status",
  "code": "INVALID_STATUS",
  "validStatuses": ["active", "admin", "user", "premium"]
}
```

### Admin Required
```json
{
  "status": "error",
  "message": "Admin access required",
  "code": "ADMIN_REQUIRED"
}
```

## Implementation Details

### Middleware Files
- `/middleware/auth.js` - Contains authentication logic
- `authenticateStatus` - Main authentication middleware
- `requireAdmin` - Admin-only access middleware
- `requirePremium` - Premium access middleware

### User Context
After successful authentication, the `req.user` object contains:
```javascript
{
  id: "123",           // User ID from token
  status: "active",    // User status
  isAdmin: false,      // Boolean: true if admin
  isPremium: false     // Boolean: true if premium or admin
}
```

### Lead Tracking
When creating leads, the system automatically adds:
- `createdBy`: User ID from the authenticated token
- `leadprocessed`: Set to "New" by default

## Security Notes

1. This is a demo implementation - in production, use proper JWT tokens or API keys
2. Tokens are logged for monitoring purposes
3. All authentication errors are logged to console
4. The system validates both token format and user status
5. Admin operations are restricted to admin users only

## Testing Authentication

Use tools like Postman, curl, or any HTTP client to test the endpoints with the required Authorization header.
