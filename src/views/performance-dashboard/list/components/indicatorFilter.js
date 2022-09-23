import Select from 'react-select'
import classnames from 'classnames'
import { selectThemeColors } from '@utils'
import { Card, CardBody, Row, Col, Input, Button, Label } from 'reactstrap'
import '@styles/react/libs/noui-slider/noui-slider.scss'

const IndicatorFilter = props => {
  // ** Props
  const { sidebarOpen } = props

  const indicatorOptions = [
    { value: 'PatientLineList', label: 'Patient Line ', color: '#00B8D9', isFixed: true },
    { value: 'HTSLineList', label: 'HTS Line List', color: '#0052CC', isFixed: true },
    { value: 'DQALineList', label: 'DQA Line List', color: '#5243AA', isFixed: true },
    { value: 'CMLineList', label: 'Commodities Line List', color: '#FF5630', isFixed: false },
    { value: 'PBSLineList', label: 'PBS Line List', color: '#FF8B00', isFixed: false }
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
    { value: 'PatientLineList', label: 'Patient Line ', color: '#00B8D9', isFixed: true },
    { value: 'HTSLineList', label: 'HTS Line List', color: '#0052CC', isFixed: true },
    { value: 'DQALineList', label: 'DQA Line List', color: '#5243AA', isFixed: true },
    { value: 'CMLineList', label: 'Commodities Line List', color: '#FF5630', isFixed: false },
    { value: 'PBSLineList', label: 'PBS Line List', color: '#FF8B00', isFixed: false }
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
