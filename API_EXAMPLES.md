# InspectIQ API Examples

Complete examples for testing the InspectIQ API.

## Health Check

```bash
curl http://localhost:8000/api/v1/health
```

Response:
```json
{
  "status": "healthy",
  "service": "InspectIQ"
}
```

## Inspection Analysis

### Basic Inspection

```bash
curl -X POST http://localhost:8000/api/v1/workflows/inspection \
  -H "Content-Type: application/json" \
  -d '{
    "inspection_id": "insp-001",
    "photos": [
      {
        "image_url": "https://example.com/living-room.jpg",
        "room_name": "Living Room",
        "order_index": 1
      }
    ]
  }'
```

### Full Inspection with Property Details

```bash
curl -X POST http://localhost:8000/api/v1/workflows/inspection \
  -H "Content-Type: application/json" \
  -d '{
    "inspection_id": "insp-002",
    "photos": [
      {
        "image_url": "https://example.com/bedroom.jpg",
        "room_name": "Bedroom",
        "order_index": 1
      },
      {
        "image_url": "https://example.com/kitchen.jpg",
        "room_name": "Kitchen",
        "order_index": 2
      },
      {
        "image_url": "https://example.com/bathroom.jpg",
        "room_name": "Bathroom",
        "order_index": 3
      }
    ],
    "property_context": {
      "property_type": "apartment",
      "state": "CA"
    },
    "property": {
      "name": "Sunset Apartments Unit 204",
      "address_line1": "123 Main Street",
      "city": "San Francisco",
      "state": "CA",
      "postal_code": "94102"
    }
  }'
```

### Expected Response

```json
{
  "inspection_id": "insp-002",
  "report_markdown": "## InspectIQ Inspection Report\n\n### Property Details\n...",
  "report_summary_json": {
    "headline": "3 minor issues found requiring attention",
    "recommendations": [
      "Schedule touch-up painting for bedroom scratches",
      "Clean kitchen countertop stains",
      "Replace bathroom caulking"
    ]
  },
  "issues_enriched": [
    {
      "image_url": "https://example.com/bedroom.jpg",
      "room_name": "Bedroom",
      "issue_type": "scratch",
      "description": "Minor wall scratches near door frame",
      "severity": "low",
      "recommended_action": "Touch up with matching paint",
      "recommended_trade": "painter",
      "diy_possible": true,
      "cost_low": 25,
      "cost_high": 75,
      "time_hours": 1,
      "materials_list": ["paint", "brush", "sandpaper"],
      "safety_warnings": null
    }
  ],
  "summary": {
    "issue_count": 3,
    "summary_severity": "low",
    "summary_cost_low": 100,
    "summary_cost_high": 300
  }
}
```

## Maintenance Diagnosis

### Basic Diagnosis

```bash
curl -X POST http://localhost:8000/api/v1/workflows/diagnosis \
  -H "Content-Type: application/json" \
  -d '{
    "diagnosis_id": "diag-001",
    "photos": [
      {
        "image_url": "https://example.com/ceiling-stain.jpg",
        "order_index": 1
      }
    ],
    "user_description": "Brown stain on ceiling that is getting bigger"
  }'
```

### Full Diagnosis with Context

```bash
curl -X POST http://localhost:8000/api/v1/workflows/diagnosis \
  -H "Content-Type: application/json" \
  -d '{
    "diagnosis_id": "diag-002",
    "photos": [
      {
        "image_url": "https://example.com/leak-photo1.jpg",
        "order_index": 1
      },
      {
        "image_url": "https://example.com/leak-photo2.jpg",
        "order_index": 2
      }
    ],
    "user_description": "Water dripping from ceiling in bathroom. Started yesterday after heavy rain. Stain is brown and spreading.",
    "property_context": {
      "property_type": "single_family",
      "state": "WA"
    },
    "property": {
      "name": "123 Oak Street",
      "address_line1": "123 Oak Street",
      "city": "Seattle",
      "state": "WA",
      "postal_code": "98101"
    }
  }'
```

### Expected Response

