const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  transports: ['websocket'],
});

const markPieceFactory = require('./handlers/markPieceFactory');
const leaveGameOrDisconnectFactory = require('./handlers/leaveGameOrDisconnectFactory');
const createGameFactory = require('./handlers/createGameFactory');
const joinGameFactory = require('./handlers/joinGameFactory');

const isWinnerOrTieFactory = require('./handlers/isWinnerOrTieFactory');

const sendGames = require('./helpers/sendGames');

io.on('connection', (socket) => {
  sendGames(socket);

  socket.on(
    'disconnect', leaveGameOrDisconnectFactory({ io, socket })
  );

  socket.on('mark-piece', markPieceFactory({ io, socket }));

  socket.on('check-if-winner-or-tie', isWinnerOrTieFactory({ socket}));

  socket.on('leave-game', leaveGameOrDisconnectFactory({ socket, io }));

  socket.on(
    'create-game',
    createGameFactory({ io, socket })
  );

  socket.on('join-game', joinGameFactory({ io, socket }));
});

http.listen(4000, () => {
  console.log('listening on *:4000');
});
