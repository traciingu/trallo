import { useEffect, useContext } from 'react';
import { getBoard } from '../features/board/boardSlice';
import di from '../injection_container';
import { connect } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { AppContainer } from './appStyles';
import PageTemplate from '../features/page-template/PageTemplate';


function App({ getBoard }) {
  const { Board } = useContext(di);

  useEffect(() => {
    // getBoard();
  }, []);



  return (
    <AppContainer className="App" >
      <Routes>
        <Route path="/" element={<PageTemplate/>}>
          <Route path="home" element={<div><h1>Home title</h1></div>} />
          <Route path="b/:boardId" element={<Board />} />
        </Route>
      </Routes>
    </AppContainer>
  );
}


const mdToProps = dispatch => {
  return {
    getBoard: () => { dispatch(getBoard()) },
  }
};

export default connect(null, mdToProps)(App);
