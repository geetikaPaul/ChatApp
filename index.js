const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var cassandra = require('cassandra-driver')
var client = new cassandra.Client({ contactPoints: ['localhost'], localDataCenter: 'datacenter1' })

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

io.on('connection', (socket) => {
    socket.on('join', function (data) {    
      socket.join(data.username);
      console.log(data.username + ' joined');

    var userId = 0
    client.execute("select * from chatApp.User where name = '" + data.username+"'", function (err, result) {
      if (err) throw err
      //userId = result.rows[0].userId;
      console.log(result.rows[0].userId);
    })

    console.log('user id '+userId);
    client.execute("select * from chatApp.message where status = 'not sent' and receiver = " + userId, function (err, result) {
      if (err) throw err
      console.log(result.rows[0])
    })

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