import Board from './Board';
import React from 'react';
import { render } from 'react-dom';
//import store from '../../app/store';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { boardSlice } from './boardSlice';
import TestRenderer from 'react-test-renderer';
const { act, create } = TestRenderer;


let container;
let store;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  store = configureStore({reducer: boardSlice.reducer, preloadedState: {
    board: {title: "Board Test", id: "BoardId123"},
    lists: {allIds: []},
    cards: {allIds: []}
  }});
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});


describe("Smoke test", () => {
  // it("Board", () => {
  //   act(() => {
  //     render(<Provider store={store}><Board /> </Provider>, container);
  //   });
  // });

  it("Board", () => {
    let root;

    act(() => {
      root = create(<Provider store={store}><Board /> </Provider>);
    });
    console.log(root.toJSON()[0].children)

    expect(root.toJSON()[0].props.className).toEqual("board");
  });

  it("gets Board title from Redux store", () => {
    let root;

    act(() => {
      root = create(<Provider store={store}><Board /> </Provider>);
    });

    expect(root.toJSON()[0].children[0].children).toEqual(["Board Test"]);
  })
});