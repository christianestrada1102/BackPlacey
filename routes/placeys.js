const express = require('express')
const router = express.Router()

const upload = require('../middlewares/upload')

const {
getPlaceys,
getPlaceyById,
createPlacey,
updatePlacey,
deletePlacey
} = require('../controllers/placeys')

router.get('/', getPlaceys)
router.get('/:id', getPlaceyById)
router.post('/', upload.single ("imagePlace"), createPlacey)
router.put('/:id', updatePlacey)
router.delete('/:id', deletePlacey)

module.exports = router