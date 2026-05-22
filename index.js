//importa la libreria
const express = require('express');
//intanciar la app
const app = express()
//aca le decimos middelware para json
const cors = require('cors')


app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://front-placey.vercel.app",
        "https://front-placey-pfzdgr5lg-christians-projects-f256bbbc.vercel.app"

    ], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

app.get('/', (req, res) => {
    res.json({message: 'Placey Corrienod al 100'})
})


//configurar el puerto (Por convicion es el 3000)
const usersRoutes = require('./routes/users')
const placeysRoutes = require('./routes/placeys')
const catRoutes = require('./routes/cat')
const authRoutes = require('./routes/auth')

const paymentRoutes = require('./routes/payment')


app.use('/users', usersRoutes)
app.use('/placeys', placeysRoutes)
app.use('/payments', paymentRoutes)
app.use('/cat', catRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 3014

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`)
    })
}

module.exports = app