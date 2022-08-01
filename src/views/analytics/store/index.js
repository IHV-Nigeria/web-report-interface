// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiRequest from '../../../api/useJwt'

export const getChatData = createAsyncThunk('appAnalytic/getChatData', async({
    states,
    lgas,
    facilities,
    ageRange,
    indicator,
    sex
}) => {
    const result = await apiRequest({
        requetType: 'GET',
        contentType: 'application/json',
        requestUrl: `data/indicators?states=${states}&lgas=${lgas}&facilities=${facilities}&ageRange=${ageRange}&indicator=${indicator}&sex=${sex}&searchType=NORMAL`
    })
    const txCURRData  = {
        chart: {
            type: 'column'
        },
        title: {
            align: 'left',
            text: 'Patients Currently Receiving ART by location'
        },
        subtitle: {
            align: 'left',
            text: 'Click the columns drill down'
        },
        accessibility: {
            announceNewData: {
                enabled: true
            }
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            title: {
                text: 'Number of patients'
            }

        },
        legend: {
            enabled: false
        },
        colors: [
            '#536e27 ',
            '#536e27 '
        ],
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y}'
                }
            }
        },

        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> of total<br/>'
        },

        series: (result.data !== undefined) ? result.data.series : {},
        drilldown: (result.data !== undefined) ? { series: result.data.drillDown } : {}
    }
    return txCURRData
})

export const getStats = createAsyncThunk('appAnalytic/getStats', async({
    states,
    lgas,
    facilities,
    ageRange,
    indicator,
    sex
}) => {
    const result = await apiRequest({
        requetType: 'GET',
        contentType: 'application/json',
        requestUrl: `data/stats?stats=${states}&lgas=${lgas}&facilities=${facilities}&ageRange=${ageRange}&indicator=${indicator}&sex=${sex}&searchType=NORMAL`
    })
    return result.data
})

export const appAnalyticsSlice = createSlice({
    name: 'appAnalytics',
    initialState: {
        stats: {},
        getChatData: {},
        getStats: []
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getChatData.fulfilled, (state, action) => {
                state.getChatData =  action.payload
            }).addCase(getStats.fulfilled, (state, action) => {
                state.getStats = action.payload
            })
    }
})

export default appAnalyticsSlice.reducer