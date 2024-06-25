const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin,getCurrentUser} = require('./utils/users');

const app = express();
const server = http.createServer(app); // Create an HTTP server with the Express app
const io = socketio(server); // Attach Socket.io to the HTTP server

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';

// Run when a client connects
io.on('connection', (socket) => {
    socket.on('joinRoom',({username,room}) => {

        const user = userJoin(socket.id,username,room);

        socket.join(user.room);


    //Welcome current user
    socket.emit('message',formatMessage(botName,'Welcome to ChatCord!'));

    //Broadcast when a user connects
    socket.broadcast
    .to(user.room)
    .emit(
        'message',
        formatMessage(botName,`${user.username} has joined the chat`)
    );
    //{Broadcast basically means to everyone in the expect the user themselves}

    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        io.emit('message',formatMessage('USER',msg))
    });

    //Runs when client disconnects
    socket.on('disconnect',() => {
        io.emit('message',formatMessage(botName,'A user has left the chat'));
    });

});

// Use environment variable PORT or default to 3000
const PORT = process.env.PORT || 3000;


// Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
