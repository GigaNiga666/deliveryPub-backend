const Router = require('express').Router
const ProductController = require('../controller/productController')

const router = new Router()

router.get('/getProducts', ProductController.getProducts)
router.get('/getProduct/:id', ProductController.getProduct)
router.post('/createProduct', ProductController.createProduct)
router.post('/updateProduct', ProductController.updateProduct)
router.post('/deleteProduct', ProductController.deleteProduct)
router.post('/adminAuth', ProductController.adminAuth)
router.post('/createCategory', ProductController.createCategory)
router.post('/updateCategory', ProductController.updateCategory)
router.post('/deleteCategory', ProductController.deleteCategory)
router.post('/createTables', ProductController.createTables)

module.exports = router