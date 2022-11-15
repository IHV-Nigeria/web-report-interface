import apiRequest from './useJwt'
import {buildBarVLChat, buildTwoColumnBarChartWithDualAxis} from './chatUtils/barChart'


export const fetchTBAnalytics = (param) => {
   const url = `data/get-tb-analytics?states=${param.states}&lgas=${param.lgas}&facilities=${param.facilities}&ageRange=${param.ageRange}&indicator=${param.indicator}&sex=${param.sex}&searchType=NORMAL&startDate=${param.startDate}&endDate=${param.endDate}`
   return apiRequest({
      requetType: 'GET',
      contentType: 'application/json',
      requestUrl: url
    })
}
  
export const  buildTBChat = (title, y1_title, x_title, seriesData)  => {
    const xaxisCategory = [
        "Total Screened",
        "Screened Negative",
        "TB Presumptive",
        "TB Negative",
        "TB Positive",
        "Not On Tb Treatment",
        "On Tb Treatment"
    ] 

    const  res = [
        {
          name: "Indicators",
          data: [
           seriesData.totalScreened,
           seriesData.screenNegative,                 
           seriesData.tbPresumptive, 
           seriesData.tbNegative,
           seriesData.notOnTbTreatment,
           seriesData.onTbTreatment
          ],
          color: "#01575C"
      },   
      {
          name: "% Presumptive",
          type: "scatter",
          yAxis: 1,
          data: [
              null,
              seriesData.percentagePresumptive,
              null,
              null,
              null,
              null,
              null               
          ],
          label:true,
          color: "#E46C0A",
          tooltip: {
            pointFormat: '<b>{point.y:.1f}%</b>'
          },
          marker: {
            radius: 7
         }
      },
      {
        name: "% positive",
        type: "scatter",
        yAxis: 1,
        marker: {
            symbol: "diamond",
            radius: 7
        },
        data: [
          null,
          null,
          null,
          seriesData.percentagePositive,
          null,         
          null,
          null               
        ],
        color: "#7030A0",
        label:true,
        tooltip: {
            pointFormat: '<b>{point.y:.1f}%</b>'
        }
       },
       {
        name: "% on treatment",
        type: "scatter",
        yAxis: 1,
        marker: {
            symbol: "diamond",
            radius: 7
        },
        data: [
            null,
            null,
            null,
            null,
            null,
            seriesData.percentageTreatment,
            null                
        ],
        color: "#7030A0",
        label:true,
        tooltip: {
            pointFormat: '<b>{point.y:.1f}%</b>'
        }
       }
      ]
    return buildBarVLChat(title, y1_title, xaxisCategory, x_title, res)
}

export const  buildTBByState = (txTbByState)  => {
    const state = []
    const txCurrSeries = []
    const txTbDenominatorSeries = []
    const positiveScreened = []
    const percentageScreeningUptakeSeries = []
    const percentagePositiveYieldSeries = []
        
    txTbByState.map((item) => {
        state.push(item.state)
        txCurrSeries.push(item.txCurr)
        txTbDenominatorSeries.push(item.txTbDenominator)
        positiveScreened.push(item.positiveScreened)
        percentageScreeningUptakeSeries.push(item.percentageScreeningUptake)
        percentagePositiveYieldSeries.push(item.percentagePositiveYield)
    }) 

    return  buildTwoColumnBarChartWithDualAxis(
        null,
        'Number of Patients',
        '% Yield',
        state,
        txCurrSeries,
        'TX_CURR',
        txTbDenominatorSeries,
        'TX_TB D',
        percentageScreeningUptakeSeries, 
        '% Screening Uptake',
        percentagePositiveYieldSeries,
        '% Positive Screen Yield',
        false,
        "States")
}
