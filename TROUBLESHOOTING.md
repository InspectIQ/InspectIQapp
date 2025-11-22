# InspectIQ Troubleshooting Guide

Common issues and solutions for InspectIQ.

## Installation Issues

### "pip install failed"

**Problem**: Dependencies won't install

**Solutions**:
```bash
# Upgrade pip first
python -m pip install --upgrade pip

# Try installing with verbose output
pip install -r requirements.txt -v

# Install specific problematic package separately
pip install openai==1.10.0
```

### "Python version too old"

**Problem**: Python 3.11+ required

**Solutions**:
```bash
# Check your Python version
python --version

# Install Python 3.11+ from python.org
# Or use pyenv:
pyenv install 3.11.0
pyenv local 3.11.0
```

## Configuration Issues

### "OpenAI API key not found"

**Problem**: Missing or incorrect API key

**Solutions**:
1. Check `.env` file exists in project root
2. Verify `OPENAI_API_KEY=sk-...` is set
3. No quotes around the key value
4. Restart the server after changing `.env`

```bash
# Verify .env file
type .env  # Windows
cat .env   # Linux/Mac

# Should see:
# OPENAI_API_KEY=sk-your-key-here
```

### "Invalid OpenAI API key"

**Problem**: API key is incorrect or expired

**Solutions**:
1. Get new key from https://platform.openai.com/api-keys
2. Verify you have GPT-4 Vision access
3. Check billing is set up
4. Test key with curl:

```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Runtime Issues

### "Module not found" errors

**Problem**: Dependencies not installed or wrong Python environment

**Solutions**:
```bash
# Activate virtual environment
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Reinstall dependencies
pip install -r requirements.txt

# Verify installation
pip list | grep fastapi
pip list | grep openai
```

### "Port 8000 already in use"

**Problem**: Another process using port 8000

**Solutions**:
```bash
# Use different port
uvicorn main:app --port 8001

# Or find and kill process on port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -i :8000
kill -9 <PID>
```

### "Connection refused" to OpenAI API

**Problem**: Network or firewall blocking OpenAI

**Solutions**:
1. Check internet connection
2. Verify firewall allows HTTPS
3. Check proxy settings if behind corporate firewall
4. Test OpenAI API directly:

```bash
curl https://api.openai.com/v1/models
```

## API Issues

### "Invalid image URL"

**Problem**: Image URL not accessible or invalid format

**Solutions**:
1. Verify URL is publicly accessible
2. Use HTTPS URLs (not HTTP)
3. Test URL in browser
4. Supported formats: JPEG, PNG, GIF, WebP
5. Check URL doesn't require authentication

```bash
# Test URL accessibility
curl -I https://your-image-url.jpg
```

### "No valid photos provided"

**Problem**: All photo URLs failed validation

**Solutions**:
1. Check URLs are properly formatted
2. Verify URLs are accessible
3. Check for typos in URLs
4. Ensure URLs include protocol (https://)

Example valid URL:
```json
{
  "image_url": "https://example.com/photo.jpg"
}
```

### "Webhook failed"

**Problem**: Cannot reach backend webhook

**Solutions**:
1. Verify `BACKEND_BASE_URL` in `.env`
2. Check backend is running and accessible
3. Test webhook endpoint manually:

```bash
curl -X POST https://api.inspectiq.app/api/v1/webhooks/inspection-complete \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

4. Note: Webhook failures don't stop the workflow
5. Check logs for detailed error message

### "Request timeout"

**Problem**: Request taking too long

**Solutions**:
1. Reduce number of photos (try 1-3 first)
2. Use smaller image files
3. Check OpenAI API status
4. Increase timeout in code if needed
5. Check network latency

## OpenAI API Issues

### "Rate limit exceeded"

**Problem**: Too many requests to OpenAI

**Solutions**:
1. Wait a few minutes and retry
2. Implement request queuing
3. Upgrade OpenAI plan
4. Add exponential backoff retry logic

### "Insufficient quota"

**Problem**: OpenAI account out of credits

**Solutions**:
1. Check billing at https://platform.openai.com/account/billing
2. Add payment method
3. Increase spending limit
4. Monitor usage dashboard

### "Model not found"

**Problem**: GPT-4 Vision not available

**Solutions**:
1. Verify GPT-4 access on your account
2. Check model name in `.env`:
```env
OPENAI_MODEL=gpt-4-vision-preview
```
3. Try alternative model:
```env
OPENAI_MODEL=gpt-4-turbo
```

### "Content policy violation"

**Problem**: Image content flagged by OpenAI

**Solutions**:
1. Review OpenAI usage policies
2. Check image content is appropriate
3. Avoid sensitive or inappropriate images
4. Review error message for specifics

## Performance Issues

### "Slow response times"

**Problem**: Requests taking >30 seconds

**Causes & Solutions**:

1. **Too many photos**
   - Limit to 3-5 photos per request
   - Process in batches if needed

2. **Large image files**
   - Resize images before upload
   - Compress images (target <2MB each)

3. **OpenAI API latency**
   - Check OpenAI status page
   - Try different times of day
   - Consider caching results

