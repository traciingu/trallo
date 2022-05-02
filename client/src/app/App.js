import './App.css';
import '@atlaskit/css-reset';
import { useEffect, useContext } from 'react';
import { getBoard, loadBoard } from '../features/board/boardSlice';
import di from '../injection_container';
import { connect } from 'react-redux';
// import Board from '../features/board/Board';


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
    <div className="App">
      <Board />
    </div>
  );
}

const mapStateToProps = state => {
  return {
    boardId: state.board.id
  }
}

const mdToProps = dispatch => {
  // const { loadBoard } = di;
  return {
    getBoard: () => { dispatch(getBoard()) },
    loadBoard: (id) => { dispatch(loadBoard(id)); }
  }
};

export default connect(mapStateToProps, mdToProps)(App);
