const db = require('../config/db')
const cloudinary = require ('../config/cloudinary')
const streamifier = require('streamifier')


const getPlaceys = async (req, res) => {
    try {
        const [rows] = await db.query(`
        SELECT p.*, u.nombre AS nombre_usuario 
        FROM placeys p 
        JOIN usuarios u ON p.id_user = u.id_user`)
        res.json(rows)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener placeys',
            message: error.message
        })

    }
}



const getPlaceyById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM placeys WHERE id_placey = ?', [req.params.id])

        if (rows.length === 0) return res.status(404).json({ error: 'Placey no encontrado' })
        res.json(rows[0])
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el placey' })
    }
}


const createPlacey = async (req, res) => { 
    try {

        console.log("FILE", req.file)
        console.log("BODY", req.body)
        console.log("IMAGE:", req.file?.filename)

        const { id_user, id_cat, name_place, description, address } = req.body

        if (!req.file) {
            return res.status(400).json({ error: 'La imagen es obligatoria' })
        }

        const uploadFromBuffer = (buffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder : 'placeys' },
                    (error, result) => {
                        if (result) resolve(result)
                            else reject(error)
                    }
                )

                streamifier.createReadStream(buffer).pipe(stream)
            })
        }

        const uploadResult = await uploadFromBuffer(req.file.buffer)
        const image = uploadResult.secure_url


        
        if (!name_place || name_place.trim() === '') return res.status(400).json({ error: 'El nombre del placey es obligatorio' })
        const [result] = await db.query(
            'INSERT INTO placeys (id_user, id_cat, nombre_place, descripcion, direccion, url_img) VALUES (?, ?, ?, ?, ?, ?)',
            [id_user, id_cat, name_place, description, address, image]
        )
        const [newplacey] = await db.query('SELECT * FROM placeys WHERE id_placey = ?', [result.insertId])
        res.status(201).json(newplacey[0])
    } catch (error) {
        message: error.message
        console.error(error)
        res.status(500).json({ error: 'Error al crear el placey',
        message:error.message
        })
 
    }
}

const updatePlacey = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const { name_place, description, address, id_cat } = req.body
        const [existing] = await db.query('SELECT * FROM placeys WHERE id_placey = ?', [id])
       
        if (existing.length === 0) return res.status(404).json({ error: 'Placey no encontrado' })
        await db.query(
            'UPDATE placeys SET nombre_place = ?, descripcion = ?, direccion = ?, id_cat = ? WHERE id_placey = ?',
            [name_place, description, address, id_cat, id]
        )
        const [updated] = await db.query('SELECT * FROM placeys WHERE id_placey = ?', [id])
        res.json({ message: 'Placey actualizado', placey: updated[0] })
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el placey' })    
    }
}

const deletePlacey = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const [existing] = await db.query('SELECT * FROM placeys WHERE id_placey = ?', [id])
        
        if (existing.length === 0) return res.status(404).json({ error: 'Placey no encontrado' })
        await db.query('DELETE FROM placeys WHERE id_placey = ?', [id])
        res.json({ message: 'Placey eliminado', placey: existing[0] })
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el placey' })
    }
}

module.exports = {
    getPlaceys,
    getPlaceyById,
    createPlacey,
    updatePlacey,
    deletePlacey
}