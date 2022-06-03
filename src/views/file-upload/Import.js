// ** React Imports
import { Fragment } from 'react'

// ** Third Party Components
import { toast } from 'react-toastify'
import { useDropzone } from 'react-dropzone'
import { X, DownloadCloud } from 'react-feather'

// ** Custom Components
import Avatar from '@components/avatar'
import ExtensionsHeader from '@components/extensions-header'

import {uploadFile} from '../../api/uploadService'


// ** Reactstrap Imports
import { Row, Col, Card, CardBody, Table, CardHeader, CardTitle, Input, Label } from 'reactstrap'

// ** Styles
import '@styles/react/libs/file-uploader/file-uploader.scss'

const ErrorToast = () => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='danger' icon={<X size={12} />} />
        <h6 className='toast-title'>Error!</h6>
      </div>
      <small className='text-muted'>a second ago</small>
    </div>
    <div className='toastify-body'>
      <span role='img' aria-label='toast-text'>
        👋 You can only upload <span className='fw-bolder'>.zip</span>,  Files!.
      </span>
    </div>
  </Fragment>
)

const Import = () => {

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: result => {
      const reader = new FileReader()
      const batch = new Date().getTime()

      const values = {
        batchNumber:batch,
        zippedFile:result
      }

     uploadFile(values).then((response) => {
       console.log(response)
        toast.success(response, { icon: false, hideProgressBar: true })
      }).catch((err) => {
        toast.error(err, { icon: false, hideProgressBar: true })
      })
     
      if (result.length && result[0].name.endsWith('zip')) {
        reader.readAsBinaryString(result[0])
      } else {
        toast.error(<ErrorToast />, { icon: false, hideProgressBar: true })
      }
    }
  })

  return (
    <Fragment>
      
      <Row className='import-component'>
        <Col sm='12'>
          <Card>
            <CardBody>
              <Row>
                <Col sm='12'>
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <div className='d-flex align-items-center justify-content-center flex-column'>
                      <DownloadCloud size={64} />
                      <h5>Drop XML file here or click to upload</h5>
                      <p className='text-secondary'>
                        Drop files here or click{' '}
                        <a href='/' onClick={e => e.preventDefault()}>
                          browse
                        </a>{' '}
                        thorough your machine
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      
      </Row>
    </Fragment>
  )
}

export default Import
