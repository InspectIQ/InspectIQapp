# InspectIQ Deployment Checklist

## Pre-Deployment

### Configuration
- [ ] Set production `OPENAI_API_KEY`
- [ ] Update `BACKEND_BASE_URL` to production backend
- [ ] Configure `INSPECTION_WEBHOOK_URL`
- [ ] Configure `DIAGNOSIS_WEBHOOK_URL`
- [ ] Set `APP_ENV=production`
- [ ] Configure appropriate `LOG_LEVEL`

### Security
- [ ] Review and restrict CORS origins in `main.py`
- [ ] Add API authentication/authorization
- [ ] Set up rate limiting
- [ ] Enable HTTPS/TLS
- [ ] Secure environment variables (use secrets manager)
- [ ] Review and sanitize error messages

### Testing
- [ ] Run all unit tests: `pytest tests/ -v`
- [ ] Test inspection workflow end-to-end
- [ ] Test diagnosis workflow end-to-end
- [ ] Verify webhook callbacks work
- [ ] Load test with multiple concurrent requests
- [ ] Test with various image formats and sizes
- [ ] Test error handling (invalid URLs, API failures)

### Performance
- [ ] Configure appropriate number of uvicorn workers
- [ ] Set up connection pooling for HTTP clients
- [ ] Consider adding Redis for caching (optional)
- [ ] Optimize image processing if needed
- [ ] Set appropriate timeout values

## Deployment

### Infrastructure
- [ ] Provision compute resources (EC2, Cloud Run, etc.)
- [ ] Set up load balancer (if needed)
- [ ] Configure auto-scaling rules
- [ ] Set up health check endpoints
- [ ] Configure firewall/security groups

### Monitoring & Logging
- [ ] Set up application logging
- [ ] Configure log aggregation (CloudWatch, Datadog, etc.)
- [ ] Set up error tracking (Sentry, Rollbar, etc.)
- [ ] Configure performance monitoring (APM)
- [ ] Set up uptime monitoring
- [ ] Create alerting rules for critical errors

### Database (if added)
- [ ] Set up production database
- [ ] Configure connection pooling
- [ ] Set up automated backups
- [ ] Test disaster recovery procedures

### CI/CD
- [ ] Set up automated testing pipeline
- [ ] Configure deployment automation
- [ ] Set up staging environment
- [ ] Create rollback procedures
- [ ] Document deployment process

## Post-Deployment

### Verification
- [ ] Test health check endpoint
- [ ] Run smoke tests on production
- [ ] Verify webhook callbacks reach backend
- [ ] Check logs for errors
- [ ] Monitor API response times
- [ ] Verify OpenAI API calls are working

### Documentation
- [ ] Update API documentation
- [ ] Document deployment procedures
- [ ] Create runbook for common issues
- [ ] Document monitoring dashboards
- [ ] Update team on new endpoints

### Optimization
- [ ] Review OpenAI API usage and costs
- [ ] Optimize agent prompts based on results
- [ ] Fine-tune cost estimates if needed
- [ ] Adjust severity thresholds if needed
- [ ] Monitor and optimize response times

## Ongoing Maintenance

### Weekly
- [ ] Review error logs
- [ ] Check API usage and costs
- [ ] Monitor response times
- [ ] Review webhook success rates

### Monthly
- [ ] Review and update agent prompts
- [ ] Analyze cost estimate accuracy
- [ ] Update dependencies
- [ ] Review security patches
- [ ] Optimize based on usage patterns

### Quarterly
- [ ] Conduct security audit
- [ ] Review and update test cases
- [ ] Evaluate new OpenAI models
- [ ] Review and optimize costs
- [ ] Update documentation

## Scaling Considerations

### When to Scale
- [ ] Response times > 10 seconds
- [ ] Error rate > 1%
- [ ] CPU usage consistently > 70%
- [ ] Memory usage consistently > 80%

### Scaling Options
- [ ] Increase uvicorn workers
- [ ] Add more compute instances
- [ ] Implement request queuing (Celery + Redis)
- [ ] Add caching layer
- [ ] Optimize image processing
- [ ] Consider batch processing for multiple photos

## Emergency Procedures

### Service Down
1. Check health endpoint
2. Review recent deployments
3. Check error logs
4. Verify OpenAI API status
5. Check backend webhook availability
6. Rollback if needed

### High Error Rate
1. Check OpenAI API status
2. Review error logs for patterns
3. Verify image URLs are accessible
4. Check webhook endpoint status
5. Temporarily disable problematic features

### High Costs
1. Review OpenAI API usage
2. Check for retry loops
3. Verify rate limiting is working
4. Review image sizes being processed
5. Optimize prompts to reduce tokens

## Contact Information

- **DevOps Lead**: [Name/Email]
- **Backend Team**: [Contact]
- **OpenAI Support**: platform.openai.com/support
- **On-Call**: [Phone/Pager]
