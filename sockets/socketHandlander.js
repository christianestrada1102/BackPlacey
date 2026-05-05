const socketHandlander = (io) => {
    io.on('connection', (socket) => {
        console.log('Cliente conectado:', socket.id)

        socket.emit('server-message', {
            message: 'Bienvenido al servidor en tiempo real'   
    })

        socket.on('client-message', (data) => {
        console.log('Mensaje del cliente:', data)

        io.emit('server-message', {
            message: data.message
        })
        })

    
    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id)
    })
    })
}

module.exports = socketHandlander