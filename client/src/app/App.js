import { useEffect, useContext } from 'react';
import { getBoard, loadBoard } from '../features/board/boardSlice';
import di from '../injection_container';
import { connect } from 'react-redux';
import { Modal, AppContainer } from './appStyles';


function App({ getBoard, loadBoard, boardId, modal }) {
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
      <Modal data-modal-type="card" className={modal.isDisplayed ? '' : 'hide'}>
        <h2 data-modal-property="title">
          {modal.title || ""}
        </h2>
        <p data-modal-property="description">{modal.description}</p>
      </Modal>
    </AppContainer >
  );
}

const mapStateToProps = state => {
  return {
    boardId: state.board.id,
    modal: state.board.modal,
  }
}

const mdToProps = dispatch => {
  return {
    getBoard: () => { dispatch(getBoard()) },
    loadBoard: (id) => { dispatch(loadBoard(id)) },
  }
};

export default connect(mapStateToProps, mdToProps)(App);
