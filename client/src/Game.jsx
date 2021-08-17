import React, { useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import classNames from 'classnames';

import './Game.css';

export default function Game({
  leaveGame,
  markPiece,
  game,
  symbol,
}) {

  useEffect(() => {
    return () => leaveGame();
  },[]);

  const dropSelectedPiece = (i, j) => {

    if (game.turn !== symbol) return;
    if (game.board[i][j] !== 0) return;
    markPiece({
      selectedPosition: {
        i,
        j
      },
    });
    
  };


  const renderBoard = () => {
    return (
      <div className="board">
        {game.board.map((row, i) => (
          <div key={i} className="row">
            {row.map((piece, j) => (
              <div
                key={`${i} ${j}`}
                className={classNames('cell')}
                onClick={() => dropSelectedPiece(i, j)}
              >
                {piece !== 0 && (
                  <div
                  className="symbol"
                  >
                    {piece === 1 ? "X" : "O"}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };


  const isGameStarted = () => game.numberOfPlayers === 2;

  const renderWaiting = () => {
    return (
      <Col>
        <div className="text-center">
          <h2 className="mb-4">{game.name}</h2>
          <div className="mb-4">
            <Spinner animation="border" role="status" />
          </div>
          <span>Waiting for an opponent....</span>
        </div>
      </Col>
    );
  };

  const renderGame = () => {
    return (
      <>
        <Col>
          <div>Your piece symbol is {symbol}</div>
          {game.turn === symbol && (
            <div>It is your turn!</div>
          )}
          {game.turn !== symbol && (
            <div>Waiting for opponent!</div>
          )}
          {renderBoard()}
        </Col>
      </>
    );
  };

  return (
    <Row>
      {!isGameStarted() && renderWaiting()}
      {isGameStarted() && renderGame()}
    </Row>
  );
}
