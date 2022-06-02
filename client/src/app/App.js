import './App.css';
import { useEffect, useContext } from 'react';
import { getBoard, loadBoard } from '../features/board/boardSlice';
import di from '../injection_container';
import { connect } from 'react-redux';
import { Modal, AppContainer } from './appStyles';
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
    <AppContainer className="App" >
      <Board />
      <Modal data-modal-type="card" className='hide' />
    </AppContainer >
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
