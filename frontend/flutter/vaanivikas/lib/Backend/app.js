// const express = require('express');

// const app = express();
// const PORT = process.env.PORT || 4000;
// const server = app.listen(PORT,()=>{
//     console.log('server is started.', PORT);
// });

// const io = require('socket.io')(server);

// io.on('connection',(socket)=>{
//     console.log('connected.', socket.id);
//     socket.on('disconnect', () => {
//         console.log('disconnected', socket.id);

//     });

//     socket.on('message',(data)=> {
//         console.log(data);
//         socket.broadcast.emit('message-receive',data);

//     });
// });



// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');

// const app = express();
// const server = http.createServer(app);

// // Enable CORS
// app.use(cors());

// // Initialize Socket.IO server with CORS
// const io = new Server(server, {
//   cors: {
//     origin: "*", // Allow all origins for development
//     methods: ["GET", "POST"],
//   },
// });

// // Socket.IO connection
// io.on('connection', (socket) => {
//   console.log(`New client connected: ${socket.id}`);

//   // Listen for messages from the client
//   socket.on('message', (data) => {
//     console.log(`Message received: ${JSON.stringify(data)}`);
//     // Broadcast message to all other clients
//     socket.broadcast.emit('message-receive', data);
//   });

//   // Disconnect
//   socket.on('disconnect', () => {
//     console.log(`Client disconnected: ${socket.id}`);
//   });
// });

// // Test route to check server
// app.get('/', (req, res) => {
//   res.json({ message: "Server is running and Socket.IO is ready!" });
// });

// // Start server
// const PORT = 4000;
// server.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

const express = require('express');

const app = express();
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log('Server started on port', PORT);
});

const io = require('socket.io')(server);

let connectedUsers = 0; // Track connected users

// When a new user connects
io.on('connection', (socket) => {
  connectedUsers++; // Increment user count
  console.log('User connected. Total connected users: ', connectedUsers);

  // Emit the current user count to all connected clients
  io.emit('user-count', connectedUsers);

  // Handle disconnection
  socket.on('disconnect', () => {
    connectedUsers--; // Decrement user count
    console.log('User disconnected. Total connected users: ', connectedUsers);
    
    // Emit the updated user count to all connected clients
    io.emit('user-count', connectedUsers);
  });

  // Handle incoming messages
  socket.on('message', (data) => {
    console.log(data);
    socket.broadcast.emit('message-receive', data); // Broadcast to others
  });
});
