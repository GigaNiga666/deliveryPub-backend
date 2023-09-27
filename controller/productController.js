const productService = require('../service/productService')
const adminService = require('../service/adminService')

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
    try {
      await adminService.createProduct(req.files,req.body)
      res.status(200).send()
    } catch (e) {
      console.log(e)
      res.status(500).send({error : e})
    }
  }

  async updateProduct(req, res) {
    try {
      await adminService.updateProduct(req.files,req.body)
      res.status(200).send()
    } catch (e) {
      console.log(e)
      res.status(500).send({error : e})
    }
  }

  async deleteProduct(req, res) {
    try {
      await adminService.deleteProduct(req.body.id)
      res.status(200).send()
    } catch (e) {
      console.log(e)
      res.status(500).send({error : e})
    }
  }

  async createCategory(req, res) {
    try {
      await adminService.createCategory(req.body)
      res.status(200).send()
    } catch (e) {
      console.log(e)
      res.status(500).send({error : e})
    }
  }

  async updateCategory(req, res) {
    try {
      await adminService.updateCategory(req.body)
      res.status(200).send()
    } catch (e) {
      console.log(e)
      res.status(500).send({error : e})
    }
  }

  async deleteCategory(req, res) {
    try {
      await adminService.deleteCategory(req.body.id)
      res.status(200).send()
    } catch (e) {
      console.log(e)
      res.status(500).send({error : e})
    }
  }

  async createWebAppQuery(req, res) {
    await productService.createWebAppQuery(req.body)
    res.send()
  }

  async adminAuth(req, res) {
    const bool = await adminService.checkData(req.body)
    res.send(bool)
  }
}

module.exports = new ProductController()