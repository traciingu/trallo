import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';

export const boardSlice = createSlice({
    name: 'board',
    initialState: {},
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadBoard.fulfilled, (state, action) => {
                const board = action.payload.board;
                state.title = board.title;
            })
            .addCase(getBoard.fulfilled, (state, action) => {
                const board = action.payload.board;
                state.id = board[0].id;
            })
            .addCase(setModalDisplay, (state, action) => {
                state.modalDisplay = action.payload;
            })
    }
});

export const getBoard = createAsyncThunk('board/get', async () => {
    const { data } = await api('boards');
    return {board: data};
});

export const loadBoard = createAsyncThunk('board/load', async (id) => {
    const { data } = await api(`/boards/${id}`);
    const lists = data.lists;
    const cards = cloneCards(lists);

    const listsCardIdOnly = cloneListsWithCardIdOnly(lists, cards);

    return { board: data, lists: listsCardIdOnly, cards: cards };
});

export const updateBoard = createAsyncThunk('board/update', async (info) => {
    const result = await api.patch(`/boards/${info.id}`, info);
    console.log(result);
    return result.data;
});

export const setModalDisplay = createAction('board/setModalDisplay');

const cloneListsWithCardIdOnly = (lists, cards) => {
    return lists.map(list => {
        return ({
            ...list,
            cards: cards.map(card => {
                if (list.id.localeCompare(card.listId) === 0) {
                    return card.id;
                }
            })
        })
    });
};

const cloneCards = (lists) => {
    const cards = [];

    for (let i = 0; i < lists.length; i++) {
        const cardsArr = lists[i].cards;
        for (let j = 0; j < cardsArr.length; j++) {
            cards.push({ listId: lists[i].id, ...cardsArr[j] });
        }
    }

    return cards;
};

