const http = require('http');

const port = process.env.PORT || 3000;
const options = {
  hostname: 'localhost',
  port: port,
  path: '/health',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200) {
    console.log('Health check passed');
    process.exit(0);
  } else {
    console.log(`Health check failed with status: ${res.statusCode}`);
    process.exit(1);
  }
});

req.on('error', (e) => {
  console.log(`Health check error: ${e.message}`);
  process.exit(1);
});

req.on('timeout', () => {
  console.log('Health check timeout');
  req.abort();
  process.exit(1);
});

req.setTimeout(5000);
req.end();
