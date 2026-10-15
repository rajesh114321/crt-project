# ==============================================================================
# QueueLess – Cloud Ready Production Multi-Stage Dockerfile
# Serves both the Node.js / Express API and React SPA from a single secure container
# ==============================================================================

# STAGE 1: Build Frontend SPA
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# STAGE 2: Backend Runtime & Final Release Image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install production backend dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --omit=dev

# Copy backend source code & initial data
WORKDIR /app
COPY backend ./backend

# Copy compiled frontend distribution from builder stage
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose HTTP port
EXPOSE 5000

# Container Healthcheck via /api/health
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start unified server
CMD ["node", "backend/server.js"]
