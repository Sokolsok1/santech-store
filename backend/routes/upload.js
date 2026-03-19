const router = require('express').Router()
const multer = require('multer')
const xlsx = require('xlsx')
const db = require('../db')

const upload = multer({ dest: 'uploads/' })

router.post('/', upload.single('file'), async (req, res) => {
    const workbook = xlsx.readFile(req.file.path)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = xlsx.utils.sheet_to_json(sheet)

    for (let row of data) {
        await db.query(
            `INSERT INTO products(name,sku,brand,country,price,stock,size)
             VALUES($1,$2,$3,$4,$5,$6,$7)`,
            [row.name, row.sku, row.brand, row.country, row.price, row.stock, row.size]
        )
    }

    res.json({ message: 'Excel imported' })
})

module.exports = router