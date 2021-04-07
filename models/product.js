// import important parts of sequelize library
const { Model, DataTypes } = require('sequelize');
// import our database connection from config.js
const sequelize = require('../config/connection');

// Initialize Product model (table) by extending off Sequelize's Model class
class Product extends Model {}

// set up fields and rules for Product model
Product.init(
  {
    // define columns
    // data will be a #, must hold a value, sets a key, & will auto increment
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    // shows the products name & it must hold a value
    product_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
// this is the price & will be listed as a number, it must hold a value, and can use decimals
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isDecimal: true,
      },
    },
    // this is showing how many items are in stock. Will be shown as a #, it must hold a value, stock level 
    // is held at 1, validates checks to see if its true or not
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isInt: true,
      },
    },
    // the category id is represented by a number 
    category_id: {
      type: DataTypes.INTEGER,
      //references the category & id from the key
      references: {
        model: 'category',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product',
  }
);

module.exports = Product;