4. **Network issues**
   - Check internet speed
   - Test latency to OpenAI API

### "High memory usage"

**Problem**: Application using too much RAM

**Solutions**:
1. Reduce concurrent requests
2. Implement request queuing
3. Add memory limits in Docker
4. Monitor with:

```bash
# Check memory usage
# Windows:
tasklist | findstr python

# Linux/Mac:
ps aux | grep python
```

## Docker Issues

### "Docker build failed"

**Problem**: Cannot build Docker image

**Solutions**:
```bash
# Clean build
docker build --no-cache -t inspectiq .

# Check Dockerfile syntax
docker build -t inspectiq . --progress=plain

# Verify base image
docker pull python:3.11-slim
```

### "Container exits immediately"

**Problem**: Container starts then stops

**Solutions**:
```bash
# Check logs
docker logs <container-id>

# Run interactively
docker run -it inspectiq /bin/bash

# Check environment variables
docker run inspectiq env
```

### "Cannot connect to container"

**Problem**: Port mapping not working

**Solutions**:
```bash
# Verify port mapping
docker ps

# Should show: 0.0.0.0:8000->8000/tcp

# Try explicit port mapping
docker run -p 8000:8000 inspectiq

# Check if port is available
netstat -an | findstr 8000
```

## Testing Issues

### "Tests failing"

**Problem**: pytest tests not passing

**Solutions**:
1. Update test image URLs in `tests/test_data.py`
2. Verify OpenAI API key is set
3. Run tests with verbose output:

```bash
pytest tests/ -v -s
```

4. Run specific test:
```bash
pytest tests/test_inspection_workflow.py::test_clean_room_inspection -v
```

5. Check test requirements:
```bash
pip install pytest pytest-asyncio
```

### "Import errors in tests"

**Problem**: Cannot import modules in tests

**Solutions**:
```bash
# Run from project root
cd /path/to/inspectiq

# Or add to PYTHONPATH
export PYTHONPATH="${PYTHONPATH}:$(pwd)"  # Linux/Mac
set PYTHONPATH=%PYTHONPATH%;%CD%  # Windows
```

## Logging & Debugging

### Enable Debug Logging

```python
# In main.py, add:
import logging
logging.basicConfig(level=logging.DEBUG)
```

Or in `.env`:
```env
LOG_LEVEL=DEBUG
```

### Check Application Logs

```bash
# If running with uvicorn
uvicorn main:app --log-level debug

# If using Docker
docker logs -f <container-id>

# Save logs to file
uvicorn main:app > app.log 2>&1
```

### Debug Specific Agent

Add print statements or logging:

```python
# In any agent file
import logging
logger = logging.getLogger(__name__)

# In agent method
logger.debug(f"Processing {len(photos)} photos")
logger.info(f"Result: {result}")
```

## Common Error Messages

### "Validation error"

**Meaning**: Input data doesn't match schema

**Solution**: Check request payload matches schema in `schemas/`

### "Connection error"

**Meaning**: Cannot reach external service

**Solution**: Check network, firewall, service status

### "JSON decode error"

**Meaning**: Invalid JSON in request or response

**Solution**: Validate JSON format, check for trailing commas

### "Timeout error"

**Meaning**: Request took too long

**Solution**: Reduce complexity, check network, increase timeout

## Getting Help

### Check Documentation
1. README.md - Overview
2. SETUP.md - Installation
3. API_EXAMPLES.md - Usage examples
4. ARCHITECTURE.md - System design

### Check Logs
```bash
# Application logs
tail -f app.log

# Docker logs
docker logs -f inspectiq

# System logs
# Check system event viewer (Windows)
# Check /var/log/ (Linux)
```

### Debug Mode
```bash
# Run with debug output
uvicorn main:app --reload --log-level debug

# Python debugger
python -m pdb main.py
```

### Test Components Individually

```python
# Test media ingestion
from agents import MediaIngestionAgent
agent = MediaIngestionAgent()
result = await agent.process(photos=[...])

# Test OpenAI connection
from openai import OpenAI
client = OpenAI(api_key="your-key")
response = client.chat.completions.create(...)
```

## Still Having Issues?

1. Check OpenAI status: https://status.openai.com
2. Review OpenAI documentation: https://platform.openai.com/docs
3. Check FastAPI documentation: https://fastapi.tiangolo.com
4. Review error stack traces carefully
5. Search for specific error messages
6. Check GitHub issues for similar problems

## Preventive Measures

### Before Deployment
- [ ] Run full test suite
- [ ] Test with real images
- [ ] Verify all environment variables
- [ ] Check OpenAI quota and billing
- [ ] Test webhook endpoints
- [ ] Review logs for warnings

### Monitoring
- [ ] Set up uptime monitoring
- [ ] Monitor OpenAI API usage
- [ ] Track error rates
- [ ] Monitor response times
- [ ] Set up cost alerts

### Regular Maintenance
- [ ] Update dependencies monthly
- [ ] Review and rotate API keys
- [ ] Check for security updates
- [ ] Optimize based on usage patterns
- [ ] Review and update documentation
