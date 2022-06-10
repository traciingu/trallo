import { useEffect, useContext, useState } from 'react';
import { getBoard, loadBoard } from '../features/board/boardSlice';
import di from '../injection_container';
import { connect } from 'react-redux';
import { Modal, AppContainer } from './appStyles';


function App({ getBoard, loadBoard, boardId, modal }) {
  const { Board } = useContext(di);

  const [canEdit, setCanEdit] = useState(false);

  const [modalEditCardTitle, setModalEditCardTitle] = useState(modal.title);

  const handleClick = () => {
    setCanEdit(true);
    setModalEditCardTitle(modal.title);
  }

  const handleChange = (e) => {
    setModalEditCardTitle(e.target.value);
  }

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
        {
          canEdit ?
            <input type="text" data-modal-edit-property="title" value={modalEditCardTitle} onChange={handleChange} />
            :
            <h2 data-modal-property="title" onClick={handleClick}>
              {modal.title || ""}
            </h2>
        }
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
