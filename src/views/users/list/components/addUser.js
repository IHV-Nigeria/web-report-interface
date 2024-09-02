// ** React Imports
//import {  useState } from "react"
import { User, Mail, X, Lock, AlertCircle} from 'react-feather'
import Select from 'react-select'
import classnames from 'classnames'
import { selectThemeColors } from '@utils'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { Modal, Input, Label, Button, ModalHeader, ModalBody, InputGroup, InputGroupText, Form } from 'reactstrap'
import { useState } from "react"
import {Alert, Spinner} from 'react-bootstrap'
import './addUser.css'

import {addNewUser} from '../../../../api/usersService'
import { useForm, Controller } from 'react-hook-form'

import { getData } from '../../store'
import { useDispatch } from 'react-redux'


const AddUser = ({ open, handleModal}) => {

  const roles = [
    { label: 'Admin', value: '1' },
    { label: 'State Admin', value: '2' },
    { label: 'M&E', value: '3' },
    { label: 'Facility Admin', value: '4' }
  ]
  const states = []
  const orgUnit = JSON.parse(localStorage.getItem('orgUnit'))
  orgUnit.map((item) => {
    const stateObj = { value: item.stateName, label: item.stateName}
    states.push(stateObj)
  })
  const [selectedLgas, setSelectedLgas] = useState([])
  const [selectedFacilities, setSelectedFacilities] = useState([])
  const dispatch = useDispatch()
  const [data, setData] = useState(null)

  const [errMsg, setErrMsg] = useState('')
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    role: null,
    state: null,
    lga: null,
    facility: null
  }

  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const handleChangeState = selectedOption => {  
    console.log(selectedOption)
    // setSelectedStates(selectedOption)
    const lgas = []
    orgUnit.filter((item) => item.stateName === selectedOption.value).forEach((item) => {
      const state = item
      item.lgas.forEach((item) => {
        const lga = {
          stateId:state.id, 
          stateName:state.stateName,
          lgaId:item.id, 
          value: item.lga, 
          label:item.lga, 
          facilities:item.facilities
        }
        lgas.push(lga)
      })
    })
    setSelectedLgas(lgas)
  }
  
  const handleChangeLga = selectedOption => {  
    console.log(selectedOption)
    // setfiltredLgas(selectedOption)
    const facilities = []
    selectedOption.facilities.forEach((item) => {
      const lga = item
      const facility = {
        stateId:lga.stateId, 
        stateName:lga.stateName,
        lgaId:lga.lgaId, 
        lga:lga.value, 
        facilityId:item.id, 
        value: item.datimCode, 
        label:item.facilityName
      }
      facilities.push(facility)
    })
    setSelectedFacilities(facilities)
  }

  const handleChangeFacility = selectedOption => {
    console.log(selectedOption)
    // setfilteredFacilities(selectedOption)
  }

  const perPage = 10
  const currentPage = 1

  // ** Store Vars
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleModal} /> 

