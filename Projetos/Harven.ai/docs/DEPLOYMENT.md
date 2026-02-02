# Harven.AI - Deployment Guide

## Overview

This guide covers deploying Harven.AI to production using Docker and Coolify.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Architecture](#architecture)
3. [Environment Setup](#environment-setup)
4. [Docker Deployment](#docker-deployment)
5. [Coolify Deployment](#coolify-deployment)
6. [SSL/TLS Configuration](#ssltls-configuration)
7. [Database Migrations](#database-migrations)
8. [Backup Strategy](#backup-strategy)
9. [Monitoring Setup](#monitoring-setup)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Docker 24.0+
- Docker Compose 2.0+
- Domain with DNS configured
- Supabase project (or PostgreSQL)
- OpenAI API key
- Coolify (optional, for managed deployment)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Load Balancer                          │
│                    (Cloudflare/Nginx)                       │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────┴───────────────┐
          │                               │
┌─────────▼─────────┐         ┌───────────▼───────────┐
│   Frontend        │         │   Backend (x2)        │
│   (React/Vite)    │         │   (FastAPI/Gunicorn)  │
│   Port: 3000      │         │   Port: 8000          │
└─────────┬─────────┘         └───────────┬───────────┘
          │                               │
          │                   ┌───────────┴───────────┐
          │                   │                       │
          │           ┌───────▼─────┐       ┌─────────▼─────┐
          │           │   Redis     │       │   Supabase    │
          │           │   (Cache)   │       │   (Database)  │
          │           └─────────────┘       └───────────────┘
          │
┌─────────▼──────────────────────────────────────────────────┐
│                    Monitoring Stack                         │
│   Prometheus │ Grafana │ Loki │ Sentry                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/harven-ai/platform.git
cd platform
```

### 2. Configure Environment

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your values

# Frontend
cd ../harven.ai-platform-mockup
cp .env.example .env
# Edit .env with your values
```

### 3. Required Environment Variables

#### Backend (.env)

```env
# Required
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
OPENAI_API_KEY=sk-your-key

# Production
ENVIRONMENT=production
SENTRY_DSN=https://your-sentry-dsn
REDIS_URL=redis://redis:6379

# Security
JWT_SECRET=generate-a-strong-secret
CORS_ORIGINS=https://harven.yourdomain.com
```

#### Frontend (.env)

```env
VITE_API_URL=https://api.harven.yourdomain.com
VITE_SENTRY_DSN=https://your-frontend-sentry-dsn
VITE_ENVIRONMENT=production
```

---

## Docker Deployment

### 1. Build Images

```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build backend
```

### 2. Start Services

```bash
# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Scale backend
docker-compose up -d --scale backend=2
```

### 3. Production Docker Compose

Use the provided `docker-compose.yml` which includes:
- 2 backend replicas
- Redis with persistence
- Prometheus + Grafana
- Loki for logs
- Health checks
- Resource limits

---

## Coolify Deployment

### 1. Create Project

1. Log into Coolify dashboard
2. Create new project: "Harven.AI"
3. Add GitHub repository

### 2. Configure Services

#### Backend Service

- Type: Docker
- Dockerfile: `backend/Dockerfile`
- Port: 8000
- Health check: `/health`
- Environment: Add all variables from `.env.example`

#### Frontend Service

- Type: Docker
- Dockerfile: `harven.ai-platform-mockup/Dockerfile`
- Port: 3000
- Build args: `VITE_API_URL`, `VITE_SENTRY_DSN`

### 3. Configure Domains

- Frontend: `harven.yourdomain.com`
- Backend: `api.harven.yourdomain.com`

### 4. Enable SSL

Coolify automatically provisions Let's Encrypt certificates.

---

## SSL/TLS Configuration

### Option 1: Cloudflare (Recommended)

1. Add domain to Cloudflare
2. Set SSL mode to "Full (strict)"
3. Enable "Always Use HTTPS"
4. Configure WAF rules

### Option 2: Let's Encrypt with Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name api.harven.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/harven.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/harven.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Database Migrations

### Run Migrations

```bash
# Connect to Supabase SQL Editor or use psql
psql $DATABASE_URL -f backend/migrations/001_performance_indexes.sql
```

### Migration Checklist

- [ ] Backup database before migration
- [ ] Run in maintenance window
- [ ] Test on staging first
- [ ] Verify indexes after migration

---

## Backup Strategy

### Supabase Backups

Supabase provides automatic daily backups. For additional protection:

#### Manual Backup

```bash
# Export database
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Upload to S3
aws s3 cp backup_*.sql s3://harven-backups/db/
```

#### Scheduled Backups (cron)

```bash
# /etc/cron.d/harven-backup
0 2 * * * root pg_dump $DATABASE_URL | gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz
```

### Redis Backup

```bash
# Manual snapshot
docker exec harven-redis redis-cli BGSAVE

# Copy RDB file
docker cp harven-redis:/data/dump.rdb ./backups/redis_$(date +%Y%m%d).rdb
```

### Backup Retention

| Type | Frequency | Retention |
|------|-----------|-----------|
| Database | Daily | 30 days |
| Database | Weekly | 12 weeks |
| Redis | Daily | 7 days |
| Logs | Daily | 14 days |

---

## Monitoring Setup

### 1. Prometheus

Access: `http://localhost:9090`

Key metrics:
- `http_requests_total`
- `http_request_duration_seconds`
- `python_gc_collections_total`

### 2. Grafana

Access: `http://localhost:3001`
Default credentials: `admin/admin`

Import dashboards:
- API Overview (included)
- System Resources
- Redis Metrics

### 3. Sentry

- Enable Performance monitoring
- Set up alerts for error spikes
- Configure release tracking

### 4. Alerting

Recommended alerts:
- Error rate > 5%
- p95 latency > 3s
- Memory usage > 80%
- Redis connection failures

---

## Troubleshooting

### Common Issues

#### 1. Container Won't Start

```bash
# Check logs
docker-compose logs backend

# Common causes:
# - Missing environment variables
# - Port already in use
# - Permission issues
```

#### 2. Database Connection Failed

```bash
# Verify Supabase is accessible
curl -s "https://your-project.supabase.co/rest/v1/" \
  -H "apikey: your-key"

# Check environment variables
docker exec harven-backend env | grep SUPABASE
```

#### 3. High Memory Usage

```bash
# Check container stats
docker stats

# Restart if needed
docker-compose restart backend
```

#### 4. SSL Certificate Issues

```bash
# Check certificate expiry
openssl s_client -connect api.harven.yourdomain.com:443 2>/dev/null | \
  openssl x509 -noout -dates

# Force renewal
certbot renew --force-renewal
```

### Health Check Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/` | Basic health |
| `/health` | Detailed health |
| `/health/live` | Kubernetes liveness |
| `/health/ready` | Kubernetes readiness |
| `/metrics` | Prometheus metrics |

### Support

- GitHub Issues: Report bugs and feature requests
- Documentation: Check `/docs` folder
- Runbook: See `docs/RUNBOOK.md` for incident response

---

## Rollback Procedure

### Docker Rollback

```bash
# List available images
docker images | grep harven

# Rollback to previous version
docker-compose down
docker tag harven-backend:latest harven-backend:rollback
docker pull harven-backend:v1.0.0
docker-compose up -d
```

### Coolify Rollback

1. Go to project dashboard
2. Select "Deployments" tab
3. Click "Redeploy" on previous successful deployment

---

*Last Updated: 2026-01-28*
*Version: 1.0*
