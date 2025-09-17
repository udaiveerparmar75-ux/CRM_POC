const authenticateStaticToken = (req, res, next) => {
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

    // Static token for comparison
    const STATIC_TOKEN = 'my-static-token';

    if (authHeader !== STATIC_TOKEN) {
      return res.status(403).json({
        status: 'error',
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }

    // Token is valid, proceed to the next middleware
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

module.exports = {
  authenticateStaticToken
};
