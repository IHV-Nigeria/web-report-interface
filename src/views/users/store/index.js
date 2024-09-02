// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiRequest from '../../../api/useJwt'

export const getData = createAsyncThunk('appUsers/getData', async({ page, size }) => {

    const result = await apiRequest({
        requetType: 'GET',
        contentType: 'application/json',
        requestUrl: `users?page=${(page === undefined) ? 0 : page }&per_page=${ (size === undefined) ? 10 : size  }&delay=1`
    })
    return result
})


export const addUser = createAsyncThunk('appUsers/addUser', async(values, {}) => {
    const params = values.values
    const data = apiRequest({
        requetType: 'POST',
        contentType: 'application/json',
        requestUrl: `register`,
        requestData: params
    })
    return data
})

export const fetchRoles = createAsyncThunk('appUsers/fetchRoles', async({ page, size }) => {
    const resp = await apiRequest({
        requetType: 'GET',
        contentType: 'application/json',
        requestUrl: `roles?page=${(page === undefined) ? 0 : page }&per_page=${ (size === undefined) ? 10 : size  }&delay=1`
    })
    return resp
})

export const appUsersSlice = createSlice({
    name: 'appUsers',
    initialState: {
        isFormSubmitted: false,
        total: 1,
        params: {},
        allData: [],
        selectedUser: null
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(addUser.fulfilled, (state, action) => {
                state.isFormSubmitted = action.payload
            })
            .addCase(getData.fulfilled, (state, action) => {
                state.allData = action.payload
            })
    }
})

export default appUsersSlice.reducer