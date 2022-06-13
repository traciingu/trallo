import { useEffect, useContext } from 'react';
import { getBoard, loadBoard } from '../features/board/boardSlice';
import di from '../injection_container';
import { connect } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { AppContainer } from './appStyles';


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
        <Route path="/" >
          <Route index element={<Board />} />
        </Route>
      </Routes>
      {/* <Board/> */}
    </AppContainer >
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
