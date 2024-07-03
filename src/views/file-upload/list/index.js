
import { Row, Col, Label, Button } from 'reactstrap'
import '@styles/react/apps/app-users.scss'
import UploadList from './components/uploadList'
import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useState,  useEffect  } from 'react'
import { User, UserPlus, UserCheck, UserX } from 'react-feather'
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import DatePicker from 'react-date-picker'
import 'react-date-picker/dist/DatePicker.css'
import 'react-calendar/dist/Calendar.css'
import apiRequest from '../../../api/useJwt'

const UsersList = () => {

  const [stats, setStats] = useState([])
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 19).split('T')[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 19).split('T')[0])
  
  const updateStats = (stats) => {
    setStats(stats)
  }
  useEffect(() => { }, [])

//   const fileUploadRequest = () => {
//     return axios({
//         method: 'GET',
//         url: `${jwtConfig.baseUrl}/export/file-upload-status?startDate=${startDate}&endDate=${endDate}`
//     })
// }

const handleSubmit = () => {
  console.log(startDate, endDate)
  apiRequest({
    requetType: 'GET',
    contentType: 'application/json',
    requestUrl: `export/file-upload-status?startDate=${startDate}&endDate=${endDate}`,
    respType: 'blob'
  }).then((response) => {
    if (response && !response.error) {
      const blob = new Blob([response.data])
      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = blobUrl
      a.download = response.headers['content-disposition'].split('filename=')[1] // Set the desired file name with .xls extension
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(blobUrl)
    } else {
      window.alert('Failed to export data, kindly try again later.')
    }
  }).catch((err) => {
    console.log(err)
    window.alert('Failed to export data, kindly try again later.')
  })
}

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
            color='primary'
            statTitle='PROCESSED'
            icon={<UserPlus size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>{stats.processed}</h3>}
          />
        </Col>
        <Col lg='2' sm='6'>
          <StatsHorizontal
            color='success'
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
        <Col lg='3' sm='4'>
            <Col className='mb-1' md='4' sm='4'>
            <Label >Start Date</Label>
            {/* <Flatpickr  locale="es"  value={startDate}  onChange={date => {
              const selectedDate = new Date(date)
              selectedDate.setDate(selectedDate.getDate() + 1)
              const newDate = new Date(selectedDate).toISOString().slice(0, 10).split('T')[0]
                  setStartDate(newDate)
            } } /> */}
            <DatePicker value={startDate} onChange={date => {
              const selectedDate = new Date(date)
              selectedDate.setDate(selectedDate.getDate() + 1)
              const newDate = new Date(selectedDate).toISOString().slice(0, 10).split('T')[0]
                  setStartDate(newDate)
            }}/>
            </Col>
        </Col>
        <Col lg='3' sm='4'>
          <Col className='mb-1' md='4' sm='4'>
            <Label >End Date</Label>
            {/* <Flatpickr  locale="es" value={endDate} onChange={date => { 
              const selectedDate = new Date(date)
              selectedDate.setDate(selectedDate.getDate() + 1)
              const newDate = new Date(selectedDate).toISOString().slice(0, 10).split('T')[0]
              setEndDate(newDate)
            }} /> */}
            <DatePicker value={endDate} onChange={date => { 
              const selectedDate = new Date(date)
              selectedDate.setDate(selectedDate.getDate() + 1)
              const newDate = new Date(selectedDate).toISOString().slice(0, 10).split('T')[0]
              setEndDate(newDate)
            }}/>
          </Col>
        </Col>
        <Col lg='3' sm='6'>
                  <Button className='ms-2' color='primary'  md='12' sm='12' onClick={handleSubmit}>
                    <span className='align-middle ms-50'>Submit</span>
                  </Button>
                  </Col>
        <Col lg='12' sm='6'>
         <UploadList updateStats = {updateStats}/>
        </Col>
      </Row>
    
    </div>
  )
}

export default UsersList
