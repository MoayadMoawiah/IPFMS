# 09 — Deployment

## G-GPFMS Deployment Guide

---

## Development Environment

### Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| Node.js | 20.x LTS | Runtime |
| PostgreSQL | 16.x | Database |
| Redis | 7.x | Cache + Queue |
| MinIO | Latest | File storage |
| pnpm | 9.x | Package manager (recommended) |

### Quick Start

```bash
# 1. Clone and install
git clone <repo>
cd IPFMS

# Install frontend dependencies (root)
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# 2. Setup environment
cp .env.example .env
# Edit .env with your values

# 3. Database setup
npx prisma migrate dev --name init
npx prisma db seed

# 4. Start services (development)
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend && npm run start:dev

# Terminal 3: MinIO (Docker)
docker run -p 9000:9000 -p 9001:9001 \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin \
  minio/minio server /data --console-address ":9001"

# Terminal 4: Redis (Docker)
docker run -p 6379:6379 redis:7-alpine

# Access:
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# Swagger: http://localhost:3001/api/docs
# MinIO Console: http://localhost:9001
```

---

## Environment Variables

See `.env.example` for full list. Key variables:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/gpfms"

# Auth
JWT_SECRET="your-256-bit-secret"
JWT_REFRESH_SECRET="your-256-bit-refresh-secret"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Redis
REDIS_URL="redis://localhost:6379"

# MinIO
MINIO_ENDPOINT="localhost"
MINIO_PORT=9000
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_BUCKET="gpfms-documents"

# SMTP
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="noreply@gaderon.org"
SMTP_PASS="password"

# Frontend
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

---

## Docker Compose (Production-like local)

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: gpfms
      POSTGRES_USER: gpfms
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ACCESS_KEY}
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY}
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://gpfms:${DB_PASSWORD}@postgres:5432/gpfms
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      MINIO_ENDPOINT: minio
      MINIO_PORT: 9000
      MINIO_ACCESS_KEY: ${MINIO_ACCESS_KEY}
      MINIO_SECRET_KEY: ${MINIO_SECRET_KEY}
    depends_on: [postgres, redis, minio]
    ports:
      - "3001:3001"

  frontend:
    build: .
    environment:
      NEXT_PUBLIC_API_URL: http://backend:3001/api
    depends_on: [backend]
    ports:
      - "3000:3000"

volumes:
  postgres_data:
  minio_data:
```

---

## Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
EXPOSE 3001
CMD ["node", "dist/main"]
```

---

## Frontend Dockerfile

```dockerfile
# Dockerfile (root)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## Database Backup

```bash
# Daily backup cron (server)
0 2 * * * pg_dump -U gpfms gpfms | gzip > /backups/gpfms_$(date +%Y%m%d).sql.gz

# Restore
gunzip -c /backups/gpfms_20260101.sql.gz | psql -U gpfms gpfms
```

---

## Monitoring

- **Health Check:** `GET /api/health` → `{ status: "ok", db: "connected", redis: "connected" }`
- **Logs:** Structured JSON logs via Winston; shipped to log aggregator
- **Uptime:** pm2 process manager for Node.js processes
- **Database:** pg_stat_statements for slow query monitoring

---

## Production Checklist

Before going live:
- [ ] All environment variables set (no defaults from .env.example)
- [ ] Database migrated and seeded with production data
- [ ] HTTPS/TLS configured (nginx reverse proxy)
- [ ] CORS restricted to production frontend domain
- [ ] JWT secrets are cryptographically random (≥ 256 bits)
- [ ] MinIO bucket policies set (private, not public)
- [ ] Redis auth enabled
- [ ] Daily backup cron configured
- [ ] Email SMTP credentials verified
- [ ] Super Admin account created and password changed
- [ ] All test/seed grants removed from production DB
- [ ] Rate limiting enabled on all auth endpoints
- [ ] Swagger disabled in production (`SWAGGER_ENABLED=false`)
