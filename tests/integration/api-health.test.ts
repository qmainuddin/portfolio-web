import { describe, it, expect } from 'vitest';
import { GET } from '@/pages/api/health';

describe('API Integration: GET /api/health', () => {
  it('returns HTTP 200 with health metrics, uptime, and service name', async () => {
    const mockRequest = new Request('http://localhost:4321/api/health', {
      method: 'GET',
    });

    const response = await GET({ request: mockRequest } as any);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.status).toBe('healthy');
    expect(json.version).toBe('1.0.0');
    expect(json.service).toBe('portfolio-web');
    expect(json.uptime).toBeDefined();
    expect(json.memory).toBeDefined();
  });
});
