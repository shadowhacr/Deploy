import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'shadowdeploy-secret-key-2025';

export function adminAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
}

export function generateToken() {
  return jwt.sign({ role: 'admin', iat: Date.now() }, JWT_SECRET, { expiresIn: '24h' });
}

export { JWT_SECRET };
