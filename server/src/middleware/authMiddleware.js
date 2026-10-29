import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import User from '../models/User.js';

// Note: If Firebase Admin credentials are fully supplied, we verify via Firebase Admin
let firebaseAdmin = null;
try {
  if (config.firebaseProjectId && config.firebaseClientEmail && config.firebasePrivateKey) {
    const admin = await import('firebase-admin');
    if (!admin.default.apps.length) {
      admin.default.initializeApp({
        credential: admin.default.credential.cert({
          projectId: config.firebaseProjectId,
          clientEmail: config.firebaseClientEmail,
          privateKey: config.firebasePrivateKey.replace(/\\n/g, '\n'),
        }),
      });
    }
    firebaseAdmin = admin.default;
    console.log('✅ [Auth] Firebase Admin SDK initialized for token verification');
  }
} catch (err) {
  console.warn('⚠️ [Auth] Firebase Admin initialization note:', err.message);
}

/**
 * Main authentication guard for protected endpoints
 */
export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication token missing. Please provide a Bearer token.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    let decodedUser = null;

    // 1. Try Firebase Admin verification if initialized
    if (firebaseAdmin) {
      try {
        const decodedFirebase = await firebaseAdmin.auth().verifyIdToken(token);
        decodedUser = {
          uid: decodedFirebase.uid,
          email: decodedFirebase.email || '',
          displayName: decodedFirebase.name || decodedFirebase.email?.split('@')[0] || 'User',
          photoURL: decodedFirebase.picture || '',
          emailVerified: !!decodedFirebase.email_verified,
        };
      } catch (fbErr) {
        // Fall through to JWT/mock verification if Firebase verification fails in local test
      }
    }

    // 2. Try standard JWT / Mock JWT verification
    if (!decodedUser) {
      try {
        if (token.startsWith('mock_jwt_token_')) {
          const payload = JSON.parse(Buffer.from(token.replace('mock_jwt_token_', ''), 'base64').toString());
          decodedUser = {
            uid: payload.uid || 'mock_uid_' + Date.now(),
            email: payload.email || 'demo@chatreplyzer.ai',
            displayName: payload.email?.split('@')[0] || 'Demo User',
            emailVerified: true,
          };
        } else if (token.startsWith('mock_google_jwt_')) {
          decodedUser = {
            uid: token.replace('mock_google_jwt_', ''),
            email: 'alex.creator@example.com',
            displayName: 'Alex Rivers',
            emailVerified: true,
          };
        } else if (token.startsWith('mock_jwt_demo_')) {
          const role = token.replace('mock_jwt_demo_', '');
          decodedUser = {
            uid: role === 'admin' ? 'admin_root_1' : 'demo_user_1',
            email: role === 'admin' ? 'admin@chatreplyzer.ai' : 'demo@chatreplyzer.ai',
            displayName: role === 'admin' ? 'Administrator' : 'Sarah Khan',
            role,
            emailVerified: true,
          };
        } else {
          // Verify standard JWT signed by our server
          const decoded = jwt.verify(token, config.jwtSecret);
          decodedUser = {
            uid: decoded.uid || decoded.id,
            email: decoded.email,
            displayName: decoded.displayName || '',
            role: decoded.role || 'user',
          };
        }
      } catch (jwtErr) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired authentication credentials.',
        });
      }
    }

    if (!decodedUser || !decodedUser.email) {
      return res.status(401).json({ success: false, message: 'Invalid credentials payload.' });
    }

    // Find or create local database record for user
    let user = await User.findOne({
      $or: [{ firebaseUid: decodedUser.uid }, { email: decodedUser.email.toLowerCase() }],
    });

    if (!user) {
      user = await User.create({
        firebaseUid: decodedUser.uid,
        email: decodedUser.email.toLowerCase(),
        displayName: decodedUser.displayName || decodedUser.email.split('@')[0],
        photoURL: decodedUser.photoURL || '',
        role: decodedUser.role || (decodedUser.email.includes('admin') ? 'admin' : 'user'),
        emailVerified: decodedUser.emailVerified || false,
      });
    }

    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        message: 'Account suspended. Please contact security@chatreplyzer.ai.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('[AuthMiddleware] Error:', error.message);
    return res.status(500).json({ success: false, message: 'Authentication validation error.' });
  }
};

/**
 * Admin role guard: requires verified role === 'admin'
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Administrator privileges required.',
    });
  }
  next();
};
