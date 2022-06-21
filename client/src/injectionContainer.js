import React from 'react';
import { reorderLists, reorderCards, reorderBetweenLists, curryOnDragHandler, curryReorderAndPersistCards, curryReorderAndPersistLists } from './helpers/helper';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Board from './features/board/Board';
import ListContainer from './features/list/ListContainer';
import CardContainer from './features/card/CardContainer';

export default React.createContext({
    reorderLists,
    reorderCards,
    reorderBetweenLists,
    curryOnDragHandler, 
    curryReorderAndPersistCards, 
    curryReorderAndPersistLists,
    DragDropContext,
    Droppable,
    Draggable,
    Board,
    ListContainer,
    CardContainer
});
