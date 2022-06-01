import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loadBoard } from '../board/boardSlice';
import { updateList } from '../list/listSlice';
import { api } from '../../api';
import { produce } from 'immer';

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
            .addCase(updateCard.fulfilled, (state, action) => {
                const card = action.payload;
                state.byId[card.id].title = card.title;
            })
            .addCase(deleteCard.fulfilled, (state, action) => {
                const card = action.payload;
                const newState = produce(state.byId, state => {
                    delete state[card.id];
                });
                state.byId = newState;
                const newAllIds = produce(state.allIds, state => {
                    const listKeys = Object.keys(state);
                    
                    let listId;
                    listKeys.forEach((key) => {
                        if (state[key].includes(card.id)) {
                            listId = key;
                        }
                    });
                    const spliceIndex = state[listId].indexOf(card.id);
                    state[listId].splice(spliceIndex, 1);
                });
                state.allIds = newAllIds;
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

export const updateCard = createAsyncThunk("cards/update", async (info) => {
    const { data } = await api.patch(`/cards/${info.id}`, info);
    return data;
})

export const deleteCard = createAsyncThunk("cards/delete", async (info) => {
    const { data } = await api.delete(`/cards/${info.id}`, info);
    return data
}); 