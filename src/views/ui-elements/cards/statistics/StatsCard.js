// ** Third Party Components
import classnames from 'classnames'
import { Calendar, User, Box, DollarSign, Home } from 'react-feather'
import * as Icon from 'react-feather'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col } from 'reactstrap'

const StatsCard = props =>  {

  const renderData = () => {
    return props?.dashboardStats?.map((item, index) => {
      const data = {
        title: item.type,
        subtitle: item.description,
        stats: item.value,
        isNative: false,
        color: 'light-primary',
        icon: <Calendar size={18} />
      }
      const colMargin = Object.keys(props.cols)
      const margin = index === 2 ? 'sm' : colMargin[0]
      return (
        <Col
          key={index}
        
          className={classnames({
            [`mb-2 mb-${margin}-0`]: index !== data.length - 1
          })}
        >
          <div className='d-flex align-items-center'>
            <div className='my-auto stats-width '>
              <h4 className='fw-bolder mb-0 annoucement-title' >
                <Avatar color={item.color} icon={item.icon} className='me-2' />
                  {item.title}
                </h4>
                <h2 className='font-medium-5'>
                 <span className='text-dark me-1000'>{item.stats}</span>
                  <span className='text-success me-10 dasboarb-stats-subtitle'> 
                  {!item.isNative ? (
                    <Icon.ArrowUp size={14} className='ms-25 text-success' />
                  ) : (
                    <Icon.ArrowDown size={14} className='ms-25 text-danger' />
                  )}
                  12%  
                  </span>
                  <span className='fw-normal dasboarb-stats-subtitle'>{item.subtitle}</span>
                </h2>              
            </div>
          </div>
        </Col>
      )
    })
  }

  return (
    <Card className='card-statistics' style={{
      backgroundColor:'#fff'
    }}>
    
      <CardBody className='statistics-body'>
        <Row>{renderData()}</Row>
      </CardBody>
    </Card>
  )
}

export default StatsCard
