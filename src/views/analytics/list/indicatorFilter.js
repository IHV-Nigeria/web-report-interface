import Select from 'react-select'
// ** Third Party Components
import classnames from 'classnames'
import { Star } from 'react-feather'
import Nouislider from 'nouislider-react'

// ** Reactstrap Imports
import { Card, CardBody, Row, Col, Input, Button, Label } from 'reactstrap'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Styles
import '@styles/react/libs/noui-slider/noui-slider.scss'

const IndicatorFilter = props => {
  // ** Props
  const { sidebarOpen } = props

  const indicatorOptions = [
    { value: 'TX_CURR', label: 'TX_CURR', color: '#00B8D9', isFixed: true },
    { value: 'TX_NEW', label: 'TX_NEW', color: '#0052CC', isFixed: true },
    { value: 'PVLS', label: 'PVLS', color: '#5243AA', isFixed: true },
    { value: 'HTS', label: 'HTS', color: '#FF5630', isFixed: false }
  ]

  const stateOptions = [
    { value: 'FCT', label: 'FCT ', color: '#00B8D9', isFixed: true },
    { value: 'Katsina', label: 'Katsina', color: '#0052CC', isFixed: true },
    { value: 'Nasarawa', label: 'Nasarawa', color: '#5243AA', isFixed: true },
    { value: 'Rivers', label: 'Rivers', color: '#FF5630', isFixed: false }
  ]

  const lgaOptions = [
    { value: 'PatientLineList', label: 'Patient Line ', color: '#00B8D9', isFixed: true },
    { value: 'HTSLineList', label: 'HTS Line List', color: '#0052CC', isFixed: true },
    { value: 'DQALineList', label: 'DQA Line List', color: '#5243AA', isFixed: true },
    { value: 'CMLineList', label: 'Commodities Line List', color: '#FF5630', isFixed: false },
    { value: 'PBSLineList', label: 'PBS Line List', color: '#FF8B00', isFixed: false }
  ]

  const facilityOptions = [
    { value: 'Kuchingoro Primary Health', label: 'Kuchingoro Primary Health', color: '#00B8D9', isFixed: true },
    { value: 'Nyanya One Stop Shop', label: 'Nyanya One Stop Shop', color: '#0052CC', isFixed: true },
    { value: 'Gwarinpa One Stop Shop', label: 'Gwarinpa One Stop Shop', color: '#5243AA', isFixed: true },
    { value: 'International Center for Advocacy on Rights to Health', label: 'International Center for Advocacy on Rights to Health', color: '#FF5630', isFixed: false },
    { value: 'MABUSHI One Stop Shop', label: 'MABUSHI One Stop Shop', color: '#FF8B00', isFixed: false }
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
                    <Label className='form-label'>Select Indicator</Label>
                    <Select
                      isClearable={false}
                      theme={selectThemeColors}
                      isMulti
                      name='colors'
                      options={indicatorOptions}
                      className='react-select'
                      classNamePrefix='select'
                    />
                  </Col>
                  <Col className='mb-1' md='12' sm='12'>
                    <Label className='form-label'>Select State</Label>
                    <Select
                      isClearable={false}
                      theme={selectThemeColors}
                      isMulti
                      name='colors'
                      options={stateOptions}
                      className='react-select'
                      classNamePrefix='select'
                    />
                  </Col>
                  <Col className='mb-1' md='12' sm='12'>
                    <Label className='form-label'>Select LGA</Label>
                    <Select
                      isClearable={false}
                      theme={selectThemeColors}
                      isMulti
                      name='colors'
                      options={lgaOptions}
                      className='react-select'
                      classNamePrefix='select'
                    />
                  </Col>
                  <Col className='mb-1' md='12' sm='12'>
                    <Label className='form-label'>Select Facility</Label>
                    <Select
                      isClearable={false}
                      theme={selectThemeColors}
                      isMulti
                      name='colors'
                      options={facilityOptions}
                      className='react-select'
                      classNamePrefix='select'
                    />
                  </Col>
                  <Col className='mb-1' md='12' sm='12'>
                  <Button className='ms-2' color='primary'  md='12' sm='12'>
                    <span className='align-middle ms-50'>Submit</span>
                  </Button>
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
