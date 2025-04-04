import React, { useState, useEffect } from "react"
import { Form, FormGroup, Label, Input, Button, Row, Col, Card, Nav, NavItem, NavLink, TabContent, TabPane, CardTitle } from "reactstrap"
import classnames from 'classnames'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useHistory } from "react-router-dom"
import jwtConfig from "../../api/jwtConfig"
import { toast } from "react-toastify"
import './systemsProcesses.css'
import { data } from "jquery"

const newDQA = () => {
  const [activeTab, setActiveTab] = useState('1')
  const history = useHistory()

  const [facilities, setFacilities] = useState([]) // State to store facilities fetched from the API
  const [formData, setFormData] = useState({
    facilityName: '',
    datimCode: '',
    orgUnit: '',
    fromMonth: '',
    fromYear: '',
    toMonth: '',
    toYear: '',
    state: '',
    lga: '',
    facilityMe: '',
    facilityEsm: '',
    facilityBackstop: '',
    personReporting: '',
    personDataEntry: '',
    personRadet: '',
    satelliteSites: '',
    dqa: '',
    dqaLastTime: '',
    dqaFrequency: '',
    dqaFeedback: '',
    gonReport: '',
    gonLevel: '',
    gonFrequency: '',
    gonReportsSent: '',
    ndrUpload: '',
    ndrPerson: '',
    ndrUploadLevel: '',
    ndrUploadFrequency: '',
    ndhisReport: '',
    ndhisPerson: '',
    ndhisFrequency: '',
    ndhisLastEntry: '',
    meArchive: '',
    facilityMeStaff: '',
    dataAssistants: '',
    functionalComputers: '',
    functionalComputerCount: '',
    currentNmrs: '',
    lastNmrsEntry: '',
    pocSite: '',
    internetFacility: '',
    trainingReceived: '',
    canExtractData: '',
    canValidateData: '',
    canUseExtractedData: '',
    dataValidationProtocol: '',
    generalAncRegister: '',
    pmtctHtsRegister: '',
    maternalCohortRegister: '',
    htsRegister: '',
    artRegister: ''
  })

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleFacilityChange = (e) => {
    const selectedFacility = facilities.find(facility => facility.facilityName === e.target.value)
    setFormData({
      ...formData,
      facilityName: selectedFacility.facilityName,
      datimCode: selectedFacility.datimCode
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(JSON.stringify(formData))

    const token = localStorage.getItem(`${jwtConfig.storageTokenKeyName}`)
    
    try {
      const response = await fetch(`${jwtConfig.dqaUrl}/save-new-facility-dqa`, {
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const text = await response.text()
        const data = text ? JSON.parse(text) : ""
        toast.success('Form submitted successfully!')
        history.push(`/new-dqa-system-questions/${data}`)
      } else {
        const text = await response.text()
        const error = text ? JSON.parse(text) : {}
        console.error('Error response:', error)
        toast.error('Failed to submit the form. Please try again.')
      }
    } catch (error) {
      console.error('Network error:', error)
      toast.error('A network error occurred. Please check your connection and try again.')
    }
  }

  useEffect(() => {
    const fetchFacilities = async () => {
      const token = localStorage.getItem(`${jwtConfig.storageTokenKeyName}`)
      console.log('Token:', token) // Log the token to check if it's being retrieved correctly
      try {
        const response = await fetch(`${jwtConfig.baseUrl}/facility/facilities`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setFacilities(data)
          // log the fetched data values
          console.log(data)
          // console.log('Facilities fetched successfully:', data)
        } else {
          console.error('Failed to fetch facilities')
        }
      } catch (error) {
        console.error('Error fetching facilities:', error)
      }
    }

    fetchFacilities()
  }, [data])

  return (
    <Form>
      <Card style={{ padding: '20px' }}>
        <CardTitle tag="h3" style={{ textAlign: 'center' }}>New DQA Form</CardTitle>
       
        {/* Existing Tabs and Form Fields */}
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "1" })}
              onClick={() => toggleTab("1")}
            >
              Facility Information
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "2" })}
              onClick={() => toggleTab("2")}
            >
              General Assessment
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "3" })}
              onClick={() => toggleTab("3")}
            >
              Structures
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "4" })}
              onClick={() => toggleTab("4")}
            >
              Documentation Review
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab} className="mt-3">
          {/* Tab 1: Facility Information */}
          <TabPane tabId="1">
          <Row>
          <Col md="12">
            <FormGroup>
              <Label for="facilityName">Facility Name</Label>
              <Input type="select" id="facilityName" name="facilityName" onChange={handleFacilityChange} required>
                <option value="">Select Facility</option>
                {facilities.map((facility, index) => (
                  // <option key={index} value={facility.facilityName}>{`${facility.facilityName  }, ${  facility.Lga  }, ${  facility.State}`}</option>
                  <option key={index} value={facility.facilityName}>{`${facility.facilityName  }`}</option>

                ))}
              </Input>
            </FormGroup>
          </Col>
        
              <Input type="hidden" id="datimCode" name="datimCode" value={formData.datimCode} readOnly />
               
              <Input type="hidden" id="orgUnit" name="orgUnit" value=""/> 
          
        </Row>
        <hr style={{ backgroundColor: 'darkblue' }} />
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="state">State</Label>
                  <Input onChange={handleChange} type="select" id="state" name="state">
                    <option value="">Select State</option>
                    <option value="1">FCT</option>
                    <option value="4">Rivers</option>
                    <option value="3">Nasarawa</option>
                    <option value="2">Katsina</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="lga">LGA</Label>
                  <Input type="text" id="lga" name="lga" onChange={handleChange} placeholder="LGA" />
                </FormGroup>
              </Col>
            </Row>

            <Row>            
              <Col md="3">
                <FormGroup>
                  <Label for="fromMonth">From Month</Label>
                  <Input type="select" id="fromMonth" name="fromMonth" onChange={handleChange} required>
                    <option value="">Select Month</option>
                    {[
                      { value: 1, label: "January" },
                      { value: 2, label: "February" },
                      { value: 3, label: "March" },
                      { value: 4, label: "April" },
                      { value: 5, label: "May" },
                      { value: 6, label: "June" },
                      { value: 7, label: "July" },
                      { value: 8, label: "August" },
                      { value: 9, label: "September" },
                      { value: 10, label: "October" },
                      { value: 11, label: "November" },
                      { value: 12, label: "December" }
                    ].map((month, index) => (
                      <option key={index} value={month.value}>{month.label}</option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label for="fromYear">From Year</Label>
                  <Input type="number" id="fromYear" name="fromYear" value={formData.fromYear} onChange={handleChange} placeholder="From Year" required />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label for="toMonth">To Month</Label>
                  <Input type="select" id="toMonth" name="toMonth" onChange={handleChange} required>
                    <option value="">Select Month</option>
                    {[
                      { value: 1, label: "January" },
                      { value: 2, label: "February" },
                      { value: 3, label: "March" },
                      { value: 4, label: "April" },
                      { value: 5, label: "May" },
                      { value: 6, label: "June" },
                      { value: 7, label: "July" },
                      { value: 8, label: "August" },
                      { value: 9, label: "September" },
                      { value: 10, label: "October" },
                      { value: 11, label: "November" },
                      { value: 12, label: "December" }
                    ].map((month, index) => (
                      <option key={index} value={month.value}>{month.label}</option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label for="toYear">To Year</Label>
                  <Input type="number" id="toYear" name="toYear" value={formData.toYear} onChange={handleChange} placeholder="To Year" required />
                </FormGroup>
              </Col>
            </Row>
          </TabPane>

          {/* Tab 2: General Assessment */}
          <TabPane tabId="2">
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="facilityMe">Name of Facility M&E</Label>
                  <Input type="text" id="facilityMe" name="facilityMe" onChange={handleChange} placeholder="Name of Facility M&E" />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="facilityEsm">Name of Facility ESM Lead</Label>
                  <Input type="text" id="facilityEsm" name="facilityEsm" onChange={handleChange} placeholder="Name of Facility ESM Lead" />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="facilityBackstop">Name of Facility IHVN SI Backstop</Label>
                  <Input type="text" id="facilityBackstop" name="facilityBackstop" onChange={handleChange} placeholder="Name of Facility IHVN SI Backstop" />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="personReporting">Name of Person Responsible for Collating and Submitting Facility Report</Label>
                  <Input type="text" id="personReporting" name="personReporting" onChange={handleChange} placeholder="Name of Person Responsible for Collating and Submitting Facility Report" />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="personDataEntry">Name of Person Responsible for Entering Data into IHVN IR and DHIS2</Label>
                  <Input type="text" id="personDataEntry" name="personDataEntry" onChange={handleChange} placeholder="Name of Person Responsible for Entering Data into IHVN IR and DHIS2" />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="personRadet">Name of person responsible for generating RADET</Label>
                  <Input type="text" id="personRadet" name="personRadet" onChange={handleChange} placeholder="Name of person responsible for generating RADET" />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="satelliteSites">Number of satellite sites and/or community pharmacy served/reached</Label>
                  <Input type="number" id="satelliteSites" name="satelliteSites" onChange={handleChange} placeholder="Number of satellite sites" />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="dqa">Has site ever had a Comprehensive DQA before now?</Label>
                  <Input onChange={handleChange} type="select" id="dqa" name="dqa">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="dqaLastTime">When was the last time such an assessment was done?</Label>
                  <Input type="date" id="dqaLastTime" name="dqaLastTime" onChange={handleChange} />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="dqaFrequency">How often is the assessment done at this site?</Label>
                  <Input type="select" id="dqaFrequency" name="dqaFrequency" onChange={handleChange}>
                    <option value="">Select Frequency</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="bi-weekly">Bi-Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="semi-quaterly">Semi-Quarterly</option>
                    <option value="annually">Annually</option>
                    <option value="Anytime">Anytime</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="dqaFeedback">Were you provided with feedback following the exercise?</Label>
                  <Input onChange={handleChange} type="select" id="dqaFeedback" name="dqaFeedback">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="gonReport">Do you report to the GON?</Label>
                  <Input onChange={handleChange} type="select" id="gonReport" name="gonReport">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="gonLevel">At what level do you report?</Label>
                  <Input type="select" id="gonLevel" onChange={handleChange} name="gonLevel">
                    <option value="">Select Level</option>
                    <option value="LACA">LACA</option>
                    <option value="SACA">SACA</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="gonFrequency">How often do you report?</Label>
                  <Input type="text" id="gonFrequency" name="gonFrequency" onChange={handleChange} placeholder="Reporting frequency" />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="gonReportsSent">How are the reports sent?</Label>
                  <Input type="text" id="gonReportsSent" name="gonReportsSent" onChange={handleChange} placeholder="Reports sending method" />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="ndrUpload">Last NDR Upload (DD/MM/YY)</Label>
                  <Input type="date" id="ndrUpload" name="ndrUpload" onChange={handleChange} />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="ndrPerson">Name and designation of person responsible for NDR upload</Label>
                  <Input type="text" id="ndrPerson" name="ndrPerson" onChange={handleChange} placeholder="Person responsible for NDR upload" />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="ndrUploadLevel">At what level do you upload from?</Label>
                  <Input type="text" id="ndrUploadLevel" name="ndrUploadLevel" onChange={handleChange} placeholder="Level of upload" />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="ndrUploadFrequency">How often is report uploaded on NDR?</Label>
                  <Input type="text" id="ndrUploadFrequency" name="ndrUploadFrequency" onChange={handleChange} placeholder="Frequency of upload" />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  {/* The next form field is actually ndhisReport please follow the comment above */}
                  <Label for="ndhisReport">Last NDHIS Report (DD/MM/YY)</Label>
                  <Input type="date" id="ndhisReport" name="ndhisReport" onChange={handleChange} />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="ndhisPerson">Name and designation of person responsible for NDHIS upload</Label>
                  <Input type="text" id="ndhisPerson" name="ndhisPerson" onChange={handleChange} placeholder="Person responsible for NDHIS upload" />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="ndhisFrequency">How often is report uploaded on NDHIS?</Label>
                  <Input type="text" id="ndhisFrequency" name="ndhisFrequency" onChange={handleChange} placeholder="Frequency of upload" />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="ndhisLastEntry">When was the last data entry on NDHIS?</Label>
                  <Input type="date" id="ndhisLastEntry" name="ndhisLastEntry" onChange={handleChange} />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="meArchive">Are previous reports archived in the M&E unit?</Label>
                  <Input onChange={handleChange} type="select" id="meArchive" name="meArchive">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
          </TabPane>
          {/* Tab 3: Structures start from FacilityMeStaff */}
          <TabPane tabId="3">
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="facilityMeStaff">Number of dedicated facility M&E staff</Label>
                  <Input type="number" id="facilityMeStaff" name="facilityMeStaff" onChange={handleChange} placeholder="Number of Dedicated Facility M&E Staff" />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="dataAssistants">Number of Data Assistants</Label>
                  <Input type="number" id="dataAssistants" name="dataAssistants" onChange={handleChange} placeholder="Number of Data Assistants" />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="functionalComputers">Are there functional computers in the M&E unit(Classmate Inclusive)? How many</Label>
                  <Input type="select" id="functionalComputers" name="functionalComputers" onChange={handleChange}>
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="functionalComputersCount">Are there functional computers in the M&E unit(Classmate Inclusive)? How many</Label>
                  <Input type="number" id="functionalComputerCount" name="functionalComputerCount" onChange={handleChange} placeholder="Number of functional computers" />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="currentNmrs">Are you using current NMRS?</Label>
                  <Input onChange={handleChange} type="select" id="currentNmrs" name="currentNmrs">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="lastNmrsEntry">When was the Last Entry on NMRS (DD/MM/YY)</Label>
                  <Input type="date" id="lastNmrsEntry" name="lastNmrsEntry" onChange={handleChange} />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="pocSite">Is this facility a POC site?</Label>
                  <Input onChange={handleChange} type="select" id="pocSite" name="pocSite">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="internetFacility">Do you have internet facility? If yes, fill 6. If No, go to 7</Label>
                  <Input onChange={handleChange} type="select" id="internetFacility" name="internetFacility">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="trainingReceived">Have personnel working in data management processes trained?</Label>
                  <Input onChange={handleChange} type="select" id="trainingReceived" name="trainingReceived">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="canExtractData">Can the facility DA demonstrate how to extract data or run queries required by service providers?</Label>
                  <Input onChange={handleChange} type="select" id="canExtractData" name="canExtractData">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="canValidateData">Can the facility DA demonstrate how to validate data or run queries required by service providers?</Label>
                  <Input onChange={handleChange} type="select" id="canValidateData" name="canValidateData">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="canUseExtractedData">Can the facility DA demonstrate how to verify, validate and correct data extracted from the NMRS?</Label>
                  <Input onChange={handleChange} type="select" id="canUseExtractedData" name="canUseExtractedData">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="dataValidationProtocol">Do you have a data validation protocol ?</Label>
                  <Input onChange={handleChange} type="select" id="dataValidationProtocol" name="dataValidationProtocol">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
          </TabPane>

          <TabPane tabId='4'>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="generalAncRegister">General ANC Register</Label>
                  <Input onChange={handleChange} type="select" id="generalAncRegister" name="generalAncRegister">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="pmtctHtsRegister">PMTCT HTS Register</Label>
                  <Input onChange={handleChange} type="select" id="pmtctHtsRegister" name="pmtctHtsRegister">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="maternalCohortRegister">Maternal Cohort Register</Label>
                  <Input onChange={handleChange} type="select" id="maternalCohortRegister" name="maternalCohortRegister">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="htsRegister">HTS Register</Label>
                  <Input onChange={handleChange} type="select" id="htsRegister" name="htsRegister">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="artRegister">ART Register</Label>
                  <Input onChange={handleChange} type="select" id="artRegister" name="artRegister">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
          </TabPane>

          <hr style={{ backgroundColor: 'darkblue' }} />

          <Button color="primary" type="submit" style={{ float: 'right' }} onClick={handleSubmit}>Save DQA</Button>
        </TabContent>
      </Card>
    </Form>
  )
}

export default newDQA
