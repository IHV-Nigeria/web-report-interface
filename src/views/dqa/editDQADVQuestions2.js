import React, { useState, useEffect } from 'react'
import { Table, Form, Input, Button, Card, CardBody, CardTitle, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane, Spinner, Label } from 'reactstrap'
import classnames from 'classnames'
import jwtConfig from "../../api/jwtConfig"
import { useHistory, useParams } from "react-router-dom"
import { toast } from 'react-toastify'
import './systemsProcesses.css'

const EditDQADVQuestions2 = () => {
    const { dqaId } = useParams()
    const history = useHistory()

    const [facility, setFacility] = useState(null)
    const [questions, setQuestions] = useState([])
    const [activeTab, setActiveTab] = useState('1')
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage] = useState(100)
    const [filters, setFilters] = useState({})

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }))
    }

    // Fetch data and questions on mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${jwtConfig.dqaUrl}/dqa-details/${dqaId}`)
                if (!response.ok) throw new Error("Failed to fetch DQA details")
                const result = await response.json()
                setFacility(result.facility)
            } catch (error) {
                toast.error("Failed to load DQA details.")
            } finally {
                setLoading(false)
            }
        }
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`${jwtConfig.dqaUrl}/questions-group/DV`)
                if (!response.ok) throw new Error("Failed to fetch questions")
                const questionData = await response.json()
                setQuestions(questionData)
            } catch (error) {
                toast.error("Failed to load questions.")
            }
        }
        fetchData()
        fetchQuestions()
    }, [dqaId])
    console.log("Facility:", facility)
    const handleNext = () => setActiveTab((parseInt(activeTab) + 1).toString())

    // Group questionsAnswers by indicator and month
    // ...existing code...
    const getIndicatorValues = (indicator) => {
        if (!facility?.questionsAnswers) return []
        // Only use DV group and this indicator
        const filtered = facility.questionsAnswers.filter(
            ans => ans.dqaQuestions?.group === "DV" && ans.dqaQuestions?.question?.split(':')[0] === indicator
        )
        // Group by month string (e.g. "10/2024")
        const grouped = {}
        filtered.forEach(ans => {
            // Only group if ans.month is defined and not empty
            if (ans.month && ans.month.trim() !== "") {
                const monthKey = ans.month
                if (!grouped[monthKey]) {
                    grouped[monthKey] = {
                        monthKey,
                        month: monthKey,
                        register: null,
                        dhis: null,
                        nmrs: null,
                        ndr: null
                    }
                }
                if (ans.answerType === "register") grouped[monthKey].register = ans.answer
                if (ans.answerType === "dhis") grouped[monthKey].dhis = ans.answer
                if (ans.answerType === "nmrs") grouped[monthKey].nmrs = ans.answer
                if (ans.answerType === "ndr") grouped[monthKey].ndr = ans.answer
            }
        })
        return Object.values(grouped)
    }
    // ...existing code...

    // Data Validations: handle input change
    const handleDVChange = (indicator, monthKey, field, value) => {
        const updatedFacility = { ...facility }
        updatedFacility.questionsAnswers = updatedFacility.questionsAnswers.map(ans => {
            const ansIndicator = ans.dqaQuestions?.question?.split(':')[0]
            const ansMonthKey = ans.month || "Last Month"
            if (
                ans.dqaQuestions?.group === "DV" &&
                ansIndicator === indicator &&
                ansMonthKey === monthKey &&
                ans.answerType === field
            ) {
                return { ...ans, answer: value }
            }
            return ans
        })
        setFacility(updatedFacility)
    }

    // Variable Assessment: handle input change
    const handleVAChange = (index, field, value) => {
        const updatedFacility = { ...facility }
        const vaArr = Array.isArray(updatedFacility.variableAssessment) ? [...updatedFacility.variableAssessment] : Object.values(updatedFacility.variableAssessment || {})
        vaArr[index][field] = value
        updatedFacility.variableAssessment = vaArr
        setFacility(updatedFacility)
    }

    console.log("Facility after changes:", facility)

    // Pagination for Variable Assessment
    // const vaArr = Array.isArray(facility?.variableAssessment) ? facility.variableAssessment : Object.values(facility?.variableAssessment || {})
    // const indexOfLastRow = currentPage * rowsPerPage
    // const indexOfFirstRow = indexOfLastRow - rowsPerPage
    // const currentRows = vaArr.slice(indexOfFirstRow, indexOfLastRow)

    const vaArr = Array.isArray(facility?.variableAssessment) ? facility.variableAssessment : Object.values(facility?.variableAssessment || {})

    // Filter rows based on filters
    const filteredRows = vaArr.filter(patient => Object.entries(filters).every(([field, filterValue]) => {
        if (!filterValue) return true
        const val = patient[field] ? String(patient[field]).toLowerCase() : ""
        return val.includes(filterValue.toLowerCase())
    })
    )

    const indexOfLastRow = currentPage * rowsPerPage
    const indexOfFirstRow = indexOfLastRow - rowsPerPage
    const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow)
    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            // Prepare Data Validations payload
            const dvPayload = []
            // ...inside handleSubmit, where you build dvPayload...
            questions.forEach(question => {
                const indicator = question.question.split(':')[0]
                const values = getIndicatorValues(indicator)
                values.forEach(entry => {
                    const { month, register, dhis, nmrs, ndr } = entry

                    // Helper to find the id for each answer type
                    const findId = (type) => {
                        const ans = facility.questionsAnswers.find(
                            a => a.dqaQuestions?.group === "DV" &&
                                a.dqaQuestions?.question?.split(':')[0] === indicator &&
                                a.month === month &&
                                a.answerType === type
                        )
                        return ans?.id || null
                    }

                    if (register !== null && register !== undefined) {
                        dvPayload.push({
                            id: findId('register'),
                            dqaId,
                            questionId: question.id,
                            answer: register,
                            month,
                            answerType: 'register'
                        })
                    }
                    if (dhis !== null && dhis !== undefined) {
                        dvPayload.push({
                            id: findId('dhis'),
                            dqaId,
                            questionId: question.id,
                            answer: dhis,
                            month,
                            answerType: 'dhis'
                        })
                    }
                    if (nmrs !== null && nmrs !== undefined) {
                        dvPayload.push({
                            id: findId('nmrs'),
                            dqaId,
                            questionId: question.id,
                            answer: nmrs,
                            month,
                            answerType: 'nmrs'
                        })
                    }
                    if (ndr !== null && ndr !== undefined) {
                        dvPayload.push({
                            id: findId('ndr'),
                            dqaId,
                            questionId: question.id,
                            answer: ndr,
                            month,
                            answerType: 'ndr'
                        })
                    }
                })
            })

            // Prepare Variable Assessment payload
            const vaPayload = vaArr.map(patient => ({
                id: patient.id || null, // Use existing id if available
                dqaId,
                patientId: patient.patientId,
                dateOfBirth: patient.dateOfBirth,
                sex: patient.sex,
                folderArtStartDate: patient.folderArtStartDate || "",
                radetArtStartDate: patient.radetArtStartDate || "",
                xmlArtStartDate: patient.xmlArtStartDate || "",
                ndrArtStartDate: patient.ndrArtStartDate || "",
                folderLastDrugPickupDate: patient.folderLastDrugPickupDate || "",
                radetLastDrugPickupDate: patient.radetLastDrugPickupDate || "",
                xmlLastDrugPickupDate: patient.xmlLastDrugPickupDate || "",
                ndrLastDrugPickupDate: patient.ndrLastDrugPickupDate || "",
                folderDaysOfArvRefill: patient.folderDaysOfArvRefill || null,
                radetDaysOfArvRefill: patient.radetDaysOfArvRefill || null,
                xmlDaysOfArvRefill: patient.xmlDaysOfArvRefill || null,
                ndrDaysOfArvRefill: patient.ndrDaysOfArvRefill || null,
                folderCurrentRegimen: patient.folderCurrentRegimen || "",
                radetCurrentRegimen: patient.radetCurrentRegimen || "",
                xmlCurrentRegimen: patient.xmlCurrentRegimen || "",
                ndrCurrentRegimen: patient.ndrCurrentRegimen || "",
                radetCurrentViralLoad: patient.radetCurrentViralLoad || null,
                xmlCurrentViralLoad: patient.xmlCurrentViralLoad || null,
                ndrCurrentViralLoad: patient.ndrCurrentViralLoad || null,
                folderViralLoadSampleCollectionDate: patient.folderViralLoadSampleCollectionDate || "",
                radetViralLoadSampleCollectionDate: patient.radetViralLoadSampleCollectionDate || "",
                xmlViralLoadSampleCollectionDate: patient.xmlViralLoadSampleCollectionDate || "",
                ndrViralLoadSampleCollectionDate: patient.ndrViralLoadSampleCollectionDate || "",
                folderCurrentArtStatus: patient.folderCurrentArtStatus || "",
                radetCurrentArtStatus: patient.radetCurrentArtStatus || "",
                xmlCurrentArtStatus: patient.xmlCurrentArtStatus || "",
                ndrCurrentArtStatus: patient.ndrCurrentArtStatus || "",
                folderPregnancyStatus: patient.folderPregnancyStatus || "",
                radetPregnancyStatus: patient.radetPregnancyStatus || "",
                xmlPregnancyStatus: patient.xmlPregnancyStatus || "",
                ndrPregnancyStatus: patient.ndrPregnancyStatus || "",
                folderPregnancyStatusDate: patient.folderPregnancyStatusDate || "",
                radetPregnancyStatusDate: patient.radetPregnancyStatusDate || "",
                xmlPregnancyStatusDate: patient.xmlPregnancyStatusDate || "",
                ndrPregnancyStatusDate: patient.ndrPregnancyStatusDate || "",
                folderTbScreen: patient.folderTbScreen || "",
                radetTbScreen: patient.radetTbScreen || "",
                xmlTbScreen: patient.xmlTbScreen || "",
                ndrTbScreen: patient.ndrTbScreen || "",
                folderTbScreenDate: patient.folderTbScreenDate || "",
                radetTbScreenDate: patient.radetTbScreenDate || "",
                xmlTbScreenDate: patient.xmlTbScreenDate || "",
                ndrTbScreenDate: patient.ndrTbScreenDate || "",
                comments: patient.comments || ""
            }))

            console.log("DV Payload:", JSON.stringify(dvPayload, null, 2))
            console.log("VA Payload:", JSON.stringify(vaPayload, null, 2))

            // Save Data Validations
            await fetch(`${jwtConfig.dqaUrl}/update-questions-answers/${dqaId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dvPayload)
            })

            // Save Variable Assessment
            await fetch(`${jwtConfig.dqaUrl}/update-variable-assessments/${dqaId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vaPayload)
            })

            toast.success("Form updated successfully!")
            history.push(`/save-dqa-comments/${dqaId}`)
            // history.push(`/dqa-details/${dqaId?}`)
        } catch (error) {
            toast.error("Failed to update the form. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (loading || !facility) {
        return (
            <div className="loading-overlay">
                <Spinner color="primary" />
                <p>Loading page contents, please wait...</p>
            </div>
        )
    }

    return (
        <div>
            <h1>Edit DQA Data Validation & Variable Assessment</h1>
            <Form onSubmit={handleSubmit}>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === "1" })}
                            onClick={() => setActiveTab("1")}
                        >
                            Data Validations
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === "2" })}
                            onClick={() => setActiveTab("2")}
                        >
                            Variable Assessment
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={activeTab} className="mt-3">
                    <TabPane tabId="1">
                        {questions.map((question, qIdx) => {
                            const indicator = question.question.split(':')[0]
                            const values = getIndicatorValues(indicator)
                            return (
                                <Card key={qIdx} className="mb-4">
                                    <CardBody>
                                        <CardTitle tag="h5">{question.question}</CardTitle>
                                        <Row className="mb-3">
                                            <Col md={2}><strong>Month</strong></Col>
                                            <Col md={2}><strong>Register</strong></Col>
                                            <Col md={2}><strong>DHIS</strong></Col>
                                            <Col md={2}><strong>NMRS</strong></Col>
                                            <Col md={2}><strong>NDR</strong></Col>
                                        </Row>
                                        {values.map((entry, idx) => {
                                            const { monthKey, register, dhis, nmrs, ndr } = entry
                                            return (
                                                <Row key={idx} className="mb-3">
                                                    <Col md={2}><Label>{monthKey}</Label></Col>
                                                    <Col md={2}>
                                                        <Input
                                                            type="number"
                                                            value={register || ""}
                                                            onChange={e => handleDVChange(indicator, monthKey, "register", e.target.value)}
                                                        />
                                                    </Col>
                                                    <Col md={2}>
                                                        <Input
                                                            type="number"
                                                            value={dhis || ""}
                                                            onChange={e => handleDVChange(indicator, monthKey, "dhis", e.target.value)}
                                                        />
                                                    </Col>
                                                    <Col md={2}>
                                                        <Input
                                                            type="number"
                                                            value={nmrs || ""}
                                                            onChange={e => handleDVChange(indicator, monthKey, "nmrs", e.target.value)}
                                                        />
                                                    </Col>
                                                    <Col md={2}>
                                                        <Input
                                                            type="number"
                                                            value={ndr || ""}
                                                            onChange={e => handleDVChange(indicator, monthKey, "ndr", e.target.value)}
                                                        />
                                                    </Col>
                                                </Row>
                                            )
                                        })}
                                    </CardBody>
                                </Card>
                            )
                        })}
                        <Button color="primary" onClick={handleNext} style={{ float: 'right' }}>Next</Button>
                    </TabPane>
                    <TabPane tabId="2">
                        <div className="table-responsive" style={{ overflowX: 'auto' }}>
                            <Table bordered style={{ tableLayout: 'auto', width: '100%' }}>
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
                                                value={filters.patientId || ""}
                                                onChange={e => handleFilterChange("patientId", e.target.value)}
                                            />
                                        </th>

                                        <th colSpan="47">
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentRows.map((patient, idx) => (
                                        <tr key={patient.patientId || idx}>
                                            <td>{indexOfFirstRow + idx + 1}</td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.patientId || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "patientId", e.target.value)}
                                                    style={{ minWidth: 130, width: "100%" }}
                                                    readOnly
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.dateOfBirth || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "dateOfBirth", e.target.value)}
                                                    style={{ minWidth: 100, width: "100%" }}
                                                    readOnly
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.sex || ""} onChange={e => handleVAChange(indexOfFirstRow + idx, "sex", e.target.value)}
                                                    readOnly
                                                    style={{ minWidth: 40, width: "50%" }}
                                                />
                                            </td>
                                            <td style={{ backgroundColor: "#d4edda" }}>
                                                <Input
                                                    type="date"
                                                    value={patient.folderArtStartDate || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "folderArtStartDate", e.target.value)}
                                                    style={{ minWidth: 110, width: "100%" }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.radetArtStartDate || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "radetArtStartDate", e.target.value)}
                                                    readOnly
                                                    style={{ minWidth: 110, width: "100%" }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.xmlArtStartDate || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "xmlArtStartDate", e.target.value)}
                                                    readOnly
                                                    style={{ minWidth: 110, width: "100%" }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.ndrArtStartDate || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "ndrArtStartDate", e.target.value)}
                                                    readOnly
                                                    style={{ minWidth: 110, width: "100%" }}
                                                />
                                            </td>
                                            <td style={{ backgroundColor: "#d4edda" }}>
                                                <Input
                                                    type="date"
                                                    value={patient.folderLastDrugPickupDate || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "folderLastDrugPickupDate", e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.radetLastDrugPickupDate || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "radetLastDrugPickupDate", e.target.value)}
                                                    readOnly
                                                    style={{ minWidth: 110, width: "100%" }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.xmlLastDrugPickupDate || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "xmlLastDrugPickupDate", e.target.value)}
                                                    readOnly
                                                    style={{ minWidth: 110, width: "100%" }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.ndrLastDrugPickupDate || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "ndrLastDrugPickupDate", e.target.value)}
                                                    readOnly
                                                    style={{ minWidth: 110, width: "100%" }}
                                                />
                                            </td>
                                            <td style={{ backgroundColor: "#d4edda" }}>
                                                <Input
                                                    type="number"
                                                    value={patient.folderDaysOfArvRefill || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "folderDaysOfArvRefill", e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="number"
                                                    value={patient.radetDaysOfArvRefill || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "radetDaysOfArvRefill", e.target.value)}
                                                    readOnly
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="number"
                                                    value={patient.xmlDaysOfArvRefill || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "xmlDaysOfArvRefill", e.target.value)}
                                                    readOnly
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="number"
                                                    value={patient.ndrDaysOfArvRefill || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "ndrDaysOfArvRefill", e.target.value)}
                                                    readOnly
                                                />
                                            </td>
                                            <td style={{ backgroundColor: "#d4edda" }}>
                                                <Input
                                                    type="text"
                                                    value={patient.folderCurrentRegimen || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "folderCurrentRegimen", e.target.value)}
                                                    style={{ minWidth: 160, width: "100%" }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.radetCurrentRegimen || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "radetCurrentRegimen", e.target.value)}
                                                    readOnly
                                                    style={{ minWidth: 160, width: "100%" }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.xmlCurrentRegimen || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "xmlCurrentRegimen", e.target.value)}
                                                    readOnly
                                                    style={{ minWidth: 160, width: "100%" }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.ndrCurrentRegimen || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "ndrCurrentRegimen", e.target.value)}
                                                    readOnly
                                                    style={{ minWidth: 160, width: "100%" }}
                                                />
                                            </td>
                                            <td style={{ backgroundColor: "#d4edda" }}>
                                                <Input
                                                    type="text"
                                                    value={patient.folderCurrentViralLoad || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "folderCurrentViralLoad", e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.radetCurrentViralLoad || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "radetCurrentViralLoad", e.target.value)}
                                                    readOnly
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.xmlCurrentViralLoad || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "xmlCurrentViralLoad", e.target.value)}
                                                    readOnly
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.ndrCurrentViralLoad || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "ndrCurrentViralLoad", e.target.value)}
                                                    readOnly
                                                />
                                            </td>
                                            <td style={{ backgroundColor: "#d4edda" }}>
                                                <Input
                                                    type="date"
                                                    value={patient.folderViralLoadSampleCollectionDate || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "folderViralLoadSampleCollectionDate", e.target.value)}
                                                    style={{ minWidth: 130, width: "100%" }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.radetViralLoadSampleCollectionDate || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "radetViralLoadSampleCollectionDate", e.target.value)}
                                                    readOnly
                                                    style={{ minWidth: 130, width: "100%" }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.xmlViralLoadSampleCollectionDate || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "xmlViralLoadSampleCollectionDate", e.target.value)}
                                                    readOnly
                                                    style={{ minWidth: 130, width: "100%" }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.ndrViralLoadSampleCollectionDate || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "ndrViralLoadSampleCollectionDate", e.target.value)}
                                                    readOnly
                                                    style={{ minWidth: 130, width: "100%" }}
                                                />
                                            </td>
                                            <td style={{ backgroundColor: "#d4edda" }}>
                                                <Input
                                                    type="text"
                                                    value={patient.folderCurrentArtStatus || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "folderCurrentArtStatus", e.target.value)}
                                                    style={{ minWidth: 60, width: "100%" }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.radetCurrentArtStatus || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "radetCurrentArtStatus", e.target.value)}
                                                    readOnly
                                                    style={{ minWidth: 60, width: "100%" }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.xmlCurrentArtStatus || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "xmlCurrentArtStatus", e.target.value)}
                                                    readOnly
                                                    style={{ minWidth: 60, width: "100%" }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.ndrCurrentArtStatus || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "ndrCurrentArtStatus", e.target.value)}
                                                    readOnly
                                                    style={{ minWidth: 60, width: "100%" }}
                                                />
                                            </td>
                                            <td style={{ backgroundColor: "#d4edda" }}>
                                                <Input
                                                    type="text"
                                                    value={patient.folderPregnancyStatus || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "folderPregnancyStatus", e.target.value)}
                                                    style={{ minWidth: 130, width: "100%" }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.radetPregnancyStatus || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "radetPregnancyStatus", e.target.value)}
                                                    readOnly
                                                    style={{ minWidth: 130, width: "100%" }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.xmlPregnancyStatus || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "xmlPregnancyStatus", e.target.value)}
                                                    readOnly
                                                    style={{ minWidth: 130, width: "100%" }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.ndrPregnancyStatus || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "ndrPregnancyStatus", e.target.value)}
                                                    readOnly
                                                    style={{ minWidth: 130, width: "100%" }}
                                                />
                                            </td>
                                            <td style={{ backgroundColor: "#d4edda" }}>
                                                <Input
                                                    type="date"
                                                    value={patient.folderPregnancyStatusDate || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "folderPregnancyStatusDate", e.target.value)}
                                                    style={{ minWidth: 130, width: "100%" }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.radetPregnancyStatusDate || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "radetPregnancyStatusDate", e.target.value)}
                                                    readOnly
                                                    style={{ minWidth: 130, width: "100%" }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.xmlPregnancyStatusDate || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "xmlPregnancyStatusDate", e.target.value)}
                                                    readOnly
                                                    style={{ minWidth: 130, width: "100%" }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.ndrPregnancyStatusDate || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "ndrPregnancyStatusDate", e.target.value)}
                                                    readOnly
                                                    style={{ minWidth: 130, width: "100%" }}
                                                />
                                            </td>
                                            <td style={{ backgroundColor: "#d4edda" }}>
                                                <Input
                                                    type="text"
                                                    value={patient.folderTbScreen || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "folderTbScreen", e.target.value)}
                                                    style={{ minWidth: 130, width: "100%" }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.radetTbScreen || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "radetTbScreen", e.target.value)}
                                                    readOnly
                                                    style={{ minWidth: 130, width: "100%" }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.xmlTbScreen || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "xmlTbScreen", e.target.value)}
                                                    readOnly
                                                    style={{ minWidth: 130, width: "100%" }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.ndrTbScreen || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "ndrTbScreen", e.target.value)}
                                                    readOnly
                                                    style={{ minWidth: 130, width: "100%" }}
                                                />
                                            </td>
                                            <td style={{ backgroundColor: "#d4edda" }}>
                                                <Input
                                                    type="date"
                                                    value={patient.folderTbScreenDate || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "folderTbScreenDate", e.target.value)}
                                                    style={{ minWidth: 130, width: "100%" }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.radetTbScreenDate || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "radetTbScreenDate", e.target.value)}
                                                    readOnly
                                                    style={{ minWidth: 130, width: "100%" }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.xmlTbScreenDate || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "xmlTbScreenDate", e.target.value)}
                                                    readOnly
                                                    style={{ minWidth: 130, width: "100%" }}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    type="text"
                                                    value={patient.ndrTbScreenDate || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "ndrTbScreenDate", e.target.value)}
                                                    readOnly
                                                    style={{ minWidth: 130, width: "100%" }}
                                                />
                                            </td>
                                            <td style={{ backgroundColor: "#d4edda" }}>
                                                <Input
                                                    type="text"
                                                    value={patient.comments || ""}
                                                    onChange={e => handleVAChange(indexOfFirstRow + idx, "comments", e.target.value)}
                                                    style={{ minWidth: 200, width: "100%" }}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                        <div className="pagination-controls">
                            <Button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                            >
                                Previous
                            </Button>
                            <Button
                                disabled={indexOfLastRow >= vaArr.length}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                                style={{ marginLeft: '50px' }}
                            >
                                Next
                            </Button>
                            <Button color="info" onClick={() => setActiveTab("1")} style={{ float: 'right' }}>Go Back</Button>
                        </div>
                        <Button type="submit" color="primary" style={{ float: 'right', marginTop: '10px' }}>Submit</Button>
                    </TabPane>
                </TabContent>
            </Form>
        </div>
    )
}

export default EditDQADVQuestions2