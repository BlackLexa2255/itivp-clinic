const os = require('os');

const counters = { total: 0, clientErrors: 0, serverErrors: 0 };
const startedAt = new Date();

// Счётчик обработанных запросов: код ответа известен только после отправки
function countRequests(req, res, next) {
  res.on('finish', () => {
    counters.total += 1;
    if (res.statusCode >= 500) counters.serverErrors += 1;
    else if (res.statusCode >= 400) counters.clientErrors += 1;
  });
  next();
}

const mb = (bytes) => Math.round(bytes / 1024 / 1024 * 10) / 10;

function getMetrics() {
  const memory = process.memoryUsage();
  const cpu = process.cpuUsage();
  return {
    startedAt: startedAt.toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    memoryMb: { rss: mb(memory.rss), heapUsed: mb(memory.heapUsed), heapTotal: mb(memory.heapTotal) },
    cpuMs: { user: Math.round(cpu.user / 1000), system: Math.round(cpu.system / 1000) },
    loadAverage: os.loadavg().map(n => Math.round(n * 100) / 100),
    requests: { ...counters },
    node: process.version
  };
}

module.exports = { countRequests, getMetrics };
