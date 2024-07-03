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
      console.log('Item stat:', item)
      const data = {
        title: item.type,
        subtitle: item.description,
        stats: item.value,
        isNative: item.percentage < 0,
        color: '#526d27',
        icon: <Calendar size={18} />
      }
      console.log(data)
      const colMargin = Object.keys(props.cols)
      const margin = index === 2 ? 'sm' : colMargin[0]
      return (
        <Col
          key={index}
        
          className={classnames({
            [`mb-2 mb-${margin}-0`]: index !== props?.dashboardStats.length - 1
          })}
        >
          <div className='d-flex align-items-center'>
            <div className='my-auto stats-width '>
              <h4 className='fw-bolder mb-0 annoucement-title' >
                <Avatar color={item.color} icon={data.icon} className='me-2' style ={{
                  color:"#fff",
                  backgroundColor : "#526d27"
                }} />
                  {data.title}
                </h4>
                <h2 className='font-medium-5'>
                 <span className='text-dark me-1000'>{data.stats}</span>
                  {!data.isNative ? (
                    <span className='text-success me-10 dasboarb-stats-subtitle'>
                      <Icon.ArrowUp size={14} className='ms-25 text-success' />
                      {item.percentage}%  
                    </span>
                  ) : (
                    <span className='text-danger me-10 dasboarb-stats-subtitle'>
                      <Icon.ArrowDown size={14} className='ms-25 text-danger' />
                      {item.percentage}%  
                    </span>
                  )}
                  <span className='fw-normal dasboarb-stats-subtitle'>{data.subtitle}</span>
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
    
      <CardBody className='statistics-body' style={{
            backgroundColor: "rgb(206 255 56 / 19%)",
            borderRradius: "10px"
      }}>
        <Row>{renderData()}</Row>
      </CardBody>
    </Card>
  )
}

export default StatsCard
