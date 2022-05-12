// ** React Imports
import { Fragment, useState } from 'react'
// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

// ** Custom Components
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import Sidebar from './Sidebar'


// ** Icons Imports
import { User, UserPlus, UserCheck, UserX } from 'react-feather'

import TableWithButtons from './TableWithButtons'

// ** Styles
import '@styles/react/apps/app-users.scss'

const UsersList = () => {
  const [sidebarOpen] = useState(false)

  return (
    <div className='app-user-list'>
      <Sidebar sidebarOpen={sidebarOpen} />
      <Row lg='7'>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='primary'
            statTitle='Total Users'
            icon={<User size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>21,459</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='danger'
            statTitle='Paid Users'
            icon={<UserPlus size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>4,567</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='success'
            statTitle='Active Users'
            icon={<UserCheck size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>19,860</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='warning'
            statTitle='Pending Users'
            icon={<UserX size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>237</h3>}
          />
        </Col>
        <Col lg='12' sm='6'>
        <TableWithButtons/>
        </Col>
      </Row>
    </div>
  )
}

export default UsersList
