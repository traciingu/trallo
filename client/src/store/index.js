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

    console.log(lists1)


    return { board: data, lists: lists1, cards: cards1 };
});

export const updateBoard = createAsyncThunk('board/update', async (info) => {
    console.log(await api.patch(`/boards/${info.id}`, info))
})

export const loadList = createAsyncThunk('list/load', async (id) => {
    const { data } = await api(`/lists/${id}`);
    return data;
});

const boardSlice = createSlice({
    name: 'board',
    initialState: {},
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadBoard.fulfilled, (state, action) => {
                const board = action.payload.board;
                // console.log(board)
                state.title = board.title;
            })
            .addCase(loadList.fulfilled, (state, action) => {
                const list = action.payload;
                // console.log(list);
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
                // console.log(lists)
                lists.forEach(list => {
                    state.byId[list.id] = list;
                    state.allIds.push(list.id);
                });
            });
    }
});

const cardSlice = createSlice({
    name: 'cards',
    initialState: { byId: {}, allIds: [] },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadBoard.fulfilled, (state, action) => {
                const cards = action.payload.cards;
                console.log(cards)
                cards.forEach(card => {
                    state.byId[card._id] = card;
                    state.allIds.push(card._id);
                })
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