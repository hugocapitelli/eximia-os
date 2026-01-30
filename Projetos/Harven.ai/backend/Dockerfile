# ============================================
# Harven.AI Backend - Production Dockerfile
# ============================================
# Multi-stage build for optimized production image

# ============================================
# STAGE 1: Builder
# ============================================
FROM python:3.11-slim as builder

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ============================================
# STAGE 2: Production
# ============================================
FROM python:3.11-slim as production

# Metadata
LABEL maintainer="Harven.AI Team"
LABEL version="1.0.0"
LABEL description="Harven.AI Backend API with AI Agents"
LABEL org.opencontainers.image.source="https://github.com/harven-ai/backend"

# Environment variables for Python optimization
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONFAULTHANDLER=1
ENV PYTHONHASHSEED=random

# Application configuration
ENV PORT=8000
ENV WORKERS=4
ENV LOG_LEVEL=info
ENV ENVIRONMENT=production

# Security: run as non-root user
RUN groupadd --gid 1000 appgroup && \
    useradd --uid 1000 --gid appgroup --shell /bin/bash --create-home appuser

# Working directory
WORKDIR /app

# Copy virtual environment from builder
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install runtime dependencies only (curl for healthcheck)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Copy application code
COPY --chown=appuser:appgroup . .

# Remove unnecessary files for smaller image
RUN rm -rf tests/ .git/ .gitignore .env.example *.md venv/

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8000

# Health check with curl (more reliable)
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Production startup command with Gunicorn + Uvicorn workers
CMD ["sh", "-c", "gunicorn main:app \
    --worker-class uvicorn.workers.UvicornWorker \
    --workers ${WORKERS:-4} \
    --bind 0.0.0.0:${PORT:-8000} \
    --timeout 120 \
    --keep-alive 5 \
    --max-requests 1000 \
    --max-requests-jitter 100 \
    --access-logfile - \
    --error-logfile - \
    --log-level ${LOG_LEVEL:-info}"]
