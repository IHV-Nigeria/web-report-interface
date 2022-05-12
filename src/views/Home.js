import { Fragment, useContext } from 'react'
import { Card, CardHeader, CardBody, CardTitle, CardText, CardLink, Col, Row } from 'reactstrap'
import NotificationCard from '@src/views/ui-elements/cards/statistics/NotificationCard'
import StatsCard from '@src/views/ui-elements/cards/statistics/StatsCard'
import TXCURRByAgeReport from '@src/views/ui-elements/cards/analytics/TXCURRByAgeReport'

import Revenue from '@src/views/ui-elements/cards/analytics/Revenue'
import { ThemeColors } from '@src/utility/context/ThemeColors'


const Home = () => {
  const context = useContext(ThemeColors)
  return (
    <div>
       <Col xl='12' md='12' xs='12'>
          <NotificationCard cols={{ xl: '4', sm: '6' }}  />
        </Col>

        <Col xl='12' md='12' xs='12'>
          <StatsCard cols={{ xl: '3', sm: '6' }}  />
        </Col>
        <Row className='match-height'>
          <Col lg='6' sm='12'>
            <Revenue primary={context.colors.primary.main} />
          </Col>
          <Col lg='6' sm='12'>
            <TXCURRByAgeReport primary={context.colors.primary.main} info={context.colors.info.main} />
          </Col>
      </Row>
    </div>
  )
}

export default Home
