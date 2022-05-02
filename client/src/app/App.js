import './App.css';
import '@atlaskit/css-reset';
import { useEffect, useContext } from 'react';
import { getBoard, loadBoard } from '../features/board/boardSlice';
import di from '../injection_container';
import { connect } from 'react-redux';
import Board from '../features/board/Board';


function App({ getBoard, loadBoard, boardId }) {
  // const { loadBoard } = di;

  useEffect(() => {
    getBoard();
  }, []);

  useEffect(() => {
    if (boardId) {
      loadBoard(boardId);
    }
  }, [loadBoard, boardId]);

  const styles = (comp, droppableStyle) => {
    switch (comp) {
      case "list":
        return {
          padding: "50px"
        };

      case "listContainer":

        return {
          display: "flex",
          justifyContent: "space-around",
          ...droppableStyle
        };
    }
  }

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
