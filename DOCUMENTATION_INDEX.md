# InspectIQ Documentation Index

Complete guide to all InspectIQ documentation.

## 📚 Quick Navigation

### Getting Started
- **[QUICK_START.md](QUICK_START.md)** - Get running in 5 minutes
- **[README.md](README.md)** - Project overview and introduction
- **[SETUP.md](SETUP.md)** - Detailed installation and configuration

### Using the API
- **[API_EXAMPLES.md](API_EXAMPLES.md)** - Complete API usage examples with curl, Python, JavaScript
- **Interactive Docs** - http://localhost:8000/docs (when server is running)

### Understanding the System
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design, data flow, and component details
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete project overview and status

### Deployment
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Production deployment guide
- **[Dockerfile](Dockerfile)** - Docker container configuration
- **[docker-compose.yml](docker-compose.yml)** - Docker Compose setup

### Troubleshooting
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions

### Configuration
- **[.env.example](.env.example)** - Environment variable template
- **[requirements.txt](requirements.txt)** - Python dependencies

## 📖 Documentation by Role

### For Developers

**First Time Setup:**
1. [QUICK_START.md](QUICK_START.md) - Get running quickly
2. [SETUP.md](SETUP.md) - Detailed setup instructions
3. [ARCHITECTURE.md](ARCHITECTURE.md) - Understand the system

