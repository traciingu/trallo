import Board from './Board';
import React from 'react';
// import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
// import { boardSlice } from './boardSlice';
// import TestRenderer from 'react-test-renderer';
// const { act, create } = TestRenderer;
import "@testing-library/jest-dom/extend-expect";
import { cleanup, fireEvent, render, getNodeText } from "@testing-library/react";
import configureStore from 'redux-mock-store';
import { updateBoard } from './boardSlice';
import { updateList } from '../list/listSlice';

const mockStore = configureStore([]);

const renderComponent = (state) => {
  const store = mockStore(state)
  return [
    render(
      <Provider store={store}>
        <Board />
      </Provider>
    ),
    store,
  ]
}

// let container;
// let store;

// beforeEach(() => {
//   container = document.createElement('div');
//   document.body.appendChild(container);

//   // store = configureStore({reducer: boardSlice.reducer, preloadedState: {
//   //   board: {title: "Board Test", id: "BoardId123"},
//   //   lists: {allIds: []},
//   //   cards: {allIds: []}
//   // }});
// });

// afterEach(() => {
//   document.body.removeChild(container);
//   container = null;
// });


describe("Board", () => {
  it("gets Board title from Redux store", () => {
    const [{ getByText }, store] = renderComponent({
      board: { title: "Board Test", id: "BoardId123" },
      lists: { allIds: [] },
      cards: { allIds: [] }
    });

    expect(getByText("Board Test")).toBeTruthy();



    // store = configureStore({
    //   reducer: boardSlice.reducer, preloadedState: {
    //     board: { title: "Board Test", id: "BoardId123" },
    //     lists: { allIds: [] },
    //     cards: { allIds: [] }
    //   }
    // });

    // let root;

    // act(() => {
    //   root = create(<Provider store={store}><Board /> </Provider>);
    // });

    // expect(root.toJSON()[0].children[0].children).toEqual(["Board Test"]);
  })

  it("calls Redux thunk after list is dropped", () => {
    // store = configureStore({
    //   reducer: boardSlice.reducer, preloadedState: {
    //     board: { title: "Board Test", id: "BoardId123" },
    //     lists: { allIds: [] },
    //     cards: { allIds: [] }
    //   }
    // });

    // let root;

    // act(() => {
    //   root = create(<Provider store={store}><Board /> </Provider>);
    // });

    // expect(root.toJSON()[0].children[0].children).toEqual(["Board Test"]);
  })

});