import { configureStore } from '@reduxjs/toolkit';
import { boardSlice, listSlice, cardSlice } from '../store';

export default configureStore({
    reducer: {
        board: boardSlice.reducer,
        lists: listSlice.reducer,
        cards: cardSlice.reducer
    }
});