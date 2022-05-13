// ** React Imports
import { Fragment, useState, useContext } from 'react'
import DeduplicationReport from '@src/views/ui-elements/cards/analytics/DeduplicationReport'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

// ** Custom Components
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import IndicatorFilter from './indicatorFilter'


// ** Icons Imports
import { User, UserPlus, UserCheck, UserX, Shield } from 'react-feather'
import { ThemeColors } from '@src/utility/context/ThemeColors'

import LineListTable from './lineListTable'

// ** Styles
import '@styles/react/apps/app-users.scss'

const UsersList = () => {
  const [sidebarOpen] = useState(false)
  const context = useContext(ThemeColors)

  return (
    <div className='app-user-list'>
      
      
      <IndicatorFilter sidebarOpen={sidebarOpen} />
      <Row lg='7'>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='primary'
            statTitle='Total Fingerprints'
            icon={<Shield size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>21,459</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='danger'
            statTitle='Valid Fingerprints'
            icon={<Shield size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>4,567</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='success'
            statTitle='Invalid Fingerprints'
            icon={<Shield size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>19,860</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='warning'
            statTitle='Percentage Valid'
            icon={<Shield size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>67%</h3>}
          />
        </Col>

        <Col lg='12' sm='12'>
            <DeduplicationReport primary={context.colors.primary.main} />
        </Col>
          
        
        <Col lg='12' sm='6'>        
        <LineListTable/>        
        </Col>

        
      </Row>
      
    </div>
  )
}

export default UsersList
