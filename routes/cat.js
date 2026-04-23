const express = require('express');
const router = express.Router();

const {
getCat,
getCatById,
createCat,
updateCat,
deleteCat
} = require('../controllers/cat');

router.get('/', getCat);
router.get('/:id', getCatById);
router.post('/', createCat);
router.put('/:id', updateCat);
router.delete('/:id', deleteCat);

module.exports = router;