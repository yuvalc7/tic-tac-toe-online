
module.exports = ({ game, selectedPosition }) => {

  const {i,j} = selectedPosition
  const value = game.turn === "X" ? 1 : 2;
  if (game.board[i][j] != 0){return;}
  else{
    game.board[i][j] = value
  }
  game.turn = game.turn === 'X' ? 'O' : 'X'; 
};






