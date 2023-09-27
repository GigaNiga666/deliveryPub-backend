const db = require('../db')
const {answerWebAppQuery} = require("../telegram");

class ProductService {
  async getProducts() {
    const {rows : products} = await db.query('SELECT p.id,p.title,p.image,p.description,p.price,p.alcohol_percent,p.volume,p.bitterness,p.country,p.brewery_name,p.style_name,p.compound,c.category_title as category, c.class_title as class FROM product p JOIN category c ON  p.category_id = c.id');
    const {rows : categories} = await db.query('SELECT * FROM category');
    return {products, categories}
  }

  async getProduct(id) {
    const {rows} = await db.query('SELECT p.id,p.title,p.image,p.description,p.price,p.alcohol_percent,p.volume,p.bitterness,p.country,p.brewery_name,p.style_name,p.compound,c.category_title as category, c.class_title as class FROM product p JOIN category c ON  p.category_id = c.id WHERE p.id =$1', [id]);
    return rows[0]
  }

  async createWebAppQuery(data) {
    await answerWebAppQuery(data)
  }
}

module.exports = new ProductService()