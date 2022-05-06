import Board from './Board';
import React from 'react';
import { Provider } from 'react-redux';
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


describe("Board", () => {
  it("gets Board title from Redux store", () => {
    const [{ getByText }, store] = renderComponent({
      board: { title: "Board Test", id: "BoardId123" },
      lists: { allIds: [] },
      cards: { allIds: [] }
    });

    expect(getByText("Board Test")).toBeTruthy();

  })

  it("calls Redux thunk after list is dropped", () => {

  })

});