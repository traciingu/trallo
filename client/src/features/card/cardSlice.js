import { createSlice } from '@reduxjs/toolkit';
import { loadBoard } from '../board/boardSlice';
import { updateList } from '../list/listSlice';

export const cardSlice = createSlice({
    name: 'cards',
    initialState: { byId: {}, allIds: {} },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadBoard.fulfilled, (state, action) => {
                const cards = action.payload.cards;
                cards.forEach(card => {
                    state.byId[card._id] = card;
                    if (!state.allIds[card.listId]) {
                        state.allIds[card.listId] = [];
                    }
                    state.allIds[card.listId].push(card.id);
                })
            })
            .addCase(updateList.fulfilled, (state, action) => {
                const lists = action.payload.lists;
                lists.forEach(list => {
                    list.cards.forEach((cardId) => {
                        if (!state.allIds[cardId]) {
                            state.allIds[cardId] = [];
                        }
                        state.allIds[cardId].push(cardId);
                    })
                });
            })
    }
});