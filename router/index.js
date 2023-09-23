const Router = require('express').Router
const ProductController = require('../controller/productController')

const router = new Router()

router.get('/getProducts', ProductController.getProducts)
router.get('/getProduct/:id', ProductController.getProduct)
router.post('/createProduct', ProductController.createProduct)

module.exports = router