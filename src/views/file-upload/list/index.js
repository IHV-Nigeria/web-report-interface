
import { Row, Col } from 'reactstrap'
import '@styles/react/apps/app-users.scss'
import UploadList from './components/uploadList'
import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useState,  useEffect  } from 'react'
import { User, UserPlus, UserCheck, UserX } from 'react-feather'
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'

const UsersList = () => {

  const [stats, setStats] = useState([])
  
  const updateStats = (stats) => {
    setStats(stats)
  }
  useEffect(() => { }, [])

  return (
    <div className='app-user-list'>
      <Breadcrumbs breadCrumbTitle='Uploads' breadCrumbParent='IHVNCR' breadCrumbActive='Facility Upload' />
      <Row lg='7'>
        <Col lg='2' sm='6'>
          <StatsHorizontal
            color='primary'
            statTitle='UPLOADED'
            icon={<User size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>{stats.uploaded}</h3>}
          />
        </Col>
        <Col lg='2' sm='6'>
          <StatsHorizontal
            color='success'
            statTitle='PROCESSED'
            icon={<UserPlus size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>{stats.processed}</h3>}
          />
        </Col>
        <Col lg='2' sm='6'>
          <StatsHorizontal
            color='primary'
            statTitle='PROCESSING'
            icon={<UserCheck size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>{stats.processing}</h3>}
          />
        </Col>
        <Col lg='2' sm='6'>
          <StatsHorizontal
            color='warning'
            statTitle='QUEUED'
            icon={<UserX size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>{stats.queued}</h3>}
          />
        </Col>
        <Col lg='2' sm='6'>
          <StatsHorizontal
            color='danger'
            statTitle='FAILED'
            icon={<UserX size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>{stats.failed}</h3>}
          />
        </Col>
        <Col lg='12' sm='6'>
         <UploadList updateStats = {updateStats}/>
        </Col>
      </Row>
    </div>
  )
}

export default UsersList
