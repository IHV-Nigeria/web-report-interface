export const  buildLineChat = (
    title, 
    categoriesData,
    seriesData
    )  => {
        console.log(categoriesData)
        console.log()
        console.log(seriesData)
        return {

            title: {
                text: title
            },
        
            yAxis: {
                title: {
                    text: 'Patients'
                }
            },
            xAxis: {
                categories: categoriesData
            },   
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },            
            series:seriesData,
        
            responsive: {
                rules: [
                    {
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }
            ]
            }
        
        }
}
