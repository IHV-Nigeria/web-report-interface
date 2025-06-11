import React, { useState, useEffect } from 'react'
import { Table, Form, Input, Button, Card, CardBody, CardTitle, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane, Spinner, Label } from 'reactstrap'
import classnames from 'classnames'
import jwtConfig from "../../api/jwtConfig"
import { useHistory, useParams } from "react-router-dom"
import { toast } from 'react-toastify'
import './systemsProcesses.css'

const editDQADVQuestions = () => {
    const { dqaId } = useParams()
    const history = useHistory()

    const [dataValidationsRows, setDataValidationsRows] = useState({})
    const [variableAssessmentRows, setVariableAssessmentRows] = useState([])
    const [questions, setQuestions] = useState([])
    const [activeTab, setActiveTab] = useState('1')
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage] = useState(100)

    // Preload from localStorage or fetch from API
    useEffect(() => {
        let dqaData = {}
        try {
            dqaData = JSON.parse(localStorage.getItem("dqaData") || "{}")
        } catch (e) {
            dqaData = {}
        }

        // Data Validations
        const preloadedDV = dqaData?.questionsAnswers || []
        if (preloadedDV.length > 0) {
            // Group by indicator
            const groupedDV = {}
            preloadedDV.filter(ans => ans.dqaQuestions?.group === "DV").forEach(ans => {
                const indicator = ans.dqaQuestions?.question?.split(':')[0]
                if (!groupedDV[indicator]) groupedDV[indicator] = []
                let found = groupedDV[indicator].find(
                    row => row.dateRange?.month === ans.dateRange?.month && row.dateRange?.year === ans.dateRange?.year
                )
                if (!found) {
                    found = {
                        dateRange: ans.dateRange,
                        register: null,
                        dhis: null,
                        nmrs: null,
                        ndr: null
                    }
                    groupedDV[indicator].push(found)
                }
                if (ans.answerType === "register") found.register = ans.answer
                if (ans.answerType === "dhis") found.dhis = ans.answer
                if (ans.answerType === "nmrs") found.nmrs = ans.answer
                if (ans.answerType === "ndr") found.ndr = ans.answer
            })
            setDataValidationsRows(groupedDV)
        }

        // Variable Assessment
        const va = dqaData?.variableAssessment
        if (Array.isArray(va)) {
            setVariableAssessmentRows(va)
        } else if (va && typeof va === "object") {
            setVariableAssessmentRows(Object.values(va))
        }

        // If nothing in localStorage, fetch from API
        if ((!preloadedDV || preloadedDV.length === 0) && (!va || (Array.isArray(va) && va.length === 0))) {
            const fetchFromDb = async () => {
                setLoading(true)
                try {
                    const token = localStorage.getItem(jwtConfig.storageTokenKeyName)
                    const response = await fetch(`${jwtConfig.dqaUrl}/dqa-details/${dqaId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    })
                    if (!response.ok) throw new Error("Failed to fetch DQA details")
                    const result = await response.json()
                    // Data Validations
                    const dvAnswers = (result.facility.questionsAnswers || []).filter(
                        qa => qa.dqaQuestions?.group === "DV"
                    )
                    const groupedDV = {}
                    dvAnswers.forEach(ans => {
                        const indicator = ans.dqaQuestions?.question?.split(':')[0]
                        if (!groupedDV[indicator]) groupedDV[indicator] = []
                        let found = groupedDV[indicator].find(
                            row => row.dateRange?.month === ans.dateRange?.month && row.dateRange?.year === ans.dateRange?.year
                        )
                        if (!found) {
                            found = {
                                dateRange: ans.dateRange,
                                register: null,
                                dhis: null,
                                nmrs: null,
                                ndr: null
                            }
                            groupedDV[indicator].push(found)
                        }
                        if (ans.answerType === "register") found.register = ans.answer
                        if (ans.answerType === "dhis") found.dhis = ans.answer
                        if (ans.answerType === "nmrs") found.nmrs = ans.answer
                        if (ans.answerType === "ndr") found.ndr = ans.answer
                    })
                    setDataValidationsRows(groupedDV)
                    // Variable Assessment
                    const vaApi = result.facility.variableAssessment
                    if (Array.isArray(vaApi)) {
                        setVariableAssessmentRows(vaApi)
                    } else if (vaApi && typeof vaApi === "object") {
                        setVariableAssessmentRows(Object.values(vaApi))
                    }
                } catch (error) {
                    console.error("Error fetching DQA details:", error)
                    toast.error("Failed to load DQA details from server.")
                } finally {
                    setLoading(false)
                }
            }
            fetchFromDb()
        } else {
            setLoading(false)
        }
    }, [dqaId])
    // Fetch questions for Data Validations
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`${jwtConfig.dqaUrl}/questions-group/DV`, {
                    headers: { 'Content-Type': 'application/json' }
                })
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
                const questionData = await response.json()
                setQuestions(questionData)
            } catch (error) {
                console.error('Error fetching questions:', error)
            }
        }
        fetchQuestions()
    }, [])

    // Tab navigation
    const toggleTab = (tab) => {
        if (activeTab !== tab) setActiveTab(tab)
    }
    const handlePrevious = () => setActiveTab((parseInt(activeTab) - 1).toString())
    const handleNext = () => setActiveTab((parseInt(activeTab) + 1).toString())

    // Render month input rows for Data Validations
    const renderMonthInputs = (values, indicator) => {
        return values.map((entry, index) => {
            const { dateRange, register, dhis, nmrs, ndr } = entry
            const month = dateRange ? `${dateRange.month}/${dateRange.year}` : "Last Month"
            return (
                <Row key={index} className="mb-3">
                    <Col md={2}><Label>{month}</Label></Col>
                    <Col md={2}>
                        <Input
                            type="number"
                            value={register !== null ? register : ""}
                            onChange={e => {
                                const updated = { ...dataValidationsRows }
                                if (!updated[indicator]) updated[indicator] = [...values]
                                updated[indicator][index] = { ...updated[indicator][index], register: e.target.value }
                                setDataValidationsRows(updated)
                            }}
                        />
                    </Col>
                    <Col md={2}>
                        <Input
                            type="number"
                            value={dhis !== null ? dhis : ""}
                            onChange={e => {
                                const updated = { ...dataValidationsRows }
                                if (!updated[indicator]) updated[indicator] = [...values]
                                updated[indicator][index] = { ...updated[indicator][index], dhis: e.target.value }
                                setDataValidationsRows(updated)
                            }}
                        />
                    </Col>
                    <Col md={2}>
                        <Input
                            type="number"
                            value={nmrs !== null ? nmrs : ""}
                            onChange={e => {
                                const updated = { ...dataValidationsRows }
                                if (!updated[indicator]) updated[indicator] = [...values]
                                updated[indicator][index] = { ...updated[indicator][index], nmrs: e.target.value }
                                setDataValidationsRows(updated)
                            }}
                        />
                    </Col>
                    <Col md={2}>
                        <Input
                            type="number"
                            value={ndr !== null ? ndr : ""}
                            onChange={e => {
                                const updated = { ...dataValidationsRows }
                                if (!updated[indicator]) updated[indicator] = [...values]
                                updated[indicator][index] = { ...updated[indicator][index], ndr: e.target.value }
                                setDataValidationsRows(updated)
                            }}
                        />
                    </Col>
                </Row>
            )
        })
    }

    // Pagination for Variable Assessment
    const indexOfLastRow = currentPage * rowsPerPage
    const indexOfFirstRow = indexOfLastRow - rowsPerPage
    const currentRows = variableAssessmentRows.slice(indexOfFirstRow, indexOfLastRow)

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        // Data Validations payload
        const payload = []
        questions.forEach(question => {
            const indicator = question.question.split(':')[0]
            const values = dataValidationsRows[indicator] || []
            values.forEach(entry => {
                const { dateRange, register, dhis, nmrs, ndr } = entry
                const month = dateRange ? `${dateRange.month}/${dateRange.year}` : "Last Month"
                if (register !== null && register !== "") {
                    payload.push({
                        id: question.id,
                        dqaId,
                        questionId: question.id,
                        answer: register,
                        period: month,
                        answerType: 'register'
                    })
                }
                if (dhis !== null && dhis !== "") {
                    payload.push({
                        id: question.id,
                        dqaId,
                        questionId: question.id,
                        answer: dhis,
                        period: month,
                        answerType: 'dhis'
                    })
                }
                if (nmrs !== null && nmrs !== "") {
                    payload.push({
                        id: question.id,
                        dqaId,
                        questionId: question.id,
                        answer: nmrs,
                        period: month,
                        answerType: 'nmrs'
                    })
                }
                if (ndr !== null && ndr !== "") {
                    payload.push({
                        id: question.id,
                        dqaId,
                        questionId: question.id,
                        answer: ndr,
                        period: month,
                        answerType: 'ndr'
                    })
                }
            })
        })

        // Variable Assessment payload
        const payloadVA = variableAssessmentRows.map(patient => ({
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
            comments: patient.comments || ""
        }))

        try {
            const token = localStorage.getItem(jwtConfig.storageTokenKeyName)
            // Update Data Validations
            const response = await fetch(`${jwtConfig.dqaUrl}/update-questions-answers/${dqaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })
            if (!response.ok) throw new Error('Failed to update Data Validations')

            // Update Variable Assessment
            const responseVA = await fetch(`${jwtConfig.dqaUrl}/update-variable-assessment/${dqaId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payloadVA)
            })
            if (!responseVA.ok) throw new Error('Failed to update Variable Assessment')

            toast.success("Form updated successfully!")
            history.push(`/dqa-details/${dqaId}`)
        } catch (error) {
            console.error("Network error:", error)
            toast.error("A network error occurred. Please check your connection and try again.")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="loading-overlay">
                <Spinner color="primary" />
                <p>Loading page contents, please wait...</p>
            </div>
        )
    }

    if (!variableAssessmentRows.length && !Object.keys(dataValidationsRows).length) {
        return (
            <div>
                <h2>No data found. Please check your localStorage or data source.</h2>
            </div>
        )
    }

    return (
        <div>
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
                            onClick={() => toggleTab("2")}
                        >
                            Variable Assessment
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={activeTab} className="mt-3">
                    <TabPane tabId="1">
                        {questions.map((question, index) => {
                            const indicator = question.question.split(':')[0]
                            const values = dataValidationsRows[indicator] || []
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
                                        {renderMonthInputs(values, indicator)}
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
                                </thead>

                                <tbody>
                                    {currentRows.map((patient, index) => (
                                        <tr key={patient.patientUniqueId || index}>
                                            <td>{index + 1 + indexOfFirstRow}</td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.patientUniqueId || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        updated[indexOfFirstRow + index].patientUniqueId = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="date"
                                                    value={patient.dob || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        updated[indexOfFirstRow + index].dob = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="select"
                                                    value={patient.sex || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        updated[indexOfFirstRow + index].sex = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="M">Male</option>
                                                    <option value="F">Female</option>
                                                </Input>
                                            </td>
                                            <td>
                                                <Input type="date" value={patient.folderArtStartDate || ""} onChange={e => {
                                                    const updated = [...variableAssessmentRows]
                                                    updated[indexOfFirstRow + index].folderArtStartDate = e.target.value
                                                    setVariableAssessmentRows(updated)
                                                }} />
                                            </td>
                                            <td>
                                                <Input
                                                    type="date"
                                                    value={patient.radetVariableAssessment?.artStartDate || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].radetVariableAssessment) updated[indexOfFirstRow + index].radetVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].radetVariableAssessment.artStartDate = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="date"
                                                    value={patient.xmlVariableAssessment?.artStartDate || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].xmlVariableAssessment) updated[indexOfFirstRow + index].xmlVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].xmlVariableAssessment.artStartDate = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="date"
                                                    value={patient.ndrVariableAssessment?.artStartDate || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].ndrVariableAssessment) updated[indexOfFirstRow + index].ndrVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].ndrVariableAssessment.artStartDate = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input type="date" value={patient.folderLastDrugPickupDate || ""} onChange={e => {
                                                    const updated = [...variableAssessmentRows]
                                                    updated[indexOfFirstRow + index].folderLastDrugPickupDate = e.target.value
                                                    setVariableAssessmentRows(updated)
                                                }} />
                                            </td>
                                            <td>
                                                <Input
                                                    type="date"
                                                    value={patient.radetVariableAssessment?.lastPickupDate || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].radetVariableAssessment) updated[indexOfFirstRow + index].radetVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].radetVariableAssessment.lastPickupDate = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="date"
                                                    value={patient.xmlVariableAssessment?.lastPickupDate || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].xmlVariableAssessment) updated[indexOfFirstRow + index].xmlVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].xmlVariableAssessment.lastPickupDate = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="date"
                                                    value={patient.ndrVariableAssessment?.lastPickupDate || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].ndrVariableAssessment) updated[indexOfFirstRow + index].ndrVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].ndrVariableAssessment.lastPickupDate = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="number"
                                                    value={patient.folderDaysOfArvRefill || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        updated[indexOfFirstRow + index].folderDaysOfArvRefill = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="number"
                                                    value={patient.radetVariableAssessment?.daysArvRefill || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].radetVariableAssessment) updated[indexOfFirstRow + index].radetVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].radetVariableAssessment.daysArvRefill = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="number"
                                                    value={patient.xmlVariableAssessment?.daysArvRefill || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].xmlVariableAssessment) updated[indexOfFirstRow + index].xmlVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].xmlVariableAssessment.daysArvRefill = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="number"
                                                    value={patient.ndrVariableAssessment?.daysArvRefill || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].ndrVariableAssessment) updated[indexOfFirstRow + index].ndrVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].ndrVariableAssessment.daysArvRefill = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.folderCurrentRegimen || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        updated[indexOfFirstRow + index].folderCurrentRegimen = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.radetVariableAssessment?.currentRegimen || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].radetVariableAssessment) updated[indexOfFirstRow + index].radetVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].radetVariableAssessment.currentRegimen = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.xmlVariableAssessment?.currentRegimen || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].xmlVariableAssessment) updated[indexOfFirstRow + index].xmlVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].xmlVariableAssessment.currentRegimen = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.ndrVariableAssessment?.currentRegimen || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].ndrVariableAssessment) updated[indexOfFirstRow + index].ndrVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].ndrVariableAssessment.currentRegimen = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.folderCurrentViralLoad || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        updated[indexOfFirstRow + index].folderCurrentViralLoad = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.radetVariableAssessment?.currentViralLoad || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].radetVariableAssessment) updated[indexOfFirstRow + index].radetVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].radetVariableAssessment.currentViralLoad = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.xmlVariableAssessment?.currentViralLoad || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].xmlVariableAssessment) updated[indexOfFirstRow + index].xmlVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].xmlVariableAssessment.currentViralLoad = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.ndrVariableAssessment?.currentViralLoad || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].ndrVariableAssessment) updated[indexOfFirstRow + index].ndrVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].ndrVariableAssessment.currentViralLoad = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="date"
                                                    value={patient.folderViralLoadSampleCollectionDate || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        updated[indexOfFirstRow + index].folderViralLoadSampleCollectionDate = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="date"
                                                    value={patient.radetVariableAssessment?.sampleCollectionDate || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].radetVariableAssessment) updated[indexOfFirstRow + index].radetVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].radetVariableAssessment.sampleCollectionDate = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="date"
                                                    value={patient.xmlVariableAssessment?.sampleCollectionDate || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].xmlVariableAssessment) updated[indexOfFirstRow + index].xmlVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].xmlVariableAssessment.sampleCollectionDate = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="date"
                                                    value={patient.ndrVariableAssessment?.sampleCollectionDate || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].ndrVariableAssessment) updated[indexOfFirstRow + index].ndrVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].ndrVariableAssessment.sampleCollectionDate = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.folderCurrentArtStatus || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        updated[indexOfFirstRow + index].folderCurrentArtStatus = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.radetVariableAssessment?.currentArtStatus || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].radetVariableAssessment) updated[indexOfFirstRow + index].radetVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].radetVariableAssessment.currentArtStatus = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.xmlVariableAssessment?.currentArtStatus || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].xmlVariableAssessment) updated[indexOfFirstRow + index].xmlVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].xmlVariableAssessment.currentArtStatus = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.ndrVariableAssessment?.currentArtStatus || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].ndrVariableAssessment) updated[indexOfFirstRow + index].ndrVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].ndrVariableAssessment.currentArtStatus = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.folderPregnancyStatus || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        updated[indexOfFirstRow + index].folderPregnancyStatus = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.radetVariableAssessment?.pregnacyStatus || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].radetVariableAssessment) updated[indexOfFirstRow + index].radetVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].radetVariableAssessment.pregnacyStatus = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.xmlVariableAssessment?.pregnacyStatus || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].xmlVariableAssessment) updated[indexOfFirstRow + index].xmlVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].xmlVariableAssessment.pregnacyStatus = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.ndrVariableAssessment?.pregnacyStatus || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].ndrVariableAssessment) updated[indexOfFirstRow + index].ndrVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].ndrVariableAssessment.pregnacyStatus = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="date"
                                                    value={patient.folderPregnancyStatusDate || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        updated[indexOfFirstRow + index].folderPregnancyStatusDate = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="date"
                                                    value={patient.radetVariableAssessment?.pregnacyStatusDate || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].radetVariableAssessment) updated[indexOfFirstRow + index].radetVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].radetVariableAssessment.pregnacyStatusDate = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="date"
                                                    value={patient.xmlVariableAssessment?.pregnacyStatusDate || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].xmlVariableAssessment) updated[indexOfFirstRow + index].xmlVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].xmlVariableAssessment.pregnacyStatusDate = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="date"
                                                    value={patient.ndrVariableAssessment?.pregnacyStatusDate || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].ndrVariableAssessment) updated[indexOfFirstRow + index].ndrVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].ndrVariableAssessment.pregnacyStatusDate = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.folderTbScreen || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        updated[indexOfFirstRow + index].folderTbScreen = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.radetVariableAssessment?.tbScreen || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].radetVariableAssessment) updated[indexOfFirstRow + index].radetVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].radetVariableAssessment.tbScreen = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.xmlVariableAssessment?.tbScreen || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].xmlVariableAssessment) updated[indexOfFirstRow + index].xmlVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].xmlVariableAssessment.tbScreen = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.ndrVariableAssessment?.tbScreen || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].ndrVariableAssessment) updated[indexOfFirstRow + index].ndrVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].ndrVariableAssessment.tbScreen = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="date"
                                                    value={patient.folderTbScreenDate || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        updated[indexOfFirstRow + index].folderTbScreenDate = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="date"
                                                    value={patient.radetVariableAssessment?.tbScreenDate || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].radetVariableAssessment) updated[indexOfFirstRow + index].radetVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].radetVariableAssessment.tbScreenDate = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="date"
                                                    value={patient.xmlVariableAssessment?.tbScreenDate || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].xmlVariableAssessment) updated[indexOfFirstRow + index].xmlVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].xmlVariableAssessment.tbScreenDate = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="date"
                                                    value={patient.ndrVariableAssessment?.tbScreenDate || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        if (!updated[indexOfFirstRow + index].ndrVariableAssessment) updated[indexOfFirstRow + index].ndrVariableAssessment = {}
                                                        updated[indexOfFirstRow + index].ndrVariableAssessment.tbScreenDate = e.target.value
                                                        setVariableAssessmentRows(updated)
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.comments || ""}
                                                    onChange={e => {
                                                        const updated = [...variableAssessmentRows]
                                                        updated[indexOfFirstRow + index].comments = e.target.value
                                                        setVariableAssessmentRows(updated)
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
                                disabled={indexOfLastRow >= variableAssessmentRows.length}
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

export default editDQADVQuestions