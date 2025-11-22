# InspectIQ

AI-powered home inspection and maintenance diagnosis for consumers (landlords, tenants, homeowners, STR hosts and more).

## Architecture

- **Backend**: Python 3.11+ with FastAPI
- **AI Vision**: OpenAI GPT-4 Vision API
- **Async Processing**: Celery with Redis (optional for production)
- **Validation**: Pydantic v2

## Project Structure

```
inspectiq/
├── agents/              # AI agent implementations
├── workflows/           # Workflow orchestration
├── schemas/             # Pydantic models
├── config/              # Configuration management
├── api/                 # FastAPI routes
├── tests/               # Test cases and fixtures
└── utils/               # Shared utilities
```

## Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your API keys

# Run development server
uvicorn main:app --reload --port 8000
```

## Workflows

### 1. Inspection Analysis
For move-in/move-out/general property inspections.

### 2. Maintenance Diagnosis
For maintenance issue triage and repair recommendations.

## API Endpoints

- `POST /api/v1/workflows/inspection` - Run inspection analysis
- `POST /api/v1/workflows/diagnosis` - Run maintenance diagnosis
- `GET /api/v1/health` - Health check
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation

## Project Statistics

- **7 AI Agents** - Specialized agents for each task
- **2 Complete Workflows** - Inspection and Diagnosis
- **20+ Python Files** - Well-organized codebase
- **9 Documentation Files** - Comprehensive guides
- **Full Test Suite** - End-to-end testing
- **Docker Ready** - Container deployment support

