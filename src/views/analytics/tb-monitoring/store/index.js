// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiRequest from '../../../../api/useJwt'

export const getChatData = createAsyncThunk('appAnalytic/getChatData', async(params = {
    states,
    lgas,
    facilities,
    ageRange,
    indicator,
    sex,
    startDate,
    endDate
}) => {   
   return params
})

export const getStats = createAsyncThunk('appAnalytic/getStats', async({
    states,
    lgas,
    facilities,
    ageRange,
    indicator,
    sex,
    startDate,
    endDate   
}) => {
    const result = await apiRequest({
        requetType: 'GET',
        contentType: 'application/json',
        requestUrl: `data/stats?states=${states}&lgas=${lgas}&facilities=${facilities}&ageRange=${ageRange}&indicator=${indicator}&sex=${sex}&searchType=NORMAL&startDate=${startDate}&endDate=${endDate}`
    })
    return result?.data
})

export const getAgeRageCharts = createAsyncThunk('appAnalytic/getAgeRageCharts', async({
    states,
    lgas,
    facilities,
    ageRange,
    indicator,
    sex,
    startDate,
    endDate   
}) => {
    const result = await apiRequest({
        requetType: 'GET',
        contentType: 'application/json',
        requestUrl: `data/get-age-rage-chart?states=${states}&lgas=${lgas}&facilities=${facilities}&ageRange=${ageRange}&indicator=${indicator}&sex=${sex}&searchType=NORMAL&startDate=${startDate}&endDate=${endDate}`
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