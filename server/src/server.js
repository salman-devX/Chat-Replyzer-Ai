import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/auth.js';
import leadRoutes from './routes/leads.js';
import customerRoutes from './routes/customers.js';
import callRoutes from './routes/calls.js';
import dealRoutes from './routes/deals.js';
import followupRoutes from './routes/followups.js';
import objectionRoutes from './routes/objections.js';
import knowledgeRoutes from './routes/knowledge.js';
import teamRoutes from './routes/team.js';
import analyticsRoutes from './routes/analytics.js';
import whatsappRoutes from './routes/whatsapp.js';
import { whatsappWebService } from './services/whatsappWebService.js';

const app = express();
const httpServer = createServer(app);

// ─── Socket.IO Setup ───────────────────────────────────────────────────────
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

whatsappWebService.setIo(io);

io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  // Send initial WhatsApp state immediately
  socket.emit('whatsapp:state', whatsappWebService.getStatus('default'));

  socket.on('whatsapp:join-session', (sessionId) => {
    const sId = sessionId || 'default';
    socket.join(`session:${sId}`);
    socket.emit('whatsapp:state', whatsappWebService.getStatus(sId));
  });

  socket.on('whatsapp:start', async (data) => {
    const sessionId = data?.sessionId || 'default';
    await whatsappWebService.startSession(sessionId);
  });

  socket.on('whatsapp:disconnect', async (data) => {
    const sessionId = data?.sessionId || 'default';
    await whatsappWebService.logout(sessionId);
  });

  socket.on('whatsapp:get-state', (data) => {
    const sessionId = data?.sessionId || 'default';
    socket.emit('whatsapp:state', whatsappWebService.getStatus(sessionId));
  });

  socket.on('join:dashboard', () => socket.join('dashboard'));
  socket.on('join:calls', () => socket.join('calls'));

  // AI Call simulation
  socket.on('ai:start-call', (data) => {
    socket.emit('ai:call-status', { status: 'Calling', ...data });
    setTimeout(() => socket.emit('ai:call-status', { status: 'Connected', ...data }), 2000);
    setTimeout(() => {
      socket.emit('ai:transcript', { text: 'Hello, is this the Fleet Manager?', speaker: 'ai' });
    }, 3000);
    setTimeout(() => {
      socket.emit('ai:call-status', { status: 'Completed', outcome: 'Follow-up Scheduled', ...data });
    }, 10000);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// ─── Middleware ─────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: [config.clientUrl, 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many attempts. Please try again in 15 minutes.' },
});

// ─── Routes ─────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'TruckPilot API',
    version: '2.4.0',
    env: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/follow-ups', followupRoutes);
app.use('/api/objections', objectionRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// ─── Production Frontend Static Serving ─────────────────────────────────────
const clientDistPath = path.join(process.cwd(), '..', 'dist');
const localDistPath = path.join(process.cwd(), 'dist');
const distDir = fs.existsSync(clientDistPath) ? clientDistPath : (fs.existsSync(localDistPath) ? localDistPath : null);

if (distDir) {
  console.log(`🌐 Serving production frontend from: ${distDir}`);
  app.use(express.static(distDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
      return next();
    }
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

// ─── Error Handling ──────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────────────
const start = async () => {
  try {
    await connectDB();

    httpServer.listen(config.port, () => {
      console.log('\n' + '═'.repeat(55));
      console.log('  🚛  TruckPilot API Server');
      console.log('═'.repeat(55));
      console.log(`  ✅  Status   : Running`);
      console.log(`  🌐  URL      : http://localhost:${config.port}`);
      console.log(`  🔑  Auth     : http://localhost:${config.port}/api/auth`);
      console.log(`  📊  Health   : http://localhost:${config.port}/api/health`);
      console.log(`  🗄️  Database : Connected`);
      console.log('═'.repeat(55) + '\n');

      // Auto-start default WhatsApp session
      whatsappWebService.startSession('default').catch((e) => {
        console.warn('⚠️ WhatsApp auto-start notice:', e.message);
      });
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

start();

export { io };
