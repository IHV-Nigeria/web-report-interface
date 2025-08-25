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

const newDQADVQuestions = () => {
  const { dqaId } = useParams()
  const [data, setData] = useState(null)
  const [questions, setQuestions] = useState([])
  const [activeTab, setActiveTab] = useState('1')
  const [filters, setFilters] = useState({})

  const history = useHistory()

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  const handlePrevious = () => {
    const nextTab = (parseInt(activeTab) - 1).toString()
    setActiveTab(nextTab)
  }

  const handleNext = () => {
    const nextTab = (parseInt(activeTab) + 1).toString()
    setActiveTab(nextTab)
  }

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }
  const [loading, setLoading] = useState(false) // State to manage loading screen
  const [currentPage, setCurrentPage] = useState(1) // For pagination
  const [rowsPerPage] = useState(100) // Rows per page

  // Fetch questions from the API
  useEffect(() => {
    // $(document).ready(function () {
    //   $('#variableAssessmentTable').DataTable()
    // })

    // Retrieve data from local storage

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
          setLoading(false) // Show loading screen

          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const questionData = await response.json()
        setQuestions(questionData)
        console.log('Fetched questions:', questionData)
      } catch (error) {
        setLoading(false) // Show loading screen

        console.error('Error fetching questions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, []) // Empty dependency array ensures this runs only once

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
            month,
            answerType: 'register'
          })
        }
        if (dhis !== null) {
          payload.push({
            dqaId,
            questionId: question.id,
            answer: dhis,
            month,
            answerType: 'dhis'
          })
        }
        if (nmrs !== null) {
          payload.push({
            dqaId,
            questionId: question.id,
            answer: nmrs,
            month,
            answerType: 'nmrs'
          })
        }
        if (ndr !== null) {
          payload.push({
            dqaId,
            questionId: question.id,
            answer: ndr,
            month,
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
      // console log the key      
      dqaId,
      patientId: patient.patientUniqueId || key,
      dateOfBirth: patient.dob,
      sex: patient.sex,
      folderArtStartDate: patient.folderArtStartDate || "",
      radetArtStartDate: patient.radetVariableAssessment?.artStartDate || "",
      xmlArtStartDate: patient.xmlVariableAssessment?.artStartDate || "",
      ndrArtStartDate: patient.ndrVariableAssessment?.artStartDate || "",
      folderLastDrugPickupDate: patient.folderLastDrugPickupDate || "",
      radetLastDrugPickupDate: patient.radetVariableAssessment?.lastPickupDate || "",
      xmlLastDrugPickupDate: patient.xmlVariableAssessment?.lastPickupDate || "",
      ndrLastDrugPickupDate: patient.ndrVariableAssessment?.lastPickupDate || "",
      folderDaysOfArvRefill: patient.folderDaysOfArvRefill ?? null,
      radetDaysOfArvRefill: patient.radetVariableAssessment?.daysArvRefill ?? null,
      xmlDaysOfArvRefill: patient.xmlVariableAssessment?.daysArvRefill ?? null,
      ndrDaysOfArvRefill: patient.ndrVariableAssessment?.daysArvRefill ?? null,
      folderCurrentRegimen: patient.folderCurrentRegimen || "",
      radetCurrentRegimen: patient.radetVariableAssessment?.currentRegimen || "",
      xmlCurrentRegimen: patient.xmlVariableAssessment?.currentRegimen || "",
      ndrCurrentRegimen: patient.ndrVariableAssessment?.currentRegimen || "",
      folderCurrentViralLoad: patient.folderCurrentViralLoad || "",
      radetCurrentViralLoad: patient.radetVariableAssessment?.currentViralLoad ?? null,
      xmlCurrentViralLoad: patient.xmlVariableAssessment?.currentViralLoad ?? null,
      ndrCurrentViralLoad: patient.ndrVariableAssessment?.currentViralLoad ?? null,
      folderViralLoadSampleCollectionDate: patient.folderViralLoadSampleCollectionDate || "",
      radetViralLoadSampleCollectionDate: patient.radetVariableAssessment?.sampleCollectionDate || "",
      xmlViralLoadSampleCollectionDate: patient.xmlVariableAssessment?.sampleCollectionDate || "",
      ndrViralLoadSampleCollectionDate: patient.ndrVariableAssessment?.sampleCollectionDate || "",
      folderCurrentArtStatus: patient.folderCurrentArtStatus || "",
      radetCurrentArtStatus: patient.radetVariableAssessment?.currentArtStatus || "",
      xmlCurrentArtStatus: patient.xmlVariableAssessment?.currentArtStatus || "",
      ndrCurrentArtStatus: patient.ndrVariableAssessment?.currentArtStatus || "",
      folderPregnancyStatus: patient.folderPregnancyStatus || "",
      radetPregnancyStatus: patient.radetVariableAssessment?.pregnacyStatus || "",
      xmlPregnancyStatus: patient.xmlVariableAssessment?.pregnacyStatus || "",
      ndrPregnancyStatus: patient.ndrVariableAssessment?.pregnacyStatus || "",
      folderPregnancyStatusDate: patient.folderPregnancyStatusDate || "",
      radetPregnancyStatusDate: patient.radetVariableAssessment?.pregnacyStatusDate || "",
      xmlPregnancyStatusDate: patient.xmlVariableAssessment?.pregnacyStatusDate || "",
      ndrPregnancyStatusDate: patient.ndrVariableAssessment?.pregnacyStatusDate || "",
      folderTbScreen: patient.folderTbScreen || "",
      radetTbScreen: patient.radetVariableAssessment?.tbScreen || "",
      xmlTbScreen: patient.xmlVariableAssessment?.tbScreen || "",
      ndrTbScreen: patient.ndrVariableAssessment?.tbScreen || "",
      folderTbScreenDate: patient.folderTbScreenDate || "",
      radetTbScreenDate: patient.radetVariableAssessment?.tbScreenDate || "",
      xmlTbScreenDate: patient.xmlVariableAssessment?.tbScreenDate || "",
      ndrTbScreenDate: patient.ndrVariableAssessment?.tbScreenDate || "",
      comments: patient.comments || ""
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
        history.push(`/save-dqa-comments/${dqaId}`)
        // history.push(`/dqa-details/${dqaId}`)
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
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const allRows = data?.variableAssessmentDto ? Object.entries(data.variableAssessmentDto) : []
  
  const filteredRows = allRows.filter(([key, patient]) => {
    console.log("Filtering patient:", key)
    return Object.entries(filters).every(([field, filterValue]) => {
      if (!filterValue) return true
      const val = patient[field] ? String(patient[field]).toLowerCase() : ""
      return val.includes(filterValue.toLowerCase())
    })
  })

  const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow)

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
            <Button color="primary" onClick={handleNext} style={{ float: 'right' }}>Next</Button>
          </TabPane>
          <TabPane tabId="2">
            <div className="table-responsive" style={{ overflowX: 'auto' }}>
              <Table id="variableAssessmentTable" bordered style={{ tableLayout: 'auto', width: '100%' }}>
                <thead>
                  <tr>
                    <th>S/No</th>
                    <th>Patient ID</th>
                    <th>Date of Birth</th>
                    <th>Sex</th>
                    <th>Folder_ART Start Date</th>
                    <th>RADET_ART Start Date</th>
                    <th>XML_ART Start Date</th>
                    <th>NDR_ART Start Date</th>
                    <th>Folder_Last Drug Pickup Date</th>
                    <th>RADET_Last Drug Pickup Date</th>
                    <th>XML_Last Drug Pickup Date</th>
                    <th>NDR_Last Drug Pickup Date</th>
                    <th>Folder_Days of ARV Refill</th>
                    <th>RADET_Days of ARV Refill</th>
                    <th>XML_Days of ARV Refill</th>
                    <th>NDR_Days of ARV Refill</th>
                    <th>Folder_Current Regimen</th>
                    <th>RADET_Current Regimen</th>
                    <th>XML_Current Regimen</th>
                    <th>NDR_Current Regimen</th>
                    <th>Folder_Current Viral Load</th>
                    <th>RADET_Current Viral Load</th>
                    <th>XML_Current Viral Load</th>
                    <th>NDR_Current Viral Load</th>
                    <th>Folder_Viral Load Sample Collection Date</th>
                    <th>RADET_Viral Load Sample Collection Date</th>
                    <th>XML_Viral Load Sample Collection Date</th>
                    <th>NDR_Viral Load Sample Collection Date</th>
                    <th>Folder_Current ART Status</th>
                    <th>RADET_Current ART Status</th>
                    <th>XML_Current ART Status</th>
                    <th>NDR_Current ART Status</th>
                    <th>Folder_Pregnancy Status</th>
                    <th>RADET_Pregnancy Status</th>
                    <th>XML_Pregnancy Status</th>
                    <th>NDR_Pregnancy Status</th>
                    <th>Folder_Pregnancy Status Date</th>
                    <th>RADET_Pregnancy Status Date</th>
                    <th>XML_Pregnancy Status Date</th>
                    <th>NDR_Pregnancy Status Date</th>
                    <th>Folder_TB Screen</th>
                    <th>RADET_TB Screen</th>
                    <th>XML_TB Screen</th>
                    <th>NDR_TB Screen</th>
                    <th>Folder_TB Screen Date</th>
                    <th>RADET_TB Screen Date</th>
                    <th>XML_TB Screen Date</th>
                    <th>NDR_TB Screen Date</th>
                    <th>Comments/Reason or Discrepancy</th>
                  </tr>
                  <tr>
                    <th>
                    </th>
                    <th>
                      <Input
                        bsSize="sm"
                        placeholder="Search Patient ID"
                        value={filters.patientUniqueId || ""}
                        onChange={e => handleFilterChange("patientUniqueId", e.target.value)}
                      />
                    </th>

                    <th colSpan="47">
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* {data &&
                    Object.entries(data.variableAssessmentDto).map(([key, patient], index) => ( */}
                  {currentRows.map(([key, patient], index) => (
                    <tr key={key}>
                      <td>{index + 1 + indexOfFirstRow}</td>
                      <td>
                        <Input
                          type="text"
                          value={patient.patientUniqueId || ""}
                          onChange={(e) => {
                            const updatedData = { ...data }
                            updatedData.variableAssessmentDto[key].patientUniqueId = e.target.value
                            setData(updatedData)
                          }}
                          style={{ minWidth: 130, width: '100%' }}
                          readOnly

                        />
                      </td>
                      <td>
                        <Input
                          type="text"
                          value={patient.dob || ""}
                          onChange={(e) => {
                            const updatedData = { ...data }
                            updatedData.variableAssessmentDto[key].dob = e.target.value
                            setData(updatedData)
                          }}
                          style={{ minWidth: 130, width: '100%' }}
                          readOnly
                        />

                      </td>
                      <td>
                        <Input
                          type="select"
                          value={patient.sex || ""}
                          onChange={(e) => {
                            const updatedData = { ...data }
                            updatedData.variableAssessmentDto[key].sex = e.target.value
                            setData(updatedData)
                          }}
                          style={{ minWidth: 100, width: '100%' }}
                          readOnly
                        >
                          <option value="">Select</option>
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                        </Input>
                      </td>
                      <td style={{ backgroundColor: "#d4edda" }}>
                        <Input
                          type="date"
                          value={patient.folderArtStartDate || ""}
                          onChange={e => {
                            const updatedData = { ...data }
                            updatedData.variableAssessmentDto[key].folderArtStartDate = e.target.value
                            setData(updatedData)
                          }}
                        />
                      </td>
                      <td>
                        <Input
                          type="date"
                          defaultValue={patient.radetVariableAssessment?.artStartDate || ""}
                          style={{ minWidth: 130, width: '100%' }}
                          readOnly
                        />
                      </td>
                      <td>
                        <Input
                          type="date"
                          defaultValue={patient.xmlVariableAssessment?.artStartDate || ""}
                          style={{ minWidth: 130, width: '100%' }}
                          readOnly
                        />
                      </td>
                      <td>
                        <Input
                          type="date"
                          defaultValue={patient.ndrVariableAssessment?.artStartDate || ""}
                          style={{ minWidth: 130, width: '100%' }}
                          readOnly
                        />
                      </td>
                      <td style={{ backgroundColor: "#d4edda" }}>
                        <Input
                          type="date"
                          value={patient.folderLastDrugPickupDate || ""}
                          onChange={e => {
                            const updatedData = { ...data }
                            updatedData.variableAssessmentDto[key].folderLastDrugPickupDate = e.target.value
                            setData(updatedData)
                          }}
                        />
                      </td>
                      <td>
                        <Input
                          type="date"
                          defaultValue={patient.radetVariableAssessment?.lastPickupDate || ""}
                          readOnly
                        />
                      </td>
                      <td>
                        <Input
                          type="date"
                          defaultValue={patient.xmlVariableAssessment?.lastPickupDate || ""}
                          readOnly
                        />
                      </td>
                      <td>
                        <Input
                          type="date"
                          defaultValue={patient.ndrVariableAssessment?.lastPickupDate || ""}
                          readOnly
                        />
                      </td>
                      <td style={{ backgroundColor: "#d4edda" }}>
                        <Input
                          type="number"
                          value={patient.folderDaysOfArvRefill || ""}
                          onChange={e => {
                            const updatedData = { ...data }
                            updatedData.variableAssessmentDto[key].folderDaysOfArvRefill = e.target.value
                            setData(updatedData)
                          }}
                          style={{ minWidth: 100, width: '100%' }}
                        />
                      </td>
                      <td>
                        <Input
                          type="number"
                          defaultValue={patient.radetVariableAssessment?.daysArvRefill || 0}
                          style={{ minWidth: 100, width: '100%' }}
                          readOnly
                        />
                      </td>
                      <td>
                        <Input
                          type="number"
                          defaultValue={patient.xmlVariableAssessment?.daysArvRefill || 0}
                          style={{ minWidth: 100, width: '100%' }}
                          readOnly
                        />
                      </td>
                      <td>
                        <Input
                          type="number"
                          defaultValue={patient.ndrVariableAssessment?.daysArvRefill || 0}
                          style={{ minWidth: 100, width: '100%' }}
                          readOnly
                        />
                      </td>
                      <td style={{ backgroundColor: "#d4edda" }}>
                        <Input
                          type="text"
                          value={patient.folderCurrentRegimen || ""}
                          onChange={e => {
                            const updatedData = { ...data }
                            updatedData.variableAssessmentDto[key].folderCurrentRegimen = e.target.value
                            setData(updatedData)
                          }}
                          style={{ minWidth: 130, width: '100%' }}
                        />
                      </td>
                      <td>
                        <Input
                          type="text"
                          defaultValue={patient.radetVariableAssessment?.currentRegimen || ""}
                          style={{ minWidth: 130, width: '100%' }}
                          readOnly
                        />
                      </td>
                      <td>
                        <Input
                          type="text"
                          defaultValue={patient.xmlVariableAssessment?.currentRegimen || ""}
                          style={{ minWidth: 130, width: '100%' }}
                          readOnly
                        />
                      </td>
                      <td>
                        <Input
                          type="text"
                          defaultValue={patient.ndrVariableAssessment?.currentRegimen || ""}
                          style={{ minWidth: 130, width: '100%' }}
                          readOnly
                        />
                      </td>
                      <td style={{ backgroundColor: "#d4edda" }}>
                        <Input
                          type="text"
                          value={patient.folderCurrentViralLoad || ""}
                          onChange={e => {
                            const updatedData = { ...data }
                            updatedData.variableAssessmentDto[key].folderCurrentViralLoad = e.target.value
                            setData(updatedData)
                          }}
                          style={{ minWidth: 130, width: '100%' }}
                        />
                      </td>
                      <td>
                        <Input
                          type="text"
                          defaultValue={patient.radetVariableAssessment?.currentViralLoad || ""}
                          readOnly
                        />
                      </td>
                      <td>
                        <Input
                          type="text"
                          defaultValue={patient.xmlVariableAssessment?.currentViralLoad || ""}
                          readOnly
                        />
                      </td>
                      <td>
                        <Input
                          type="text"
                          defaultValue={patient.ndrVariableAssessment?.currentViralLoad || ""}
                          readOnly
                        />
                      </td>
                      <td style={{ backgroundColor: "#d4edda" }}>
                        <Input
                          type="date"
                          value={patient.folderViralLoadSampleCollectionDate || ""}
                          onChange={e => {
                            const updatedData = { ...data }
                            updatedData.variableAssessmentDto[key].folderViralLoadSampleCollectionDate = e.target.value
                            setData(updatedData)
                          }}
                        />
                      </td>
                      <td>
                        <Input
                          type="date"
                          defaultValue={
                            patient.radetVariableAssessment?.sampleCollectionDate || ""
                          }
                          readOnly
                        />
                      </td>
                      <td>
                        <Input
                          type="date"
                          defaultValue={
                            patient.xmlVariableAssessment?.sampleCollectionDate || ""
                          }
                          readOnly
                        />
                      </td>
                      <td>
                        <Input
                          type="date"
                          defaultValue={
                            patient.ndrVariableAssessment?.sampleCollectionDate || ""
                          }
                          readOnly
                        />
                      </td>
                      <td style={{ backgroundColor: "#d4edda" }}>
                        <Input
                          type="text"
                          value={patient.folderCurrentArtStatus || ""}
                          onChange={e => {
                            const updatedData = { ...data }
                            updatedData.variableAssessmentDto[key].folderCurrentArtStatus = e.target.value
                            setData(updatedData)
                          }}
                          style={{ minWidth: 130, width: '100%' }}
                        />
                      </td>
                      <td>
                        <Input
                          type="text"
                          defaultValue={patient.radetVariableAssessment?.currentArtStatus || ""}
                          readOnly
                        />
                      </td>
                      <td>
                        <Input
                          type="text"
                          defaultValue={patient.xmlVariableAssessment?.currentArtStatus || ""}
                          readOnly
                        />
                      </td>
                      <td>
                        <Input
                          type="text"
                          defaultValue={patient.ndrVariableAssessment?.currentArtStatus || ""}
                          readOnly
                        />
                      </td>
                      <td style={{ backgroundColor: "#d4edda" }}>
                        <Input
                          type="text"
                          value={patient.folderPregnancyStatus || ""}
                          onChange={e => {
                            const updatedData = { ...data }
                            updatedData.variableAssessmentDto[key].folderPregnancyStatus = e.target.value
                            setData(updatedData)
                          }}
                          style={{ minWidth: 130, width: '100%' }}
                        />
                      </td>
                      <td>
                        <Input
                          type="text"
                          defaultValue={patient.radetVariableAssessment?.pregnacyStatus || ""}
                          readOnly
                        />
                      </td>
                      <td>
                        <Input
                          type="text"
                          defaultValue={patient.xmlVariableAssessment?.pregnacyStatus || ""}
                          readOnly
                        />
                      </td>
                      <td>
                        <Input
                          type="text"
                          defaultValue={patient.ndrVariableAssessment?.pregnacyStatus || ""}
                          readOnly
                        />
                      </td>
                      <td style={{ backgroundColor: "#d4edda" }}>
                        <Input
                          type="date"
                          value={patient.folderPregnancyStatusDate || ""}
                          onChange={e => {
                            const updatedData = { ...data }
                            updatedData.variableAssessmentDto[key].folderPregnancyStatusDate = e.target.value
                            setData(updatedData)
                          }}
                        />
                      </td>
                      <td>
                        <Input
                          type="date"
                          defaultValue={
                            patient.radetVariableAssessment?.pregnacyStatusDate || ""
                          }
                          readOnly
                        />
                      </td>
                      <td>
                        <Input
                          type="date"
                          defaultValue={
                            patient.xmlVariableAssessment?.pregnacyStatusDate || ""
                          }
                          readOnly
                        />
                      </td>
                      <td>
                        <Input
                          type="date"
                          defaultValue={
                            patient.ndrVariableAssessment?.pregnacyStatusDate || ""
                          }
                          readOnly
                        />
                      </td>
                      <td style={{ backgroundColor: "#d4edda" }}>
                        <Input
                          type="text"
                          value={patient.folderTbScreen || ""}
                          onChange={e => {
                            const updatedData = { ...data }
                            updatedData.variableAssessmentDto[key].folderTbScreen = e.target.value
                            setData(updatedData)
                          }}
                          style={{ minWidth: 130, width: '100%' }}
                        />
                      </td>
                      <td>
                        <Input
                          type="text"
                          defaultValue={patient.radetVariableAssessment?.tbScreen || ""}
                          style={{ minWidth: 200, width: '100%' }}
                          readOnly
                        />
                      </td>
                      <td>
                        <Input
                          type="text"
                          defaultValue={patient.xmlVariableAssessment?.tbScreen || ""}
                          style={{ minWidth: 130, width: '100%' }}
                          readOnly
                        />
                      </td>
                      <td>
                        <Input
                          type="text"
                          defaultValue={patient.ndrVariableAssessment?.tbScreen || ""}
                          style={{ minWidth: 130, width: '100%' }}
                          readOnly
                        />
                      </td>
                      <td style={{ backgroundColor: "#d4edda" }}>
                        <Input
                          type="date"
                          value={patient.folderTbScreenDate || ""}
                          onChange={e => {
                            const updatedData = { ...data }
                            updatedData.variableAssessmentDto[key].folderTbScreenDate = e.target.value
                            setData(updatedData)
                          }}
                        />
                      </td>
                      <td>
                        <Input
                          type="date"
                          defaultValue={patient.radetVariableAssessment?.tbScreenDate || ""}
                          style={{ minWidth: 130, width: '100%' }}
                          readOnly
                        />
                      </td>
                      <td>
                        <Input
                          type="date"
                          defaultValue={patient.xmlVariableAssessment?.tbScreenDate || ""}
                          readOnly
                        />
                      </td>
                      <td>
                        <Input
                          type="date"
                          defaultValue={patient.ndrVariableAssessment?.tbScreenDate || ""}
                          readOnly
                        />
                      </td>
                      <td style={{ backgroundColor: "#d4edda" }}>
                        <Input
                          type="text"
                          value={patient.comments || ""}
                          onChange={e => {
                            const updatedData = { ...data }
                            updatedData.variableAssessmentDto[key].comments = e.target.value
                            setData(updatedData)
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            {/* Pagination controls */}
            <div className="pagination-controls">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <Button
                disabled={indexOfLastRow >= Object.entries(data?.variableAssessmentDto || {}).length}
                onClick={() => setCurrentPage((prev) => prev + 1)} style={{ marginLeft: '50px' }}
              >
                Next
              </Button>
              <Button color="info" onClick={handlePrevious} style={{ float: 'right' }}>Go Back</Button>
            </div>
            <Button type="submit" color="primary" style={{ float: 'right', marginTop: '10px' }}>Submit</Button>
          </TabPane>
        </TabContent>

      </Form>
    </div>
  )
}

export default newDQADVQuestions