// ** React Imports


// ** Third Party Components
import Chart from 'react-apexcharts'
import { Settings } from 'react-feather'


// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardText } from 'reactstrap'

const Revenue = props => {  

  const renderStats = () => {  
    return  props?.stats?.map((item, index) => {
        return (               
          <div className='me-2' key={index}>
          <CardText className='mb-50'>{item.key}</CardText>
          <h3 className='fw-bolder'>
            <span className='text-primary'>{item.value}</span>
          </h3>
        </div>           
        )
      })
  }
  
  const options = {
      chart: {
        toolbar: { show: false },
        zoom: { enabled: false },
        type: 'line',
        offsetX: -10
      },
      stroke: {
        curve: 'smooth'
       // dashArray: [0, 12],
        //width: [4, 3]
      },
      legend: {
        show: false
      },
      colors: ['#d0ccff', '#f1ebe9'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          inverseColors: false,
        //  gradientToColors: [props.primary, '#ebe9f1'],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1
        //  stops: [0, 100, 100, 100]
        }
      },
      markers: {
        size: 10,
        hover: {
          size: 10
        }
      },
      xaxis: {
        labels: {
          style: {
            colors: '#b9b9c3',
            fontSize: '1rem'
          }
        },
        axisTicks: {
          show: false
        },
        categories: props?.categories,
        axisBorder: {
          show: true
        },
        tickPlacement: 'on'
      },
      yaxis: {
        tickAmount: 5,
        labels: {
          style: {
            colors: '#b9b9c3',
            fontSize: '1rem'
          },
          formatter(val) {
            return val //> 999 ? `${(val / 1000).toFixed(0)}k` : val
          }
        }
      },
      grid: {
        borderColor: '#e7eef7',
        padding: {
          top: -20,
          bottom: -10,
          left: 20
        }
      },
      tooltip: {
        x: { show: false }
      }
    },
    series = props?.lineChatSeries

  return props?.stats !== null ? (
    
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>TX CURR Performance Trend</CardTitle>
        <Settings size={18} className='text-muted cursor-pointer' />
      </CardHeader>
      <CardBody>
        <div className='d-flex justify-content-start mb-3'>            
         {renderStats()}     
        </div>
       {props?.lineChatSeries && <Chart options={options} series={series} type='line' height={240} />
}
      </CardBody>
    </Card>
  ) : null
}
export default Revenue
