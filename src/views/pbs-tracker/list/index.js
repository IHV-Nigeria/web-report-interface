// ** React Imports
import { Fragment, useState} from 'react'

import RevenueReport from '@src/views/ui-elements/cards/analytics/RevenueReport'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

// ** Custom Components
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import IndicatorFilter from './indicatorFilter'


// ** Icons Imports
import { User, UserPlus, UserCheck, UserX } from 'react-feather'

import { ThemeColors } from '@src/utility/context/ThemeColors'
import LineListTable from './lineListTable'

// ** Styles
import '@styles/react/apps/app-users.scss'

const options = {
  chart: {
    stacked: true,
    type: 'column',
    toolbar: { show: false }
  },
  title: {
    text: 'PBS Achievement'
  },
  xAxis: {
    categories: ['FCT', 'Katsina', 'Nasarawa', 'Rivers']
},
plotOptions: {
  
  column: {
    borderWidth: 0,
    pointWidth: 70
}
},
series: [
  {
    type: 'column',
    name: 'TxCurr',
    data: [300, 280, 1000, 300]
}, {
    type: 'column',
    name: 'Captured',
    data: [148, 100, 500, 149]
}, {
    type: 'column',
    name: 'Usable',
    data: [148, 100, 500, 149]
}

]
}


const UsersList = () => {
  const [sidebarOpen] = useState(false)
  //const context = useContext(ThemeColors)
  return (
    <div className='app-user-list'>
      <IndicatorFilter sidebarOpen={sidebarOpen} />
      <Row lg='7'>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='primary'
            statTitle='Active Patients'
            icon={<User size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>21,459</h3>}
          />
        </Col>
        
        <Col lg='3' sm='6'>
          <StatsHorizontal 
            color='success'
            statTitle='Total Captured'
            icon={<UserCheck size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>19,860</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='danger'
            statTitle='Unusable Prints'
            icon={<UserPlus size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>4,567</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='warning'
            statTitle='Duplicate Patients'
            icon={<UserX size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>5,678</h3>}
          />
        </Col>
      </Row>
      
      <Row className='match-height'>
      <Col lg='12' sm='12'>
      <div>
    <HighchartsReact highcharts={Highcharts} options={options} />
  </div>
          </Col>
          
      </Row>
    </div>
  )
}

export default UsersList
