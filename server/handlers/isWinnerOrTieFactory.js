const {
    isGameOver,
    endGame,
  } = require('../gameManager');


module.exports = ({ socket }) => () => {
  const winner = isGameOver({ player: socket });

  if (winner !== false) {
    endGame({ player: socket, winner });
  }
}
