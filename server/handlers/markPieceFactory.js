const {
  markPiece,
} = require('../gameManager');
const sendGames = require('../helpers/sendGames');

module.exports = ({ io, socket }) => ({
  selectedPosition,
}) => {
  markPiece({
    player: socket,
    selectedPosition,
  });
  sendGames(io);
};
