import {useEffect,  React, useState } from 'react'
import { Row, Col, Card, CardBody, CardImg  } from 'reactstrap'
import Highcharts from 'highcharts'
import {useSelector} from 'react-redux'
import IndicatorFilter from './indicatorFilter'

import drilldown from 'highcharts/modules/drilldown'
import HighchartsReact from 'highcharts-react-official'
import { User, UserPlus, UserCheck, UserX } from 'react-feather'
import {fetchDashboardChart, getChartData} from  '../../../api/dashboardService'
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
drilldown(Highcharts) 

import '@styles/react/apps/app-users.scss'

const UsersList = () => {
  const [sidebarOpen] = useState(false)
  const [chartSeries, setChartSeries] = useState([])
  const chartData = useSelector(state => state.analytics)
  const categoriesList = [
    '<1', '1-4', '  5-9', '10-14', '15-19',
    '20-24', '25-29', '30-34', '35-39', '40-44',
    '45-49', '50-54', '55-59', '60-64', '  65+'
  ]

  const dashboardStats = () => {
   if (chartData.getChatData.indicator  !== undefined && chartData.getChatData.indicator  !== '') {
      fetchDashboardChart(chartData.getChatData).then((response) => {
        setChartSeries(getChartData(response.data, chartData.getChatData.indicator))
      }).catch((err) => {
        console.log(err)
      }) 
/* 
    Object.entries(chartData.getAgeRageCharts).forEach((item) => {
      const [first, ageBands] = item

     const  seriesData = []


      categoriesList.forEach((item) => {   
        const ageBandsValue = ageBands.filter(ageBand => { return  ageBand.key === item })
        console.log(ageBandsValue)
        seriesData.push(ageBandsValue.value)
       })
       console.log(seriesData)

       console.log(first)
    }) */


    } 
    

  }


const ageRage = {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Population pyramid for Germany, 2018'
    },
    subtitle: {
        text: 'Source: <a href="http://populationpyramid.net/germany/2018/">Population Pyramids of the World from 1950 to 2100</a>'
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

    series: [
      {
        name: 'Male',
        data: [
            -2.2, -2.1, -2.2, -2.4,
            -2.7, -3.0, -3.3, -3.2,
            -2.9, -3.5, -4.4, -4.1,
            -3.4, -2.7, -2.3, -2.2,
            -1.6, -0.6, -0.3, -0.0,
            -0.0
        ]
    }, {
        name: 'Female',
        data: [
            2.1, 2.0, 2.1, 2.3, 2.6,
            2.9, 3.2, 3.1, 2.9, 3.4,
            4.3, 4.0, 3.5, 2.9, 2.5,
            2.7, 2.2, 1.1, 0.6, 0.2,
            0.0
        ]
    }
  ]
}

  useEffect(() => {
    dashboardStats()
  }, [chartData]) 

  return (
    <div className='app-user-list'>
      <IndicatorFilter sidebarOpen={sidebarOpen} />
      <Row lg='7'>
        <Col lg='4' sm='6'>
          <StatsHorizontal
            color='primary'
            statTitle='PATIENTS'
            icon={<User size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>{(chartData.getStats !== undefined) ? chartData.getStats.txCurrStateCount : 0}</h3>}
          />
        </Col>
        <Col lg='4' sm='6'>
          <StatsHorizontal
            color='danger'
            statTitle='FACILITIES'
            icon={<UserPlus size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>{(chartData.getStats !== undefined) ? chartData.getStats.numberOfFacilities : 0}</h3>}
          />
        </Col>
        <Col lg='4' sm='6'>
          <StatsHorizontal
            color='success'
            statTitle='STATES'
            icon={<UserCheck size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>{(chartData.getStats !== undefined) ? chartData.getStats.numberOfStates : 0}</h3>}
          />
        </Col> 


        {chartData.getChatData.indicator  === undefined  && <Col className='kb-search-content' md='12' sm='12'>
          <Card style={{
                display: "flex",
                alignItems: "center"
          }}>
              <CardImg src={require('@src/assets/images/illustration/api.svg').default} alt='knowledge-base-image' top  style={{
                    width: "300px"
              }}/>
              <CardBody className='text-center'>
                <h4>Select an indicator to get started</h4>
                <p className='text-body mt-1 mb-0'></p>
              </CardBody>
          </Card>
        </Col>}
      
         
        <Col lg='12' sm='12'>     
            {chartData.getChatData.indicator  !== undefined  &&  <HighchartsReact  highcharts={Highcharts}  options={chartSeries} />  }
        </Col> 
        <Col lg='12' sm='12'>

        <HighchartsReact  highcharts={Highcharts}  options={ageRage} />
        </Col> 
      </Row>
    </div>
  )
}

export default UsersList
