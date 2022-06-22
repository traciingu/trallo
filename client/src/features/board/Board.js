import React, { useContext, useEffect, useState } from 'react';
import { loadBoard, updateBoard, deleteBoard } from './boardSlice';
import { updateList } from '../list/listSlice';
import di from '../../injectionContainer';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { moveCardInSameList } from '../../helpers/helper';
import { BoardContainerStyling } from './boardStyles';
import EditModal from '../modal/EditModal';


function Board({ loadBoard, updateBoard, title, listOrdering, cardOrdering, updateList, deleteBoard }) {
  const {
    reorderLists, 
    reorderCards, 
    reorderBetweenLists,
    curryOnDragHandler, 
    curryReorderAndPersistCards, 
    curryReorderAndPersistLists,
    DragDropContext, 
    Droppable, 
    ListContainer
  } = useContext(di);

  const reorderAndPersistCards = curryReorderAndPersistCards(reorderBetweenLists, reorderCards, updateList, moveCardInSameList, cardOrdering);
  const reorderAndPersistLists = curryReorderAndPersistLists(reorderLists, updateBoard, listOrdering);
  const onDragEnd = curryOnDragHandler(reorderAndPersistCards, reorderAndPersistLists);

  const { boardId } = useParams();
  const navigate = useNavigate();
  const [textEditInput, setTextEditInput] = useState(title);
  const [canEdit, setCanEdit] = useState(false);


  useEffect(() => {
    if (boardId) {
      loadBoard(boardId);
    }
  }, [loadBoard, boardId]);

  useEffect(() => {
    setTextEditInput(title);
  }, [title]);

  const handleChange = (e) => {
    setTextEditInput(e.target.value);
  };

  const handleOnClick = (e) => {
    setCanEdit(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBoard({ title: e.target[0].value, id: boardId });
    setCanEdit(false);
  };

  const handleDeleteClick = (e) => {
    deleteBoard({ id: boardId });
    navigate("/");
  };

  return (
    <BoardContainerStyling className="board" data-item-type="board">
      <input type="button" className="delete-board-button" value="Delete board" onClick={handleDeleteClick} />
      <form className={canEdit ? '' : 'hide'} onSubmit={handleSubmit}>
        <input type="text" value={textEditInput} onChange={handleChange} />
      </form>
      <h1 className={canEdit ? 'hide' : ''} onClick={handleOnClick}>{title}</h1>
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
      <EditModal />
    </BoardContainerStyling>
  );
};

const msToProps = state => {
  return {
    title: state.board.title,
    listOrdering: state.lists.allIds,
    cardOrdering: state.cards.allIds,
  };
}

const mdToProps = dispatch => {
  return {
    loadBoard: (id) => { dispatch(loadBoard(id)) },
    updateBoard: (info) => { dispatch(updateBoard(info)) },
    updateList: (info) => { dispatch(updateList(info)) },
    deleteBoard: (info) => { dispatch(deleteBoard(info)) },
  }
};

export default connect(msToProps, mdToProps)(Board);
