const BENCHMARK_CONFIG = {
  host: 'localhost',
  port: 3002,
  duration: 10000,
  concurrency: 100,
};

interface BenchmarkResult {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatency: number;
  requestsPerSecond: number;
  minLatency: number;
  maxLatency: number;
}

async function makeRequest(path: string): Promise<number> {
  const startTime = Date.now();

  try {
    const response = await fetch(`http://${BENCHMARK_CONFIG.host}:${BENCHMARK_CONFIG.port}${path}`);
    await response.text();
    return Date.now() - startTime;
  } catch (_error) {
    throw new Error('Request failed');
  }
}

async function runBenchmark(): Promise<BenchmarkResult> {
  const startTime = Date.now();
  const latencies: number[] = [];
  let successfulRequests = 0;
  let failedRequests = 0;

  console.log(`Starting benchmark for ${BENCHMARK_CONFIG.duration}ms...`);
  console.log(`Concurrency: ${BENCHMARK_CONFIG.concurrency}`);

  while (Date.now() - startTime < BENCHMARK_CONFIG.duration) {
    const promises: Promise<void>[] = [];

    for (let i = 0; i < BENCHMARK_CONFIG.concurrency; i++) {
      promises.push(
        makeRequest('/health')
          .then((latency) => {
            latencies.push(latency);
            successfulRequests++;
          })
          .catch(() => {
            failedRequests++;
          })
      );
    }

    await Promise.all(promises);
  }

  const totalRequests = successfulRequests + failedRequests;
  const averageLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  const requestsPerSecond = (totalRequests / BENCHMARK_CONFIG.duration) * 1000;

  return {
    totalRequests,
    successfulRequests,
    failedRequests,
    averageLatency: Math.round(averageLatency * 100) / 100,
    requestsPerSecond: Math.round(requestsPerSecond * 100) / 100,
    minLatency: Math.min(...latencies),
    maxLatency: Math.max(...latencies),
  };
}

try {
  const result = await runBenchmark();
  console.log('\n=== Deno API Benchmark Results ===');
  console.log(`Total Requests: ${result.totalRequests}`);
  console.log(`Successful: ${result.successfulRequests}`);
  console.log(`Failed: ${result.failedRequests}`);
  console.log(`Average Latency: ${result.averageLatency}ms`);
  console.log(`Min Latency: ${result.minLatency}ms`);
  console.log(`Max Latency: ${result.maxLatency}ms`);
  console.log(`Requests/sec: ${result.requestsPerSecond}`);
  console.log('=====================================\n');
} catch (error) {
  console.error('Benchmark failed:', error);
  Deno.exit(1);
}
