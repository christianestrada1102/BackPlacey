const express = require('express');
const router = express.Router();

const {
getPlaceys,
getPlaceyById,
createPlacey,
updatePlacey,
deletePlacey
} = require('../controllers/placeys');

router.get('/', getPlaceys);
router.get('/:id', getPlaceyById);
router.post('/', createPlacey);
router.put('/:id', updatePlacey);
router.delete('/:id', deletePlacey);

module.exports = router;