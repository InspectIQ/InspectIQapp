# InspectIQ Quick Start Guide

Get InspectIQ running in 5 minutes.

## 1. Install Dependencies

```bash
pip install -r requirements.txt
```

## 2. Configure Environment

```bash
# Copy example config
copy .env.example .env
```

Edit `.env` and add your OpenAI API key:
```env
OPENAI_API_KEY=sk-your-actual-key-here
```

## 3. Start the Server

```bash
uvicorn main:app --reload
```

Server runs at: http://localhost:8000

## 4. Test the API

Open your browser to: http://localhost:8000/docs

Or test with curl:

```bash
# Health check
curl http://localhost:8000/api/v1/health
```

## 5. Run Your First Inspection

```bash
curl -X POST http://localhost:8000/api/v1/workflows/inspection \
  -H "Content-Type: application/json" \
  -d '{
    "inspection_id": "test-001",
    "photos": [
      {
        "image_url": "https://your-image-url.jpg",
        "room_name": "Living Room"
      }
    ],
    "property": {
      "name": "Test Property",
      "city": "San Francisco",
      "state": "CA"
    }
  }'
```

## What's Next?

- **Read SETUP.md** for detailed installation
- **Read ARCHITECTURE.md** to understand the system
- **Update test_data.py** with real image URLs
- **Run tests**: `pytest tests/ -v`
- **Customize agents** in `agents/` directory
- **Deploy** using DEPLOYMENT_CHECKLIST.md

## Common Issues

### "OpenAI API key not found"
- Make sure `.env` file exists
- Check `OPENAI_API_KEY` is set correctly
- Restart the server after changing `.env`

### "Invalid image URL"
- URLs must be publicly accessible
- Use HTTPS URLs
- Supported formats: JPEG, PNG

### "Webhook failed"
- Update `BACKEND_BASE_URL` in `.env`
- Webhook failures don't stop the workflow
- Check logs for details

## Project Structure

```
inspectiq/
├── agents/          # AI agent implementations
├── workflows/       # Workflow orchestration
├── schemas/         # Data models
├── api/             # FastAPI routes
├── config/          # Configuration
├── tests/           # Test cases
├── scripts/         # Helper scripts
└── main.py          # Application entry point
```

## Key Files

- **main.py** - FastAPI application
- **config/settings.py** - Environment configuration
- **workflows/inspection_workflow.py** - Inspection logic
- **workflows/diagnosis_workflow.py** - Diagnosis logic
- **agents/** - Individual AI agents

## API Endpoints

- `GET /` - Root endpoint
- `GET /api/v1/health` - Health check
- `POST /api/v1/workflows/inspection` - Run inspection
- `POST /api/v1/workflows/diagnosis` - Run diagnosis
- `GET /docs` - Interactive API documentation

## Need Help?

1. Check the interactive docs at `/docs`
2. Review SETUP.md for detailed instructions
3. Check ARCHITECTURE.md for system design
4. Review agent code in `agents/` directory
5. Check logs for error messages
