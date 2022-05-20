import Board, { curryReorderAndPersistCards, curryOnDragHandler, curryReorderAndPersistLists } from './Board';
import React from 'react';
import { Provider } from 'react-redux';
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import configureStore from 'redux-mock-store';

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
  let onDragHandler;
  let mockReorderLists;
  let mockUpdateBoard;
  let mockReorderCards;
  let mockUpdateList;
  let mockMoveCardInSameList;
  let mockReorderBetweenLists;
  let mockReorderAndPersistCards;
  let mockReorderAndPersistLists;

  let listOrdering;
  let cardOrdering;

  beforeEach(() => {
    mockReorderLists = jest.fn(() => { });
    mockUpdateBoard = jest.fn(() => { });
    mockReorderCards = jest.fn(() => { return [1, 2] });
    mockUpdateList = jest.fn(() => { });
    mockMoveCardInSameList = jest.fn(() => { });
    mockReorderBetweenLists = jest.fn(() => { });
    mockReorderAndPersistLists = jest.fn(() => { });

    listOrdering = [];
    cardOrdering = [];

    mockReorderAndPersistCards = jest.fn(curryReorderAndPersistCards(mockReorderBetweenLists, mockReorderCards, mockUpdateList, mockMoveCardInSameList, cardOrdering));

    onDragHandler = curryOnDragHandler(mockReorderLists, listOrdering, mockUpdateBoard, mockReorderAndPersistCards, mockReorderAndPersistLists);

  })

  it("returns undefined if destination is undefined", () => {
    const result = onDragHandler({
      "destination": null,
      "source": null,
      "draggableId": null,
      "type": null
    });

    expect(result).toBe(undefined);
  })

  it("returns undefined when dropped in same spot", () => {
    const destination = {};

    const result = onDragHandler({
      destination,
      "source": destination,
      "draggableId": null,
      "type": null
    });

    expect(result).toBe(undefined);
  })

  it("calls reorderAndPersistCards when the draggable type is equal to cards", () => {
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

    onDragHandler(onDragInput);

    expect(mockReorderAndPersistCards).toBeCalledWith(source, destination, draggableId);
  })

  it("calls reorderAndPersistLists when the type is lists", () => {
    const destination = {
      "droppableId": "1",
      "index": 1
    };

    const source = {
      "droppableId": "2",
      "index": 2
    };

    const draggableId = "1";

    const type = "lists";

    const onDragInput = {
      destination,
      source,
      draggableId,
      type
    };

    onDragHandler(onDragInput);

    expect(mockReorderAndPersistLists).toBeCalled();
  })
})

describe("reorderAndPersistCards", () => {
  let mockReorderBetweenLists;
  let mockReorderCards;
  let mockUpdateList;
  let mockreorderAndPersistCardsInSameList;
  let reorderAndPersistCards;
  let cardOrdering;

  // TODO Make assertions what args reorderCards should be called with
  // TODO Make mocks return specific values and test reorderCards output against the mock inputs

  beforeEach(() => {
    mockReorderBetweenLists = jest.fn(() => { });
    mockReorderCards = jest.fn(() => { return ["foo", "bar"] });
    mockUpdateList = jest.fn(() => { });
    mockreorderAndPersistCardsInSameList = jest.fn(() => { });

    cardOrdering = { '1': ['1', '2'], '2': ['3', '4', '5'] };

    reorderAndPersistCards = curryReorderAndPersistCards(mockReorderBetweenLists, mockReorderCards, mockUpdateList, mockreorderAndPersistCardsInSameList, cardOrdering);
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

      const id = '1';

      const cardDraggableInfo = { destination, source, id };

      reorderAndPersistCards(source, destination, id);

      expect(mockReorderBetweenLists).toBeCalledWith(cardOrdering, mockReorderCards, mockUpdateList, cardDraggableInfo);
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

      reorderAndPersistCards(source, destination);

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

      const id = '1';

      const cardDraggableInfo = { destination, source, id };

      const reorderCardsArguments = [cardOrdering, cardDraggableInfo, mockreorderAndPersistCardsInSameList];

      const mockReorderCardsResult = mockReorderCards();
      const updateListArguments = { id: destination.droppableId, card: mockReorderCardsResult[1] };

      reorderAndPersistCards(source, destination, id);

      expect(mockReorderCards).toBeCalledWith(...reorderCardsArguments);
      expect(mockUpdateList).toBeCalledWith(updateListArguments);
    })

  })
})

describe("reorderAndPersistLists", () => {
  it("abc", () => {
    const mockReorderLists = jest.fn(() => { return "TEST 123" });
    const mockUpdateBoard = jest.fn(() => { });
    
    const reorderAndPersistLists = curryReorderAndPersistLists(mockReorderLists, mockUpdateBoard);
    reorderAndPersistLists();
    
    const reorderListsResult = mockReorderLists();

    expect(mockReorderLists).toBeCalled();
    expect(mockUpdateBoard).toBeCalledWith(reorderListsResult);
  })
})