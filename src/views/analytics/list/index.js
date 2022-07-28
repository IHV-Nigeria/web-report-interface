// ** React Imports
import { React, useState, useEffect } from 'react'
// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

// ** Custom Components
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import IndicatorFilter from './indicatorFilter'

import {useSelector, useDispatch} from 'react-redux'
import { getChatData, getStats } from '../store'
// ** Icons Imports
import { User, UserPlus, UserCheck, UserX } from 'react-feather'

import Highcharts from 'highcharts'
import drilldown from 'highcharts/modules/drilldown'
import HighchartsReact from 'highcharts-react-official'

drilldown(Highcharts)

// ** Styles
import '@styles/react/apps/app-users.scss'

const UsersList = () => {
  const [sidebarOpen] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getChatData({ 
      states:"",
      lgas:"",
      facilities:"",
      ageRange:"",
      indicator:"TX_CURR",
      sex:""
    })) 

    dispatch(getStats({ 
      states:"",
      lgas:"",
      facilities:"",
      ageRange:"",
      indicator:"TX_CURR",
      sex:""
    }))  
  }, [])   

 const chartData = useSelector(state => state.analytics)


// Age categories
const categoriess =  [
  {
    name: "25 +",
    y: 1555293
  },
  {
    name: "20 - 24",
    y: 107980
  },
  {
    name: "10 - 19",
    y: 51435
  },
  {
    name: "≤ 9",
    y: 22870
  }
]

const age = {
  chart: {
      type: 'bar'
  },
  title: {
      text: 'Patients Currently Receiving ART by Sex and Age Group'
  },
  subtitle: {
      text: ''
  },
  accessibility: {
      point: {
          valueDescriptionFormat: '{index}. Age {xDescription}, {value}%.'
      }
  },
  xAxis: [
    {
      categories: categoriess,
      reversed: false,
      labels: {
          step: 1
      },
      accessibility: {
          description: 'Age (male)'
      }
  }, { // mirror axis on right side
      opposite: true,
      reversed: false,
      categories: categoriess,
      linkedTo: 0,
      labels: {
          step: 1
      },
      accessibility: {
          description: 'Age (female)'
      }
  }
],
  yAxis: {
      title: {
          text: null
      },
      accessibility: {
          description: 'Percentage population',
          rangeDescription: 'Range: 0 to 5%'
      }
  },
  colors: [
    '#a3a8e2',
    '#494fa3'
],
  plotOptions: {
      series: {
          stacking: 'normal'
      }
  },
  series: [
    {
      name: 'Male',
      data: [
        -18,
        -3072,
        -8457,
        -11293,
        -12495,
        -40617,
        -74093,
        -89355,
        -85184,
        -94760,
        -73505,
        -126008
      ]
  }, {
      name: 'Female',
      data:   [
              17,
              3050,
              8256,
              11596,
              16051,
              67363,
              149019,
              215943,
              204781,
              175180,
              108775,
              158690
    ]
  }
]
}


  return (
    <div className='app-user-list'>
      <IndicatorFilter sidebarOpen={sidebarOpen} />
      <Row lg='7'>
        <Col lg='4' sm='6'>
          <StatsHorizontal
            color='primary'
            statTitle='PATIENTS'
            icon={<User size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>{chartData.getStats.txCurrStateCount}</h3>}
          />
        </Col>
        <Col lg='4' sm='6'>
          <StatsHorizontal
            color='danger'
            statTitle='FACILITIES'
            icon={<UserPlus size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>{chartData.getStats.numberOfFacilities}</h3>}
          />
        </Col>
        <Col lg='4' sm='6'>
          <StatsHorizontal
            color='success'
            statTitle='STATES'
            icon={<UserCheck size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>{chartData.getStats.numberOfStates}</h3>}
          />
        </Col> 
        <Col lg='12' sm='12'>     
        <HighchartsReact  highcharts={Highcharts}  options={chartData.getChatData} />    
        </Col> 
        <Col lg='12' sm='12'>

        <HighchartsReact  highcharts={Highcharts}  options={age} />
        </Col>
      </Row>
    </div>
  )
}

export default UsersList
