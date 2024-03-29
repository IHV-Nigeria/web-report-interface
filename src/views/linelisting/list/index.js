// ** React Imports
import { Fragment, useState } from 'react'
// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

// ** Custom Components
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import IndicatorFilter from './indicatorFilter'


// ** Icons Imports
import { User, UserPlus, UserCheck, UserX } from 'react-feather'

import LineListTable from './lineListTable'

// ** Styles
import '@styles/react/apps/app-users.scss'

const UsersList = () => {
  const [sidebarOpen] = useState(false)

  return (
    <div className='app-user-list'>
      <IndicatorFilter sidebarOpen={sidebarOpen} />
      <Row lg='7'>
      <Col lg='2' sm='6'>
          <StatsHorizontal
            color='primary'
            statTitle='Total Patients'
            icon={<User size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>21,459</h3>}
          />
        </Col>
        <Col lg='2' sm='6'>
          <StatsHorizontal
            color='primary'
            statTitle='Active'
            icon={<User size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>21,459</h3>}
          />
        </Col>
        <Col lg='2' sm='6'>
          <StatsHorizontal
            color='success'
            statTitle='IIT'
            icon={<UserCheck size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>19,860</h3>}
          />
        </Col>
        <Col lg='2' sm='6'>
          <StatsHorizontal
            color='warning'
            statTitle='Tranferred Out'
            icon={<UserX size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>237</h3>}
          />
        </Col>
        <Col lg='2' sm='6'>
          <StatsHorizontal
            color='warning'
            statTitle='Tranferred Out'
            icon={<UserX size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>237</h3>}
          />
        </Col>        
        <Col lg='2' sm='6'>
          <StatsHorizontal
            color='danger'
            statTitle='Dead '
            icon={<UserPlus size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>4,567</h3>}
          />
        </Col>
        <Col lg='12' sm='6'>
        <LineListTable/>
        </Col>
      </Row>
    </div>
  )
}

export default UsersList