**Daily Development:**
1. [API_EXAMPLES.md](API_EXAMPLES.md) - API usage reference
2. Interactive docs at `/docs` - Test endpoints
3. [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Fix issues

**Code Reference:**
- `agents/` - AI agent implementations
- `workflows/` - Workflow orchestration
- `schemas/` - Data models
- `api/` - API endpoints

### For DevOps/SRE

**Deployment:**
1. [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Complete deployment guide
2. [Dockerfile](Dockerfile) - Container configuration
3. [docker-compose.yml](docker-compose.yml) - Multi-container setup

**Operations:**
1. [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues
2. [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
3. [.env.example](.env.example) - Configuration reference

**Monitoring:**
- Health endpoint: `/api/v1/health`
- Logs: Application and container logs
- Metrics: Response times, error rates, costs

### For Product Managers

**Understanding the Product:**
1. [README.md](README.md) - Product overview
2. [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Features and capabilities
3. [ARCHITECTURE.md](ARCHITECTURE.md) - How it works

**API Capabilities:**
1. [API_EXAMPLES.md](API_EXAMPLES.md) - What the API can do
2. Interactive docs at `/docs` - Try it yourself

### For QA/Testers

**Testing:**
1. [SETUP.md](SETUP.md) - Setup test environment
2. [API_EXAMPLES.md](API_EXAMPLES.md) - Test cases and examples
3. `tests/` directory - Automated tests

**Test Data:**
- `tests/test_data.py` - Test fixtures
- `scripts/run_test_inspection.py` - Manual inspection test
- `scripts/run_test_diagnosis.py` - Manual diagnosis test

## 📋 Documentation by Topic

### Installation & Setup
- [QUICK_START.md](QUICK_START.md) - Quick installation
- [SETUP.md](SETUP.md) - Detailed installation
- [requirements.txt](requirements.txt) - Dependencies
- [.env.example](.env.example) - Configuration template

### Architecture & Design
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Project overview
- [README.md](README.md) - High-level overview

### API Usage
- [API_EXAMPLES.md](API_EXAMPLES.md) - Complete examples
- `/docs` endpoint - Interactive documentation
- `/redoc` endpoint - Alternative documentation

### Deployment
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Deployment guide
- [Dockerfile](Dockerfile) - Docker setup
- [docker-compose.yml](docker-compose.yml) - Compose configuration
- [.dockerignore](.dockerignore) - Docker ignore rules

### Troubleshooting
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Issue resolution
- [SETUP.md](SETUP.md) - Setup issues
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Deployment issues

### Testing
- `tests/test_inspection_workflow.py` - Inspection tests
- `tests/test_diagnosis_workflow.py` - Diagnosis tests
- `tests/test_data.py` - Test fixtures
- `scripts/run_test_inspection.py` - Manual inspection test
- `scripts/run_test_diagnosis.py` - Manual diagnosis test

### Configuration
- [.env.example](.env.example) - Environment variables
- `config/settings.py` - Settings management
- [requirements.txt](requirements.txt) - Python packages

## 🔍 Finding Information

### "How do I...?"

**...install InspectIQ?**
→ [QUICK_START.md](QUICK_START.md) or [SETUP.md](SETUP.md)

**...use the API?**
→ [API_EXAMPLES.md](API_EXAMPLES.md) or `/docs` endpoint

**...deploy to production?**
→ [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

**...fix an error?**
→ [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

**...understand how it works?**
→ [ARCHITECTURE.md](ARCHITECTURE.md)

**...run tests?**
→ [SETUP.md](SETUP.md) Testing section

**...configure environment?**
→ [.env.example](.env.example) and [SETUP.md](SETUP.md)

**...use Docker?**
→ [Dockerfile](Dockerfile) and [docker-compose.yml](docker-compose.yml)

**...customize agents?**
→ `agents/` directory and [ARCHITECTURE.md](ARCHITECTURE.md)

**...add authentication?**
→ [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) Security section

## 📁 File Structure Reference

```
inspectiq/
├── 📄 Documentation Files
│   ├── README.md                    # Project overview
│   ├── QUICK_START.md              # 5-minute setup
│   ├── SETUP.md                    # Detailed setup
│   ├── ARCHITECTURE.md             # System design
│   ├── API_EXAMPLES.md             # API usage
│   ├── DEPLOYMENT_CHECKLIST.md     # Deployment guide
│   ├── TROUBLESHOOTING.md          # Issue resolution
│   ├── PROJECT_SUMMARY.md          # Project status
│   └── DOCUMENTATION_INDEX.md      # This file
│
├── 🐳 Docker Files
│   ├── Dockerfile                  # Container definition
│   ├── docker-compose.yml          # Compose setup
│   └── .dockerignore              # Docker ignore rules
│
├── ⚙️ Configuration Files
│   ├── .env.example               # Config template
│   ├── requirements.txt           # Python dependencies
│   ├── .gitignore                # Git ignore rules
│   └── config/settings.py        # Settings management
│
├── 🚀 Application Code
│   ├── main.py                   # FastAPI app
│   ├── agents/                   # AI agents
│   ├── workflows/                # Orchestration
│   ├── schemas/                  # Data models
│   └── api/                      # API routes
│
├── 🧪 Testing
│   ├── tests/                    # Test suite
│   └── scripts/                  # Helper scripts
│
└── 🔧 IDE Configuration
    └── .vscode/                  # VS Code settings
```

## 🎯 Common Workflows

### First Time Setup
1. Read [README.md](README.md)
2. Follow [QUICK_START.md](QUICK_START.md)
3. Review [API_EXAMPLES.md](API_EXAMPLES.md)
4. Test with sample data

### Development
1. Review [ARCHITECTURE.md](ARCHITECTURE.md)
2. Check code in `agents/` and `workflows/`
3. Use [API_EXAMPLES.md](API_EXAMPLES.md) for testing
4. Refer to [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for issues

### Deployment
1. Complete [SETUP.md](SETUP.md)
2. Follow [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
3. Use [Dockerfile](Dockerfile) or [docker-compose.yml](docker-compose.yml)
4. Monitor using health endpoint

### Troubleshooting
1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Review logs
3. Test components individually
4. Check [SETUP.md](SETUP.md) for configuration

## 📊 Documentation Statistics

- **Total Documentation Files**: 9 markdown files
- **Total Code Files**: 20+ Python files
- **Total Lines of Documentation**: ~3,000+ lines
- **Configuration Files**: 5 files
- **Test Files**: 3 files
- **Docker Files**: 3 files

## 🔄 Documentation Updates

This documentation is current as of: **November 20, 2025**

### Keeping Documentation Updated

When making changes:
1. Update relevant documentation files
2. Update code comments
3. Update API examples if endpoints change
4. Update architecture diagrams if structure changes
5. Update troubleshooting guide with new issues

## 💡 Tips for Using Documentation

1. **Start with QUICK_START.md** - Get running first
2. **Use the search** - Ctrl+F in your editor
3. **Check examples** - API_EXAMPLES.md has working code
4. **Interactive docs** - Use `/docs` endpoint for live testing
5. **Read architecture** - Understand before modifying
6. **Check troubleshooting** - Before asking for help

## 📞 Getting Help

If you can't find what you need:

1. **Search this index** - Use Ctrl+F
2. **Check TROUBLESHOOTING.md** - Common issues
3. **Review API docs** - `/docs` endpoint
4. **Check code comments** - In-line documentation
5. **Review test files** - See usage examples

## ✅ Documentation Checklist

Before starting development:
- [ ] Read README.md
- [ ] Complete QUICK_START.md
- [ ] Review ARCHITECTURE.md
- [ ] Test API with API_EXAMPLES.md

Before deployment:
- [ ] Complete SETUP.md
- [ ] Follow DEPLOYMENT_CHECKLIST.md
- [ ] Review TROUBLESHOOTING.md
- [ ] Test all endpoints

## 🎓 Learning Path

**Beginner:**
1. README.md → Understand what InspectIQ does
2. QUICK_START.md → Get it running
3. API_EXAMPLES.md → Try the API

**Intermediate:**
1. ARCHITECTURE.md → Understand the design
2. Code in `agents/` → See how agents work
3. SETUP.md → Deep dive into configuration

**Advanced:**
1. DEPLOYMENT_CHECKLIST.md → Production deployment
2. Customize agents and workflows
3. Optimize performance and costs

---

**Need something specific?** Use Ctrl+F to search this index!
