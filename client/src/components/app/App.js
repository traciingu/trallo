import './App.css';
import '@atlaskit/css-reset';
import { useEffect, useContext } from 'react';
import { loadBoard } from '../../store/index';
import di from '../injection_container';
import { connect } from 'react-redux';
import Board from '../features/board/Board';


function App({loadBoard}) {
  // const { loadBoard } = di;

  useEffect(() => {
    loadBoard("625a2e6ea978638034ee3850");
  }, [loadBoard]);

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

const mdToProps = dispatch => {
  // const { loadBoard } = di;
  return {
    loadBoard: (id) => { dispatch(loadBoard(id)); }
  }
};

export default connect(null, mdToProps)(App);
