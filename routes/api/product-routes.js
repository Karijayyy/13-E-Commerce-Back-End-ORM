const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// gets all products from api products, if it's good then it'll work if not it'll send an error
router.get('/', async (req, res) => {
  try {
    const allProducts = await Product.findAll({
      include: [{ model: Tag, through: ProductTag, foreignKey: 'product_id' }],
    });
    res.status(200).json(allProducts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// gets just one product, if it's good then it'll work if not it'll send an error
// finds a single product 
router.get('/:id', async (req, res) => {
  try {
    const singleProduct = await Product.findByPk(req.params.id, {
      include: [{ model: Tag, through: ProductTag, foreignKey: 'product_id' }],
    });

    if (!singleProduct) {
      res.status(404).json({ message: 'There inst a product associated with this id' });
      return;
    }
    res.status(200).json(singleProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// creates a new product
router.post('/', (req, res) => {

  // creates the products
  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const updatedProductTagId = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(updatedProductTagId);
      }
      // if its good it'll work if not send err 
      res.status(200).json(product);
    })
    .then((updatedProductTagId) => res.status(200).json(updatedProductTagId))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

//updates products
router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
  // finds all tags from ProductTag
    .then((product) => {
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    // gets current tag_ids
    .then((productTags) => {
      const updatedProductTagId = productTags.map(({ tag_id }) => tag_id);
      // creates new product tags
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !updatedProductTagId.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // this removes the old tags
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // this creates & destroys tags
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // deletes single product by its id 
  try {
    const deleteProducts = await Product.destroy({
      where: { id: req.params.id, },
    });
    if (!deleteProducts) {
      res.status(404).json({ message: 'There isnt a product associated with this id ' });
      return;
    }
    res.status(200).json(req.params.id);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;