import React, { useContext } from 'react';
import { updateBoard } from './boardSlice';
import { updateList } from '../list/listSlice';
import di from '../../injection_container';
import { connect } from 'react-redux';


function Board({ updateBoard, title, listOrdering, cardOrdering, updateList }) {
  const { reorderLists, reorderCards, DragDropContext, Droppable, List } = useContext(di);


  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    console.log(result)

    // Do nothing if component is dropped outside of DragDropContext
    if (!destination) {
      return;
    }

    // If component is dropped in the same starting position, do nothing
    if (destination.droppableId === source.droppableId &&
      destination.index === source.index) {
      return;
    }

    // Reordering logic for lists
    if (type.localeCompare("lists") === 0) {

      const orderingCpy = reorderLists(listOrdering, {
        sourceIndex: source.index,
        destinationIndex: destination.index,
        id: draggableId
      });

      updateBoard({ id: "625a2e6ea978638034ee3850", lists: orderingCpy });
    }

    // Reordering logic for cards
    if (type.localeCompare("cards") === 0) {
      try {
        if (destination.droppableId !== source.droppableId) {

          const { destCpy, sourceCpy } = reorderCards(cardOrdering, { destination, source, id: draggableId });

          updateList({ id: destination.droppableId, card: destCpy });
          updateList({ id: source.droppableId, card: sourceCpy });
          console.log("Moving outside DESTCOPY: ", destCpy);
          console.log("Moving outside SOURCECOPY: ", sourceCpy);

        } else {

          const destCpy = reorderCards(destination, source, cardOrdering, draggableId);

          updateList({ id: destination.droppableId, card: destCpy });
          console.log("Moving inside list: ", destCpy);
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

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
