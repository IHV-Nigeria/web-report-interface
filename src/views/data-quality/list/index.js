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
      <Breadcrumbs breadCrumbTitle='Data quality & issues' breadCrumbParent='IHVNCR' breadCrumbActive='Data Quality' />
      <Row lg='7'>
        <Col lg='4' sm='6'>
          <StatsHorizontal
            color='primary'
            statTitle='Total Patients'
            icon={<User size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>21,459</h3>}
          />
        </Col>
        <Col lg='4' sm='6'>
          <StatsHorizontal
            color='danger'
            statTitle='Patients with errors'
            icon={<UserPlus size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>4,567</h3>}
          />
        </Col>
        <Col lg='4' sm='6'>
          <StatsHorizontal
            color='warning'
            statTitle='Percentage Score'
            icon={<UserX size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>70%</h3>}
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
