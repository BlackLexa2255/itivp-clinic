// Тесты не подключаются к базе: строка нужна только для создания объекта Sequelize
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgres://test:test@localhost:5432/test';

const request = require('supertest');
const app = require('../app');

describe('служебные маршруты и проверки без базы данных', () => {
  test('GET /health отвечает 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /metrics отдаёт время работы, память и счётчик запросов', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.body.uptimeSeconds).toBeGreaterThanOrEqual(0);
    expect(res.body.memoryMb.rss).toBeGreaterThan(0);
    expect(res.body.requests.total).toBeGreaterThanOrEqual(1);
  });

  test('неизвестный маршрут возвращает 404', async () => {
    const res = await request(app).get('/no-such-route');
    expect(res.status).toBe(404);
  });

  test('GET /auth/me без токена возвращает 401', async () => {
    const res = await request(app).get('/auth/me');
    expect(res.status).toBe(401);
  });

  test('вход с пустым телом отклоняется валидацией с кодом 400', async () => {
    const res = await request(app).post('/auth/login').send({});
    expect(res.status).toBe(400);
  });
});
