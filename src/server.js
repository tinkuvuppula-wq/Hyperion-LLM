const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 7700;

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8'));
  } else if (req.url === '/api/metrics') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'HEALTHY', app: 'Hyperion-LLM', tokensPerSec: 184.5, specSpeedup: '2.85x', pagedKVOccupancy: '42.8%' }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => console.log('Hyperion-LLM Server running on port ' + PORT));
