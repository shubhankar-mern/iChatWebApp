const express = require('express');
const path = require('path');
const port = 5000 || process.env.PORT;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server started in ${port}`);
  }
});
const io = require('socket.io')(server);

let socketsConnected = new Set();

io.on('connection', onConnected);

function onConnected(socket) {
  console.log(socket.id);
  socketsConnected.add(socket.id);

  io.emit('clients-total', socketsConnected.size);

  socket.on('disconnect', () => {
    console.log('socket-disconnected ', socket.id);
    socketsConnected.delete(socket.id);
    io.emit('clients-total', socketsConnected.size);
  });

  socket.on('message', (data) => {
    console.log(data);
    socket.broadcast.emit('chat-message', data);
  });

  socket.on('feedback', (data) => {
    socket.broadcast.emit('feedback', data);
  });
}
