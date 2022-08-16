import apiRequest from './useJwt'

export const fetchDashboardStats = () => {
    return apiRequest({
        requetType: 'GET',
        contentType: 'application/json',
        requestUrl: `data/dashbaord-stats`
    })
}

export const fetchDashboardChart = (param) => {

   const url = `data/indicators?states=${param.states}&lgas=${param.lgas}&facilities=${param.facilities}&ageRange=${param.ageRange}&indicator=${param.indicator}&sex=${param.sex}&searchType=NORMAL&startDate=${param.startDate}&endDate=${param.endDate}`
   return apiRequest({
      requetType: 'GET',
      contentType: 'application/json',
      requestUrl: url
    })
  }
     
  export const getChartData = (result, indicator) => {   
   
   return  {
        chart: {
            type: 'column'
        },
        title: {
            align: 'left',
            text: `${indicator} by state`
        },
        subtitle: {
            align: 'left',
            text: ''
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
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y} patients'
                }
            }
        },
    
        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
        },
    
        series: result.series,
        drilldown: {
            breadcrumbs: {
                position: {
                    align: 'right'
                }
            },
            series:result.drillDown
        }
    }
  } 
  