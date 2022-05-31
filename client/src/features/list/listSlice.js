import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loadBoard, updateBoard } from '../board/boardSlice';
import { api } from '../../api';

export const listSlice = createSlice({
    name: 'lists',
    initialState: { byId: {}, allIds: [] },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadBoard.fulfilled, (state, action) => {
                pushListToStore(state, action);
            })
            .addCase(updateBoard.fulfilled, (state, action) => {
                updateListToStore(state, action);
            })
            .addCase(createList.fulfilled, (state, action) => {
                pushNewListToStore(state, action)
            })
            .addCase(updateList.fulfilled, (state, action) => {
                const lists = action.payload.lists;
                lists.forEach(list => {
                    state.byId[list.id].title = list.title;
                });           
            })
    }
});

const pushNewListToStore = (state, action) => {
    const list = action.payload;
    state.byId[list.id] = list;
    if (!state.allIds.includes(list.id)) {
        state.allIds.push(list.id);
    }
};

const pushListToStore = (state, action) => {
    const lists = action.payload.lists;
    lists.forEach(list => {
        state.byId[list.id] = list;
        if (!state.allIds.includes(list.id)) {
            state.allIds.push(list.id);
        }
    });
};

const updateListToStore = (state, action) => {
    const listsOrdering = action.payload.lists;
    state.allIds = listsOrdering;
};

export const updateList = createAsyncThunk('lists/update', async (info) => {
    const { data } = await api.patch(`/lists/${info.id}`, info);
    return { lists: data };
});

export const createList = createAsyncThunk('lists/create', async (info) => {
    const { data } = await api.post(`/lists/`, info);
    return data;
});