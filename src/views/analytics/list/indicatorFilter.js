import Select from 'react-select'
// ** Third Party Components
import classnames from 'classnames'
import { Star } from 'react-feather'
import Nouislider from 'nouislider-react'
import { Card, CardBody, Row, Col, Input, Button, Label } from 'reactstrap'
import { selectThemeColors } from '@utils'
import '@styles/react/libs/noui-slider/noui-slider.scss'
import { getChatData, getStats } from '../store'
import { useDispatch } from 'react-redux'
const IndicatorFilter = props => {
  // ** Props
  const dispatch = useDispatch()
  const { sidebarOpen } = props

  const indicatorOptions = [
    { value: 'TX_CURR', label: 'TX_CURR', color: '#00B8D9', isFixed: true },
    { value: 'TX_NEW', label: 'TX_NEW', color: '#00B8D9', isFixed: true },
    { value: 'PVLS', label: 'PVLS', color: '#00B8D9', isFixed: true },
    { value: 'HTS', label: 'HTS', color: '#00B8D9', isFixed: false }
  ]
  const orgUnit = JSON.parse(localStorage.getItem('orgUnit'))
 
  const stateOptions = []
  const lgaOptions = []
  const lgaFacilityOptions = []
  const facilityOptions = []

  const selectedStatesObj = []
  const selectedlgasObj = []

  orgUnit.map((item) => {
    const stateObj = { value: item.stateName, label: item.stateName, color: '#00B8D9', isFixed: true }
    stateOptions.push(stateObj)
  })

  const handleChangeState = selectedOption => {
    lgaOptions.length = 0
    lgaFacilityOptions.length = 0
    const selectedState = []
    selectedOption.map((item) => {
      selectedState.push(item.value)
      selectedStatesObj.push(item.value)
    })

    orgUnit.filter(item => {
      return  selectedState.includes(item.stateName) 
    }).map((item) => {
      item.lgas.map((item) => {
        const lgaObj = { value: item.lga, label: item.lga, color: '#00B8D9', isFixed: true }
        lgaOptions.push(lgaObj)       
          lgaFacilityOptions.push(item)        
      })
    })
  }

  const handleChangeLga = selectedOption => {
    facilityOptions.length = 0
    const selectedLga = []
    selectedOption.map((item) => {
      selectedLga.push(item.value)
      selectedlgasObj.push(item.value)
    })
    lgaFacilityOptions.filter(item => {
      return  selectedLga.includes(item.lga) 
    }).map((item) => {     
      item.facilities.map((item) => {
        const facilityObj = { value: item.facilityName, label: item.facilityName, color: '#00B8D9', isFixed: true }
        facilityOptions.push(facilityObj)
      })
    })

  }

  const handleSubmit = () => { 
   // const search = selectedStatesObj.find(element => element.name === value)
   //const states = selectedStatesObj.map(function (el) { return el.value })
  console.log(selectedStatesObj)
    dispatch(getChatData({ 
      states:(selectedStatesObj.length > 0) ? selectedStatesObj.join(',') : "",
      lgas:(selectedStatesObj.length > 0) ? selectedlgasObj.join(',') : "",
      facilities:"",
      ageRange:"",
      indicator:"TX_CURR",
      sex:""
    })) 

    dispatch(getStats({ 
      states:(selectedStatesObj.length > 0) ? selectedStatesObj.join(',') : "",
      lgas:(selectedStatesObj.length > 0) ? selectedlgasObj.join(',') : "",
      facilities:"",
      ageRange:"",
      indicator:"TX_CURR",
      sex:""
    })) 
  }

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
                      onChange={handleChangeState}
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
                      onChange={handleChangeLga}
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
                  <Button className='ms-2' color='primary'  md='12' sm='12' onClick={handleSubmit}>
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
