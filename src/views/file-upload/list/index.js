// ** React Imports
import { Fragment } from 'react'
// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

// ** Custom Components
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import Breadcrumbs from '@components/breadcrumbs'

// ** Icons Imports
import { User, UserPlus, UserCheck, UserX } from 'react-feather'

import LineListTable from './lineListTable'

// ** Styles
import '@styles/react/apps/app-users.scss'

const UsersList = () => {

  return (
    <div className='app-user-list'>
      <Breadcrumbs breadCrumbTitle='Uploads' breadCrumbParent='IHVNCR' breadCrumbActive='Facility Upload' />
      <Row lg='7'>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='primary'
            statTitle='UPLOADED'
            icon={<User size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>21,459</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='danger'
            statTitle='PROCESSED'
            icon={<UserPlus size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>4,567</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='success'
            statTitle='PROCESSING'
            icon={<UserCheck size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>19,860</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='warning'
            statTitle='QUEUED'
            icon={<UserX size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>237</h3>}
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
