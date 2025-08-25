const http = require('http');

console.log('🚑 Starting emergency health server on port 3001...');

const server = http.createServer((req, res) => {
  console.log(`🏥 Health request: ${req.method} ${req.url}`);

  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        status: 'emergency-ok',
        timestamp: new Date().toISOString(),
        message: 'Emergency health server running',
      }),
    );
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(3001, '0.0.0.0', () => {
  console.log('🚑 Emergency health server listening on 0.0.0.0:3001');
  console.log('🏥 Health endpoint: http://0.0.0.0:3001/health');
});

server.on('error', (err) => {
  console.error('🚑 Emergency server error:', err);
  process.exit(1);
});
