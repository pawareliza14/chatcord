const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app); // Create an HTTP server with the Express app
const io = socketio(server); // Attach Socket.io to the HTTP server

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when a client connects
io.on('connection', socket => {
    console.log(`New WS connection`);

    socket.emit('message','Welcome to ChatCord!');
});

// Use environment variable PORT or default to 3000
const PORT = process.env.PORT || 3000;


// Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