const handleSidebarClosed = () => {
    for (const key in defaultValues) {
      setValue(key, '')
    }
  } 

  const onSubmit = data => {
    let isValid = true

    if (!data?.firstName || data.firstName.trim().length === 0) {
      setError('firstName', { type: 'manual', message: 'First Name is required' })
      isValid = false
    }
    if (!data?.lastName || data.lastName.trim().length === 0) {
      setError('lastName', { type: 'manual', message: 'Last Name is required' })
      isValid = false
    }
    if (!data?.email || data.email.trim().length === 0) {
      setError('email', { type: 'manual', message: 'Email is required' })
      isValid = false
    }
    if (!data?.role || !data.role.value) {
      setError('role', { type: 'manual', message: 'Role is required' })
      isValid = false
    }

    if (data?.role && data.role.value === '4') {
      if (!data.state || !data.state.value) {
        setError('state', { type: 'manual', message: 'State is required for Facility Admin' })
        isValid = false
      }
      if (!data.lga || !data.lga.value) {
        setError('lga', { type: 'manual', message: 'LGA is required for Facility Admin' })
        isValid = false
      }
      if (!data.facility || !data.facility.value) {
        setError('facility', { type: 'manual', message: 'Facility is required for Facility Admin' })
        isValid = false
      }
    } else if (data?.role && data.role.value === '2') {
      if (!data.state || !data.state.value) {
        setError('state', { type: 'manual', message: 'State is required for State Admin' })
        isValid = false
      }
    }

    // if (isValid && Object.values(data).some(field => (typeof field === 'object' ? field === null : field.trim().length > 0))) {
    if (isValid) {
      setIsLoading(true)
      setData(data)
      addNewUser({ 
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          username: `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}`,
          password: `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}@ihvn!`,
          role: data.role.value,
          state: data.state ? data.state.value : null,
          lga: data.lga ? data.lga.value : null,
          facility: data.facility ? data.facility.value : null
        })
        .then(res => {
          setIsLoading(false)
          if (res.status >= 400) {
           setErrMsg(res.data.message)
           setIsError(true)
          } else {
            dispatch(getData({currentPage, perPage})) 
            for (const key in defaultValues) {
              setValue(key, '')
            }
            setSelectedLgas(null)
            setSelectedFacilities(null)
            setData(null)
            setErrMsg('')
            setIsError(false)
          }        
      
        })
        .catch(err => {
          setIsLoading(false)
          console.log(err)
          setErrMsg('An error occurred while adding the user')
          setIsError(true)
 
        })
    } else {
      for (const key in data) {
        if (data[key] && data[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }
 

  return (
    <Modal
      isOpen={open}
      toggle={handleModal}
      className='sidebar-lg'
      modalClassName='modal-slide-in'
      contentClassName='pt-0'
      onClosed={handleSidebarClosed}
    >
      <ModalHeader className='mb-1' toggle={handleModal} close={CloseBtn} tag='div'>
        <h5 className='modal-title'>Create New User</h5>
      </ModalHeader>
      
      <ModalBody className='flex-grow-1 form-container'>
        {isError && <Alert color='danger' >
                <div className='alert-body'>
                  <AlertCircle size={15} />{' '}
                  <span className='ms-1'>
                        {errMsg}
                  </span>
                </div>
              </Alert>
        }

        {isLoading && (
          <div className='text-center spinner-overlay'>
            <Spinner animation='border' />
          </div>
        )}
        <Form id="add-user-form" className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-1'>
            <Label className='form-label' for='first-name'>
            First Name
            </Label>
            <Controller
              id='firstName'
              name='firstName'
              control={control}
              render={({ field }) => (
                <div>
                  <Input
                    autoFocus
                    type='firstName'
                    placeholder='John'
                    invalid={errors.firstName && true}
                    {...field}
                  />
                  {errors.firstName && <div className='text-danger'>{errors.firstName.message}</div>}
                </div>
              )}
            />
          </div>   
          <div className='mb-1'>
            <Label className='form-label' for='last-name'>
            Last Name
            </Label>
            <Controller
              id='lastName'
              name='lastName'
              control={control}
              render={({ field }) => (
                <div>
                  <Input
                    autoFocus
                    type='lastName'
                    placeholder='Doe'
                    invalid={errors.lastName && true}
                    {...field}
                  />
                  {errors.lastName && <div className='text-danger'>{errors.lastName.message}</div>}
                </div>
              )}
            />
          </div>    
          <div className='mb-1'>
            <Label className='form-label' for='email'>
            Email
            </Label>
            <Controller
              id='email'
              name='email'
              control={control}
              render={({ field }) => (
                <div>
                  <Input
                    autoFocus
                    type='email'
                    placeholder='john@example.com'
                    invalid={errors.email && true}
                    {...field}
                  />
                  {errors.email && <div className='text-danger'>{errors.email.message}</div>}
                </div>
              )}
            />
          </div>  
          <div className='mb-1'>
            <Label className='form-label' for='state'>
              State {data?.role && (data.role.value === '4' || data.role.value === '2') && <span className='text-danger'>*</span>}
            </Label>
            <Controller
              name='state'
              control={control}
              render={({ field }) => (
                <div>
                  <Select
                    {...field}
                    isClearable
                    classNamePrefix='select'
                    options={states}
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption)
                      handleChangeState(selectedOption)
                    }}
                    theme={selectThemeColors}
                    className={classnames('react-select', { 'is-invalid': errors.state || (data?.role && (data.role.value === '4' || data.role.value === '2') && !data.state.value) })}
                  />
                  {errors.state && <div className='text-danger'>{errors.state.message}</div>}
                </div>
              )}
            />
          </div>
          <div className='mb-1'>
            <Label className='form-label' for='lga'>
              LGA {data?.role && data.role.value === '4' && <span className='text-danger'>*</span>}
            </Label>
            <Controller
              name='lga'
              control={control}
              render={({ field }) => (
                <div>
                  <Select
                    {...field}
                    isClearable
                    classNamePrefix='select'
                    options={selectedLgas}
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption)
                      handleChangeLga(selectedOption)
                    }}
                    theme={selectThemeColors}
                    className={classnames('react-select', { 'is-invalid': errors.lga || (data?.role && data.role.value === '4' && !data.lga.value) })}
                  />
                  {errors.lga && <div className='text-danger'>{errors.lga.message}</div>}
                </div>
              )}
            />
          </div>
          <div className='mb-1'>
            <Label className='form-label' for='facility'>
              Facility {data?.role && data.role.value === '4' && <span className='text-danger'>*</span>}
            </Label>
            <Controller
              name='facility'
              control={control}
              render={({ field }) => (
                <div>
                  <Select
                    {...field}
                    isClearable
                    classNamePrefix='select'
                    options={selectedFacilities}
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption)
                      handleChangeFacility(selectedOption)
                    }}
                    theme={selectThemeColors}
                    className={classnames('react-select', { 'is-invalid': errors.facility || (data?.role && data.role.value === '4' && !data.facility.value) })}
                  />
                  {errors.facility && <div className='text-danger'>{errors.facility.message}</div>}
                </div>
              )}
            />
          </div>
          <div className='mb-1'>
            <Label className='form-label' for='role'>
              Role <span className='text-danger'>*</span>
            </Label>
            <Controller
              name='role'
              control={control}
              render={({ field }) => (
                <div>
                  <Select
                    isClearable={false}
                    classNamePrefix='select'
                    options={roles}
                    theme={selectThemeColors}
                    className={classnames('react-select', { 'is-invalid': data !== null && data.role === null })}
                    {...field}
                  />
                  {errors.role && <div className='text-danger'>{errors.role.message}</div>}
                </div>
              )}
            />
          </div>
          <Button type='submit' color='primary' block >
            Submit
          </Button>
        </Form>
    
      </ModalBody>
    </Modal>
  )
}

export default AddUser 
