const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint
// this finds all of the categories,  if it's good then it'll work if not it'll send an error
router.get('/', async (req, res) => {
  try {
    const allCategories = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(allCategories);
  } catch (err) {
    res.status(500).json(err);
  }
});

// finds just 1 category if it's good then it'll work if not it'll send an error
router.get('/:id', async (req, res) => {
  try {
    const singleCategory = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!singleCategory) {
      res.status(404).json({ message: 'No category associated with the id' });
      return;
    }
    res.status(200).json(singleCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

// creates a new category if it's good then it'll work if not it'll send an error
router.post('/', async (req, res) => {
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// updates an existing category if it's good then it'll work if not it'll send an error
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.update(
      {
        category_name: req.body.category_name,
      },
      {
        where: {
          id: req.params.id,
        },
      });
    res.status(200).json(req.params.id);
  } catch (err) {
    res.status(500).json(err);
  };
});

// deletes a category if it's good then it'll work if not it'll send an error
router.delete('/:id', async (req, res) => {
  try {
    const deleteCategory = await Category.destroy({
      where: { id: req.params.id, },
    });
    if (!deleteCategory) {
      res.status(404).json({ message: 'No category found' });
      return;
    }
    res.status(200).json(req.params.id);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
