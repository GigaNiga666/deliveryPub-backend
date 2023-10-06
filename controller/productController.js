const productService = require('../service/productService')
const adminService = require('../service/adminService')

class ProductController {
  async getProducts(req, res) {
    try {
      const data = await productService.getProducts()
      if (!data.products.length || !data.categories.length) return res.status(500).send('Данные по неизвестной причине отсутствуют')
      else return res.send(data)
    } catch(e) {
        console.log(e)
    }
  }

  async getProduct(req, res) {
    try {
      const product = await productService.getProduct(req.params.id)
      if (!product) return res.status(400).send('Текущего id нету')
      else return res.send(product)
    } catch(e) {
        console.log(e)
    }
  }

  async createProduct(req, res) {
    try {
      console.log('some')
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
    try {
      await productService.createWebAppQuery(req.body)
      res.send()
    } catch(e) {
        console.log(e)
    }
  }

  async adminAuth(req, res) {
    try {
      const bool = await adminService.checkData(req.body)
      res.send(bool)
    } catch(e) {
        console.log(e)
    }
  }

  async createTables(req, res) {
    try {
      await adminService.createTables();
      res.status(200).send()
    }
    catch (e) {
      console.log(e)
    }
  }
}

module.exports = new ProductController()