const db = require('../db')
const {createInvoiceLink} = require("../telegram");

class ProductService {
  async getProducts() {
    const {rows : products} = await db.query('SELECT p.id,p.title,p.image,p.description,p.price,p.alcohol_percent,p.liter,p.bitterness,p.country,p.brewery_name,p.style_name,c.category_title as category, c.class_title as class FROM product p JOIN category c ON  p.category_id = c.id');
    const {rows : categories} = await db.query('SELECT * FROM category');
    return {products, categories}
  }

  async getProduct(id) {
    const {rows} = await db.query('SELECT * FROM product WHERE id = $1', [id]);
    return rows[0]
  }

  async createProduct(data) {
    await db.query('INSERT INTO product(title,image,price,alcohol_percent,liter,bitterness,country,brewery_name,style_name,description,category_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)', [data.title, data.image, data.price, data.alcohol_percent, data.liter, data.bitterness, data.country, data.brewery_name, data.style_name,data.description,data.category_id])
  }

  async getInvoiceLink(price, products) {
    const invoiceLink = await createInvoiceLink(price, products)
    return invoiceLink
  }
}

module.exports = new ProductService()