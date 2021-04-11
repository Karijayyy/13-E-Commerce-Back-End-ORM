// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tags');
const ProductTag = require('./ProductTag');

// found references in week 13/activity 25 

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: 'category_id',
});

// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE',
});

// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag,{
    through: { model: ProductTag },
    foreignKey: 'product_id'
  });
// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product,{
    through: { model: ProductTag },
    foreignKey: "tag_id"
  });

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};