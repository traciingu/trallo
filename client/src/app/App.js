import { useEffect, useContext } from 'react';
import { getBoard, loadBoard } from '../features/board/boardSlice';
import di from '../injection_container';
import { connect } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { AppContainer } from './appStyles';
import Navbar from '../features/navbar/Navbar';


function App({ getBoard, loadBoard, boardId }) {
  const { Board } = useContext(di);

  useEffect(() => {
    getBoard();
  }, []);

  useEffect(() => {
    if (boardId) {
      loadBoard(boardId);
    }
  }, [loadBoard, boardId]);

  return (
    <AppContainer className="App" >
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route path="home" element={<div></div>} />
          <Route path="b">
            <Route path=":boardId" element={<Board />} />
          </Route>
        </Route>
      </Routes>
    </AppContainer>
  );
}

const mapStateToProps = state => {
  return {
    boardId: state.board.id,
  }
}

const mdToProps = dispatch => {
  return {
    getBoard: () => { dispatch(getBoard()) },
    loadBoard: (id) => { dispatch(loadBoard(id)) },
  }
};

export default connect(mapStateToProps, mdToProps)(App);
