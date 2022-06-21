import { useContext } from 'react';
import di from '../injectionContainer';
import { Routes, Route } from 'react-router-dom';
import { AppContainer } from './appStyles';
import PageTemplate from '../features/page-template/PageTemplate';
import Homepage from '../features/homepage/Homepage';


function App() {
  const { Board } = useContext(di);

  return (
    <AppContainer className="App" >
      <Routes>
        <Route path="/" element={<PageTemplate/>}>
          <Route path="home" element={<Homepage/>} />
          <Route path="b/:boardId" element={<Board />} />
        </Route>
      </Routes>
    </AppContainer>
  );
}

export default App;
