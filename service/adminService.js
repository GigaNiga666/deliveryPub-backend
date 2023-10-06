const db = require('../db')
const fs = require('fs');

class AdminService {
  async createProduct(files,data) {
    try {
      if (files) {
        const file = files.file;
        const fileName = file.name

        await file.mv(`./client/public/${fileName}`, (err) => {
          if (err) throw Error
          return
        })
      }

      for (const datum in data) {
        if (data[datum] === 'null') data[datum] = null
      }

      const {rows} =  await db.query('INSERT INTO product(title,image,price,alcohol_percent,volume,bitterness,country,brewery_name,style_name,description,category_id, compound) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', [data.title, data.image, data.price, data.alcohol_percent, data.volume, data.bitterness, data.country, data.brewery_name, data.style_name,data.description,data.category_id, data.compound])
      return rows
    } catch (e) {
      throw Error
    }
  }

  async updateProduct(files,data) {
    try {
      if (files) {
        const file = files.file;
        const fileName = file.name

        await file.mv(`./client/public/${fileName}`, (err) => {
          if (err) throw Error
          return
        })
      }
      for (const datum in data) {
        if (data[datum] === 'null') data[datum] = null
      }
      const {rows} = await db.query('SELECT image FROM product WHERE id=?', [data.id])

      if (rows[0].image !== data.image) {
        fs.unlink('./client/public/' + rows[0].image, (e) => {
            if (e) console.log(e)
        })
      }

      await db.query('UPDATE product SET ' +
        'title=?' +
        ',image=?' +
        ',price=?' +
        ',alcohol_percent=?' +
        ',volume=?' +
        ',bitterness=?' +
        ',country=?' +
        ',brewery_name=?' +
        ',style_name=?' +
        ',description=?' +
        ',category_id=?' +
        ',compound=? WHERE id=?', [data.title, data.image, data.price, data.alcohol_percent, data.volume, data.bitterness, data.country, data.brewery_name, data.style_name,data.description,data.category_id, data.compound, data.id])
      return
    } catch (e) {
      console.log(e)
      throw Error
    }
  }

  async deleteProduct(id) {

    try {
      const [rows] = await db.query('SELECT image FROM product WHERE id=?', [id])

      fs.unlink('./client/public/' + rows[0].image, (e) => {
        if (e) console.log(e)
      })

      return await db.query('DELETE FROM product WHERE id=?', [id])
    } catch(e) {
      console.log(e)
    }
  }

  async createCategory(data) {
    try {
      return await db.query('INSERT INTO category(category_title, class_title) VALUES (?,?)', [data.category_title, data.class_title])
    } catch(e) {
        console.log(e)
    }
  }

  async updateCategory(data) {
    try {
      return await db.query('UPDATE category SET category_title=?,class_title=? WHERE id=?', [data.category_title, data.class_title, data.id])
    } catch(e) {
        console.log(e)
    }
  }

  async deleteCategory(id) {
    try {
      return await db.query('DELETE FROM category WHERE id=?', [id])
    } catch(e) {
        console.log(e)
    }
  }

  async checkData(data) {
    try {
      return process.env.ADMIN_USERNAME === data.username && process.env.ADMIN_PASSWORD === data.password
    } catch(e) {
        console.log(e)
    }
  }

  async createTables() {
    try {
      await db.query('CREATE TABLE category (id SMALLSERIAL PRIMARY KEY,category_title VARCHAR(255) NOT NULL,class_title VARCHAR(25) NOT NULL)')
      return await db.query('create TABLE product (id SMALLSERIAL PRIMARY KEY,title VARCHAR(255) NOT NULL,description TEXT NOT NULL,image VARCHAR(255) NOT NULL,price INT2 NOT NULL,alcohol_percent INT2,volume FLOAT(3) NOT NULL,bitterness INT2,country VARCHAR(255),brewery_name VARCHAR(255),style_name VARCHAR(255),compound VARCHAR(255),category_id INTEGER NOT NULL,FOREIGN KEY (category_id) REFERENCES category(id))')
    } catch(e) {
        console.log(e)
    }
  }
}

module.exports = new AdminService()