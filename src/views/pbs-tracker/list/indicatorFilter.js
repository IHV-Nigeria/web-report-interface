import Select from 'react-select'
import "flatpickr/dist/themes/material_green.css"
// ** Third Party Components
import classnames from 'classnames'

import Flatpickr from 'react-flatpickr'
// ** Reactstrap Imports
import { Card, CardBody, Row, Col, Input, Button, Label } from 'reactstrap'
// ** Utils
import { selectThemeColors } from '@utils'

import '../../../assets/scss/style.scss'
// ** Styles
import '@styles/react/libs/noui-slider/noui-slider.scss'
import "flatpickr/dist/flatpickr.css"

const IndicatorFilter = props => {
  // ** Props
  const { sidebarOpen } = props

  
  const stateOptions = [
    { value: 'FCT', label: 'FCT ', color: '#00B8D9', isFixed: true },
    { value: 'Katsina', label: 'Katsina', color: '#0052CC', isFixed: true },
    { value: 'Nasarawa', label: 'Nasarawa', color: '#5243AA', isFixed: true },
    { value: 'Rivers', label: 'Rivers', color: '#FF5630', isFixed: false }
  ]
  const aggregateOptions = [
    { value: 'Txcurr', label: 'TX_CURR ', color: '#00B8D9', isFixed: true },
    { value: 'Txnew', label: 'TX_NEW', color: '#0052CC', isFixed: true }
  ]


  return (
    <div className='sidebar-detached sidebar-left'>
      <div className='sidebar'>
        <div
          className={classnames('sidebar-shop', {
            show: sidebarOpen
          })}
        >   
             
          <Card>
            <CardBody>
              <div className='multi-range-price'>
                <h6 className='filter-title mt-0'>APPLY FILTERS BELOW TO LOAD DATA</h6>
                <Row>
                  <Col className='mb-1' md='12' sm='12'>
                    <Label className='form-label'>Select State</Label>
                    <Select
                      isClearable={false}
                      theme={selectThemeColors}
                      isFixed
                      name='colors'
                      options={stateOptions}
                      className='react-select'
                      classNamePrefix='select'
                    />
                  </Col>
                  <Col className='mb-1' md='12' sm='12'>
                    <Label className='form-label'>Aggregate List Type</Label>
                    <Select
                      isClearable={false}
                      theme={selectThemeColors}
                      isFixed
                      name='aggregate_type'
                      options={aggregateOptions}
                      className='react-select'
                      classNamePrefix='select'
                    />
                  </Col>
                  <Col className='mb-1' md='12' sm='12'>
                    <Label className='form-label'>From Date</Label>
                    <Flatpickr className="c-date-picker" placeholder="Select date" options={{ altFormat: "M j, Y", dateFormat: "Y-m-d" }} />
                   
                  </Col>
                  <Col className='mb-1' md='12' sm='12'>
                    <Label className='form-label'>To Date</Label>
                    <Flatpickr className="c-date-picker" placeholder="Select date" options={{ altFormat: "M j, Y", dateFormat: "Y-m-d" }} />
                   
                  </Col>
                </Row>
               
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default IndicatorFilter