```json
{
  "diagnosis_id": "diag-002",
  "report_markdown": "## InspectIQ Maintenance Diagnosis\n\n### Summary\n...",
  "report_summary_json": {
    "headline": "Likely roof leak requiring immediate attention",
    "recommended_next_step": "Contact a licensed roofer for inspection within 24-48 hours"
  },
  "diagnosis_summary": "Based on the photos and description, this appears to be an active roof leak. The brown staining and timing after heavy rain strongly suggest water is entering through the roof and traveling down to the bathroom ceiling. This requires prompt professional attention to prevent further water damage.",
  "issues_enriched": [
    {
      "issue_label": "Active roof leak",
      "system": "roof",
      "urgency": "high",
      "probable_cause": "Damaged or missing roof shingles, flashing failure, or compromised roof membrane allowing water infiltration",
      "diy_possible": false,
      "recommended_trade": "roofer",
      "cost_low": 500,
      "cost_high": 2500,
      "time_hours": 8,
      "materials_list": ["roofing materials", "flashing", "sealant"],
      "safety_warnings": "Do not attempt roof repairs yourself. Working on roofs is dangerous and requires proper safety equipment. Active leaks can also cause electrical hazards.",
      "steps": [
        "Place buckets to catch any dripping water",
        "Document the damage with photos",
        "Contact 2-3 licensed roofers for quotes",
        "Schedule inspection within 24-48 hours",
        "Check attic for additional water damage if accessible",
        "Notify landlord/insurance if applicable"
      ]
    }
  ],
  "summary": {
    "overall_urgency": "high",
    "summary_cost_low": 500,
    "summary_cost_high": 2500
  }
}
```

## Using Python Requests

### Inspection Example

```python
import requests

url = "http://localhost:8000/api/v1/workflows/inspection"
payload = {
    "inspection_id": "python-test-001",
    "photos": [
        {
            "image_url": "https://example.com/room.jpg",
            "room_name": "Living Room"
        }
    ],
    "property": {
        "name": "Test Property",
        "city": "San Francisco",
        "state": "CA"
    }
}

response = requests.post(url, json=payload)
result = response.json()

print(f"Issues found: {result['summary']['issue_count']}")
print(f"Cost range: ${result['summary']['summary_cost_low']} - ${result['summary']['summary_cost_high']}")
print(f"\nReport:\n{result['report_markdown']}")
```

### Diagnosis Example

```python
import requests

url = "http://localhost:8000/api/v1/workflows/diagnosis"
payload = {
    "diagnosis_id": "python-test-002",
    "photos": [
        {
            "image_url": "https://example.com/issue.jpg",
            "order_index": 1
        }
    ],
    "user_description": "Water stain on ceiling"
}

response = requests.post(url, json=payload)
result = response.json()

print(f"Diagnosis: {result['diagnosis_summary']}")
print(f"Urgency: {result['summary']['overall_urgency']}")
print(f"\nReport:\n{result['report_markdown']}")
```

## Using JavaScript/Fetch

### Inspection Example

```javascript
const inspectionData = {
  inspection_id: "js-test-001",
  photos: [
    {
      image_url: "https://example.com/room.jpg",
      room_name: "Living Room"
    }
  ],
  property: {
    name: "Test Property",
    city: "San Francisco",
    state: "CA"
  }
};

fetch("http://localhost:8000/api/v1/workflows/inspection", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(inspectionData)
})
  .then(response => response.json())
  .then(result => {
    console.log(`Issues found: ${result.summary.issue_count}`);
    console.log(`Cost: $${result.summary.summary_cost_low} - $${result.summary.summary_cost_high}`);
    console.log(`\nReport:\n${result.report_markdown}`);
  })
  .catch(error => console.error("Error:", error));
```

## Error Responses

### Invalid Input

```json
{
  "detail": [
    {
      "loc": ["body", "photos", 0, "image_url"],
      "msg": "invalid or missing URL scheme",
      "type": "value_error.url.scheme"
    }
  ]
}
```

### No Valid Photos

```json
{
  "detail": "No valid photos provided"
}
```

### Server Error

```json
{
  "detail": "OpenAI API error: Rate limit exceeded"
}
```

## Testing Tips

1. **Use Real Images**: Replace example.com URLs with actual image URLs
2. **Public URLs**: Ensure images are publicly accessible
3. **HTTPS**: Use HTTPS URLs for images
4. **Image Quality**: Higher quality images = better analysis
5. **Multiple Angles**: Provide multiple photos of the same issue
6. **Context**: Include room names and descriptions for better results

## Rate Limiting

Currently no rate limiting is implemented. For production:
- Implement rate limiting per API key
- Monitor OpenAI API usage
- Set up cost alerts
- Consider caching results

## Authentication

Currently no authentication is required. For production:
- Add API key authentication
- Implement JWT tokens
- Set up OAuth if needed
- Secure webhook callbacks

## Next Steps

1. Replace example URLs with real test images
2. Test both workflows end-to-end
3. Review generated reports
4. Adjust agent prompts if needed
5. Set up monitoring and logging
6. Deploy to production environment
