import React, { useContext } from 'react';
import { updateBoard } from './boardSlice';
import { updateList } from '../list/listSlice';
import di from '../../injection_container';
import { connect } from 'react-redux';
import { moveCardInSameList } from '../../helpers/helper';

export const curryOnDragHandler = (reorderLists, listOrdering, updateBoard, moveCards) => (result) => {
  const { destination, source, draggableId, type } = result;

  if (!destination) {
    return;
  }

  if (destination.droppableId === source.droppableId &&
    destination.index === source.index) {
    return;
  }

  if (type.localeCompare("lists") === 0) {

    const orderingCpy = reorderLists(listOrdering, {
      sourceIndex: source.index,
      destinationIndex: destination.index,
      id: draggableId
    });

    updateBoard({ id: "625a2e6ea978638034ee3850", lists: orderingCpy });
  }

  if (type.localeCompare("cards") === 0) {
    try {
      moveCards(source, destination, draggableId);
    } catch (err) {
      console.log(err)
    }
  }
};

export const curryMoveCard = (reorderBetweenLists, reorderCards, updateList, moveCardInSameList, cardOrdering) => {
  return (source, destination, id) => {
    if (source.droppableId !== destination.droppableId) { 
      reorderBetweenLists(cardOrdering, reorderCards, updateList, {destination, source, id}); 
    } else {
      const result = reorderCards(cardOrdering, {destination, source, id}, moveCardInSameList);
      console.log(result);
      updateList({id: destination.droppableId, card: result[1]});
    }
  };
};


function Board({ updateBoard, title, listOrdering, cardOrdering, updateList }) {
  const { reorderLists, reorderCards, DragDropContext, Droppable, List } = useContext(di);

  const moveCards = curryMoveCard(reorderBetweenLists, reorderCards, updateList, moveCardInSameList, cardOrdering);
  const onDragEnd = curryOnDragHandler(reorderLists, listOrdering, updateBoard, moveCards);

  const styles = (comp, droppableStyle) => {
    switch (comp) {
      case "list":
        return {
          padding: "50px"
        };

      case "listContainer":

        return {
          display: "flex",
          justifyContent: "space-around",
          ...droppableStyle
        };
    }
  }

  return (
    <div className="board">
      <h1>{title}</h1>
      <DragDropContext
        onDragEnd={onDragEnd}
      >
        <Droppable droppableId='list-container' direction="horizontal" type="lists">
          {provided => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={styles("listContainer", provided.droppableProps.style)}
            >
              <List />
              {provided.placeholder}
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


const msToProps = state => {
  return {
    title: state.board.title,
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
