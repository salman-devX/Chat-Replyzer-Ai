# ==============================================================================
# Multi-Stage Production Dockerfile for Chat Replyzer AI
# ==============================================================================

# ─── Stage 1: Build React Frontend ─────────────────────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ─── Stage 2: Build Node.js Backend & Final Production Runner ─────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install production dependencies for server
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

# Copy server code
COPY server/src ./server/src
COPY server/package.json ./server/package.json

# Copy built frontend assets to dist
COPY --from=frontend-builder /app/dist ./dist

# Create persistent storage directories for WhatsApp sessions
RUN mkdir -p /app/server/wa_auth /app/server/wa_sessions

EXPOSE 5000

WORKDIR /app/server
CMD ["node", "src/server.js"]
