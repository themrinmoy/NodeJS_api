let io;

module.exports = {
    init: httpsServer => {
        io = require('socket.io')(httpsServer, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"]
            }
        });
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!')
        }
        return io;
    }
}