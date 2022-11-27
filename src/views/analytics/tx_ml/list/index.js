import {useEffect,  React, useState } from 'react'
import { 
  Row, 
  Col,
  Card, 
  CardBody, 
  CardImg,  
  CardHeader,
  CardTitle,
  CardText  
} from 'reactstrap'
import Highcharts from 'highcharts'
import {useSelector} from 'react-redux'
import IndicatorFilter from './indicatorFilter'

import HighchartsMore from "highcharts/highcharts-more"
import HighchartsReact from 'highcharts-react-official'
import { User, UserPlus, UserCheck, UserX } from 'react-feather'
import {fetchGetTXMLAnalytics, buildTxmlChart } from  '../../../../api/txmlService'
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
HighchartsMore(Highcharts) 

import '@styles/react/apps/app-users.scss'

const UsersList = () => {
  const [sidebarOpen] = useState(false)
  const [chartSeries, setChartSeries] = useState([])
//  const [sexSeries, setSexSeries] = useState([])
  const chartData = useSelector(state => state.analytics)
  
  const dashboardStats = () => {
    fetchGetTXMLAnalytics(chartData.getChatData).then((response) => {
        console.log(response.data)
        setChartSeries(buildTxmlChart(response.data))       
        }).catch((err) => {
          console.log(err)
        })  
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
         
        <Col lg='12' sm='12'>     
          {chartData.getChatData.indicator  !== undefined  &&  
              <Card className='card-revenue-budget'>
              <CardHeader>
                <CardTitle tag='h4'>TX_ML Cascade by Quarter </CardTitle>
              </CardHeader>
              <CardBody> 
                <HighchartsReact  highcharts={Highcharts}  options={chartSeries} />  
              </CardBody>
            </Card>
          }
        </Col>   
        
      </Row>
    </div>
  )
}

export default UsersList
