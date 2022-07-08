
import { Row, Col, Button} from 'reactstrap'
import '@styles/react/apps/app-users.scss'
import UserList from './components/userList'
import Breadcrumbs from '@components/breadcrumbs'
import { useState, useEffect  } from 'react'
import { Plus } from 'react-feather'
import AddUser from './components/addUser'


const UsersList = () => {
  const [modal, setModal] = useState(false)

  useEffect(() => { }, [])
  
  // ** Function to handle Modal toggle
  const handleModal = () => setModal(!modal)
  return (
    <div className='app-user-list'>
      <div className='content-header row'>
      <Breadcrumbs breadCrumbTitle='Users' breadCrumbParent='IHVNCR' breadCrumbActive='Users List'/>
      <div className='content-header-right text-md-end col-md-3 col-12 d-md-block d-none'>
        <div className='breadcrumb-right dropdown'>
          <Button className='ms-2' color='primary' onClick={handleModal}>
              <Plus size={15} />
              <span className='align-middle ms-50'>Add New User</span>
          </Button>
        </div>
      </div>
      </div>
      <Row lg='12'>       
        <Col lg='12' sm='6'>
         <UserList />
        </Col>
      </Row>
      <AddUser  open={modal} handleModal={handleModal} />

    </div>
  )
}

export default UsersList
