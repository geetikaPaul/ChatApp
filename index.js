const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

io.on('connection', (socket) => {
    socket.on('join', function (data) {    
      socket.join(data.username);
      console.log(data.username + ' joined');
    });

    socket.on('chat message', (data) => {
        console.log('message: ' + data.msg);
        //io.emit('chat message', msg);
        io.to(data.to).emit('chat message', data.from + ' : '+ data.msg);
        io.to(data.from).emit('chat message', data.from + ' : ' +data.msg);
      });
  });

server.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});