const authenticateStatus = (req, res, next) => {
  try {
    // Check for authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        status: 'error',
        message: 'Authorization header is required',
        code: 'MISSING_AUTH_HEADER'
      });
    }

    // Check if it starts with 'Bearer '
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Authorization header must start with Bearer',
        code: 'INVALID_AUTH_FORMAT'
      });
    }

    // Extract the token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Token is required',
        code: 'MISSING_TOKEN'
      });
    }

    // Simple status-based authentication
    // In production, you would validate JWT tokens or API keys here
    const validStatuses = ['active', 'admin', 'user', 'premium'];
    
    // For demo purposes, we'll check if token matches valid status patterns
    // Format: status_userid (e.g., "active_123", "admin_456")
    const tokenParts = token.split('_');
    
    if (tokenParts.length !== 2) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token format. Expected: status_userid',
        code: 'INVALID_TOKEN_FORMAT'
      });
    }

    const [userStatus, userId] = tokenParts;
    
    if (!validStatuses.includes(userStatus)) {
      return res.status(403).json({
        status: 'error',
        message: 'Invalid user status',
        code: 'INVALID_STATUS',
        validStatuses: validStatuses
      });
    }

    if (!userId || userId.length < 1) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid user ID',
        code: 'INVALID_USER_ID'
      });
    }

    // Add user info to request object for use in routes
    req.user = {
      id: userId,
      status: userStatus,
      isAdmin: userStatus === 'admin',
      isPremium: userStatus === 'premium' || userStatus === 'admin'
    };

    // Log authentication for monitoring
    console.log(`Authenticated user: ${userId} with status: ${userStatus}`);
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal authentication error',
      code: 'AUTH_ERROR'
    });
  }
};

// Optional: Admin-only middleware
const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      status: 'error',
      message: 'Admin access required',
      code: 'ADMIN_REQUIRED'
    });
  }
  next();
};

// Optional: Premium access middleware
const requirePremium = (req, res, next) => {
  if (!req.user || !req.user.isPremium) {
    return res.status(403).json({
      status: 'error',
      message: 'Premium access required',
      code: 'PREMIUM_REQUIRED'
    });
  }
  next();
};

module.exports = {
  authenticateStatus,
  requireAdmin,
  requirePremium
};
