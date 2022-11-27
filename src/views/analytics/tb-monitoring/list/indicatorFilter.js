import Select from 'react-select'
// ** Third Party Components

import { useState } from 'react'
import { Star } from 'react-feather'
import classnames from 'classnames'
import { selectThemeColors } from '@utils'
import Nouislider from 'nouislider-react'
import {useDispatch} from 'react-redux'
import Flatpickr from 'react-flatpickr'
import { getChatData} from '../store'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/noui-slider/noui-slider.scss'
import { Card, CardBody, Row, Col, Input, Button, Label } from 'reactstrap'
const IndicatorFilter = props => {

  const { sidebarOpen } = props
  const dispatch = useDispatch()

  const orgUnit = JSON.parse(localStorage.getItem('orgUnit'))

  //options
  const facilities = []
  const stateOptions = []
  const lgas = []


  const [selectedStatesObj, setSelectedStatesObj] = useState([])
  const [filteredLgas, setFilteredLgas] = useState([])
  const [filteredFacilities, setFilteredFacilities] = useState([])
  const [selectedLgas, setSelectedLgas] = useState([])
  const [selectedFacilities, setSelectedFacilities] = useState([])
  const [selectedStartDate, setSelectedStartDate] = useState(new Date().toISOString().slice(0, 19).split('T')[0])
  const [selectedEndDate, setSelectedEndDate] = useState(new Date().toISOString().slice(0, 19).split('T')[0])

  orgUnit.map((item) => {
    const stateObj = { value: item.stateName, label: item.stateName, color: '#00B8D9', isFixed: true }
    stateOptions.push(stateObj)
  })

  const handleChangeState = selectedOption => {
    lgas.length = 0
    const selectedState = []

    // get state list
    selectedOption.map((item) => {
      selectedState.push(item.value)
    })
    setSelectedStatesObj(selectedState)
    
    // filter out lga by state
    orgUnit.forEach((item) => {
      const state = item
      item.lgas.forEach((item) => {
        const lga = {
          stateId:state.id, 
          stateName:state.stateName,
          lgaId:item.id, 
          value: item.lga, 
          label:item.lga, 
          facilities:item.facilities,
          color: '#00B8D9', 
          isFixed: true 
        }
        lgas.push(lga)
      })
    })
    setFilteredLgas(lgas.filter(item => { return  selectedState.includes(item.stateName) }))
  }

  const handleChangeLga = selectedOption => {
    facilities.length = 0  
    const options = [] 
    selectedOption.map((item) => {
      options.push(item.value)
    })

    filteredLgas.forEach((item) => {
      const lga = item

      item.facilities.forEach((item) => {
        const facility = {
          stateId:lga.stateId, 
          stateName:lga.stateName,
          lgaId:lga.lgaId, 
          lga:lga.value, 
          facilityId:item.id, 
          value: item.facilityName, 
          label:item.facilityName, 
          color: '#00B8D9', 
          isFixed: true 
        }
        facilities.push(facility)
      })
      })
    setSelectedLgas(options)
    setFilteredFacilities(facilities)
  }

  const handleChangeFacility = selectedOption => {
    facilities.length = 0  
    const options = [] 
    selectedOption.map((item) => {
      options.push(item.value)
    })
    setSelectedFacilities(options)
  }


  const handleSubmit = () => { 
    dispatch(getChatData({ 
      states:  (selectedStatesObj.length > 0) ? selectedStatesObj.join(',') : "",
      lgas:(selectedLgas.length  > 0) ? selectedLgas.join(',') : "",
      facilities:(selectedFacilities.length > 0) ? selectedFacilities.join(",") : "",
      ageRange:"",
      indicator:"",
      sex:"",
      startDate: selectedStartDate,
      endDate: selectedEndDate
    }))  

    /* dispatch(getStats({ 
      states:(selectedStatesObj.length > 0) ? selectedStatesObj.join(',') : "",
      lgas:(selectedLgas.length > 0) ? selectedLgas.join(',') : "",
      facilities:"",
      ageRange:"",
      indicator:"",
      sex:"",
      startDate: "",
      endDate: ""
    }))

    dispatch(getAgeRageCharts({ 
      states:(selectedStatesObj.length > 0) ? selectedStatesObj.join(',') : "",
      lgas:(selectedLgas.length > 0) ? selectedLgas.join(',') : "",
      facilities:"",
      ageRange:"",
      indicator:"",
      sex:"",
      startDate: "",
      endDate: ""
    })) */
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
                      options={filteredLgas}
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
                      onChange={handleChangeFacility}
                      options={filteredFacilities}
                      className='react-select'
                      classNamePrefix='select'
                    />
                  </Col>
                  <div>
                    <Col className='mb-1' md='12' sm='12'>
                    <Label className='form-label'>Start Date</Label>
                    <Flatpickr  locale="es" className='form-control' value={selectedStartDate}  onChange={date => {
                      const newDate = new Date(date).toISOString().slice(0, 19).split('T')[0]
                          setSelectedStartDate(newDate)
                    } } />
                    </Col>
                    <Col className='mb-1' md='12' sm='12'>
                    <Label className='form-label'>End Date</Label>
                    <Flatpickr  locale="es"  className='form-control' value={selectedEndDate} onChange={date => { 
                      console.log(date)
                      const newDate = new Date(date).toISOString().slice(0, 10)//.split('T')[0]
                      console.log(newDate)
                      setSelectedEndDate(newDate)
                      }} />
                    </Col>
                  </div>                  
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
