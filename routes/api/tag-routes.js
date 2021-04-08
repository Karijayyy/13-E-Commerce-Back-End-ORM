const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint
// find all tags, if it can't find it then it'll send an error
router.get('/', async (req, res) => {
  try {
    const everyProduct = await Tag.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(everyProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// this finds a single product & its associated category & tag data
router.get('/:id', async (req, res) => {
  try {
    const singleTags = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!singleTags) {
      res.status(404).json({ message: 'There is no product associated with this id' });
      return;
    }
    res.status(200).json(singleTags);
  } catch (err) {
    res.status(500).json(err);
  }
});


// creates new tag & if its good sends 200 if its not working gets an error
router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(200).json(newTag);
  } catch (err) {
    res.status(400).json(err);
  }
});

// updates a tag & if its good it'll go through and if not then sends an error 
router.put('/:id', async (req, res) => {
  try {
    const updatedTag = await Tag.update(
      {
        tag_name: req.body.tag_name,
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

// deletes tag, if its good it'll work and if its bad then send an error
router.delete('/:id', async (req, res) => {
  try {
    const deleteTag = await Tag.destroy({
      where: { id: req.params.id, },
    });
    if (!deleteTag) {
      res.status(404).json({ message: 'Theres no tag associated with this id' });
      return;
    }
    res.status(200).json(req.params.id);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;