const db = require('../config/db')

const getUsers = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM usuarios')
        res.json(rows)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios' })
    }
}

const getUserById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE id_user = ?', [req.params.id])
        if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' })
        res.json(rows[0])
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el usuario' })
    }
}

const createUser = async (req, res) => {
    try {
        const { name, email } = req.body
        if (!name || name.trim() === '') return res.status(400).json({ error: 'El nombre es obligatorio' })
        if (!email || email.trim() === '') return res.status(400).json({ error: 'El email es obligatorio' })
        const [result] = await db.query('INSERT INTO usuarios (nombre, email, contraseña) VALUES (?, ?, ?)', [name, email, '1234'])
        const [newuser] = await db.query('SELECT * FROM usuarios WHERE id_user = ?', [result.insertId])
        res.status(201).json(newuser[0])
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el usuario' })
    }
}

const updateUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const { name, email } = req.body
        const [existing] = await db.query('SELECT * FROM usuarios WHERE id_user = ?', [id])
        if (existing.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' })
        await db.query('UPDATE usuarios SET nombre = ?, email = ? WHERE id_user = ?', [name, email, id])
        const [updated] = await db.query('SELECT * FROM usuarios WHERE id_user = ?', [id])
        res.json({ message: 'Usuario actualizado', user: updated[0] })
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el usuario' })
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const [existing] = await db.query('SELECT * FROM usuarios WHERE id_user = ?', [id])
        if (existing.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' })
        await db.query('DELETE FROM usuarios WHERE id_user = ?', [id])
        res.json({ message: 'Usuario eliminado', user: existing[0] })
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el usuario' })
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}