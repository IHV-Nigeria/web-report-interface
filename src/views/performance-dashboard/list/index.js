
import { Row, Col } from 'reactstrap'
import '@styles/react/apps/app-users.scss'
import UploadList from './components/uploadList'
import Breadcrumbs from '@components/breadcrumbs'
import { Fragment,  useEffect  } from 'react'
import { User, UserPlus, UserCheck, UserX } from 'react-feather'
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'

const UsersList = () => {

  //const [stats, setStats] = useState([])
  
 /*  const updateStats = (stats) => {
  //  setStats(stats)
  } */
  useEffect(() => { }, [])

  return (
    <div className='app-user-list'>
      <Breadcrumbs breadCrumbParent='IHVNCR'  breadCrumbTitle='Performance' breadCrumbActive='Dashboard' />
      <Row lg='7'>       
        <Col lg='12' sm='6'>
         <UploadList />
        </Col>
      </Row>
    </div>
  )
}

export default UsersList
