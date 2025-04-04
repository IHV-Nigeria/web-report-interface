import React, { useState, useEffect } from 'react'
import { Table, Form, FormGroup, Label, Input, Button, Card, CardBody, CardTitle, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane, Spinner } from 'reactstrap'
import classnames from 'classnames'
import jwtConfig from "../../api/jwtConfig"
import { useHistory, useParams } from "react-router-dom"
import { toast } from 'react-toastify'
import 'datatables.net-dt/css/jquery.dataTables.css'
import $ from 'jquery' // Import jQuery for DataTables

import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import './systemsProcesses.css'

const NewDQADVQuestions = () => {
  const { dqaId } = useParams()
  const [data, setData] = useState(null)
  const [questions, setQuestions] = useState([])
  const [activeTab, setActiveTab] = useState('1')

  const history = useHistory()

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }
  const [loading, setLoading] = useState(false) // State to manage loading screen
  const [currentPage, setCurrentPage] = useState(1) // For pagination
  const [rowsPerPage] = useState(100) // Rows per page

  // Fetch questions from the API
  useEffect(() => {
    $(document).ready(function () {
      $('#variableAssessmentTable').DataTable()
    })
    
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

        const token = localStorage.getItem(`${jwtConfig.storageTokenKeyName}`)
        const response = await fetch(`${jwtConfig.dqaUrl}/questions-group/DV`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${token}`,
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
      const response = await fetch(`${jwtConfig.baseUrl}/questions-answers`, {
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

    try {
      const response = await fetch(`${jwtConfig.baseUrl}/variable-assessment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payloadVA)
      })
  
      if (response.ok) {
        const result = await response.json()
        console.log("Submitted variable assessment:", result)
        toast.success("Form submitted successfully!")
        history.push(`/dqa-details/${dqaId}`)
      } else {
        const error = await response.json()
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
  const currentRows = data?.variableAssessmentDto ? Object.entries(data.variableAssessmentDto).slice(indexOfFirstRow, indexOfLastRow) : []

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
            <div className="table-responsive">
              <Table  id="variableAssessmentTable" bordered>
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
                          />
                        </td>
                        <td>
                          <Input
                            type="date"
                            value={patient.dob || ""}
                            onChange={(e) => {
                              const updatedData = { ...data }
                              updatedData.variableAssessmentDto[key].dob = e.target.value
                              setData(updatedData)
                            }}
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
                          >
                            <option value="">Select</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                          </Input>
                        </td>
                        <td>
                          <Input type="text" defaultValue="" />
                        </td>
                        <td>
                          {/* <Input
                            type="text"
                            defaultValue={patient.radetVariableAssessment?.artStartDate || ""}
                          /> */}

                            <CustomDatePicker
                              value={patient.radetVariableAssessment?.artStartDate}
                              onChange={(date) => {
                                const updatedData = { ...data };
                                updatedData.variableAssessmentDto[key].radetVariableAssessment.artStartDate = date;
                                setData(updatedData);
                              }}
                            />
                        </td>
                        <td>
                          {/* <Input
                            type="text"
                            defaultValue={patient.xmlVariableAssessment?.artStartDate || ""}
                          /> */}

                            <CustomDatePicker
                              value={patient.xmlVariableAssessment?.artStartDate}
                              onChange={(date) => {
                                const updatedData = { ...data };
                                updatedData.variableAssessmentDto[key].xmlVariableAssessment.artStartDate = date;
                                setData(updatedData);
                              }}
                            />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={patient.ndrVariableAssessment?.artStartDate || ""}
                          />
                        </td>
                        <td>
                          <Input type="text" defaultValue="" />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={patient.radetVariableAssessment?.lastPickupDate || ""}
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={patient.xmlVariableAssessment?.lastPickupDate || ""}
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={patient.ndrVariableAssessment?.lastPickupDate || ""}
                          />
                        </td>
                        <td>
                        <Input
                          type="text"
                          value={patient.comments || ""} // Bind the comments field
                          onChange={(e) => {
                            const updatedData = { ...data }
                            updatedData.variableAssessmentDto[key].comments = e.target.value // Update the comments field
                            setData(updatedData)
                          }}
                        />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={patient.radetVariableAssessment?.daysArvRefill || ""}
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={patient.xmlVariableAssessment?.daysArvRefill || ""}
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={patient.ndrVariableAssessment?.daysArvRefill || ""}
                          />
                        </td>
                        <td>
                          <Input type="text" defaultValue="" />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={patient.radetVariableAssessment?.currentRegimen || ""}
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={patient.xmlVariableAssessment?.currentRegimen || ""}
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={patient.ndrVariableAssessment?.currentRegimen || ""}
                          />
                        </td>
                        <td>
                          <Input type="text" defaultValue="" />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={patient.radetVariableAssessment?.currentViralLoad || ""}
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={patient.xmlVariableAssessment?.currentViralLoad || ""}
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={patient.ndrVariableAssessment?.currentViralLoad || ""}
                          />
                        </td>
                        <td>
                          <Input type="text" defaultValue="" />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={
                              patient.radetVariableAssessment?.sampleCollectionDate || ""
                            }
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={
                              patient.xmlVariableAssessment?.sampleCollectionDate || ""
                            }
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={
                              patient.ndrVariableAssessment?.sampleCollectionDate || ""
                            }
                          />
                        </td>
                        <td>
                          <Input type="text" defaultValue="" />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={patient.radetVariableAssessment?.currentArtStatus || ""}
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={patient.xmlVariableAssessment?.currentArtStatus || ""}
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={patient.ndrVariableAssessment?.currentArtStatus || ""}
                          />
                        </td>
                        <td>
                          <Input type="text" defaultValue="" />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={patient.radetVariableAssessment?.pregnacyStatus || ""}
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={patient.xmlVariableAssessment?.pregnacyStatus || ""}
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={patient.ndrVariableAssessment?.pregnacyStatus || ""}
                          />
                        </td>
                        <td>
                          <Input type="text" defaultValue="" />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={
                              patient.radetVariableAssessment?.pregnacyStatusDate || ""
                            }
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={
                              patient.xmlVariableAssessment?.pregnacyStatusDate || ""
                            }
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={
                              patient.ndrVariableAssessment?.pregnacyStatusDate || ""
                            }
                          />
                        </td>
                        <td>
                          <Input type="text" defaultValue="" />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={patient.radetVariableAssessment?.tbScreen || ""}
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={patient.xmlVariableAssessment?.tbScreen || ""}
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={patient.ndrVariableAssessment?.tbScreen || ""}
                          />
                        </td>
                        <td>
                          <Input type="text" defaultValue="" />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={patient.radetVariableAssessment?.tbScreenDate || ""}
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={patient.xmlVariableAssessment?.tbScreenDate || ""}
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            defaultValue={patient.ndrVariableAssessment?.tbScreenDate || ""}
                          />
                        </td>
                        <td>
                          <Input type="text" defaultValue="" />
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
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </TabPane>
        </TabContent>
        <Button type="submit" color="primary">Submit</Button>
      </Form>
    </div>
  )
}

export default NewDQADVQuestions