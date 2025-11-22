# InspectIQ Architecture

## System Overview

InspectIQ is an AI-powered property inspection and maintenance diagnosis system built with FastAPI and OpenAI's GPT-4 Vision API.

## High-Level Architecture

```
┌─────────────┐
│   Client    │
│ Application │
└──────┬──────┘
       │ HTTP POST
       ▼
┌─────────────────────────────────────────┐
│         InspectIQ API (FastAPI)         │
│  ┌───────────────────────────────────┐  │
│  │     /api/v1/workflows/inspection  │  │
│  │     /api/v1/workflows/diagnosis   │  │
│  └───────────────────────────────────┘  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│         Workflow Orchestration           │
│  ┌────────────────────────────────────┐  │
│  │  InspectionWorkflow                │  │
│  │  DiagnosisWorkflow                 │  │
│  └────────────────────────────────────┘  │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│            AI Agents Layer               │
│  ┌────────────────────────────────────┐  │
│  │  MediaIngestionAgent               │  │
│  │  InspectionVisionAgent             │  │
│  │  InspectionRepairScopeAgent        │  │
│  │  InspectionReportAgent             │  │
│  │  MaintenanceDiagnosisAgent         │  │
│  │  DiagnosisRepairScopeAgent         │  │
│  │  DiagnosisReportAgent              │  │
│  └────────────────────────────────────┘  │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│         External Services                │
│  ┌────────────────────────────────────┐  │
│  │  OpenAI GPT-4 Vision API           │  │
│  │  Backend Webhook Endpoints         │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

## Workflow Details

### Inspection Analysis Workflow

```
Input: Photos + Property Context
  │
  ▼
┌─────────────────────────┐
│ 1. Media Ingestion      │ ← Validate URLs
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│ 2. Vision Analysis      │ ← GPT-4 Vision: Detect damage
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│ 3. Repair Scope         │ ← GPT-4: Cost/time estimates
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│ 4. Report Generation    │ ← GPT-4: Markdown report
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│ 5. Webhook Callback     │ ← POST to backend
└─────────────────────────┘
  │
  ▼
Output: Report + Issues + Summary
```

### Maintenance Diagnosis Workflow

```
Input: Photos + User Description
  │
  ▼
┌─────────────────────────┐
│ 1. Media Ingestion      │ ← Validate URLs
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│ 2. Diagnosis            │ ← GPT-4 Vision: Identify issue
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│ 3. Repair Scope         │ ← GPT-4: Recommendations
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│ 4. Report Generation    │ ← GPT-4: Markdown report
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│ 5. Webhook Callback     │ ← POST to backend
└─────────────────────────┘
  │
  ▼
Output: Diagnosis + Report + Summary
```

## Component Details

### API Layer (`api/`)
- **routes.py**: FastAPI endpoints for workflows
- Handles HTTP requests/responses
- Input validation with Pydantic
- Error handling and status codes

### Workflows (`workflows/`)
- **InspectionWorkflow**: Orchestrates inspection analysis
- **DiagnosisWorkflow**: Orchestrates maintenance diagnosis
- Sequential agent execution
- Webhook callback handling

### Agents (`agents/`)

#### MediaIngestionAgent
- Validates image URLs
- Normalizes photo metadata
- Filters invalid entries

#### InspectionVisionAgent
- Uses GPT-4 Vision API
- Detects property damage
- Returns structured issue data
- Confidence scoring

#### InspectionRepairScopeAgent
- Analyzes detected issues
- Provides cost estimates
- Recommends trades/DIY
- Materials lists

#### InspectionReportAgent
- Generates markdown reports
- Consumer-friendly language
- Room-by-room breakdown
- Actionable recommendations

#### MaintenanceDiagnosisAgent
- Diagnoses maintenance issues
- Combines photos + description
- Identifies root causes
- Urgency assessment

#### DiagnosisRepairScopeAgent
- Repair recommendations
- Safety warnings
- Step-by-step guidance
- Cost/time estimates

#### DiagnosisReportAgent
- Diagnostic reports
- Urgency explanation
- Next steps guidance
- Safety notes

### Schemas (`schemas/`)
- **common.py**: Shared data models
- **inspection.py**: Inspection-specific models
- **diagnosis.py**: Diagnosis-specific models
- Pydantic validation
- Type safety

### Configuration (`config/`)
- **settings.py**: Environment configuration
- Webhook URLs
- OpenAI settings
- App configuration

## Data Flow

### Inspection Request
```json
{
  "inspection_id": "string",
  "photos": [
    {
      "image_url": "https://...",
      "room_name": "Living Room",
      "order_index": 1
    }
  ],
  "property_context": {
    "property_type": "apartment",
    "state": "CA"
  },
  "property": {
    "name": "Property Name",
    "address_line1": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "postal_code": "94102"
  }
}
```

### Inspection Response
```json
{
  "inspection_id": "string",
  "report_markdown": "# InspectIQ Report...",
  "report_summary_json": {
    "headline": "Summary headline",
    "recommendations": ["rec1", "rec2"]
  },
  "issues_enriched": [
    {
      "image_url": "https://...",
      "room_name": "Living Room",
      "issue_type": "scratch",
      "description": "Minor wall scratch",
      "severity": "low",
      "recommended_action": "Touch up paint",
      "recommended_trade": "painter",
      "diy_possible": true,
      "cost_low": 20,
      "cost_high": 50,
      "time_hours": 1,
      "materials_list": ["paint", "brush"],
      "safety_warnings": null
    }
  ],
  "summary": {
    "issue_count": 1,
    "summary_severity": "low",
    "summary_cost_low": 20,
    "summary_cost_high": 50
  }
}
```

## Scalability Considerations

### Current Architecture
- Synchronous workflow execution
- Single-threaded per request
- Suitable for: Low-medium traffic

### Scaling Options

#### Horizontal Scaling
- Multiple uvicorn workers
- Load balancer distribution
- Stateless design enables easy scaling

#### Async Processing (Future)
- Celery + Redis for job queue
- Background task processing
- Webhook notifications on completion
- Better for high-volume scenarios

#### Caching (Future)
- Redis for result caching
- Reduce duplicate API calls
- Cache common repair estimates

## Security

### Current Implementation
- HTTPS for API communication
- Environment variable secrets
- Input validation with Pydantic
- URL validation in media ingestion

### Production Recommendations
- API key authentication
- Rate limiting per client
- Request signing for webhooks
- CORS restriction
- Input sanitization
- Audit logging

## Monitoring

### Key Metrics
- API response times
- OpenAI API latency
- Error rates by endpoint
- Webhook success rates
- Cost per request

### Logging
- Request/response logging
- Agent execution traces
- Error stack traces
- OpenAI API usage

## Cost Optimization

### OpenAI API Usage
- GPT-4 Vision: ~$0.01-0.03 per image
- GPT-4 Turbo: ~$0.01-0.03 per request
- Estimated: $0.05-0.10 per workflow

### Optimization Strategies
- Batch image processing
- Prompt optimization
- Result caching
- Retry logic with backoff
- Model selection per task

## Future Enhancements

### Planned Features
- [ ] PDF report generation
- [ ] Image annotation/markup
- [ ] Historical comparison
- [ ] Cost database integration
- [ ] Multi-language support
- [ ] Mobile app integration

### Technical Improvements
- [ ] Async job processing
- [ ] Result caching
- [ ] Database persistence
- [ ] Advanced analytics
- [ ] A/B testing framework
- [ ] Custom model fine-tuning
