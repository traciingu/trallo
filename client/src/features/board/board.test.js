import Board, { curryOnDragHandler } from './Board';
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

describe("onDragHandler", () => {
  it("returns undefined if destination is undefined", () => {
    const onDragHandler = curryOnDragHandler();
    const result = onDragHandler({
      "destination": null,
      "source": null,
      "draggableId": null,
      "type": null
    });

    expect(result).toBe(undefined);
  })

  it("returns undefined when dropped in same spot", () => {
    const onDragHandler = curryOnDragHandler();
    const destination = {};

    const result = onDragHandler({
      destination,
      "source": destination,
      "draggableId": null,
      "type": null
    });

    expect(result).toBe(undefined);
  })

  it("checks reorderLists was called", () => {
    const mockReorderLists = jest.fn(() => {});
    const mockUpdateBoard = jest.fn(() => {});
    const emptyFn = () => {};

    const onDragHandler = curryOnDragHandler(mockReorderLists, {}, {}, emptyFn, emptyFn, mockUpdateBoard);
    const result = onDragHandler({
      "destination": {
        "droppableId": "123",
        "index": 1
      },
      "source": {
        "droppableId": "456",
        "index": 2
      },
      "draggableId": null,
      "type": "lists"
    });

    expect(mockReorderLists).toBeCalled();
    expect(mockUpdateBoard).toBeCalled();

  })
})