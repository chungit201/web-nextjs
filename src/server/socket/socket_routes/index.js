// const io = require('socket.io')();
// const jwt = require('jsonwebtoken');
// const eventHandlers = require('./eventHandlers');
// const {getUser, getUsers} = require("./eventHandlers");
//
// io.use((socket, next) => {
//   const token = socket.handshake.auth.token;
//   if (token) {
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) {
//         console.log(err);
//         return false;
//       }
//       console.log(decoded) // bar
//       socket.decoded = decoded;
//       let clients = eventHandlers.addToDB(decoded.sub, socket.id);
//       next();
//     });
//
//   } else {
//     next(new Error('Authentication error'));
//   }
//
// }).on('connection', (socket) => {
//   console.log("a user connected.");
//   //get user online
//   io.sockets.emit('/root/users/online', getUsers());
//
//   socket.on('/client/send-notification', (data) => {
//     console.log(data);
//     const user = getUser(data.receiver);
//     io.to(user.socketId).emit('/root/send-notification', {
//       sender: data.sender,
//       action: data.action,
//       types: data.types,
//       notificationBy: data.notificationBy
//     });
//   });
//
//   socket.on('/client/new_message', (data) => {
//     const user = getUser(data.receiver);
//     io.to(user.socketId).emit('/root/send-message', {
//       sender: data.sender,
//       message: data.message,
//     });
//   });
//
//   socket.on('/client/new_message/all', (data) => {
//     io.sockets.emit('/root/send-message/all', data);
//   });
//
//   socket.on('sendding-chat', () => {
//     socket.broadcast.emit('a-sendding-message')
//   })
//   socket.on('stop-sendding-chat', () => {
//     io.sockets.emit('a-stop-message');
//   });
//
//   socket.on('create', function (room) {
//     socket.join(room);
//     socket.to(room.name).emit("some event");
//   });
//
//   socket.on('disconnect', () => {
//     let clients = eventHandlers.onClientDisconnect(socket.id);
//     socket.broadcast.emit('root/update_socket_count', clients);
//   });
//
//
// });
//
// module.exports = io;