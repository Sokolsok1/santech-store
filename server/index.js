const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

// Статика (картинки)
app.use('/images', express.static(path.join(__dirname, 'public/images')))

// Роуты
const productRoutes = require('./routes/productRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const attributeRoutes = require('./routes/attributeRoutes')
const catalogRoutes = require('./routes/catalogRoutes')
const filterRoutes = require('./routes/filterRoutes')

// ✅ ЕДИНЫЙ API
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/attributes', attributeRoutes)
app.use('/api/catalog', catalogRoutes)
app.use('/api/filters', filterRoutes)

// тест
app.get('/api/test', (req, res) => {
  res.send('API работает!')
})

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})