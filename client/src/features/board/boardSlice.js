import { createSlice, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';

export const boardSlice = createSlice({
    name: 'board',
    initialState: { modal: { isDisplayed: false, title: "", description: "" } },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadBoard.fulfilled, (state, action) => {
                const board = action.payload.board;
                state.id = board.id;
                state.title = board.title;
            })
            .addCase(updateBoard.fulfilled, (state, action) => {
                const title = action.payload.title;
                state.title = title;
            })
            .addCase(setModalDisplay, (state, action) => {
                state.modal = {};
                state.modal.isDisplayed = action.payload.isDisplayed;
                state.modal.title = action.payload.title;
                state.modal.description = action.payload.description;
                state.modal.dataAttribute = action.payload.dataAttribute;
                state.modal.mode = action.payload.mode;
            })
    }
});

export const createBoard = createAsyncThunk('board/create', async (board) => {
    const { data } = await api.post('boards', { title: board.title });
    return { board: data };
});

export const getBoard = createAsyncThunk('board/get', async () => {
    const { data } = await api('boards');
    return { board: data };
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
    return result.data;
});

export const deleteBoard = createAsyncThunk('board/delete', async (info) => {
    const { data } = await api.delete(`/boards/${info.id}`);
    return data;
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

