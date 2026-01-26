# ExímIA Agent Service

Backend service for AI agent orchestration in ExímIA OS.

## Stack

- **Python 3.11+**
- **FastAPI** - Modern web framework
- **Uvicorn** - ASGI server
- **Supabase** - Database & Auth
- **Pydantic** - Data validation

## Quick Start

### 1. Setup Environment

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy example env
cp .env.example .env

# Edit .env with your credentials
```

### 3. Run Development Server

```bash
uvicorn app.main:app --reload --port 8000
```

### 4. Access API

- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **API v1**: http://localhost:8000/api/v1

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Basic health check |
| `/api/v1/health` | GET | API health check |
| `/api/v1/health/detailed` | GET | Detailed health with deps |

## Project Structure

```
agent-service/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI app
│   ├── config.py         # Settings
│   ├── api/
│   │   ├── deps.py       # Dependencies (auth, db)
│   │   └── v1/
│   │       ├── router.py # Main router
│   │       └── health.py # Health endpoints
│   └── services/
│       └── supabase.py   # Supabase client
├── tests/
│   └── test_health.py
├── Dockerfile
├── requirements.txt
└── pyproject.toml
```

## Docker

### Build

```bash
docker build -t eximia-agent-service:0.1.0 .
```

### Run

```bash
docker run -p 8000:8000 --env-file .env eximia-agent-service:0.1.0
```

## Testing

```bash
# Install dev dependencies
pip install -e ".[dev]"

# Run tests
pytest

# Run with coverage
pytest --cov=app
```

## Deploy (Easypanel)

1. Create new service in Easypanel
2. Select Docker image or Git deploy
3. Configure environment variables
4. Set port to 8000
5. Deploy

---

**Version:** 0.1.0
**Last Updated:** 26 Janeiro 2026
