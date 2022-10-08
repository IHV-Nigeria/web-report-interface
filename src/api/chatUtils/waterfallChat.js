const colors = ['#01575C', '#59BA89', '#9d9b03', '#08bf7A78020f']
export const  buildWaterFallChart = (
    title,    
    seriesData
    )  =>  {
        return {
    chart: {
        type: 'waterfall'
    },

    title: {
        text: title
    },

    xAxis: {
        type: 'category'
    },

    yAxis: {
        title: {
            text: 'Patients'
        }
    },

    legend: {
        enabled: false
    },

    tooltip: {
        pointFormat: '<b>${point.y:,.2f}</b> USD'
    },

    series: [
        {
        upColor: colors[2],
        color: colors[3],
        data: seriesData,
        dataLabels: {
            enabled: true,
            /* formatter:  () => {
                return point.y//Highcharts.numberFormat(this.y / 1000, 0, ',') + 'k'
            }, */
            style: {
                fontWeight: 'bold'
            }
        },
        pointPadding: 0
    }
    ]
}
}