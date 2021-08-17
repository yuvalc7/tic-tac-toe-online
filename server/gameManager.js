let nextGameId = 0;

const markPiece = require('./markPiece');

const games = [];

const getGameForPlayer = (player) => {
  return games.find((g) =>
    g.players.find((p) => p.socket === player)
  );
};

exports.getGames = () =>
  games.map((g) => {
    const { players, ...game } = g;
    return {
      ...game,
      numberOfPlayers: players.length,
    };
  });

exports.createGame = ({ player, name }) => {
  const game = {
    name,
    turn: 'X',
    players: [
      {
        socket: player,
        symbol: 'X',
      },
    ],
    id: nextGameId++,
    board: [
      [0, 0, 0],
      [0,0, 0],
      [0, 0, 0],
    ],
    winner: false,
  };
  games.push(game);
  return game;
};

exports.markPiece = ({
  player,
  selectedPosition,
}) => {
  const game = getGameForPlayer(player);
  markPiece({ game, selectedPosition });
};

exports.getGameById = (gameId) =>
  exports.getGames().find((g) => g.id === gameId);

exports.addPlayerToGame = ({ player, gameId }) => {
  const game = games.find((g) => g.id === gameId);

  game.players.push({
    symbol: 'O',
    socket: player,
  });

  return 'O';
};

exports.endGame = ({ player, winner }) => {
  
  const game = getGameForPlayer(player);
  // players might disconnect while in the lobby
  if (!game) return;
  games.splice(games.indexOf(game), 1);
  game.players.forEach((currentPlayer) => {

    if (winner) {
      game.winner = true;  
      currentPlayer.socket.emit('winner',winner);
    }
    if (player !== currentPlayer.socket ){
      currentPlayer.socket.emit('end-game');
    }
  });
};

exports.isGameOver = ({ player }) => {
  const game = getGameForPlayer(player);

  const winnerCondition = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

  let newArr = [];

  for(var i = 0; i < game.board.length; i++)
  {
      newArr = newArr.concat(game.board[i]);
  }
 
  let ans;
      winnerCondition.forEach(winnerArray => {
            if (newArr[winnerArray[0]] === newArr[winnerArray[1]] &&
              newArr[winnerArray[0]] === newArr[winnerArray[2]] &&
              newArr[winnerArray[0]] !== 0) {
              ans = true;
            }
          })
  let symbol =  game.turn === 'X' ? 'O' : 'X';    
  ans = ans ? symbol : false;   
  return ans;
};

