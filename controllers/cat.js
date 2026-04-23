const db =  require ('../config/db')


const getCat = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categorias')
        res.json(rows)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener categorias' })
    }
}

const getCatById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categorias WHERE id_cat = ?', [req.params.id])
        if (rows.length === 0) return res.status(404).json({ error: 'Categoria no encontrada' })
        res.json(rows[0])
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la categoria' })
    }
}

const createCat = async (req, res) => {
    try {
        const { name_cat, icono } = req.body
        if (!name_cat || name_cat.trim() === '') return res.status(400).json({ error: 'El nombre de la categoria es obligatorio' })
            
        const [result] = await db.query('INSERT INTO categorias (nombre_cat, icono) VALUES (?, ?)', [name_cat, icono])
        const [newcat] = await db.query('SELECT * FROM categorias WHERE id_cat = ?', [result.insertId])
        res.status(201).json(newcat[0])
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la categoria' })
    }
}

const updateCat = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const { name_cat, icono } = req.body
        const [existing] = await db.query('SELECT * FROM categorias WHERE id_cat = ?', [id])

        if (existing.length === 0) return res.status(404).json({ error: 'Categoria no encontrada' })
        await db.query('UPDATE categorias SET nombre_cat = ?, icono = ? WHERE id_cat = ?', [name_cat, icono, id])
        const [updated] = await db.query('SELECT * FROM categorias WHERE id_cat = ?', [id])
        res.json({ message: 'Categoria actualizada', cat: updated[0] })
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la categoria' })
    }
}

const deleteCat = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const [existing] = await db.query('SELECT * FROM categorias WHERE id_cat = ?', [id])

        if (existing.length === 0) return res.status(404).json({ error: 'Categoria no encontrada' })
        await db.query('DELETE FROM categorias WHERE id_cat = ?', [id])
        res.json({ message: 'Categoria eliminada', cat: existing[0] })
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la categoria' })
    }
}

module.exports = {
    getCat,
    getCatById,
    createCat,
    updateCat,
    deleteCat
};