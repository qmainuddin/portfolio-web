import type { APIRoute } from 'astro';

export const prerender = false;

const startTime = Date.now();

export const GET: APIRoute = async () => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const memoryUsage = process.memoryUsage();

  return new Response(
    JSON.stringify({
      status: 'healthy',
      version: '1.0.0',
      uptime: `${uptimeSeconds}s`,
      timestamp: new Date().toISOString(),
      service: 'portfolio-web',
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      },
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    }
  );
};
