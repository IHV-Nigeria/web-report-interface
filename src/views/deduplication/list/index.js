// ** React Imports
import { useState } from 'react'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

// ** Custom Components
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import IndicatorFilter from './indicatorFilter'


// ** Icons Imports
import { Shield } from 'react-feather'
// import { ThemeColors } from '@src/utility/context/ThemeColors'

import LineListTable from './lineListTable'

// ** Styles
import '@styles/react/apps/app-users.scss'

const options = {
  chart: {
    stacked: true,
    type: 'column',
    toolbar: { show: false },
    gridLineColor: 'ffffff'
  },
  title: {
    text: 'Fingerprint Deduplication'
  },
  xAxis: {
    categories: ['FCT', 'Katsina', 'Nasarawa', 'Rivers'],
    gridLineColor: 'ffffff'
  },
  yAxis: {
    title: {
      text: 'No of Patients'
  },  
  gridLineColor: 'ffffff'
},
plotOptions: {
  
  column: {
    borderWidth: 0,
    pointWidth: 70
  }
},
// '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'

colors: ['#24CBE5', '#DDDF00', '#ED561B'],
series: [
          {
            type: 'column',
            name: 'Total Fingerprints',
            data: [30500, 20080, 10900, 39030]
          }, {
              type: 'column',
              name: 'Duplicates',
              data: [10048, 7100, 5300, 12049]
          }, {
              type: 'column',
              name: 'Deduplicated',
              data: [8048, 3890, 2020, 6809]
          }

        ]
}

const UsersList = () => {
  const [sidebarOpen] = useState(false)
//  const context = useContext(ThemeColors)

  return (
    <div className='app-user-list'>
      
      
      <IndicatorFilter sidebarOpen={sidebarOpen} />
      <Row lg='7'>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='primary'
            statTitle='Total Fingerprints'
            icon={<Shield size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>21,459</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='danger'
            statTitle='Valid Fingerprints'
            icon={<Shield size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>4,567</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='success'
            statTitle='Invalid Fingerprints'
            icon={<Shield size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>19,860</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='warning'
            statTitle='Percentage Valid'
            icon={<Shield size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>67%</h3>}
          />
        </Col>

        <Col lg='12' sm='12'>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </Col>
          
        
        <Col lg='12' sm='6'>        
        <LineListTable/>        
        </Col>

        
      </Row>
      
    </div>
  )
}

export default UsersList
