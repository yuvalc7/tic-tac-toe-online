const { createGame } = require('../gameManager');
const sendGames = require('../helpers/sendGames');

module.exports = ({ io, socket }) => (name) => {
  const game = createGame({ player: socket, name });
  sendGames(io);
  socket.emit('game-created', game.id);
  socket.emit('symbol', 'X');
};
