// ** React Imports
import { useEffect, useState } from 'react'

// ** Third Party Components
import axios from 'axios'
import Chart from 'react-apexcharts'
import * as Icon from 'react-feather'
import classnames from 'classnames'
import { Settings } from 'react-feather'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Progress,
  CardHeader,
  CardTitle,
  CardBody,
  DropdownItem,
  DropdownToggle,
  UncontrolledButtonDropdown
} from 'reactstrap'

const RevenueReport = props => {
  // ** State
  const [data, setData] = useState(null)

  useEffect(() => {
    axios.get('/card/card-analytics/revenue-report').then(res => setData(res.data))
    return () => setData(null)
  }, [])

  const donutColors = {
    series1: '#017EFA',
    series2: '#30D988'
  }

  // ** Chart Options
  const options = {
    legend: {
      show: true,
      position: 'bottom'
    },
    labels: ['Female', 'Male'],

    colors: [donutColors.series1, donutColors.series2],
    dataLabels: {
      enabled: true,
      formatter(val) {
        return `${parseInt(val)}%`
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: '2rem',
              fontFamily: 'Montserrat'
            },
            value: {
              fontSize: '1rem',
              fontFamily: 'Montserrat',
              formatter(val) {
                return `${parseInt(val)}%`
              }
            },
            total: {
              show: true,
              fontSize: '1.5rem',
              label: 'Gender',
              formatter() {
                return '100%'
              }
            }
          }
        }
      }
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380
          },
          legend: {
            position: 'bottom'
          }
        }
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: '1.5rem'
                  },
                  value: {
                    fontSize: '1rem'
                  },
                  total: {
                    fontSize: '1.5rem'
                  }
                }
              }
            }
          }
        }
      }
    ]
  }

  const listData = [
    {
      icon: 'Circle',
      iconColor: 'text-primary',
      text: '< 15 years old',
      result: 690,
      percentage: '20%'
    },
    {
      icon: 'Circle',
      iconColor: 'text-warning',
      text: '15 - 19 years old',
      result: 258,
      percentage: '30%'
    },
    {
      icon: 'Circle',
      iconColor: 'text-danger',
      text: '20 - 49 Years old',
      result: 149,
      percentage: '50%'
    },
    {
      icon: 'Circle',
      iconColor: 'text-danger',
      text: '> 50 years old',
      result: 149,
      percentage: '70%'
    }
  ]

  const renderChartInfo = () => {
    return listData.map((item, index) => {
      const IconTag = Icon[item.icon]
      return (               
            <tr  key={index}>
                <td style={{
                    width:"50%"
                }}  >   
                        <IconTag
                    size={15}
                    className={classnames({
                      [item.iconColor]: item.iconColor
                    })}
                  />
                  <span className='fw-bold ms-75'>{item.text}  </span>

              </td>
              <td>{item.result}</td>
              <td>{item.percentage}</td>
            </tr>
         
      )
    })
  }

  // ** Chart Series
  const series = [85, 50]
  const color = props.primary
  return data !== null ? (
    <Card className='card-revenue-budget'>
         <CardHeader>
        <CardTitle tag='h4'>TX_CURR Performance Trend</CardTitle>
        <Settings size={18} className='text-muted cursor-pointer' />
      </CardHeader>
      <CardBody>
      <Row className='mx-0'>
        <Col className='revenue-report-wrapper' md='6' xs='12'>          
            <Chart options={options} series={series} type='donut' height={350} />
        </Col>
        <Col className='budget-wrapper' md='6' xs='12'>
            <p className='mb-50 item-align-left' style={{
                textAlign:'left'
            }}>Audience Age</p>
            <div className='row'>
                <div className='revenue-report-wrapper col-md-4' >   
                    <Progress className='avg-session-progress progress-bar-primary  mt-25' value='100' />
                </div>
                <div className='revenue-report-wrapper col-md-4'>   
                    <Progress className='avg-session-progress progress-bar-dark  mt-25' value='100' />
                </div>
                <div className='revenue-report-wrapper col-md-4'>   
                    <Progress className='avg-session-progress progress-bar-warning  mt-25' value='100' />
                </div>
            </div>
             <div className='pt-25' color={{color}}>
             <table>
              <tbody>
               {renderChartInfo()}
               </tbody>
              </table>
               
               </div>
        </Col>
      </Row>
      </CardBody>
    </Card>
  ) : null
}

export default RevenueReport
