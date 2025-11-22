# InspectIQ Setup Guide

## Prerequisites

- Python 3.11 or higher
- OpenAI API key with GPT-4 Vision access
- pip (Python package manager)

## Installation Steps

### 1. Clone/Download the Project

```bash
cd inspectiq
```

### 2. Create Virtual Environment (Recommended)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

```bash
# Copy the example env file
copy .env.example .env

# Edit .env with your settings
```

Required environment variables in `.env`:

```env
# Your OpenAI API key (required)
OPENAI_API_KEY=sk-your-key-here

# Backend webhook URLs (update with your actual backend)
BACKEND_BASE_URL=https://api.inspectiq.app

# Optional: Change model if needed
OPENAI_MODEL=gpt-4-vision-preview
```

### 5. Verify Installation

```bash
# Check if FastAPI is working
python -c "import fastapi; print('FastAPI installed successfully')"

# Check if OpenAI is working
python -c "import openai; print('OpenAI installed successfully')"
```

## Running the Application

### Start the API Server

```bash
# Development mode with auto-reload
uvicorn main:app --reload --port 8000

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

The API will be available at:
- API: http://localhost:8000
- Interactive docs: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc

### Test the API

```bash
# Health check
curl http://localhost:8000/api/v1/health
```

## Testing

### Prepare Test Data

Before running tests, update `tests/test_data.py` with real image URLs. You can use:
- Your own test images hosted online
- Public image URLs
- Images from cloud storage (S3, etc.)

### Run Tests

```bash
# Run all tests
pytest tests/ -v

# Run specific workflow tests
pytest tests/test_inspection_workflow.py -v
pytest tests/test_diagnosis_workflow.py -v

# Run with output
pytest tests/ -v -s
```

### Manual Testing Scripts

```bash
# Test inspection workflow
python scripts/run_test_inspection.py

# Test diagnosis workflow
python scripts/run_test_diagnosis.py
```

## API Usage Examples

### Inspection Analysis

```bash
curl -X POST http://localhost:8000/api/v1/workflows/inspection \
  -H "Content-Type: application/json" \
  -d '{
    "inspection_id": "test-001",
    "photos": [
      {
        "image_url": "https://example.com/room.jpg",
        "room_name": "Living Room",
        "order_index": 1
      }
    ],
    "property_context": {
      "property_type": "apartment",
      "state": "CA"
    },
    "property": {
      "name": "Test Property",
      "address_line1": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "postal_code": "94102"
    }
  }'
```

### Maintenance Diagnosis

```bash
curl -X POST http://localhost:8000/api/v1/workflows/diagnosis \
  -H "Content-Type: application/json" \
  -d '{
    "diagnosis_id": "diag-001",
    "photos": [
      {
        "image_url": "https://example.com/issue.jpg",
        "order_index": 1
      }
    ],
    "user_description": "Water stain on ceiling",
    "property_context": {
      "property_type": "apartment",
      "state": "CA"
    }
  }'
```

## Deployment

### Docker (Optional)

Create a `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:

```bash
docker build -t inspectiq .
docker run -p 8000:8000 --env-file .env inspectiq
```

### Cloud Deployment

The application can be deployed to:
- AWS (EC2, ECS, Lambda with API Gateway)
- Google Cloud (Cloud Run, App Engine)
- Azure (App Service, Container Instances)
- Heroku, Railway, Render, etc.

Make sure to:
1. Set environment variables in your cloud platform
2. Configure CORS appropriately for production
3. Set up proper logging and monitoring
4. Use a production ASGI server (uvicorn with workers)

## Troubleshooting

### OpenAI API Errors

- Verify your API key is correct
- Check you have GPT-4 Vision access
- Monitor rate limits and quotas

### Image URL Issues

- Ensure URLs are publicly accessible
- Check image formats (JPEG, PNG supported)
- Verify URLs use HTTPS

### Webhook Failures

- Check backend URL is correct and accessible
- Verify backend endpoint accepts POST requests
- Review webhook payload format

## Next Steps

1. Replace test image URLs with real images
2. Update backend webhook URLs
3. Customize agent prompts if needed
4. Add authentication/authorization
5. Set up monitoring and logging
6. Configure production database (if needed)
7. Add rate limiting
8. Set up CI/CD pipeline

## Support

For issues or questions:
- Check the API docs at `/docs`
- Review agent system prompts in `agents/` directory
- Check workflow logic in `workflows/` directory
