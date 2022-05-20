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
            .addCase(updateList.fulfilled, (state, action) => {
                pushListToStore(state, action);

            })
            .addCase(updateBoard.fulfilled, (state, action) => {
                updateListToStore(state, action);
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

const updateListToStore = (state, action) => {
    const listsOrdering = action.payload.lists;
    //state.allIds = listsOrdering;
    console.log(listsOrdering);
};

export const updateList = createAsyncThunk('lists/update', async (info) => {
    console.log(info);
    const { data } = await api.patch(`/lists/${info.id}`, info);
    return { lists: data };
});