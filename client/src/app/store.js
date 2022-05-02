import { configureStore } from '@reduxjs/toolkit';
import { boardSlice } from '../features/board/boardSlice';
import { listSlice } from '../features/list/listSlice';
import { cardSlice } from '../features/card/cardSlice';

export default configureStore({
    reducer: {
        board: boardSlice.reducer,
        lists: listSlice.reducer,
        cards: cardSlice.reducer
    }
});