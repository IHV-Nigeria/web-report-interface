import apiRequest from './useJwt'
import {serialize} from '../api/utils/common'
const colors = ['#01575C', '#59BA89', '#9d9b03', '#08bf7A78020f']

export const fetchDashboardStats = () => {
    return apiRequest({
        requetType: 'GET',
        contentType: 'application/json',
        requestUrl: `data/dashbaord-stats`
    })
}

export const fetchDashboardChart = (param) => {
    const url = `data/indicators?${serialize(param)}`
    return apiRequest({
        requetType: 'GET',
        contentType: 'application/json',
        requestUrl: url
    })
}

export const getChartData = (result) => {

    return {
        chart: {
            type: 'column'
        },
        title: {
            align: 'left',
            text: ``
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
        colors,
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
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
        },
        series: result.series,
        drilldown: {
            breadcrumbs: {
                position: {
                    align: 'right'
                }
            },
            series: result.drillDown
        }
    }
}

export const buildButerFlyChat = (result) => {
    const categoriesList = [
        '<1', '1-4', '  5-9', '10-14', '15-19',
        '20-24', '25-29', '30-34', '35-39', '40-44',
        '45-49', '50-54', '55-59', '60-64', '  65+'
    ]
    return {
        chart: {
            type: 'bar'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        accessibility: {
            point: {
                valueDescriptionFormat: '{index}. Age {xDescription}, {value}%.'
            }
        },
        xAxis: [
            {
            categories: categoriesList,
            reversed: false,
            labels: {
                step: 1
            },
            accessibility: {
                description: 'Age (male)'
            }
        }, { // mirror axis on right side
            opposite: true,
            reversed: false,
            categories: categoriesList,
            linkedTo: 0,
            labels: {
                step: 1
            },
            accessibility: {
                description: 'Age (female)'
            }
        }
    ],
        yAxis: {
            title: {
                text: null
            },
            /*   labels: {
                  formatter: function () {
                      return Math.abs(this.value) + '%';
                  }
              }, */
            accessibility: {
                description: 'Percentage population',
                rangeDescription: 'Range: 0 to 5%'
            }
        },
        colors,
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },

        /*    tooltip: {
               formatter: function () {
                   return '<b>' + this.series.name + ', age ' + this.point.category + '</b><br/>' +
                       'Population: ' + Highcharts.numberFormat(Math.abs(this.point.y), 1) + '%';
               }
           }, */

        series: result
    }


}

export const buildDonut = (data_array) => {

    return {
        chart: {
            type: 'pie'
        },
        title: {
            text: ''
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            pie: {
                //colors: pieColors,
                shadow: false,
                dataLabels: {
                    format: '{point.y:,.0f}<br /> ({point.percentage:.1f} %)'
                }
            }
        },
        tooltip: {
            pointFormat: '{point.y} ({point.percentage:.1f}%)'
        },
        series: [
            {
            data: data_array,
            size: '80%',
            innerSize: '60%',
            showInLegend: true

        }
    ],
        credits: {
            enabled: false
        },
        colors,
        exporting: { enabled: false },
        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        chart: {
                            height: 300
                        },
                        subtitle: {
                            text: null
                        },
                        navigator: {
                            enabled: false
                        },
                        credits: {
                            enabled: false
                        }
                    }
                }
            ]
        }
    }
}