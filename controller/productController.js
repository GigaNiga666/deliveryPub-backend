const productService = require('../service/productService')

class ProductController {
  async getProducts(req, res) {
    const data = await productService.getProducts()
    if (!data.products.length || !data.categories.length) return res.status(500).send('Данные по неизвестной причине отсутствуют')
    else return res.send(data)
  }

  async getProduct(req, res) {
    const product = await productService.getProduct(req.params.id)
    if (!product) return res.status(400).send('Текущего id нету')
    else return res.send(product)
  }

  async createProduct(req, res) {
    await productService.createProduct(req.body)
    res.status(200).send()
  }

  async createWebAppQuery(req, res) {
    await productService.createWebAppQuery(req.body.queryId)
    res.send()
  }
}

module.exports = new ProductController()