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

import {addNewUser} from '../../../../api/usersService'
import { useForm, Controller } from 'react-hook-form'

import { getData } from '../../store'
import { useDispatch } from 'react-redux'

const AddUser = ({ open, handleModal}) => {
  const roles = [
    { label: 'Admin', value: '1' },
    { label: 'State Admin', value: '2' },
    { label: 'M&E', value: '3' }
 
  ]
  
  const dispatch = useDispatch()
  const [data, setData] = useState(null)

  const [errMsg, setErrMsg] = useState('')
  const [isError, setIsError] = useState(false)

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    role: null
  }

  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })


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

    if (Object.values(data).every(field => (typeof field === 'object' ? field !== null : field.length > 0))) {
      setData(data)
      addNewUser({ 
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          username: `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}`,
          password: `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}@ihvn!`,
          role: data.role.value
        })
        .then(res => {
          if (res.status === 400) {
           setErrMsg(res.data.message)
           setIsError(true)
          } else {
            dispatch(getData({currentPage, perPage})) 
          }        
      
        })
        .catch(err => {
          console.log(err)
 
        })
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
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
      
      <ModalBody className='flex-grow-1'>
      {isError && <Alert color='danger' >
              <div className='alert-body'>
                <AlertCircle size={15} />{' '}
                <span className='ms-1'>
                      {errMsg}
                </span>
              </div>
            </Alert>
            }

      <Form id="add-user-form" className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-1'>
                <Label className='form-label' for='login-email'>
                First Name
                </Label>
                <Controller
                  id='firstName'
                  name='firstName'
                  control={control}
                  render={({ field }) => (
                    <Input
                      autoFocus
                      type='firstName'
                      placeholder='john@example.com'
                      invalid={errors.firstName && true}
                      {...field}
                    />
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
                    <Input
                      autoFocus
                      type='lastName'
                      placeholder='Enter lastname'
                      invalid={errors.lastName && true}
                      {...field}
                    />
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
                    <Input
                      autoFocus
                      type='email'
                      placeholder='john@example.com'
                      invalid={errors.email && true}
                      {...field}
                    />
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
                    <Select
                      isClearable={false}
                      classNamePrefix='select'
                      options={roles}
                      theme={selectThemeColors}
                      className={classnames('react-select', { 'is-invalid': data !== null && data.role === null })}
                      {...field}
                    />
                  )}
                />
              </div>
              <Button type='submit' color='primary' block onClick={handleModal}>
                Submit
              </Button>
            </Form>

      </ModalBody>
    </Modal>
  )
}

export default AddUser 
