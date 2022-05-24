import React, { useContext, useState } from 'react';
import { updateBoard } from './boardSlice';
import { updateList } from '../list/listSlice';
import di from '../../injection_container';
import { connect } from 'react-redux';
import { moveCardInSameList } from '../../helpers/helper';
import { ListContainer } from './BoardStyles';

function Board({ updateBoard, title, listOrdering, cardOrdering, updateList, boardId }) {
  const { reorderLists, reorderCards, DragDropContext, Droppable, List } = useContext(di);
  const [canEdit, setCanEdit ] = useState(false);
  const reorderAndPersistCards = curryReorderAndPersistCards(reorderBetweenLists, reorderCards, updateList, moveCardInSameList, cardOrdering);
  const reorderAndPersistLists = curryReorderAndPersistLists(reorderLists, updateBoard, listOrdering);
  const onDragEnd = curryOnDragHandler(reorderLists, listOrdering, updateBoard, reorderAndPersistCards, reorderAndPersistLists);

  const styles = (comp, droppableStyle) => {
    switch (comp) {
      case "list":
        return {
          padding: "50px"
        };

      case "listContainer":
        return {
          // ...droppableStyle
        };
    }
  }
  
  const handleClick = (e) => {
    setCanEdit(!canEdit);
  };

  return (
    <div className="board">
      <h1>{title}</h1>
      <DragDropContext
        onDragEnd={onDragEnd}
      >
        <Droppable droppableId={`${boardId}`} direction="horizontal" type="lists">
          {provided => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={styles("listContainer", provided.droppableProps.style)}
            >
              <ListContainer>
                <List />
                {provided.placeholder}
                <input className={canEdit ? "hide" : ""} type="button" data-add-button="list" value="Add list" onClick={handleClick} />
                <div data-create-item-container="list" className={!canEdit && "hide"}><input type="text" /></div>
              </ListContainer>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export const reorderBetweenLists = (cardOrdering, reorderCards, updateList, draggable) => {

  const { destination, source } = draggable;
  const result = reorderCards(cardOrdering, draggable);

  updateList({ id: destination.droppableId, card: result[1] });
  updateList({ id: source.droppableId, card: result[0] });
};

export const curryOnDragHandler = (reorderLists, listOrdering, updateBoard, reorderAndPersistCards, reorderAndPersistLists) => (result) => {
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
    boardId: state.board.id,
    listOrdering: state.lists.allIds,
    cardOrdering: state.cards.allIds
  };
}

const mdToProps = dispatch => {
  return {
    updateBoard: (info) => { dispatch(updateBoard(info)) },
    updateList: (info) => { dispatch(updateList(info)) },
  }
};

export default connect(msToProps, mdToProps)(Board);
