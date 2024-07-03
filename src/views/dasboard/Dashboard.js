import { useContext, useState, useEffect } from 'react'
import {Col, Row } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import { ThemeColors } from '@src/utility/context/ThemeColors'

import StatsCard from '../dasboard/components/StatsCard' 
import NotificationCard from '../dasboard/components/NotificationCard'
import TXCurrLineChart from '../dasboard/components/TXCurrLineChart'
import TXCURRByAgeReport from '../dasboard/components/TXCURRByAgeReport'
import {fetchDashboardStats} from  '../../api/dashboardService'
import { Calendar, User, Box, DollarSign, Home } from 'react-feather'
import FeatherIcon from 'feather-icons-react'

const Dashboard = () => {
  const context = useContext(ThemeColors)
  const [stats, setStats] = useState([])

  const data = [
    {
      title: 'Quarter ends in 117 days',
      subtitle: 'Programme alerts',
      color: 'light-primary',
      icon: <Calendar size={24} />
    },
    {
      title: 'SAPR starts in 30 days',
      subtitle: 'Programme alerts',
      color: 'light-info',
      icon: <Calendar size={24} />
    },
    {
      title: '384 Reporting Facilities (100%)',
      subtitle: 'Total  facilites = 384',
      color: 'light-danger',
      icon: <FeatherIcon icon="close" size="24"  fill="black" />
    }
  ]

  // ** State
  const dashboardStats = () => {
  fetchDashboardStats().then((response) => {
    setStats(response.data)
   }).catch((err) => {
     console.log(err)
   }) 
  }

  useEffect(() => {
    dashboardStats()
  }, []) 
  return (
    <div>
      <Breadcrumbs breadCrumbTitle='Summary Report' breadCrumbParent='IHVNCR' breadCrumbActive='Summary Report' />
       <Col xl='12' md='12' xs='12'>
          <NotificationCard cols={{ xl: '4', sm: '6' }} data={data} />
        </Col>

        <Col xl='12' md='12' xs='12'>
          <StatsCard cols={{ xl: '3', sm: '6' }}   dashboardStats={stats?.dashboardStats}/>
        </Col>
        <Row className='match-height'>
          <Col lg='6' sm='12'>
          <TXCurrLineChart primary={context.colors.primary.main} stats={stats?.txCurrByState} lineChatSeries={stats?.lineChatSeries} categories={stats?.categories}/>
         </Col>
          <Col lg='6' sm='12'>
            <TXCURRByAgeReport primary={context.colors.primary.main} 
            info={context.colors.info.main}  
            genderStats={stats?.txCurrByGender} 
            demographyStats={stats?.txCurrByDemography}/>
          </Col>
      </Row>
    </div>
  )
}

export default Dashboard
