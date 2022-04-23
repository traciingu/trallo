import { configureStore, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api/v1/',
    timeout: 3000
})


export const loadBoard = createAsyncThunk('board/load', async (id) => {
    const { data } = await api(`/boards/${id}`);
    const lists = data.lists;
    const cards1 = [];
    const cards = [];


    for (let i = 0; i < lists.length; i++) {
        for (let j = 0; j < lists[i].cards.length; j++) {
            cards1.push({ listId: lists[i].id, ...lists[i].cards[j] });
            cards.push({ listId: lists[i].id, cardId: lists[i].cards[j]._id });
        }
    }

    let listProps;
    data.lists.map(list => {
        listProps = Object.keys(list).filter((key) => key.localeCompare('cards') !== 0);
    });

    let lists1 = [];
    lists.map(list => {
        let newList = {};
        listProps.map(prop => {
            newList[prop] = list[prop];
        });

        newList['cards'] = [];

        cards.map(card => {
            if (newList['id'].localeCompare(card.listId) === 0) {
                newList['cards'].push(card.cardId);
            }
        });

        lists1.push(newList);
    });

    return { board: data, lists: lists1, cards: cards1 };
});

export const updateBoard = createAsyncThunk('board/update', async (info) => {
    await api.patch(`/boards/${info.id}`, info);
})

export const updateList = createAsyncThunk('lists/update', async (info) => {
    const { data } = await api.patch(`/lists/${info.id}`, info);
    return { lists: data };
});

const boardSlice = createSlice({
    name: 'board',
    initialState: {},
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadBoard.fulfilled, (state, action) => {
                const board = action.payload.board;
                state.title = board.title;
            })
    }
});

const listSlice = createSlice({
    name: 'lists',
    initialState: { byId: {}, allIds: [] },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadBoard.fulfilled, (state, action) => {
                const lists = action.payload.lists;
                lists.forEach(list => {
                    state.byId[list.id] = list;
                    state.allIds.push(list.id);
                });
            })
            .addCase(updateList.fulfilled, (state, action) => {
                console.log(action.payload);
                const lists = action.payload.lists;
                lists.forEach(list => {
                    state.byId[list.id] = list;
                    state.allIds.push(list.id);
                });
            })
    }
});

const cardSlice = createSlice({
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
                    state.allIds[card.listId].push(card._id);
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
})

export default configureStore({
    reducer: {
        board: boardSlice.reducer,
        lists: listSlice.reducer,
        cards: cardSlice.reducer
    }
});