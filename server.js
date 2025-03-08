const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 3000;

// Serve static files
app.use(express.static('./'));

// Store messages in memory (in a real app, this would be a database)
const messages = [];

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Send existing messages to newly connected users
    socket.emit('previous-messages', messages);

    // Handle new messages
    socket.on('send-message', (message) => {
        messages.push(message);
        io.emit('new-message', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

http.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});