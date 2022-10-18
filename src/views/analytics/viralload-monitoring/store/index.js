// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {serialize} from '../../../../api/utils/common'
import apiRequest from '../../../../api/useJwt'

export const getChatData = createAsyncThunk('appAnalytic/getChatData', async(params) => {   
   return params
})

export const getStats = createAsyncThunk('appAnalytic/getStats', async(params) => {
    const result = await apiRequest({
        requetType: 'GET',
        contentType: 'application/json',
        requestUrl: `data/stats?${serialize(params)}`
    })
    return result?.data
})

export const getAgeRageCharts = createAsyncThunk('appAnalytic/getAgeRageCharts', async(params) => {
    const result = await apiRequest({
        requetType: 'GET',
        contentType: 'application/json',
        requestUrl: `data/get-age-rage-chart?${serialize(params)}`
    })
    return result?.data
})

export const appAnalyticsSlice = createSlice({
    name: 'appAnalytics',
    initialState: {
        stats: {},
        getChatData: {},
        getStats: [],
        getAgeRageCharts: {}
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getChatData.fulfilled, (state, action) => {
                state.getChatData =  action.payload
            }).addCase(getStats.fulfilled, (state, action) => {
                state.getStats = action.payload
            }).addCase(getAgeRageCharts.fulfilled, (state, action) => {
                state.getAgeRageCharts = action.payload
            })
    }
})

export default appAnalyticsSlice.reducer