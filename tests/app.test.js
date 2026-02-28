const request = require('supertest');
const app = require('../app');
const { calculateValue, applyDiscount, isLowStock } = require('../lib/logic');


describe('Suite de Pruebas de Calidad de Software', () => {

  describe('Pruebas Unitarias - Lógica de Inventario', () => {
    test('Debe calcular correctamente el valor total (10 * 5 = 50)', () => {
      const result = calculateValue(10, 5);
      expect(result).toBe(50);
    });

    test('Debe retornar 0 si se ingresan valores negativos', () => {
      const result = calculateValue(-10, 5);
      expect(result).toBe(0);
    });

    test('Debe aplicar descuento correctamente (100 con 20% = 80)', () => {
      const result = applyDiscount(100, 20);
      expect(result).toBe(80);
    });

    test('Debe retornar precio original si descuento es inválido', () => {
      const result = applyDiscount(100, 150);
      expect(result).toBe(100);
    });
  });

    describe('Pruebas de Integración - API Endpoints', () => {
    test('GET /health - Debe responder con status 200 y JSON correcto', async () => {
      const response = await request(app).get('/health');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('status', 'OKK');
    });

    test('GET /items - Debe validar la estructura del inventario', async () => {
      const response = await request(app).get('/items');
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      // Validamos que el primer objeto tenga las propiedades requeridas
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('stock');
    });

    test('POST /items - Debe crear un nuevo item correctamente', async () => {
      const newItem = { name: 'Keyboard', stock: 25 };
      const response = await request(app)
        .post('/items')
        .send(newItem)
        .set('Content-Type', 'application/json');
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id', 3);
      expect(response.body).toHaveProperty('name', 'Keyboard');
      expect(response.body).toHaveProperty('stock', 25);
    });

    test('GET /users - Debe responder con status 200', async () => {
      const response = await request(app).get('/users');
      expect(response.statusCode).toBe(200);
      expect(typeof response.text).toBe('string');
    });
  });
});

