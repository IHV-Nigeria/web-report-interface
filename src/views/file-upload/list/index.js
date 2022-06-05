
import { Row, Col } from 'reactstrap'
import { toast } from 'react-toastify'
import '@styles/react/apps/app-users.scss'
import LineListTable from './components/lineListTable'
import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useState,  useEffect  } from 'react'
import {fetchStatsData} from '../../../api/uploadService'
import { User, UserPlus, UserCheck, UserX } from 'react-feather'
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'

const UsersList = () => {

  const [stats, setStats] = useState([])
  const fetchStats = async() => {
    fetchStatsData().then((response) => {
      setStats(response.data)    
    }).catch((err) => {
      toast.error(err, { icon: false, hideProgressBar: true })
    })    
  }

  useEffect(() => {
   fetchStats(1)
  }, [])

  return (
    <div className='app-user-list'>
      <Breadcrumbs breadCrumbTitle='Uploads' breadCrumbParent='IHVNCR' breadCrumbActive='Facility Upload' />
      <Row lg='7'>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='primary'
            statTitle='UPLOADED'
            icon={<User size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>{stats.filesUploaded}</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='danger'
            statTitle='PROCESSED'
            icon={<UserPlus size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>{stats.filesProcessed}</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='success'
            statTitle='PROCESSING'
            icon={<UserCheck size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>{stats.filesProcessing}</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='warning'
            statTitle='QUEUED'
            icon={<UserX size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>{stats.filesQuequed}</h3>}
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
