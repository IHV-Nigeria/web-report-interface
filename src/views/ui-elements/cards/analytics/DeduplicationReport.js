// ** React Imports
import { useEffect, useState } from 'react'

// ** Third Party Components
import axios from 'axios'
import Chart from 'react-apexcharts'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Button,
  CardTitle,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledButtonDropdown
} from 'reactstrap'

const DeduplicationReport = props => {
  // ** State
  const [data, setData] = useState(null)

  useEffect(() => {
    axios.get('/card/card-analytics/revenue-report').then(res => setData(res.data))
    return () => setData(null)
  }, [])

  const revenueOptions = {
      chart: {
        stacked: true,
        type: 'bar',
        toolbar: { show: false }
      },
      grid: {
        padding: {
          top: -20,
          bottom: -10
        },
        yaxis: {
          lines: { show: false }
        }
      },
      xaxis: {
        categories: ['Total Fingerprints', 'Duplicates', 'Deduplicated', 'Invalids'],
        labels: {
          style: {
            colors: '#000000',
            fontSize: '0.86rem'
          }
        },
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: true
        }
      },
      legend: {
        show: true
      },
      dataLabels: {
        enabled: true
      },
      colors: [props.primary, props.warning],
      plotOptions: {
        bar: {
          columnWidth: '50%',
          borderRadius: [5]
        },
        distributed: true
      },
      yaxis: {
        labels: {
          style: {
            colors: '#b9b9c3',
            fontSize: '0.86rem'
          }
        }
      }
    },
    revenueSeries = [
      {
        name: 'FCT',
        data: [2095, 5177, 7284, 6256]
      }
    ]

  
  return data !== null ? (
    <Card className='card-revenue-budget'>
      <Row className='mx-0'>
        <Col className='revenue-report-wrapper' md='12' xs='12'>
          <div className='d-sm-flex justify-content-between align-items-center mb-3'>
            <CardTitle className='mb-50 mb-sm-0'>Deduplication Chart</CardTitle>
           
          </div>
          <Chart id='revenue-report-chart' type='bar' height='430' options={revenueOptions} series={revenueSeries} />
        </Col>
        
      </Row>
    </Card>
  ) : null
}

export default DeduplicationReport
