import React, { useState } from "react"
// suggest all the missing imports and rewrite line 3 to import the missing components

import { Form, FormGroup, Label, Input, Button, Row, Col, Card, Nav, NavItem, NavLink, NavItems, TabContent, TabPane, CardTitle } from "reactstrap"
import classnames from 'classnames'
import 'bootstrap/dist/css/bootstrap.min.css'

import jwtConfig from "../../api/jwtConfig"

// import { useNavigate } from "react-router-dom"
const newDQASystemsProcesses = () => {
  const [activeTab, setActiveTab] = useState('1')
  const [formData, setFormData] = useState({
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
  // const navigate = useNavigate()

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
        const data = text ? JSON.parse(text) : {}
        alert('Form submitted successfully!')
        console.log('Server response:', data)
      } else {
        const text = await response.text()
        const error = text ? JSON.parse(text) : {}
        console.error('Error response:', error)
        alert('Failed to submit the form. Please try again.')
      }
    } catch (error) {
      console.error('Network error:', error)
      alert('A network error occurred. Please check your connection and try again.')
    }
  }

  
  return (
    <Form>
      <Card style={{padding: '20px'}}>        
      <CardTitle tag="h3" style={{textAlign: 'center'}}>New DQA Form</CardTitle>
      <hr style={{backgroundColor: 'darkblue'}} />
      <div>
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
              <Col md="6">
                <FormGroup>
                  <Label for="state">State</Label>

                  <Input  onChange={handleChange} type="select" id="state" name="state">
                    <option value="">Select State</option>
                    <option value="FCT">FCT</option>
                    <option value="Rivers">Rivers</option>
                    <option value="Nasarawa">Nasarawa</option>
                    <option value="Katsina">Katsina</option>
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
        </TabPane>

        {/* Tab 2: General Assessment */}
        <TabPane tabId="2">
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="facilityMe">Name of Facility M&E</Label>
                  <Input type="text" id="facilityMe" name="facilityMe"  onChange={handleChange} placeholder="Name of Facility M&E" />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="facilityEsm">Name of Facility ESM Lead</Label>
                  <Input type="text" id="facilityEsm" name= "facilityEsm" onChange={handleChange} placeholder="Name of Facility ESM Lead" />
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
                  <Input type="text" id="personReporting" name= "personReporting" onChange={handleChange} placeholder="Name of Person Responsible for Collating and Submitting Facility Report" />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="personDataEntry">Name of Person Responsible for Entering Data into IHVN IR and DHIS2</Label>
                  <Input type="text" id="personDataEntry" name="personDataEntry"  onChange={handleChange} placeholder="Name of Person Responsible for Entering Data into IHVN IR and DHIS2" />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="personRadet">Name of person responsible for generating RADET</Label>
                  <Input type="text" id="personRadet" name="personRadet"  onChange={handleChange} placeholder="Name of person responsible for generating RADET" />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="satelliteSites">Number of satellite sites and/or community pharmacy served/reached</Label>
                  <Input type="number" id="satelliteSites" name="satelliteSites"  onChange={handleChange} placeholder="Number of satellite sites" />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="dqa">Has site ever had a Comprehensive DQA before now?</Label>
                  <Input  onChange={handleChange} type="select" id="dqa" name="dqa">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="dqaLastTime">When was the last time such an assessment was done?</Label>
                  <Input type="date" id="dqaLastTime" name="dqaLastTime"  onChange={handleChange} />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="dqaFrequency">How often is the assessment done at this site?</Label>
                  
                  <Input type="select" id="dqaFrequency" name="dqaFrequency" onChange={handleChange} >
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
                  <Input  onChange={handleChange} type="select" id="dqaFeedback" name="dqaFeedback">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="gonReport">Do you report to the GON?</Label>
                  <Input  onChange={handleChange} type="select" id="gonReport" name="gonReport">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="gonLevel">At what level do you report?</Label>
                  <Input type="select" id="gonLevel"  onChange={handleChange} name="gonLevel">
                  <option value="">Select Level</option>
                    <option value="LACA">LACA</option>
                    <option value="SACA">SACA</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="gonFrequency">How often do you report?</Label>
                  <Input type="text" id="gonFrequency" name="gonFrequency"  onChange={handleChange} placeholder="Reporting frequency" />
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
                  <Input type="date" id="ndrUpload" name="ndrUpload"  onChange={handleChange} />
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
                  <Input type="text" id="ndrUploadLevel" name="ndrUploadLevel"  onChange={handleChange} placeholder="Level of upload" />
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
                  <Input type="date" id="ndhisReport" name="ndhisReport"  onChange={handleChange} />                  
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="ndhisPerson">Name and designation of person responsible for NDHIS upload</Label>
                  <Input type="text" id="ndhisPerson" name="ndhisPerson"  onChange={handleChange} placeholder="Person responsible for NDHIS upload" />
                </FormGroup>
              </Col>
              
              <Col md="6">
                <FormGroup>
                  <Label for="ndhisFrequency">How often is report uploaded on NDHIS?</Label>
                  <Input type="text" id="ndhisFrequency" name="ndhisFrequency"  onChange={handleChange} placeholder="Frequency of upload" /> 
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <Label for="ndhisLastEntry">When was the last data entry on NDHIS?</Label>
                  <Input type="date" id="ndhisLastEntry" name="ndhisLastEntry"  onChange={handleChange} />
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <Label for="meArchive">Are previous reports archived in the M&E unit?</Label>
                  <Input  onChange={handleChange} type="select" id="meArchive" name="meArchive">
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
                  <Input  onChange={handleChange} type="select" id="facilityMeStaff" name="facilityMeStaff">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
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

              functionalComputerCount
              <Col md="6">
                <FormGroup>
                  <Label for="functionalComputersCount">Are there functional computers in the M&E unit(Classmate Inclusive)? How many</Label>
                  <Input type="number" id="functionalComputerCount" name="functionalComputerCount" onChange={handleChange} placeholder="Number of functional computers" />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="currentNmrs">Are you using current NMRS?</Label>
                  <Input  onChange={handleChange} type="select" id="currentNmrs" name="currentNmrs">
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
                  <Input  onChange={handleChange} type="select" id="pocSite" name="pocSite">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="internetFacility">Do you have internet facility?  If yes, fill 6. If No, go to 7</Label>
                  <Input  onChange={handleChange} type="select" id="internetFacility" name="internetFacility">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>    
              
              <Col md="6">
                <FormGroup>
                  <Label for="trainingReceived">Have personnel working in data management processes trained?</Label>
                  <Input  onChange={handleChange} type="select" id="trainingReceived" name="trainingReceived">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <Label for="canExtractData">Can the facility DA demonstrate how to extract data or run queries required by service providers?                  </Label>
                  <Input  onChange={handleChange} type="select" id="canExtractData" name="canExtractData">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
              
              <Col md="6">
                <FormGroup>
                  <Label for="canValidateData">Can the facility DA demonstrate how to validate data or run queries required by service providers?</Label>
                  <Input  onChange={handleChange} type="select" id="canValidateData" name="canValidateData">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
              
              <Col md="6">
                <FormGroup>
                  <Label for="canUseExtractedData">Can the facility DA demonstrate how to verify, validate and correct data  extracted from the NMRS?</Label>
                  <Input  onChange={handleChange} type="select" id="canUseExtractedData" name="canUseExtractedData">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
              
              <Col md="6">
                <FormGroup>
                  <Label for="dataValidationProtocol">Do you have a data validation protocol ?</Label>
                  <Input  onChange={handleChange} type="select" id="dataValidationProtocol" name="dataValidationProtocol">
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
                  <Input  onChange={handleChange} type="select" id="generalAncRegister" name="generalAncRegister">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="pmtctHtsRegister">PMTCT HTS Register</Label>
                  <Input  onChange={handleChange} type="select" id="pmtctHtsRegister" name="pmtctHtsRegister">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="maternalCohortRegister">Maternal Cohort Register</Label>
                  <Input  onChange={handleChange} type="select" id="maternalCohortRegister" name="maternalCohortRegister">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="htsRegister">HTS Register</Label>
                  <Input  onChange={handleChange} type="select" id="htsRegister" name="htsRegister">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="artRegister">ART Register</Label>
                  <Input  onChange={handleChange} type="select" id="artRegister" name="artRegister">
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>

        </TabPane>
 
        <hr style={{backgroundColor: 'darkblue'}} />

        <Button color="primary" type="submit" style={{float: 'right'}} onClick={handleSubmit}>Save DQA</Button>
      </TabContent>
    </div>
      </Card>
    </Form>
  )
}

export default newDQASystemsProcesses
