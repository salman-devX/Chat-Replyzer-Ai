import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'chat_replyzer_default_jwt_secret_2026',
  jwtExpiresIn: '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  encryptionSecretKey: process.env.ENCRYPTION_SECRET_KEY || 'chat_replyzer_32byte_secret_key_2026!',

  // Firebase
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || 'chat-replyzer-ai',
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
  firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY || '',

  // AI & Gemini
  aiProvider: process.env.AI_PROVIDER || 'Gemini',
  aiApiKey: process.env.GEMINI_API_KEY || process.env.AI_API_KEY || '',
  geminiModel: process.env.AI_MODEL || 'gemini-3.5-flash',

  // Meta Developer Platform
  metaAppId: process.env.META_APP_ID || '',
  metaAppSecret: process.env.META_APP_SECRET || '',
  metaWebhookVerifyToken: process.env.META_WEBHOOK_VERIFY_TOKEN || 'chat_replyzer_webhook_verify_token_2026',
  whatsappPhoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  whatsappWabaId: process.env.WHATSAPP_WABA_ID || '',
  whatsappAccessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',

  // TikTok Business
  tiktokAppId: process.env.TIKTOK_APP_ID || '',
  tiktokAppSecret: process.env.TIKTOK_APP_SECRET || '',

  // Quota
  dailyFreeReplyLimit: parseInt(process.env.DAILY_FREE_REPLY_LIMIT || '150', 10),
  timezoneReset: process.env.TIMEZONE_RESET || 'UTC',
};
