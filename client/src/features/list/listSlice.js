import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loadBoard, updateBoard } from '../board/boardSlice';
import { api } from '../../api';
import { produce } from "immer";

export const listSlice = createSlice({
    name: 'lists',
    initialState: { byId: {}, allIds: [] },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadBoard.fulfilled, (state, action) => {
                const lists = action.payload.lists;
                lists.forEach(list => {
                    state.byId[list.id] = list;
                    if (!state.allIds.includes(list.id)) {
                        state.allIds.push(list.id);
                    }
                });
            })
            .addCase(updateBoard.fulfilled, (state, action) => {
                const listsOrdering = action.payload.lists;
                state.allIds = listsOrdering;
            })
            .addCase(createList.fulfilled, (state, action) => {
                console.log(action.payload)
                const list = action.payload;
                state.byId[list.id] = list;
                if (!state.allIds.includes(list.id)) {
                    state.allIds.push(list.id);
                }
            })
            .addCase(updateList.fulfilled, (state, action) => {
                const lists = action.payload.lists;
                lists.forEach(list => {
                    state.byId[list.id].title = list.title;
                });
            })
            .addCase(deleteList.fulfilled, (state, action) => {
                const list = action.payload;
                const spliceIndex = state.allIds.indexOf(list.id);
                state.allIds.splice(spliceIndex, 1);
                const newById = produce(state.byId, (state) => {
                    delete state[list.id];
                });
                state.byId = newById;
            })
    }
});

export const updateList = createAsyncThunk('lists/update', async (info) => {
    const { data } = await api.patch(`/lists/${info.id}`, info);
    return { lists: data };
});

export const createList = createAsyncThunk('lists/create', async (info) => {
    const { data } = await api.post(`/lists/`, info);
    return data;
});

export const deleteList = createAsyncThunk('lists/delete', async (info) => {
    const { data } = await api.delete(`/lists/${info.id}`);
    return data;
});