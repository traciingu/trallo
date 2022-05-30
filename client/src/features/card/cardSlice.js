import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loadBoard } from '../board/boardSlice';
import { updateList } from '../list/listSlice';
import { api } from '../../api';

export const cardSlice = createSlice({
    name: 'cards',
    initialState: { byId: {}, allIds: {} },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadBoard.fulfilled, (state, action) => {
                pushCardsToStoreOnLoad(state, action);
            })
            .addCase(updateList.fulfilled, (state, action) => {
                pushCardsToStoreOnUpdate(state, action);
            })
            .addCase(createCard.fulfilled, (state, action) => {
                const card = action.payload;
                state.byId[card.id] = card;
                if (!state.allIds[card.listId]) {
                    state.allIds[card.listId] = [];
                }

                if (!state.allIds[card.listId].includes(card.id)) {
                    state.allIds[card.listId].push(card.id);
                }
            })
    }
});

const pushCardsToStoreOnLoad = (state, action) => {
    const cards = action.payload.cards;
    cards.forEach(card => {
        state.byId[card._id] = card;
        if (!state.allIds[card.listId]) {
            state.allIds[card.listId] = [];
        }

        if (!state.allIds[card.listId].includes(card.id)) {
            state.allIds[card.listId].push(card.id);
        }
    })
};

const pushCardsToStoreOnUpdate = (state, action) => {
    const lists = action.payload.lists;
    lists.forEach(list => {
        let cardOrdering = [];
        if (list.cards.length === 0) {
            state.allIds[list.id] = cardOrdering;
        } else {
            list.cards.forEach((cardId) => {
                if (!state.allIds[list.id]) {
                    state.allIds[list.id] = [];
                }
                cardOrdering.push(cardId);
                state.allIds[list.id] = cardOrdering;
            })
        }
    });
};

export const createCard = createAsyncThunk("cards/create", async (info) => {
    const { data } = await api.post("/cards", info);
    return data;
});