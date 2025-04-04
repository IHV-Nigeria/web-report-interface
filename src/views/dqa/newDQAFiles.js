import React, { useState } from 'react'
import { Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button, Row, Col, Spinner } from 'reactstrap'
import { useHistory, useParams } from 'react-router-dom'
import jwtConfig from '../../api/jwtConfig'
import { toast } from 'react-toastify'
import './systemsProcesses.css'

const NewDQAFiles = () => {
  const { dqaId } = useParams()
  const [htsFile, setHtsFile] = useState(null)
  const [pmtctFile, setPmtctFile] = useState(null)
  const [artFile, setArtFile] = useState(null)
  const [xmlFile, setXmlFile] = useState(null)
  const [ndrFile, setNdrFile] = useState(null)
  const [formData, setFormData] = useState({
    fromMonth: '',
    fromYear: new Date().getFullYear(), // Default to current year
    toMonth: '',
    toYear: new Date().getFullYear() // Default to current year
  })
  const [loading, setLoading] = useState(false) // State to manage loading screen

  const history = useHistory()

  const handleFileChange = (setter) => (event) => {
    setter(event.target.files[0])
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  // Generate a list of years from 3 years backward to 10 years forward
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const startYear = currentYear - 5
    const endYear = currentYear
    const years = []
    for (let year = startYear; year <= endYear; year++) {
      years.push(year)
    }
    return years
  }

  const constructDateRanges = () => {
    const { fromMonth, fromYear, toMonth, toYear } = formData
    const dateQtrRangeList = []
    const dateSemiRangeList = []
  
    if (fromMonth && fromYear && toMonth && toYear) {
      const startMonth = parseInt(fromMonth)
      const startYear = parseInt(fromYear)
      const endMonth = parseInt(toMonth)
      const endYear = parseInt(toYear)
  
      // Add quarterly ranges
      dateQtrRangeList.push({ month: startMonth, year: startYear })
      dateQtrRangeList.push({ month: endMonth, year: endYear })
  
      // Add semi-annual ranges
      dateSemiRangeList.push({ month: startMonth, year: startYear })
      dateSemiRangeList.push({ month: endMonth, year: endYear })
    }
  
    return { dateQtrRangeList, dateSemiRangeList }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true) // Show loading screen

    const { dateQtrRangeList, dateSemiRangeList } = constructDateRanges()

    const formDataToSend = new FormData()
    formDataToSend.append('hts', htsFile)
    formDataToSend.append('pmtct', pmtctFile)
    formDataToSend.append('art', artFile)
    formDataToSend.append('xml', xmlFile)
    formDataToSend.append('ndr', ndrFile)

    // Construct the dateDto
    const dateDto = {
      datimCode: "Z226xvNYD7J", // Replace with actual datimCode if available
      orgUnit: "", // Optional: Add orgUnit if needed
      dateQtrRangeList,
      dateSemiRangeList
    }

    formDataToSend.append('date', JSON.stringify(dateDto)) // Send as JSON string
    console.log("DATEDTO: ", JSON.stringify(dateDto))

    try {
      const response = await fetch(`${jwtConfig.dqaUrl}/upload`, {
        method: 'POST',
        body: formDataToSend
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Server response:', data)
        toast.success('Files uploaded successfully!')
        // Save data to local storage
        localStorage.setItem('dqaData', JSON.stringify(data))
        history.push(`/new-dqa-dv-questions/${dqaId}`) // Navigate to the new page with the received ID
      } else {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        toast.error('Failed to upload files. Please try again.')
      }
    } catch (error) {
      console.error('Network error:', error)
      toast.error('A network error occurred. Please check your connection and try again.')
    } finally {
      setLoading(false) // Hide loading screen
    }
  }

  return (
    <div>
      {loading && (
        <div className="loading-overlay">
          <Spinner color="primary" />
          <p>Uploading files, please wait...</p>
        </div>
      )}
      <Card>
        <CardBody>
          <CardTitle tag='h4'>Upload Files</CardTitle>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for='htsFile'>HTS File</Label>
              <Input type='file' id='htsFile' onChange={handleFileChange(setHtsFile)} required />
            </FormGroup>
            <FormGroup>
              <Label for='pmtctFile'>PMTCT File</Label>
              <Input type='file' id='pmtctFile' onChange={handleFileChange(setPmtctFile)} required />
            </FormGroup>
            <FormGroup>
              <Label for='artFile'>ART File</Label>
              <Input type='file' id='artFile' onChange={handleFileChange(setArtFile)} required />
            </FormGroup>
            <FormGroup>
              <Label for='xmlFile'>XML File</Label>
              <Input type='file' id='xmlFile' onChange={handleFileChange(setXmlFile)} required />
            </FormGroup>
            <FormGroup>
              <Label for='ndrFile'>NDR File</Label>
              <Input type='file' id='ndrFile' onChange={handleFileChange(setNdrFile)} required />
            </FormGroup>
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label for="fromMonth">From Month</Label>
                  <Input type="select" id="fromMonth" name="fromMonth" onChange={handleChange} required>
                    <option value="">Select Month</option>
                    {[...Array(12)].map((_, index) => (
                      <option key={index} value={index + 1}>
                        {new Date(0, index).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label for="fromYear">From Year</Label>
                  <Input
                    type="select"
                    id="fromYear"
                    name="fromYear"
                    value={formData.fromYear}
                    onChange={handleChange}
                    required
                  >
                    {generateYearOptions().map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label for="toMonth">To Month</Label>
                  <Input type="select" id="toMonth" name="toMonth" onChange={handleChange} required>
                    <option value="">Select Month</option>
                    {[...Array(12)].map((_, index) => (
                      <option key={index} value={index + 1}>
                        {new Date(0, index).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label for="toYear">To Year</Label>
                  <Input
                    type="select"
                    id="toYear"
                    name="toYear"
                    value={formData.toYear}
                    onChange={handleChange}
                    required
                  >
                    {generateYearOptions().map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Button type='submit' color='primary'>Submit</Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  )
}

export default NewDQAFiles