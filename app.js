const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const client = require('prom-client')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const itemsRouter = require('./routes/items')

const app = express()

// Métricas por defecto de Node.js
client.collectDefaultMetrics();

// Contador de peticiones HTTP
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de peticiones HTTP procesadas',
  labelNames: ['metodo', 'ruta', 'estado_http'],
});

// Middleware para contar peticiones
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.inc({
      metodo: req.method,
      ruta: req.path,
      estado_http: res.statusCode.toString()
    });
  });
  next();
});

// Gauge de usuarios activos
const activeUsersGauge = new client.Gauge({
  name: 'active_users_current',
  help: 'Número actual de usuarios activos simulados'
});

// Simular usuarios activos aleatorios
let userCount = 0;
setInterval(() => {
  userCount = (userCount + Math.floor(userCount * 0.1) + 1) % 100;
  activeUsersGauge.set(userCount);
}, 5000);

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Endpoint /metrics para Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.send(await client.register.metrics());
});

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/items', itemsRouter)

module.exports = app
