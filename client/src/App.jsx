import React, { useEffect, useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import CreateNewGame from './CreateNewGame';
import Lobby from './Lobby';
import Game from './Game';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

import 'bootstrap/dist/css/bootstrap.min.css';

const PAGE_GAME = 'Game';
const PAGE_LOBBY = 'Lobby';
const PAGE_CREATE_NEW_GAME = 'CreateNewGame';

function App() {
  const [page, setPage] = useState('Lobby');
  const [games, setGames] = useState([]);
  const [symbol, setSymbol] = useState('');
  const [game, setGame] = useState({ board: [] });
  const [gameId, setGameId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalText, setModalText] = useState('');


  const joinGame = (gameId) => {
    socket.emit('join-game', gameId);
    setPage(PAGE_GAME);
    setGameId(gameId);
  };

  const markPiece =   ({ selectedPosition}) => {
     socket.emit('mark-piece', {selectedPosition});
     isWinner();
  };

  const isWinner = () => {
    socket.emit('check-if-winner-or-tie')
  }


  useEffect(() => {
    const game = games.find((g) => g.id === gameId);
    if (!game) {
      setGame({
        board: [],
      });
    } else {
      setGame(game);
    }
  }, [games, gameId]);

  const leaveGame = () => {
    setPage(PAGE_LOBBY);
    socket.emit('leave-game');
  };

  const createGame = (name) => {
    socket.emit('create-game', name);
    setPage(PAGE_GAME);
  };


  useEffect(() => {
    const newSocket = io('http://localhost:4000', {
      transports: ['websocket'],
    });
    newSocket.on('disconnect', () => {
      setGameId(null);
      setSymbol('');
      setPage(PAGE_LOBBY);
      alert('The server crashed or restarted');
    });
    newSocket.on('games', (games) => {
      setGames(games);
    });
    newSocket.on('game-created', (gameId) => {
      setGameId(gameId);
    });
    newSocket.on('symbol', (symbol) => setSymbol(symbol));
    newSocket.on('end-game', () => {
      setGameId(null);
      setGame({board:[]})
      setSymbol('');
      setPage(PAGE_LOBBY);
      setShowModal(true);
      setModalText('Your opponent has left the game');
      setModalTitle('Game Over');
    });
    newSocket.on('winner', (winner) => {
      alert(`${winner} has won the game!`);
      setGameId(null);
      setGame({board:[]})
      setSymbol('');
      setPage(PAGE_LOBBY);
    });

    newSocket.on("tie", () => {
      alert(`Tie !! game over !`);
      setGameId(null);
      setGame({ board: [] });
      setSymbol("");
      setPage(PAGE_LOBBY);
    });

    setSocket(newSocket);
  }, []);

  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <Navbar className="mb-4" bg="dark" variant="dark">
        <Navbar.Brand href="#home">
          Online tic tac toe
        </Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link onClick={() => setPage(PAGE_LOBBY)}>
            Lobby Games
          </Nav.Link>
        </Nav>
      </Navbar>
      <Container>
        <Row>
          <Col>
            {page === PAGE_LOBBY && (
              <Lobby
                games={games}
                setPage={setPage}
                joinGame={joinGame}
              />
            )}
            {page === PAGE_CREATE_NEW_GAME && (
              <CreateNewGame createGame={createGame} />
            )}
            {page === PAGE_GAME && game && (
              <Game
                symbol={symbol}
                game={game}
                leaveGame={leaveGame}
                markPiece={markPiece}
              />
            )}
          </Col>
        </Row>
      </Container>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalText}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleCloseModal}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
