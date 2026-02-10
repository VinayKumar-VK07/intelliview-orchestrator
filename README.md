# IntelliView Orchestrator

> **Distributed AI-powered interview orchestration platform with real-time risk scoring, multi-node execution, and fault-tolerant task scheduling.**

[![FastAPI](https://img.shields.io/badge/API-FastAPI-009688.svg)](https://fastapi.tiangolo.com)
[![Celery](https://img.shields.io/badge/Queue-Celery-37814A.svg)](https://docs.celeryq.dev)
[![Redis](https://img.shields.io/badge/Broker-Redis-DC382D.svg)](https://redis.io)
[![PostgreSQL](https://img.shields.io/badge/Store-PostgreSQL-336791.svg)](https://www.postgresql.org)
[![Next.js](https://img.shields.io/badge/UI-Next.js_14-000.svg)](https://nextjs.org)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB.svg)](https://python.org)
[![Docker](https://img.shields.io/badge/Deploy-Docker_Compose-2496ED.svg)](https://docs.docker.com/compose)

---

## Overview

IntelliView Orchestrator is a production-grade distributed system for conducting, monitoring, and evaluating online interviews at scale. It coordinates multiple AI pipelines (video, audio, NLP) across worker nodes with intelligent load balancing, automatic retry, dead-letter handling, and a real-time operations dashboard.

## Architecture

```
                 ┌──────────────────────────┐
                 │     Next.js Dashboard    │  ← operator UI
                 └────────────┬─────────────┘
                              │ HTTPS / WSS
                 ┌────────────▼─────────────┐
                 │   FastAPI Orchestrator   │
                 │  (Scheduler + LB + Auth) │
                 └────────────┬─────────────┘
                              │
                     Redis Task Queue
                              │
         ┌──────────────┬─────┴────────┬──────────────┐
         │ Worker Node 1│ Worker Node 2│ Worker Node N│
         └──────┬───────┴──────┬───────┴──────┬───────┘
                │              │              │
      Video + Audio + NLP Pipelines
                │              │              │
         ┌──────▼──────────────▼──────────────▼──────┐
         │              PostgreSQL                    │
         │  (source of truth + analytics)            │
         └────────────────────────────────────────────┘
```

## Features

### Scalability
- Horizontal worker scaling via Celery + Redis
- Three load-balancing strategies: `ROUND_ROBIN`, `LEAST_LOADED`, `QUEUE_BASED`
- Pluggable AI pipelines (swap in your own models)

### Reliability
- Exponential backoff with configurable max retries
- Dead-letter queue for permanently failed sessions
- Heartbeat-based worker health monitoring
- Stuck-session detection + automatic recovery

### Observability
- Real-time metrics dashboard with auto-refresh
- WebSocket push for live system updates
- Failure analytics, risk-score distributions, retry telemetry
- Structured logging throughout

### Security
- API token authentication for all privileged endpoints
- CORS-configurable origin policy
- WebSocket token-gating

## Quick start

```bash
git clone https://github.com/rajat-wyrm/intelliview-orchestrator
cd intelliview-orchestrator
cp .env.example .env
docker compose up -d --build
```

Services:
- **Frontend** (dashboard): http://localhost:3000
- **API** (FastAPI): http://localhost:8000 — docs at `/docs`
- **Flower** (Celery UI): http://localhost:5555/flower
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

Open the frontend, set your `API_TOKEN` in the top bar, and start an interview.

## Project structure

```
intelliview-orchestrator/
├── orchestrator/        # FastAPI app + scheduling, load balancing, fault tolerance
├── workers/             # Celery tasks + AI pipelines + worker agent
├── monitoring/          # Metrics collection, WebSocket manager, dashboard API
├── database/            # SQLAlchemy models + connection management
├── frontend/            # Next.js 14 dashboard (TypeScript + Tailwind)
├── tests/               # Pytest suite (unit + contract + e2e)
├── config.py            # Centralized configuration
├── docker-compose.yml   # Full stack orchestration
├── Dockerfile           # Python service image
└── pyproject.toml       # Project metadata
```

## API endpoints

### Core
- `POST /start-interview` — enqueue a new session
- `GET /session-status/{id}` — current status
- `GET /task-status/{task_id}` — Celery task status

### Session tracking
- `GET /active-sessions`, `/completed-sessions`, `/failed-sessions`, `/stuck-sessions`
- `GET /session-statistics`, `/high-risk-sessions`, `/worker-distribution`

### Worker management (auth required)
- `POST /register-worker`, `POST /worker/heartbeat`, `DELETE /deregister-worker/{id}`

### Scheduling & load balancing
- `GET /scheduling-status`, `/load-status`, `/worker-statistics`
- `POST /switch-strategy` — change the LB strategy at runtime

### Fault tolerance & recovery
- `GET /failure-log`, `/dead-letter-queue`, `/recovery-queue`, `/fault-statistics`
- `POST /retry-session/{id}`, `/detect-failures`

### Monitoring
- `GET /system-health`, `/worker-health`
- `WS /monitoring/ws/metrics?token=...` — live metric stream
- `GET /monitoring/metrics/{system,workers,sessions,queue,failures,retries,performance}`

## Development

```bash
# Python deps
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Frontend deps
cd frontend && npm install

# Run tests
pytest                          # unit + contract
pytest tests/test_e2e_smoke.py  # end-to-end (requires running stack)

# Run linters
ruff check .
mypy orchestrator workers monitoring database
cd frontend && npm run lint && npm run typecheck
```

## Pluggable AI pipelines

The AI workers (`workers/video_pipeline.py`, `workers/audio_pipeline.py`, `workers/evaluation_pipeline.py`) define a clear interface that teams can extend with their own models. Each pipeline returns a structured dict that `RiskScoringEngine` consumes to produce a final 0–1 risk score.

Drop in your own implementations of:
- Face / object detection (e.g., MediaPipe, YOLO, OpenCV)
- Speech-to-text (e.g., Whisper, Wav2Vec2)
- LLM-based answer evaluation (e.g., GPT, Claude, Llama)

## Testing

```
tests/
├── test_unit_risk_engine.py        # 7 tests
├── test_unit_session_manager.py    # 5 tests
├── test_unit_load_balancer.py      # 5 tests
├── test_api_contract.py            # 30 tests (every documented endpoint exists)
└── test_e2e_smoke.py               # 5 tests (live stack)
```

## Contributing

See `CONTRIBUTING.md` for development setup, coding standards, and the PR process.

## License

MIT — see `LICENSE`.

## Author

**Mukta Redij**
