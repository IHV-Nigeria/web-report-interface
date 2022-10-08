import apiRequest from './useJwt'
import {buildBarVLChat, buildThreeColumnBarChartWithDualAxis} from './chatUtils/barChart'
import {buildLineChat} from './chatUtils/lineChart'

export const fetchPvlsAnalytics = (param) => {
   const url = `data/get-pvls-analytics?states=${param.states}&lgas=${param.lgas}&facilities=${param.facilities}&ageRange=${param.ageRange}&indicator=${param.indicator}&sex=${param.sex}&searchType=NORMAL&startDate=${param.startDate}&endDate=${param.endDate}`
   return apiRequest({
      requetType: 'GET',
      contentType: 'application/json',
      requestUrl: url
    })
}
  
export const  buildPvlsChat = (title, y1_title, x_title, seriesData)  => {
    const xaxisCategory = [
        "TX_CURR",
        "Eligible for VL Load",
        "",
        "TX_PVLS D",
        "",
        "TX_PVLS N"
    ] 

    const  res = [
        {
          name: "Indicators",
          data: [
            seriesData.active,
            seriesData.eligible,                 
              0,
              seriesData.pvlsDenominator,
              0,
              seriesData.pvlsNumerator
          ],
          color: "#01575C"
      },   
      {
          name: "% Suppressed",
          type: "scatter",
          yAxis: 1,
          data: [
              null,
              null,
              seriesData.percentageCoverage,
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
        name: "% Coverage",
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
          seriesData.percentageSuppressed,
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

export const  buildPvlsByAge = (txPvlsByAge)  => {
    const ageGroupsValues = []
        const eligibleSeries = []
        const pvlsDenominatorSeries = []
        const pvlsNumeratorSeries = []
        const percentageSuppresedSeries = []
        const percentageCoverageSeries = []
        const ageGroups = [
          {"<1" :"0-1yrs"},
          {"1-4":"1-4yrs"},
          {"5-9":"5-9yrs"},
          {"10-14":"10-14yrs"},
          {"15-19":"15-19yrs"},
          {"20-24":"20-24yrs"},
          {"25-29":"25-29yrs"},
          {"30-34":"30-34yrs"},
          {"35-39":"35-39yrs"},
          {"40-44":"40-44yrs"},
          {"45-49":"45-49yrs"},
          {"50+":"50+yrs"}
        ]     
         ageGroups.map((item) => {
          const ageGroup = Object.keys(item)
          ageGroupsValues.push(Object.values(item)) 
          if (ageGroup !== "50+") {
            const filtedAgeGroup = Object.fromEntries(Object.entries(txPvlsByAge).filter(([key]) => key.includes(ageGroup)))        
            const ageGroupObj = filtedAgeGroup[ageGroup]    
            if (ageGroupObj !== undefined) {
              eligibleSeries.push(ageGroupObj['eligible'])
              pvlsDenominatorSeries.push(ageGroupObj['pvlsDenominator'])
              pvlsNumeratorSeries.push(ageGroupObj['pvlsNumerator'])
              percentageSuppresedSeries.push(ageGroupObj['percentageSuppressed'])
              percentageCoverageSeries.push(ageGroupObj['percentageCoverage'])
            }
          }  
        })
 
        const dt = {
          tx_pvls_age: {
            age_groups: ageGroupsValues,
            eligibleSeries,
            pvlsDenominatorSeries,
            pvlsNumeratorSeries,
            percentageSuppresedSeries,
            percentageCoverageSeries
          },
          ribbon_data: {
            no_of_ips: 1,
            no_of_states: 4,
            no_of_lga: 55,
            no_of_facilities: 357,
            no_of_patients: 283690
          }
        }
    return  buildThreeColumnBarChartWithDualAxis(
        null,
        'Number of Patients',
        '% Suppression',
        dt.tx_pvls_age.age_groups,
        dt.tx_pvls_age.eligibleSeries,
        'Eligible',
        dt.tx_pvls_age.pvlsDenominatorSeries,
        'TX_PVLS D',
        dt.tx_pvls_age.pvlsNumeratorSeries,
        'TX_PVLS N',
        dt.tx_pvls_age.percentageSuppresedSeries,
        '% Suppression',
        dt.tx_pvls_age.percentageCoverageSeries,
        '% Coverage',
        false,
        "Age Group")
}

export const  buildVLQuarterChat = (vlData)  => { 
  const undetected = []
  const lowLevelViraemia = []
  const categoriesData = [] 
  vlData.map((item) => {     
    categoriesData.push(item.name)
    undetected.push(item.y)
    lowLevelViraemia.push(item.z)
  })

  const seriesData = [
    {
      name: 'Undetected Viralload',
      data: undetected
    },
    {
      name: 'Low Level Viraemia',
      data: lowLevelViraemia
    }
  ]

  return buildLineChat('', categoriesData, seriesData)
}
