var express = require('express')
var router = express.Router()

router.get('/', (req, res) => {
  res.status(200).json([
    { id: 1, name: 'Laptop', stock: 10 },
    { id: 2, name: 'Mouse', stock: 50 }
  ])
})

router.post('/', (req, res) => {
  const { name, stock } = req.body;
  if (!name || stock === undefined) {
    return res.status(400).json({ error: 'Name and stock are required' });
  }
  res.status(201).json({ id: 3, name, stock });
})

module.exports = router
