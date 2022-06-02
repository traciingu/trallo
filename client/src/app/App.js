import './App.css';
import { useEffect, useContext } from 'react';
import { getBoard, loadBoard, setModalDisplay } from '../features/board/boardSlice';
import di from '../injection_container';
import { connect } from 'react-redux';
import { Modal, AppContainer } from './appStyles';


function App({ getBoard, loadBoard, setModalDisplay, boardId, modalDisplay }) {
  const { Board } = useContext(di);

  useEffect(() => {
    getBoard();
    setModalDisplay(false);
  }, []);

  useEffect(() => {
    if (boardId) {
      loadBoard(boardId);
    }
  }, [loadBoard, boardId]);


  return (
    <AppContainer className="App" >
      <Board />
      <Modal data-modal-type="card" className={modalDisplay ? '' : 'hide'}> I AM A MODAL</Modal>
    </AppContainer >
  );
}

const mapStateToProps = state => {
  return {
    boardId: state.board.id,
    modalDisplay: state.board.modalDisplay,
  }
}

const mdToProps = dispatch => {
  // const { loadBoard } = di;
  return {
    getBoard: () => { dispatch(getBoard()) },
    loadBoard: (id) => { dispatch(loadBoard(id)) },
    setModalDisplay: (info) => { dispatch(setModalDisplay(info)) },
  }
};

export default connect(mapStateToProps, mdToProps)(App);
