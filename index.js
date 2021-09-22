const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var cassandra = require('cassandra-driver')
var client = new cassandra.Client({ contactPoints: ['localhost'], localDataCenter: 'datacenter1' })
var activeUsers = new Set()

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

io.on('connection', (socket) => {
    socket.on('join', function (data) {    
      socket.join(data.username);
      console.log(data.username + ' has joined');
      activeUsers.add(data.username)

    client.execute("select * from chatApp.messages where receiver = {username : '" + data.username+"', mobile : '123456'}", function (err, result) {
        if (err) throw err
        result.rows.forEach(x => {
            x.messages.forEach(m => {
              console.log(m.txt);
              io.to(data.username).emit('chat message', x.sender.username + ' : '+ m.txt);
            });
        });
      });

      client.execute("delete from chatApp.messages where receiver = {username : '" + data.username+"', mobile : '123456'}", function (err, result) {
        if (err) throw err
        console.log('successfully cleaned up')
      });
    });

    socket.on('chat message', (data) => {
        console.log('message: ' + data.msg);
        //io.emit('chat message', msg);
        if(activeUsers.has(data.to))
          io.to(data.to).emit('chat message', data.from + ' : '+ data.msg);
        else
        {
          client.execute("insert into chatApp.messages (receiver, sender, messages) values ({username:'"+data.to+"', mobile:'123456'},{username:'"+data.from+"',mobile:'789884'},[{txt:'"+data.msg+"', time:'2015-04-19'}]);", function (err, result) {
            if (err) throw err
            console.log('successfully logged')
          });
        }
        io.to(data.from).emit('chat message', data.from + ' : ' +data.msg);
      });
  });

server.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});