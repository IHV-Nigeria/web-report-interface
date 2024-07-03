import Select from 'react-select'
// ** Third Party Components
import { useState } from 'react'

import { Star } from 'react-feather'
import classnames from 'classnames'
import { selectThemeColors } from '@utils'
import Nouislider from 'nouislider-react'
import {useDispatch} from 'react-redux'
import Flatpickr from 'react-flatpickr'
import { getChatData, getStats, getAgeRageCharts} from '../store'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/noui-slider/noui-slider.scss'
import { Card, CardBody, Row, Col, Input, Button, Label } from 'reactstrap'
import {
  fetchLgas,
  fetchFacilities,
  indicatorOptions,
  stateOptions,
  quarterOptions
} from '../../../../api/utils/sharedFunctions'

const IndicatorFilter = props => {

  let lgas = []  
  const { sidebarOpen } = props
  const dispatch = useDispatch()

  const [selectedLgas, setSelectedLgas] = useState([])
  const [selectedStates, setSelectedStates] = useState([])

  const [filtredLgas, setfiltredLgas] = useState([])
  const [filteredFacilities, setfilteredFacilities] = useState([])

  const [selectedQuarter, setSelectedQuarter] = useState('') 
  const [selectedIndicator, setSelectedIndicator] = useState('')
  const [selectedFacilities, setSelectedFacilities] = useState([])

  const [selectedStartDate, setSelectedStartDate] = useState(new Date().toISOString().slice(0, 19).split('T')[0])
  const [selectedEndDate, setSelectedEndDate] = useState(new Date().toISOString().slice(0, 19).split('T')[0])


  const handleChangeIndicator = selectedOption => {
    setSelectedIndicator(selectedOption.value)
  }

  const handleChangeQuarter = selectedOption => {
    setSelectedQuarter(selectedOption.value)
  }

  const handleChangeState = selectedOption => {  
    const states = []  
    selectedOption.map((item) => {
      states.push(item.value)
    })
    setSelectedStates(states)
    lgas = fetchLgas(states)
    setSelectedLgas(lgas)
  }
  
  const handleChangeLga = selectedOption => {  
    const lgas = []  
    selectedOption.map((item) => {
      lgas.push(item.value)
    })
    const facilities = fetchFacilities(selectedOption)
    setSelectedFacilities(facilities)
    setfiltredLgas(lgas)
  }

  const handleChangeFacility = selectedOption => {
    const options = [] 
    selectedOption.map((item) => {
      options.push(item.value)
    })
    // setSelectedFacilities(options)
    setfilteredFacilities(options)
  }


  const handleSubmit = () => { 
    if (selectedIndicator === '') {
      alert("Please select an indicator")
    } else if (selectedIndicator === 'TX_CURR' && selectedQuarter === '') {
      alert("Please select quarter for TX_CURR")
    } else {
      const param = { 
        states:  (selectedStates.length > 0) ? selectedStates.join(',') : "",
        lgas:(filtredLgas.length  > 0) ? filtredLgas.join(',') : "",
        facilities:(filteredFacilities.length > 0) ? filteredFacilities.join(",") : "",
        ageRange:"",
        indicator:selectedIndicator,
        quarter:(selectedQuarter !== '') ? selectedQuarter : '',
        sex:"",
        searchType:"NORMAL",
        startDate: selectedStartDate,
        endDate: selectedEndDate
      }
      dispatch(getStats(param))
      dispatch(getChatData(param))
      dispatch(getAgeRageCharts(param))
    }
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
                      name='colors'
                      options={indicatorOptions}
                      onChange={handleChangeIndicator}
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
                      options={selectedLgas}
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
                        options={selectedFacilities}
                        className='react-select'
                        classNamePrefix='select'
                      />
                    </Col>                    
                    {selectedIndicator  === "TX_NEW"  && 
                    <div>
                    <Col className='mb-1' md='12' sm='12'>
                    <Label className='form-label'>Start Date</Label>
                    <Flatpickr  locale="es" className='form-control' value={selectedStartDate}  onChange={date => {
                      const correctDate = new Date(date)
                      correctDate.setDate(correctDate.getDate() + 1)
                      const newDate = new Date(correctDate).toISOString().slice(0, 10).split('T')[0]
                          setSelectedStartDate(newDate)
                    } } />
                    </Col>
                    <Col className='mb-1' md='12' sm='12'>
                    <Label className='form-label'>End Date</Label>
                    <Flatpickr  locale="es"  className='form-control' value={selectedEndDate} onChange={date => { 
                      console.log(date)
                      const correctDate = new Date(date)
                      correctDate.setDate(correctDate.getDate() + 1)
                      const newDate = new Date(correctDate).toISOString().slice(0, 10).split('T')[0]
                      console.log(newDate)
                      setSelectedEndDate(newDate)
                      }} />
                    </Col>
                    </div>
                    }
                    {selectedIndicator  === "TX_CURR"  && 
                    <Col className='mb-1' md='12' sm='12'>
                    <Label className='form-label'>Select Quarter</Label>
                    <Select
                      isClearable={false}
                      theme={selectThemeColors}
                      name='colors'
                      onChange={handleChangeQuarter}
                      options={quarterOptions}
                      className='react-select'
                      classNamePrefix='select'
                    />
                    </Col> 
                    } 
                 
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
