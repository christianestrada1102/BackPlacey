//importa la libreria
const express = require('express');
//intanciar la app
const app = express();
//aca le decimos middelware para json
app.use(express.json())
//configurar el puerto (Por convicion es el 3000)
const usersRoutes = require('./routes/users')
const placeysRoutes = require('./routes/placeys')
const catRoutes = require('./routes/cat')
const cors = require('cors')
const authRoutes = require('./routes/auth')

const http = require('http')
const { Server } = require('socket.io')
const socketHandlander = require('./sockets/socketHandlander.js')

app.use(cors())
app.use('/users', usersRoutes)
app.use('/placeys', placeysRoutes)
app.use('/cat', catRoutes)
app.use('/auth', authRoutes)
app.use('/uploads', express.static('uploads'))

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5174',
        methods: ['GET', 'POST']
    }
})

        socketHandlander(io)


const db = require ('./config/db')
const PORT = process.env.PORT || 3014

const testDBConnectionAndStart = async () => {
    try {
        await db.query('SELECT 1')
        console.log('DB conectada pa')
        server.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error('Error conectando la BD:', error.message)
        process.exit(1)
    }
}

testDBConnectionAndStart()