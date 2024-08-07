import {useEffect,  React, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
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

import drilldown from 'highcharts/modules/drilldown'
import HighchartsReact from 'highcharts-react-official'
import { User, UserPlus, UserCheck, UserX } from 'react-feather'
import {fetchDashboardChart, getChartData, buildButerFlyChat, buildDonut } from  '../../../../api/treatmentService'
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
drilldown(Highcharts) 

import '@styles/react/apps/app-users.scss'

const UsersList = () => {
  const [sidebarOpen] = useState(false)
  const [chartSeries, setChartSeries] = useState([])
  const [ageRageSeries, setAgeRageSeries] = useState([])
  const [sexSeries, setSexSeries] = useState([])
  const chartData = useSelector(state => state.analytics)

  const dashboardStats = () => {
    if (chartData.getChatData.indicator  !== undefined && chartData.getChatData.indicator  !== '') {
        fetchDashboardChart(chartData.getChatData).then((response) => {
          setChartSeries(getChartData(response.data, chartData.getChatData.indicator))
          setAgeRageSeries(buildButerFlyChat(chartData.getAgeRageCharts.tx_male_female_age_groups))
          setSexSeries(buildDonut(chartData.getAgeRageCharts.tx_sex))
        }).catch((err) => {
          console.log(err)
        })  
    }
  }

  useEffect(() => {
    dashboardStats()
  }, [chartData]) 

  return (
    
    <div className='app-user-list'>
      <Breadcrumbs breadCrumbTitle='Analytics' breadCrumbParent='IHVNCR' breadCrumbActive='Treatment Reports' />
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
          {chartData.getChatData.indicator  !== undefined  &&  
              <Card className='card-revenue-budget'>
              <CardHeader>
                <CardTitle tag='h4'>{chartData.getChatData.indicator}  by State</CardTitle>
              </CardHeader>
              <CardBody> 
                <HighchartsReact  highcharts={Highcharts}  options={chartSeries} />  
              </CardBody>
            </Card>
          }
        </Col> 
        <Col lg='6' sm='12'>   
        {
          chartData.getChatData.indicator  !== undefined  && 
            <Card className='card-revenue-budget'>
              <CardHeader>
                <CardTitle tag='h4'>{chartData.getChatData.indicator}  by Age Groups </CardTitle>
              </CardHeader>
              <CardBody>     
                <HighchartsReact  highcharts={Highcharts}  options={ageRageSeries} />
              </CardBody>
            </Card>
          }
        </Col> 
        <Col lg='6' sm='12'>        
           {
           chartData.getChatData.indicator  !== undefined  && 
           <Card className='card-revenue-budget'>
            <CardHeader>
              <CardTitle tag='h4'>{chartData.getChatData.indicator} by Sex </CardTitle>
            </CardHeader>
            <CardBody> 
                <HighchartsReact  highcharts={Highcharts}  options={sexSeries} />
            </CardBody>
            </Card>
           }
        </Col> 
      </Row>
    </div>
  )
}

export default UsersList
