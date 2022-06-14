import React, { useContext, useEffect } from 'react';
import { loadBoard, updateBoard } from './boardSlice';
import { updateList } from '../list/listSlice';
import di from '../../injection_container';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { moveCardInSameList } from '../../helpers/helper';
import { BoardContainerStyling } from './boardStyles';
import Modal from '../modal/Modal';

function Board({ loadBoard, updateBoard, title, listOrdering, cardOrdering, updateList }) {
  const { reorderLists, reorderCards, DragDropContext, Droppable, ListContainer } = useContext(di);
  const reorderAndPersistCards = curryReorderAndPersistCards(reorderBetweenLists, reorderCards, updateList, moveCardInSameList, cardOrdering);
  const reorderAndPersistLists = curryReorderAndPersistLists(reorderLists, updateBoard, listOrdering);
  const onDragEnd = curryOnDragHandler(reorderAndPersistCards, reorderAndPersistLists);

  let { boardId } = useParams();


  useEffect(() => {
    console.log(boardId)
    if (boardId) {
      loadBoard(boardId);
    }
  }, [loadBoard, boardId]);

  return (
    <BoardContainerStyling className="board" data-item-type="board">
      <h1>{title}</h1>
      <DragDropContext
        onDragEnd={onDragEnd}
      >
        <Droppable droppableId={`${boardId}`} direction="horizontal" type="lists">
          {provided => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <ListContainer />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Modal />
    </BoardContainerStyling>
  );
};

export const reorderBetweenLists = (cardOrdering, reorderCards, updateList, draggable) => {

  const { destination, source } = draggable;
  const result = reorderCards(cardOrdering, draggable);

  updateList({ id: destination.droppableId, card: result[1] });
  updateList({ id: source.droppableId, card: result[0] });
};

export const curryOnDragHandler = (reorderAndPersistCards, reorderAndPersistLists) => (result) => {
  const { destination, source, draggableId, type } = result;

  if (!destination) {
    return;
  }

  if (destination.droppableId === source.droppableId &&
    destination.index === source.index) {
    return;
  }

  if (type.localeCompare("lists") === 0) {

    reorderAndPersistLists(destination, source, draggableId);

  }

  if (type.localeCompare("cards") === 0) {
    try {
      reorderAndPersistCards(source, destination, draggableId);
    } catch (err) {
      console.log(err)
    }
  }
};

export const curryReorderAndPersistCards = (reorderBetweenLists, reorderCards, updateList, reorderAndPersistCardsInSameList, cardOrdering) => {
  return (source, destination, id) => {
    if (source.droppableId !== destination.droppableId) {
      reorderBetweenLists(cardOrdering, reorderCards, updateList, { destination, source, id });
    } else {
      const result = reorderCards(cardOrdering, { destination, source, id }, reorderAndPersistCardsInSameList);
      updateList({ id: destination.droppableId, card: result[1] });
    }
  };
};

export const curryReorderAndPersistLists = (reorderLists, updateBoard, listOrdering) => {
  return (destination, source, id) => {
    const result = reorderLists(listOrdering, { destination, source, id });
    updateBoard({ id: destination.droppableId, lists: result[1] });
  }
}

const msToProps = state => {
  console.log(state);
  return {
    title: state.board.title,
    listOrdering: state.lists.allIds,
    cardOrdering: state.cards.allIds
  };
}

const mdToProps = dispatch => {
  return {
    loadBoard: (id) => { dispatch(loadBoard(id)) },
    updateBoard: (info) => { dispatch(updateBoard(info)) },
    updateList: (info) => { dispatch(updateList(info)) },
  }
};

export default connect(msToProps, mdToProps)(Board);
