const db = require('../config/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    try {
        const { nombre, email, contraseña } = req.body
       
        if (!nombre || ! email || !contraseña) {
            return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios' })
        }

        const [existingUser] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email])

        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'El email ya está registrado' })
        }

        const passwordHash = await bcrypt.hash(contraseña, 10)

        const [result] = await db.query('INSERT INTO usuarios (nombre, email, contraseña) VALUES (?, ?, ?)',
             [nombre, email, passwordHash]
            )

        res.status(201).json({ message: 'Usuario registrado exitosamente',
             userId: result.insertId, 
            nombre, 
            email
        })


    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al registrar el usuario' })
    }
}

const login = async (req, res) => {
    try {
        const { email, contraseña } = req.body

        if (!email || !contraseña) {
            return res.status(400).json({ error: 'Email y contraseña son obligatorios' })
        }

        const [users] = await db.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        )

        if (users.length === 0) {
            return res.status(401).json({ error: 'Credenciales incorrectas' })
        }

        const user = users[0]

        const passwordOk = await bcrypt.compare(contraseña, user.contraseña)

        if (!passwordOk) {
            return res.status(401).json({
                error: 'Credenciales incorrectas'
            })
        }

        const token = jwt.sign(
            {
                userId: user.id_user,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h'
            }
        )

        res.json({ message: 'Login correcto',
             token,
             user: {
                id_user: user.id_user,
                nombre: user.nombre,
                email: user.email
             }

             })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al iniciar sesión' })
    }
}

module.exports = {
    register,
    login
}