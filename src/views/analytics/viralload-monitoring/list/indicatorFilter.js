import Select from 'react-select'
// ** Third Party Components

import { useState } from 'react'
import { Star } from 'react-feather'
import classnames from 'classnames'
import { selectThemeColors } from '@utils'
import Nouislider from 'nouislider-react'
import {useDispatch} from 'react-redux'
import Flatpickr from 'react-flatpickr'
import { getChatData,  getStats} from '../store'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/noui-slider/noui-slider.scss'
import { Card, CardBody, Row, Col, Input, Button, Label } from 'reactstrap'
import {
  fetchLgas,
  fetchFacilities,
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
  const [selectedFacilities, setSelectedFacilities] = useState([])


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
    setSelectedFacilities(options)
    setfilteredFacilities(options)
  }
  const handleSubmit = () => { 
    const param = { 
      states:  (selectedStates.length > 0) ? selectedStates.join(',') : "",
      lgas:(filtredLgas.length  > 0) ? filtredLgas.join(',') : "",
      facilities:(filteredFacilities.length > 0) ? filteredFacilities.join(",") : "",
      ageRange:"",
      indicator:'',
      quarter:(selectedQuarter !== '') ? selectedQuarter : '',
      sex:"",
      searchType:"NORMAL",
      startDate: '',
      endDate: ''
    }
    dispatch(getChatData(param)) 
    dispatch(getStats(param))
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
