import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import { createBoard } from '../board/boardSlice';

export const boardCollectionSlice = createSlice({
    name: 'boardcollection',
    initialState: { boards: []},
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getBoardCollection.fulfilled, (state, action) => {
                const boards = action.payload.boards;
                state.boards = boards;
            })
            .addCase(createBoard.fulfilled, (state, action) => {
                const currentBoards = state.boards.map(board => ({...board}));
                state.boards = [...currentBoards, action.payload.board];
            })
    }
});

export const getBoardCollection = createAsyncThunk('boardcollection/get', async () => {
    const { data } = await api('boards');
    console.log(data);
    return { boards: data };
});