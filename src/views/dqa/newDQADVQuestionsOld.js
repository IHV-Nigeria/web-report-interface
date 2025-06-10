import React, { useState, useEffect } from 'react'
import { Table, Form, FormGroup, Label, Input, Button, Card, CardBody, CardTitle, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane, Spinner } from 'reactstrap'
import classnames from 'classnames'
import jwtConfig from "../../api/jwtConfig"
import { useHistory, useParams } from "react-router-dom"
import { toast } from 'react-toastify'
// import 'datatables.net-dt/css/jquery.dataTables.css'
// import $ from 'jquery' // Import jQuery for DataTables

// import ReactDatePicker from 'react-datepicker'
// import 'react-datepicker/dist/react-datepicker.css'

import './systemsProcesses.css'

const NewDQADVQuestions = () => {
  const { dqaId } = useParams()
  const [data, setData] = useState(null)
  const [questions, setQuestions] = useState([])
  const [activeTab, setActiveTab] = useState('1')

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPatient, setSelectedPatient] = useState(null)


  const history = useHistory()

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }
  const [loading, setLoading] = useState(false) // State to manage loading screen
  // const [currentPage, setCurrentPage] = useState(1) // For pagination
  // const [rowsPerPage] = useState(100) // Rows per page

  // Fetch questions from the API
  useEffect(() => {
    
    const storedData = localStorage.getItem('dqaData')
    if (storedData) {
      setData(JSON.parse(storedData))
      console.log('Loaded data from local storage:', JSON.parse(storedData))
    } else {
      console.error('No data found in local storage.')
    }
    const fetchQuestions = async () => {
      try {
        setLoading(true) // Show loading screen

        // const token = localStorage.getItem(`${jwtConfig.storageTokenKeyName}`)
        const response = await fetch(`${jwtConfig.dqaUrl}/questions-group/DV`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            // Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          // setLoading(false) // Show loading screen

          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const questionData = await response.json()
        setQuestions(questionData)
        // console.log('Fetched questions:', questionData)
      } catch (error) {
        // setLoading(false) // Show loading screen

        console.error('Error fetching questions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, []) // Empty dependency array ensures this runs only once

   // Handle search for a patient
   const handleSearch = () => {
    if (data && data.variableAssessmentDto) {
      const patient = Object.values(data.variableAssessmentDto).find(
        (p) => p.patientUniqueId === searchQuery
      )
      if (patient) {
        setSelectedPatient(patient)
      } else {
        toast.error('Patient not found')
        setSelectedPatient(null)
      }
    }
  }

  // Handle updating patient data
  const handleUpdatePatient = async () => {
    if (!selectedPatient) {
      toast.error('No patient selected')
      return
    }

    try {
      const response = await fetch(`${jwtConfig.dqaUrl}/variable-assessment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([selectedPatient])
      })

      if (response.ok) {
        toast.success('Patient data updated successfully')
      } else {
        toast.error('Failed to update patient data')
      }
    } catch (error) {
      console.error('Error updating patient data:', error)
      toast.error('A network error occurred. Please try again.')
    }
  }

  const getIndicatorValues = (indicator) => {
    // Extract the corresponding values for the indicator from the data
    return data?.dataVerificationDto?.dataVerificationQtrData[indicator] || []
  }

  const renderMonthInputs = (values) => {
    return values.map((entry, index) => {
      const { dateRange, register, dhis, nmrs, ndr } = entry
      const month = dateRange ? `${dateRange.month}/${dateRange.year}` : "Last Month"
  
      return (
        <Row key={index} className="mb-3">
          <Col md={2}>
            <Label>{month}</Label>
          </Col>
          <Col md={2}>
            <Input type="number" defaultValue={register !== null ? register : 0} />
          </Col>
          <Col md={2}>
            <Input type="number" defaultValue={dhis !== null ? dhis : 0} />
          </Col>
          <Col md={2}>
            <Input type="number" defaultValue={nmrs !== null ? nmrs : 0} />
          </Col>
          <Col md={2}>
            <Input type="number" defaultValue={ndr !== null ? ndr : 0} />
          </Col>
        </Row>
      )
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true) // Show loading screen


    const payload = []
    questions.forEach(question => {
      const indicator = question.question.split(':')[0] // Extract the first word (indicator)
      const values = getIndicatorValues(indicator)

      values.forEach(entry => {
        const { dateRange, register, dhis, nmrs, ndr } = entry
        const month = dateRange ? `${dateRange.month}/${dateRange.year}` : "Last Month"

        if (register !== null) {
          payload.push({
            dqaId,
            questionId: question.id,
            answer: register,
            period: month,
            answerType: 'register'
          })
        }
        if (dhis !== null) {
          payload.push({
            dqaId,
            questionId: question.id,
            answer: dhis,
            period: month,
            answerType: 'dhis'
          })
        }
        if (nmrs !== null) {
          payload.push({
            dqaId,
            questionId: question.id,
            answer: nmrs,
            period: month,
            answerType: 'nmrs'
          })
        }
        if (ndr !== null) {
          payload.push({
            dqaId,
            questionId: question.id,
            answer: ndr,
            period: month,
            answerType: 'ndr'
          })
        }
      })
    })

    console.log('Payload:', JSON.stringify(payload))

    try {
      const response = await fetch(`${jwtConfig.dqaUrl}/questions-answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // Authorization: `Bearer ${localStorage.getItem(`${jwtConfig.storageTokenKeyName}`)}`
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const text = await response.text()
        try {
          const data = text ? JSON.parse(text) : {}
          console.log('Submitted answers:', data)
          // toast.success('Form submitted successfully!')          
        } catch (jsonError) {
          console.error('Failed to parse JSON response:', jsonError)
          // toast.success('Form submitted successfully, but failed to parse server response.')
        }
      } else {
        const text = await response.text()
        const error = text ? JSON.parse(text) : {}
        console.error('Error response:', error)
        // alert('Failed to submit the form. Please try again.')
      }
    } catch (error) {
      // setLoading(false) // Show loading screen

      console.error('Network error:', error)
      // toast.error('A network error occurred. Please check your connection and try again.')
    }


    const payloadVA = Object.entries(data.variableAssessmentDto).map(([key, patient]) => ({      
      dqaId,
      patientId: patient.patientUniqueId,
      dateOfBirth: patient.dob,
      sex: patient.sex,
      folderArtStartDate: "",
      radetArtStartDate: patient.radetVariableAssessment?.artStartDate || "",
      xmlArtStartDate: patient.xmlVariableAssessment?.artStartDate || "",
      ndrArtStartDate: patient.ndrVariableAssessment?.artStartDate || "",
      folderLastDrugPickupDate: "",
      radetLastDrugPickupDate: patient.radetVariableAssessment?.lastPickupDate || "",
      xmlLastDrugPickupDate: patient.xmlVariableAssessment?.lastPickupDate || "",
      ndrLastDrugPickupDate: patient.ndrVariableAssessment?.lastPickupDate || "",
      folderDaysOfArvRefill: null,
      radetDaysOfArvRefill: patient.radetVariableAssessment?.daysArvRefill || null,
      xmlDaysOfArvRefill: patient.xmlVariableAssessment?.daysArvRefill || null,
      ndrDaysOfArvRefill: patient.ndrVariableAssessment?.daysArvRefill || null,
      folderCurrentRegimen: "",
      radetCurrentRegimen: patient.radetVariableAssessment?.currentRegimen || "",
      xmlCurrentRegimen: patient.xmlVariableAssessment?.currentRegimen || "",
      ndrCurrentRegimen: patient.ndrVariableAssessment?.currentRegimen || "",
      radetCurrentViralLoad: patient.radetVariableAssessment?.currentViralLoad || null,
      xmlCurrentViralLoad: patient.xmlVariableAssessment?.currentViralLoad || null,
      ndrCurrentViralLoad: patient.ndrVariableAssessment?.currentViralLoad || null,
      folderViralLoadSampleCollectionDate: "",
      radetViralLoadSampleCollectionDate: patient.radetVariableAssessment?.sampleCollectionDate || "",
      xmlViralLoadSampleCollectionDate: patient.xmlVariableAssessment?.sampleCollectionDate || "",
      ndrViralLoadSampleCollectionDate: patient.ndrVariableAssessment?.sampleCollectionDate || "",
      folderCurrentArtStatus: "",
      radetCurrentArtStatus: patient.radetVariableAssessment?.currentArtStatus || "",
      xmlCurrentArtStatus: patient.xmlVariableAssessment?.currentArtStatus || "",
      ndrCurrentArtStatus: patient.ndrVariableAssessment?.currentArtStatus || "",
      folderPregnancyStatus: "",
      radetPregnancyStatus: patient.radetVariableAssessment?.pregnacyStatus || "",
      xmlPregnancyStatus: patient.xmlVariableAssessment?.pregnacyStatus || "",
      ndrPregnancyStatus: patient.ndrVariableAssessment?.pregnacyStatus || "",
      folderPregnancyStatusDate: "",
      radetPregnancyStatusDate: patient.radetVariableAssessment?.pregnacyStatusDate || "",
      xmlPregnancyStatusDate: patient.xmlVariableAssessment?.pregnacyStatusDate || "",
      ndrPregnancyStatusDate: patient.ndrVariableAssessment?.pregnacyStatusDate || "",
      folderTbScreen: "",
      radetTbScreen: patient.radetVariableAssessment?.tbScreen || "",
      xmlTbScreen: patient.xmlVariableAssessment?.tbScreen || "",
      ndrTbScreen: patient.ndrVariableAssessment?.tbScreen || "",
      folderTbScreenDate: "",
      radetTbScreenDate: patient.radetVariableAssessment?.tbScreenDate || "",
      xmlTbScreenDate: patient.xmlVariableAssessment?.tbScreenDate || "",
      ndrTbScreenDate: patient.ndrVariableAssessment?.tbScreenDate || "",
      comments: patient.comments || key // Add comments field if it exists

    }))

    console.log("PayloadVA:", JSON.stringify(payloadVA, null, 2))

    try {
      const response = await fetch(`${jwtConfig.dqaUrl}/variable-assessment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payloadVA)
      })

      const text = await response.text()
      let result

      try {
        // Attempt to parse as JSON if the response is JSON
        result = response.headers.get("Content-Type")?.includes("application/json") ? JSON.parse(text) : text // Use plain text if not JSON
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError)
        result = text // Fallback to plain text
      }


      if (response.ok) {
        // const text = await response.text()
        // const result = text ? JSON.parse(text) : {} // Handle empty response
        console.log("Submitted variable assessment:", result)
        toast.success("Form submitted successfully!")
        history.push(`/dqa-details/${dqaId}`)
      } else {
        // const text = await response.text()
        // const error = text ? JSON.parse(text) : {} // Handle empty error response
        console.error("Error response:", error)
        toast.error("Failed to submit the form. Please try again.")
      }
    } catch (error) {
      console.error("Network error:", error)
      toast.error("A network error occurred. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  // Pagination logic

  return (
    <div>
      {loading && (
        <div className="loading-overlay">
          <Spinner color="primary" />
          <p>Loading page contents, please wait...</p>
        </div>
      )}
      <h1>DQA Data Validation Questions</h1>
      <Form onSubmit={handleSubmit}>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "1" })}
              onClick={() => toggleTab("1")}
            >
              Data Validations
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "2" })}
              onClick={() => toggleTab("2")}            >
              Variable Assessment
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab} className="mt-3">
          <TabPane tabId="1">
            {questions.map((question, index) => {
              const indicator = question.question.split(':')[0] // Extract the first word (indicator)
              const values = getIndicatorValues(indicator)

              return (
                <Card key={index} className="mb-4">
                  <CardBody>
                    <CardTitle tag="h5">{question.question}</CardTitle>
                    <Row className="mb-3">
                      <Col md={2}><strong>Month</strong></Col>
                      <Col md={2}><strong>Register</strong></Col>
                      <Col md={2}><strong>DHIS</strong></Col>
                      <Col md={2}><strong>NMRS</strong></Col>
                      <Col md={2}><strong>NDR</strong></Col>
                    </Row>
                    {renderMonthInputs(values)}
                  </CardBody>
                </Card>
              )
            })}
          </TabPane>
          <TabPane tabId="2">

            <div className="search-container mb-4">
              <Input
                type="text"
                placeholder="Search by Patient ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button color="primary" onClick={handleSearch}>
                Search
              </Button>
            </div>

            {selectedPatient ? (
              <div className="patient-details">
                <Table bordered>
                  <thead>
                    <tr>
                      <th>Field</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>

                    {/* ================= PATIENT DETAILS ================= */}
                    <tr>
                      <td colSpan="2"><strong>Patient Details</strong></td>
                    </tr>

                    <tr>
                      <td>DQA ID</td>
                      <td>
                        <Input
                          type="text"
                          value={selectedPatient.dqaId || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient,  dqaId: e.target.value })}
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>Patient ID</td>
                      <td>
                        <Input
                          type="text"
                          value={selectedPatient.patientUniqueId || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient,  patientUniqueId: e.target.value })}
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>Date of Birth</td>
                      <td>
                        <Input
                          type="date"
                          value={selectedPatient.dob || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient,  dob: e.target.value })}
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>Sex</td>
                      <td>
                        <Input
                          type="select"
                          value={selectedPatient.sex || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient,  sex: e.target.value })}
                        >
                          <option value="">Select</option>
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                        </Input>
                      </td>
                    </tr>

                    {/* ================= ART START DATES ================= */}
                    <tr>
                      <td colSpan="2"><strong>ART Start Dates</strong></td>
                    </tr>

                    <tr>
                      <td>Folder ART Start Date</td>
                      <td>
                        <Input
                          type="date"
                          value={selectedPatient.folderArtStartDate || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient,  folderArtStartDate: e.target.value })}
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>Radet ART Start Date</td>
                      <td>
                        <Input
                          type="date"
                          value={selectedPatient.radetVariableAssessment.radetArtStartDate || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient,  radetArtStartDate: e.target.value })}
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>XML ART Start Date</td>
                      <td>
                        <Input
                          type="date"
                          value={selectedPatient.xmlVariableAssessment.xmlArtStartDate || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient,  xmlArtStartDate: e.target.value })}
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>NDR ART Start Date</td>
                      <td>
                        <Input
                          type="date"
                          value={selectedPatient.ndrVariableAssessment.ndrArtStartDate || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient,  ndrArtStartDate: e.target.value })}
                        />
                      </td>
                    </tr>

                    {/* ================= DRUG PICKUPS ================= */}
                    <tr>
                      <td colSpan="2"><strong>Last Drug Pickup Dates</strong></td>
                    </tr>

                    <tr>
                      <td>Folder Last Drug Pickup Date</td>
                      <td>
                        <Input
                          type="date"
                          value={selectedPatient.folderLastDrugPickupDate || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient,  folderLastDrugPickupDate: e.target.value })}
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>Radet Last Drug Pickup Date</td>
                      <td>
                        <Input
                          type="date"
                          value={selectedPatient.radetLastDrugPickupDate || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient,  radetLastDrugPickupDate: e.target.value })}
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>XML Last Drug Pickup Date</td>
                      <td>
                        <Input
                          type="date"
                          value={selectedPatient.xmlLastDrugPickupDate || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient,  xmlLastDrugPickupDate: e.target.value })}
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>NDR Last Drug Pickup Date</td>
                      <td>
                        <Input
                          type="date"
                          value={selectedPatient.ndrLastDrugPickupDate || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient,  ndrLastDrugPickupDate: e.target.value })}
                        />
                      </td>
                    </tr>

                    {/* ================= ARV REFILL DAYS ================= */}
                    <tr>
                      <td colSpan="2"><strong>Days of ARV Refill</strong></td>
                    </tr>

                    <tr>
                      <td>Folder Days of ARV Refill</td>
                      <td>
                        <Input
                          type="number"
                          value={selectedPatient.folderDaysOfArvRefill || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient,  folderDaysOfArvRefill: e.target.value })}
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>Radet Days of ARV Refill</td>
                      <td>
                        <Input
                          type="number"
                          value={selectedPatient.radetDaysOfArvRefill || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient,  radetDaysOfArvRefill: e.target.value })}
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>XML Days of ARV Refill</td>
                      <td>
                        <Input
                          type="number"
                          value={selectedPatient.xmlDaysOfArvRefill || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient,  xmlDaysOfArvRefill: e.target.value })}
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>NDR Days of ARV Refill</td>
                      <td>
                        <Input
                          type="number"
                          value={selectedPatient.ndrDaysOfArvRefill || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient,  ndrDaysOfArvRefill: e.target.value })}
                        />
                      </td>
                    </tr>

                    {/* ================= CURRENT REGIMEN ================= */}
                    <tr>
                      <td colSpan="2"><strong>Current Regimen</strong></td>
                    </tr>

                    <tr>
                      <td>Folder Current Regimen</td>
                      <td>
                        <Input
                          type="text"
                          value={selectedPatient.folderCurrentRegimen || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient,  folderCurrentRegimen: e.target.value })}
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>Radet Current Regimen</td>
                      <td>
                        <Input
                          type="text"
                          value={selectedPatient.radetCurrentRegimen || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient,  radetCurrentRegimen: e.target.value })}
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>XML Current Regimen</td>
                      <td>
                        <Input
                          type="text"
                          value={selectedPatient.xmlCurrentRegimen || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient,  xmlCurrentRegimen: e.target.value })}
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>NDR Current Regimen</td>
                      <td>
                        <Input
                          type="text"
                          value={selectedPatient.ndrCurrentRegimen || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient,  ndrCurrentRegimen: e.target.value })}
                        />
                      </td>
                    </tr>

                    {/* ================= VIRAL LOADS ================= */}
                    <tr>
                      <td colSpan="2"><strong>Viral Load Results</strong></td>
                    </tr>

                    <tr>
                      <td>Radet Current Viral Load</td>
                      <td>
                        <Input
                          type="number"
                          value={selectedPatient.radetCurrentViralLoad || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient,  radetCurrentViralLoad: e.target.value })}
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>XML Current Viral Load</td>
                      <td>
                        <Input
                          type="number"
                          value={selectedPatient.xmlCurrentViralLoad || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient,  xmlCurrentViralLoad: e.target.value })}
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>NDR Current Viral Load</td>
                      <td>
                        <Input
                          type="number"
                          value={selectedPatient.ndrCurrentViralLoad || ''}
                          onChange={(e) => setSelectedPatient({ ...selectedPatient,  ndrCurrentViralLoad: e.target.value })}
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>Folder Pregnancy Status</td>
                      <td>
                        <Input
                          type="text"
                          value={selectedPatient.folderPregnancyStatus || ''}
                          onChange={(e) => setSelectedPatient({...selectedPatient, folderPregnancyStatus: e.target.value})
                          }
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>Radet Pregnancy Status</td>
                      <td>
                        <Input
                          type="text"
                          value={selectedPatient.radetPregnancyStatus || ''}
                          onChange={(e) => setSelectedPatient({...selectedPatient, radetPregnancyStatus: e.target.value})
                          }
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>XML Pregnancy Status</td>
                      <td>
                        <Input
                          type="text"
                          value={selectedPatient.xmlPregnancyStatus || ''}
                          onChange={(e) => setSelectedPatient({...selectedPatient, xmlPregnancyStatus: e.target.value})
                          }
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>NDR Pregnancy Status</td>
                      <td>
                        <Input
                          type="text"
                          value={selectedPatient.ndrPregnancyStatus || ''}
                          onChange={(e) => setSelectedPatient({...selectedPatient, ndrPregnancyStatus: e.target.value})
                          }
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>Folder Pregnancy Status Date</td>
                      <td>
                        <Input
                          type="date"
                          value={selectedPatient.folderPregnancyStatusDate || ''}
                          onChange={(e) => setSelectedPatient({...selectedPatient, folderPregnancyStatusDate: e.target.value})
                          }
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>Radet Pregnancy Status Date</td>
                      <td>
                        <Input
                          type="date"
                          value={selectedPatient.radetPregnancyStatusDate || ''}
                          onChange={(e) => setSelectedPatient({...selectedPatient, radetPregnancyStatusDate: e.target.value})
                          }
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>XML Pregnancy Status Date</td>
                      <td>
                        <Input
                          type="date"
                          value={selectedPatient.xmlPregnancyStatusDate || ''}
                          onChange={(e) => setSelectedPatient({...selectedPatient, xmlPregnancyStatusDate: e.target.value})
                          }
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>NDR Pregnancy Status Date</td>
                      <td>
                        <Input
                          type="date"
                          value={selectedPatient.ndrPregnancyStatusDate || ''}
                          onChange={(e) => setSelectedPatient({...selectedPatient, ndrPregnancyStatusDate: e.target.value})
                          }
                        />
                      </td>
                    </tr>

                    {/* ================= TB SCREENING ================= */}
                    <tr>
                      <td colSpan="2"><strong>TB Screening</strong></td>
                    </tr>

                    <tr>
                      <td>Folder TB Screen</td>
                      <td>
                        <Input
                          type="text"
                          value={selectedPatient.folderTbScreen || ''}
                          onChange={(e) => setSelectedPatient({...selectedPatient, folderTbScreen: e.target.value})
                          }
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>Radet TB Screen</td>
                      <td>
                        <Input
                          type="text"
                          value={selectedPatient.radetTbScreen || ''}
                          onChange={(e) => setSelectedPatient({...selectedPatient, radetTbScreen: e.target.value})
                          }
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>XML TB Screen</td>
                      <td>
                        <Input
                          type="text"
                          value={selectedPatient.xmlTbScreen || ''}
                          onChange={(e) => setSelectedPatient({...selectedPatient, xmlTbScreen: e.target.value})
                          }
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>NDR TB Screen</td>
                      <td>
                        <Input
                          type="text"
                          value={selectedPatient.ndrTbScreen || ''}
                          onChange={(e) => setSelectedPatient({...selectedPatient, ndrTbScreen: e.target.value})
                          }
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>Folder TB Screen Date</td>
                      <td>
                        <Input
                          type="date"
                          value={selectedPatient.folderTbScreenDate || ''}
                          onChange={(e) => setSelectedPatient({...selectedPatient, folderTbScreenDate: e.target.value})
                          }
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>Radet TB Screen Date</td>
                      <td>
                        <Input
                          type="date"
                          value={selectedPatient.radetTbScreenDate || ''}
                          onChange={(e) => setSelectedPatient({...selectedPatient, radetTbScreenDate: e.target.value})
                          }
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>XML TB Screen Date</td>
                      <td>
                        <Input
                          type="date"
                          value={selectedPatient.xmlTbScreenDate || ''}
                          onChange={(e) => setSelectedPatient({...selectedPatient, xmlTbScreenDate: e.target.value})
                          }
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>NDR TB Screen Date</td>
                      <td>
                        <Input
                          type="date"
                          value={selectedPatient.ndrTbScreenDate || ''}
                          onChange={(e) => setSelectedPatient({...selectedPatient, ndrTbScreenDate: e.target.value})
                          }
                        />
                      </td>
                    </tr>

                    {/* ================= OTHER ================= */}
                    <tr>
                      <td colSpan="2"><strong>Other</strong></td>
                    </tr>

                    <tr>
                      <td>Comments</td>
                      <td>
                        <Input
                          type="text"
                          value={selectedPatient.comments || ''}
                          onChange={(e) => setSelectedPatient({...selectedPatient, comments: e.target.value})
                          }
                        />
                      </td>
                    </tr>


                  </tbody>
                </Table>
                <Button color="success" onClick={handleUpdatePatient}>
                  Update Patient
                </Button>
              </div>
            ) : (
              <p>No patient selected</p>
            )}

            
          </TabPane>
        </TabContent>
        <Button type="submit" color="primary">Submit</Button>
      </Form>
    </div>
  )
}

export default NewDQADVQuestions