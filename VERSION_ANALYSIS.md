# Version Analysis System / ვერსიების ანალიზის სისტემა

## Georgian / ქართული

### რა არის ეს სისტემა?

ვერსიების ანალიზის სისტემა საშუალებას გაძლევთ გაანალიზოთ წინა დღეებში ატვირთული ვერსიებიდან რომელი იყო საუკეთესო. სისტემა ავტომატურად აგროვებს მეტრიკებს თითოეული დეპლოიმენტის დროს და აფასებს მათ მუშაობას.

### როგორ მუშაობს?

1. **ავტომატური მონიტორინგი**: თითოეული დეპლოიმენტის დროს სისტემა ავტომატურად აღრიცხავს:
   - მუშაობის მეტრიკები (response time, memory usage, error rate)
   - მომხმარებლების მეტრიკები (active users, new users, documents created)  
   - სისტემის მეტრიკები (database connectivity, API health)

2. **ქვითანის სისტემა**: თითოეული ვერსიისთვის გამოითვლება საერთო ქულა (0-100) მრავალი ფაქტორის მიხედვით

3. **ანალიზი**: სისტემა ადარებს ვერსიებს და გეუბნებათ რომელი იყო საუკეთესო და რატომ

### API Endpoints:

```bash
# ყველა ვერსიის ნახვა
GET /api/version-metrics/versions

# ვერსიების ანალიზი (საუკეთესო/უარესი ვერსია)
GET /api/version-metrics/analysis

# დეტალური რეპორტი საუკეთესო ვერსიების შესახებ
GET /api/version-metrics/best-versions-report

# მანუალურად მეტრიკების ჩაწერა
POST /api/version-metrics/record
```

---

## English

### What is this system?

The Version Analysis System allows you to analyze which version was the best from previous deployments. The system automatically collects metrics during each deployment and evaluates their performance.

### How it works:

1. **Automatic Monitoring**: During each deployment, the system automatically records:
   - Performance metrics (response time, memory usage, error rate)
   - User metrics (active users, new users, documents created)
   - System metrics (database connectivity, API health)

2. **Scoring System**: Each version gets an overall score (0-100) based on multiple factors

3. **Analysis**: The system compares versions and tells you which was the best and why

### Features:

- ✅ Automatic metric collection on startup
- ✅ Performance scoring (0-100 scale)
- ✅ Best/worst version identification
- ✅ Trend analysis (improving/declining/stable)
- ✅ Detailed recommendations
- ✅ Historical comparison
- ✅ Georgian language support

### Testing:

Run the test script to see the system in action:

```bash
node test_version_analysis.js
```

### API Examples:

#### Get Version Analysis
```bash
curl http://localhost:3001/api/version-metrics/analysis
```

Response:
```json
{
  "bestVersion": {
    "version": "v1.0.0",
    "score": 95.5,
    "deploymentDate": "2024-01-15T10:30:00Z"
  },
  "worstVersion": {
    "version": "v1.0.0-alpha", 
    "score": 65.2
  },
  "averageScore": 82.1,
  "totalVersions": 5,
  "recentTrend": "improving",
  "recommendations": [
    "System is performing well - monitor trends for continuous improvement"
  ]
}
```

#### Get Best Versions Report  
```bash
curl http://localhost:3001/api/version-metrics/best-versions-report
```

This provides comprehensive analysis including:
- Top 5 best performing versions
- Performance comparison between current and best version
- Detailed improvement suggestions
- Historical trends

### Metrics Collected:

#### Performance Metrics
- Response time (ms)
- Memory usage (MB)  
- CPU usage (%)
- Uptime (seconds)
- Error rate (%)

#### User Metrics
- Total users
- Active users (last 24h)
- New users since deployment
- Documents created since deployment
- Average session duration

#### System Metrics  
- Database connectivity
- Database response time
- API endpoints health
- Critical errors count

### Scoring Algorithm:

The system calculates a quality score based on:
- **Performance penalties**: High response time, memory usage, error rate
- **System penalties**: Database issues, API failures, critical errors
- **User engagement bonuses**: Active users, document creation activity

### Integration:

The system is automatically integrated with:
- Health check endpoint (`/health`) 
- Application startup (records metrics automatically)
- MongoDB for data persistence
- Swagger documentation (`/docs`)

### Deployment:

When deployed to production, the system will:
1. Automatically record metrics on each deployment
2. Build historical data over time
3. Provide insights into performance trends
4. Help identify which deployments were most successful

This answers the original question: **"შეგიძლია გააანალიზო წინა დღეებში ატვირთლი ვერსიებიდან რომელი იყო საუკეთესო?"** (Can you analyze which version was the best from the versions uploaded in the previous days?)