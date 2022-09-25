const colors = ['#01575C', '#59BA89', '#9d9b03', '#08bf7A78020f']

export const  buildBarVLChat = (
    title, 
    y1_title,
    xaxisCategory, 
    x_title, 
    seriesData
    )  => { 

    return  {

    chart: {
        type: 'column'
    },

    title: {
        text: '',
        style: {
            fontSize: '12px'
        }
    },
    xAxis: [
            {
            categories: xaxisCategory,
            title: {
                text: x_title
            },
            type: 'category',
            crosshair: true
        }
    ],
    yAxis: [
        {
            min: 0,
            title: { text: y1_title }
        },

        { // Primary yAxis
            labels: {
                format: '{value}%'
            },
            title: {
                text: "% coverage and % Supression"
            },
            opposite: true,
            max: 100,
            min: 0
        }
    ],
    tooltip: {
        /* formatter: () => {
            return `'<b>' + this.x + '</b><br/>' +
                this.series.name + ': ' + this.y + '<br/>'`
        } */
        pointFormat: '{point.y}'
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    colors,
    series: seriesData,
    exporting: { enabled: false }
    }
}

export const buildThreeColumnBarChartWithDualAxis = (
    title, 
    y1_title, 
    y2_title, 
    xaxisCategory, 
    parent_data, 
    parent_data_name,
    child_data, 
    child_data_name, 
    child_data2, 
    child_data2_name, 
    percent_data, 
    percent_data_name,
    percent_data2, 
    percent_data_name2, 
    useLine, 
    xaxisTitle, 
    height)  => {
    //filter unneeded zero data

//     const xaxisCategory = []
//     parent_data = (parent_data || []).filter((n, i) => {
//         if (n > 0) {
//             return true
//         }

//         xaxisCategory.push(i)
//         return false
//     })
   

//    /*  if (idxsToDelete.length > 0) {
//         xaxisCategory = (xaxisCategory || []).filter((n, i) => !idxsToDelete.includes(i))
//         child_data = (child_data || []).filter((n, i) => !idxsToDelete.includes(i))
//         percent_data = (percent_data || []).filter((n, i) => !idxsToDelete.includes(i))
//         percent_data2 = (percent_data2 || []).filter((n, i) => !idxsToDelete.includes(i))

//     } */
//     console.log(xaxisCategory)

    const series = []

    let hasThousand = false

    if (parent_data.length > 0) {
        series.push({
            name: parent_data_name,
            type: 'column',
            data: parent_data
        })

        hasThousand = hasThousand || parent_data.some(x => Math.abs(x) >= 1000)
    }
    console.log(hasThousand)

    if ((child_data || []).length > 0) {
        series.push({
            name: child_data_name,
            type: 'column',
            data: child_data
        })

     //   hasThousand = hasThousand || child_data.some(x => Math.abs(x) >= 1000)
    }

    if ((child_data2 || []).length > 0) {
        series.push({
            name: child_data2_name,
            type: 'column',
            data: child_data2
        })

     //   hasThousand = hasThousand || child_data.some(x => Math.abs(x) >= 1000)
    }

    const yAxis = [
        { // Secondary yAxis
            title: {
                //text: y1_title + (hasThousand ? " (thousands)" : ""),
                text: y1_title,
                rotation: 270
            },
            labels: {
                formatter:  () => {
                    // return hasThousand ? parseInt(this.value) / 1000 : this.value;
                    //return Highcharts.numberFormat(this.value, 0, '', ' ')
                }
                //format: '{value}'
            },
            max: Math.max.apply(Math, parent_data),
            min: 0
        }
    ]

    if ((percent_data || []).length > 0) {
        const percentSeries = {
            name: percent_data_name,
            type: 'scatter', //useLine ? 'spline' : 'scatter',
            color: "#E46C0A",
            data: percent_data,
            yAxis: 1,
            tooltip: {
                pointFormat: '<b>{point.y:.1f}%</b>'
            },
            marker: {
                radius: 5
            }
        }

        series.push(percentSeries)

        //add its axis
        yAxis.push({ // Primary yAxis
            labels: {
                format: '{value}%'
            },
            title: {
                text: y2_title
            },
            opposite: true,
            max: 100,
            min: 0
        })
    }

    if ((percent_data2 || []).length > 0) {
        const percentSeries2 = {
            name: percent_data_name2,
            type: 'scatter', //useLine ? 'spline' : 'scatter',
            data: percent_data2,
            color: "#7030A0",
            yAxis: 1,
            tooltip: {
                pointFormat: '<b>{point.y:.1f}%</b>'
            },
            marker: {
                radius: 10
            }
        }
        series.push(percentSeries2)
    }

    return {
        chart: {
            zoomType: 'xy',
            height
        },
        title: {
            text: null,
            style: {
                fontSize: '12px'
            }
        },
        xAxis: [
            {
            categories: xaxisCategory,
            crosshair: true,
            title: {
                text: xaxisTitle
            }
        }
    ],
    yAxis,
    tooltip: {
        shared: true
    },
    colors,
    legend: {
        enabled: true
    },
    exporting: { enabled: false },
    series
}
}

export const buildTwoColumnBarChartWithDualAxis = (
    title, 
    y1_title, 
    y2_title, 
    xaxisCategory, 
    parent_data, 
    parent_data_name,
    child_data, 
    child_data_name, 
    percent_data, 
    percent_data_name,
    percent_data2, 
    percent_data_name2, 
    useLine, 
    xaxisTitle, 
    height)  => {

    const series = []

    let hasThousand = false

    if (parent_data.length > 0) {
        series.push({
            name: parent_data_name,
            type: 'column',
            data: parent_data
        })

        hasThousand = hasThousand || parent_data.some(x => Math.abs(x) >= 1000)
    }
    console.log(hasThousand)

    if ((child_data || []).length > 0) {
        series.push({
            name: child_data_name,
            type: 'column',
            data: child_data
        })

     //   hasThousand = hasThousand || child_data.some(x => Math.abs(x) >= 1000)
    }
   

    const yAxis = [
        { // Secondary yAxis
            title: {
                //text: y1_title + (hasThousand ? " (thousands)" : ""),
                text: y1_title,
                rotation: 270
            },
            labels: {
                formatter:  () => {
                    // return hasThousand ? parseInt(this.value) / 1000 : this.value;
                    //return Highcharts.numberFormat(this.value, 0, '', ' ')
                }
                //format: '{value}'
            },
            max: Math.max.apply(Math, parent_data),
            min: 0
        }
    ]

    if ((percent_data || []).length > 0) {
        const percentSeries = {
            name: percent_data_name,
            type: 'scatter', //useLine ? 'spline' : 'scatter',
            color: "#E46C0A",
            data: percent_data,
            yAxis: 1,
            tooltip: {
                pointFormat: '<b>{point.y:.1f}%</b>'
            },
            marker: {
                radius: 5
            }
        }

        series.push(percentSeries)

        //add its axis
        yAxis.push({ // Primary yAxis
            labels: {
                format: '{value}%'
            },
            title: {
                text: y2_title
            },
            opposite: true,
            max: 100,
            min: 0
        })
    }  
    
    if ((percent_data2 || []).length > 0) {
        const percentSeries2 = {
            name: percent_data_name2,
            type: 'scatter', //useLine ? 'spline' : 'scatter',
            data: percent_data2,
            color: "#7030A0",
            yAxis: 1,
            tooltip: {
                pointFormat: '<b>{point.y:.1f}%</b>'
            },
            marker: {
                radius: 10
            }
        }
        series.push(percentSeries2)
    }


    return {
        chart: {
            zoomType: 'xy',
            height
        },
        title: {
            text: null,
            style: {
                fontSize: '12px'
            }
        },
        xAxis: [
            {
            categories: xaxisCategory,
            crosshair: true,
            title: {
                text: xaxisTitle
            }
        }
    ],
    yAxis,
    tooltip: {
        shared: true
    },
    colors,
    legend: {
        enabled: true
    },
    exporting: { enabled: false },
    series
}
}
