import Board, { curryMoveCard, curryOnDragHandler, reorderBetweenLists } from './Board';
import React from 'react';
import { Provider } from 'react-redux';
import "@testing-library/jest-dom/extend-expect";
import { cleanup, fireEvent, render, getNodeText } from "@testing-library/react";
import configureStore from 'redux-mock-store';
import { updateBoard } from './boardSlice';
import { updateList } from '../list/listSlice';
import { moveCardInSameList } from '../../helpers/helper';

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
    const mockReorderLists = jest.fn(() => { });
    const mockUpdateBoard = jest.fn(() => { });
    const emptyFn = () => { };
    const emptyObj = {};

    const destination = {
      "droppableId": "123",
      "index": 1
    };

    const source = {
      "droppableId": "456",
      "index": 2
    };

    const draggableId = null;

    const type = "lists";

    const onDragInput = {
      destination,
      source,
      draggableId,
      type
    };

    const onDragHandler = curryOnDragHandler(mockReorderLists, emptyObj, emptyObj, emptyFn, emptyFn, mockUpdateBoard);
    onDragHandler(onDragInput);

    expect(mockReorderLists).toBeCalled();
    expect(mockUpdateBoard).toBeCalled();

  })

  it("calls reorderCards when the droppableId in destination and source are equal and type is equal to cards", () => {
    const mockReorderCards = jest.fn(() => { return [1, 2] });
    const mockUpdateList = jest.fn(() => { });
    const emptyFn = () => { };
    const emptyObj = {};

    const destination = {
      "droppableId": "1",
      "index": 1
    };

    const source = {
      "droppableId": "1",
      "index": 2
    };

    const draggableId = "1";

    const type = "cards";

    const onDragInput = {
      destination,
      source,
      draggableId,
      type
    };

    const onDragHandler = curryOnDragHandler(emptyFn, emptyObj, emptyObj, mockReorderCards, emptyFn, emptyFn, mockUpdateList);
    onDragHandler(onDragInput);

    expect(mockReorderCards).toBeCalled();
    expect(mockUpdateList).toBeCalled();

  })

  it("calls reorderBetweenLists when the droppableId of source and destination are not equal and type is equal to cards", () => {
    const mockReorderBetweenLists = jest.fn(() => { });

    const emptyFn = () => { };
    const emptyObj = {};

    const destination = {
      "droppableId": "1",
      "index": 1
    };

    const source = {
      "droppableId": "2",
      "index": 2
    };

    const draggableId = "1";

    const type = "cards";

    const onDragInput = {
      destination,
      source,
      draggableId,
      type
    };

    const onDragHandler = curryOnDragHandler(emptyFn, emptyObj, emptyObj, emptyFn, emptyFn, emptyFn, emptyFn, mockReorderBetweenLists);
    onDragHandler(onDragInput);

    expect(mockReorderBetweenLists).toBeCalled();
  })
})

describe("moveCard", () => {
  let mockReorderBetweenLists;
  let mockReorderCards;
  let mockUpdateList;
  let moveCard;

  // TODO Make assertions what args reorderCards should be called with
  // TODO Make mocks return specific values and test reorderCards output against the mock inputs

  beforeEach(() => {
    mockReorderBetweenLists = jest.fn(() => { });
    mockReorderCards = jest.fn(() => { return ["foo", "bar"] });
    mockUpdateList = jest.fn(() => { });
    moveCard = curryMoveCard(mockReorderBetweenLists, mockReorderCards, mockUpdateList);
  })

  describe("between two different lists", () => {
    it("calls reorderBetweenLists when the source and destination droppableId are different", () => {
      const destination = {
        "droppableId": "1",
        "index": 1
      };

      const source = {
        "droppableId": "2",
        "index": 2
      };

      moveCard(source, destination);

      expect(mockReorderBetweenLists).toBeCalled();
    })
  })

  describe("within the same list", () => {
    it("does not call reorderBetweenLists when the source and destination droppableId are the same", () => {
      const destination = {
        "droppableId": "1",
        "index": 1
      };

      const source = {
        "droppableId": "1",
        "index": 2
      };

      moveCard(source, destination);

      expect(mockReorderBetweenLists).not.toBeCalled();
    })

    it("calls reorderCards when the source and destination droppableId are the same", () => {
      const destination = {
        "droppableId": "1",
        "index": 1
      };

      const source = {
        "droppableId": "1",
        "index": 2
      };

      const mockReorderCardsResult = mockReorderCards();
      const expected = { id: destination.droppableId, card: mockReorderCardsResult[1] };

      moveCard(source, destination);

      expect(mockReorderCards).toBeCalled();
      expect(mockUpdateList).toBeCalledWith(expected);
    })

  })
})