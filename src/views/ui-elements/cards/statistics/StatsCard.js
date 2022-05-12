// ** Third Party Components
import classnames from 'classnames'
import { Calendar, User, Box, DollarSign, Home } from 'react-feather'
import * as Icon from 'react-feather'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col } from 'reactstrap'

const StatsCard = ({ cols }) => {
  const data = [
    {
      title: 'TX_CURR',
      subtitle: 'form Last Quarter',
      stats: '150K',
      isNative: false,
      color: 'light-primary',
      icon: <Calendar size={18} />
    },
    {
      title: 'TX_NEW',
      subtitle: 'as at May 21 2021',
      stats: '234K',
      isNative: false,
      color: 'light-info',
      icon: <Calendar size={18} />
    },
    {
      title: 'IIT',
      subtitle: 'as at March  2021',
      stats: '43K',
      isNative: false,
      color: 'light-danger',
      icon: <Home size={18} />
    },
    {
      title: 'PVLS',
      subtitle: '90% Suppressed',
      stats: '43K',
      isNative: false,
      color: 'light-danger',
      icon: <Home size={18} />
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
