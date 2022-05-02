import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loadBoard } from '../board/boardSlice';
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
            .addCase(updateList.fulfilled, (state, action) => {
                pushListToStore(state, action);
            })
    }
});

const pushListToStore = (state, action) => {
    const lists = action.payload.lists;
    lists.forEach(list => {
        state.byId[list.id] = list;
        state.allIds.push(list.id);
    });
};

export const updateList = createAsyncThunk('lists/update', async (info) => {
    const { data } = await api.patch(`/lists/${info.id}`, info);
    return { lists: data };
});