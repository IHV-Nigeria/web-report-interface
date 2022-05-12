// ** Third Party Components
import classnames from 'classnames'
import { Calendar, User, Box, DollarSign, Home } from 'react-feather'
import FeatherIcon from 'feather-icons-react'
// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col } from 'reactstrap'

const NotificationCard = ({ cols }) => {
  const data = [
    {
      title: 'Quarter ends in 117 days',
      subtitle: 'Programme alerts',
      color: 'light-primary',
      icon: <Calendar size={24} />
    },
    {
      title: 'SAPR starts in 30 days',
      subtitle: 'Programme alerts',
      color: 'light-info',
      icon: <Calendar size={24} />
    },
    {
      title: '200 Reporting Facilities (98%)',
      subtitle: 'Total  facilites = 360',
      color: 'light-danger',
      icon: <FeatherIcon icon="close" size="24"  fill="black" />
    }
  ]

  const renderData = () => {
    return data.map((item, index) => {
      const colMargin = Object.keys(cols)
      const margin = index === 2 ? 'sm' : colMargin[0]
      return (
        <Col
          key={index}
          {...cols}
          className={classnames({
            [`mb-2 mb-${margin}-0`]: index !== data.length - 1
          })}
        >
          <div className='d-flex align-items-center'>
            <Avatar color={item.color} icon={item.icon} className='me-2' />
            <div className='my-auto'>
              <h4 className='fw-bolder mb-0 annoucement-title' >{item.title}</h4>
              <CardText className='font-small-3 mb-0 annoucement-subtitle' >{item.subtitle}</CardText>
            </div>
          </div>
        </Col>
      )
    })
  }

  return (
    <Card className='card-statistics' style={{
      backgroundColor:'#FCF8F8'
    }}>
      <CardHeader className='custom-card-header'>
        <CardTitle tag='h4'>Notifications</CardTitle>
      </CardHeader>
      <CardBody className='statistics-body'>
        <Row>{renderData()}</Row>
      </CardBody>
    </Card>
  )
}

export default NotificationCard
