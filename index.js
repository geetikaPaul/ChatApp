const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var cassandra = require('cassandra-driver');
const { resolve } = require('url');
var client = new cassandra.Client({ contactPoints: ['localhost'], localDataCenter: 'datacenter1' })
var activeUsers = new Set()

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

app.get('/chat.html*', (req, res) => {
    var options = {
      username: req.query.username
    }
    res.sendFile(__dirname + '/chat.html', options);
});

io.on('connection', (socket) => {
    socket.on('join', function (data) {    
      socket.join(data.username);
      console.log(data.username + ' has joined');
      activeUsers.add(data.username)

      getCleanUpSentMessages(data.username);
    });
    
    socket.on('chat message', (data) => {
        console.log('message: ' + data.msg);
        //io.emit('chat message', msg);
        if(activeUsers.has(data.to))
          io.to(data.to).emit('chat message', data.from + ' : '+ data.msg);
        else
        {
          addMessage(data.to, data.from, data.msg);
        }
        io.to(data.from).emit('chat message', data.from + ' : ' +data.msg);
      });
  });

server.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});

function getMessagesForUser (username)  {
  return new Promise(resolve => {
    client.execute("select * from chatApp.messages2 where receiver = {username : '" + username+"', mobile : '123456'}", function (err, result) {
      if (err) throw err
      console.log('getting')
      result.rows.forEach(x => {
          x.messages.forEach(m => {
            console.log(m.txt);
            io.to(username).emit('chat message', x.sender.username + ' : '+ m.txt);
          });
      });
      resolve('resolved');
    });
  });
}

async function getCleanUpSentMessages(username) {
    const result = await getMessagesForUser(username);
    if(result == 'resolved')
    {
      client.execute("delete from chatApp.messages2 where receiver = {username : '" + username+"', mobile : '123456'}", function (err, result) {
        if (err) throw err
          console.log('successfully cleaned up')
        });
    }
}

function doesMessageExist(receiver, sender){
  let cnt = 0;
  return new Promise(resolve => {
    client.execute("select * from chatApp.messages2 where receiver = {username : '" + receiver+"', mobile : '123456'} and sender = {username : '" + sender+"', mobile : '789884'} LIMIT 1 ;", function (err, result) {
      if(err) throw err
      cnt = result.rows.length;
      console.log(cnt)
      resolve(cnt);
    });
  });
}

async function addMessage(receiver, sender, msg){
  const cnt = await doesMessageExist(receiver, sender)
  console.log('cnt ')
  console.log(cnt)
  if(cnt == 0) {
    client.execute("insert into chatApp.messages2 (receiver, sender, messages) values ({username:'"+receiver+"', mobile:'123456'},{username:'"+sender+"',mobile:'789884'},[{txt:'"+msg+"', time:'2015-04-19'}]);", function (err, result) {
      if (err) throw err
      console.log('successfully logged')
    });
  }

  else {
    client.execute("update chatApp.messages2 set messages = messages + [{txt:'"+msg+"', time:'2015-04-19'}] where receiver = {username : '" + receiver+"', mobile : '123456'} and sender = {username : '" + sender+"', mobile : '789884'} ;", function (err, result) {
      if (err) throw err
      console.log('successfully logged')
    });
 }
}