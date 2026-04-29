const db = require('../config/db')
const fs = require("node:fs")

const getPlaceys = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM placeys')
        res.json(rows)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener placeys' })
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

function saveImage(file) {
    const newPath = `./uploads/${Date.now()}-${file.originalname}`
    fs.renameSync(file.path, newPath)
    return newPath
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

        const image = saveImage(req.file)
        
        if (!name_place || name_place.trim() === '') return res.status(400).json({ error: 'El nombre del placey es obligatorio' })
        const [result] = await db.query(
            'INSERT INTO placeys (id_user, id_cat, nombre_place, descripcion, direccion, url_img) VALUES (?, ?, ?, ?, ?, ?)',
            [id_user, id_cat, name_place, description, address, image]
        )
        const [newplacey] = await db.query('SELECT * FROM placeys WHERE id_placey = ?', [result.insertId])
        res.status(201).json(newplacey[0])
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el placey' })
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