import { useEffect, useState } from "react"
import { Form, FormGroup, Label, Input, Button, Row, Col, Card, Nav, NavItem, NavLink, TabContent, TabPane, CardTitle } from "reactstrap"
import classnames from 'classnames'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useParams, useHistory } from "react-router-dom"
import jwtConfig from "../../api/jwtConfig"
import { toast } from "react-toastify"
import './systemsProcesses.css'

const EditDQA = () => {
    const [activeTab, setActiveTab] = useState('1')
    const { dqaId } = useParams()
    const history = useHistory()
    const [formData, setFormData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [facilities, setFacilities] = useState([])

    const lgaOptions = {
        1: ["Abaji", "Bwari", "Gwagwalada", "Kuje", "Kwali", "Municipal"],
        2: ["Bakori", "Batagarawa", "Batsari", "Baure", "Bindawa", "Charanchi", "Dandume", "Danja", "Dan Musa", "Daura", "Dutsi", "Dutsin-Ma", "Faskari", "Funtua", "Ingawa", "Jibia", "Kafur", "Kaita", "Kankara", "Kankia", "Katsina", "Kurfi", "Kusada", "Mai'Adua", "Malumfashi", "Mani", "Mashi", "Matazu", "Musawa", "Rimi", "Sabuwa", "Safana", "Sandamu", "Zango"],
        3: ["Akwanga", "Awe", "Doma", "Karu", "Keana", "Keffi", "Kokona", "Lafia", "Nasarawa", "Nasarawa Egon", "Obi", "Toto", "Wamba"],
        4: ["Abua/Odual", "Ahoada East", "Ahoada West", "Akuku Toru", "Andoni", "Asari-Toru", "Bonny", "Degema", "Eleme", "Emohua", "Etche", "Gokana", "Ikwerre", "Khana", "Obio/Akpor", "Ogba/Egbema/Ndoni", "Ogu/Bolo", "Okrika", "Omuma", "Opobo/Nkoro", "Oyigbo", "Port Harcourt", "Tai"]
    }

    const months = [
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
    ]
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

    useEffect(() => {
        const fetchDQA = async () => {
            const token = localStorage.getItem(`${jwtConfig.storageTokenKeyName}`)
            const response = await fetch(`${jwtConfig.dqaUrl}/dqa-details/${dqaId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (response.ok) {
                const result = await response.json()
                setFormData(result.facility)
                // Fetch facilities for the state of the loaded DQA
                if (result.facility && result.facility.state) {
                    const facilitiesResponse = await fetch(`${jwtConfig.baseUrl}/facility/facilities/${result.facility.state}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    if (facilitiesResponse.ok) {
                        const facilitiesData = await facilitiesResponse.json()
                        setFacilities(facilitiesData)
                    }
                }
            }
            setLoading(false)
        }
        fetchDQA()
    }, [dqaId])

    const toggleTab = (tab) => {
        if (activeTab !== tab) setActiveTab(tab)
    }

    const handlePrevious = () => {
        const nextTab = (parseInt(activeTab) - 1).toString()
        setActiveTab(nextTab)
    }

    const handleNext = () => {
        const nextTab = (parseInt(activeTab) + 1).toString()
        setActiveTab(nextTab)
    }

    const handleChange = async (e) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        })

        if (name === "state") {
            if (value) {
                const token = localStorage.getItem(`${jwtConfig.storageTokenKeyName}`)
                try {
                    const response = await fetch(`${jwtConfig.baseUrl}/facility/facilities/${value}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    if (response.ok) {
                        const data = await response.json()
                        setFacilities(data)
                    } else {
                        setFacilities([])
                    }
                } catch (error) {
                    setFacilities([])
                }
            } else {
                setFacilities([])
            }
            setFormData((prev) => ({
                ...prev,
                facilityName: '',
                datimCode: ''
            }))
        }
    }

    const handleFacilityChange = (e) => {
        const selectedFacility = facilities.find(facility => facility.facilityName === e.target.value)
        setFormData({
            ...formData,
            facilityName: selectedFacility ? selectedFacility.facilityName : "",
            datimCode: selectedFacility ? selectedFacility.datimCode : ""
        })
    }

    // const handleSubmit = async (e) => {
    //     e.preventDefault()
    //     const token = localStorage.getItem(`${jwtConfig.storageTokenKeyName}`)
    //     const response = await fetch(`${jwtConfig.dqaUrl}/dqa/${dqaId}`, {
    //         method: "PUT",
    //         headers: {
    //             "Content-Type": "application/json",
    //             Authorization: `Bearer ${token}`
    //         },
    //         body: JSON.stringify(formData)
    //     })
    //     if (response.ok) {
    //         toast.success("DQA updated successfully!")
    //         history.push("/dqas")
    //     } else {
    //         toast.error("Failed to update DQA.")
    //     }
    // }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem(`${jwtConfig.storageTokenKeyName}`)
        const response = await fetch(`${jwtConfig.dqaUrl}/update-facility-dqa/${dqaId}`, {
            method: "PUT",
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        })
        if (response.ok) {
            toast.success("DQA updated successfully!")
            localStorage.setItem("dqaData", JSON.stringify(formData))
            history.push(`/edit-dqa-system-questions/${dqaId}`)

        } else if (response.status === 404) {
            toast.error("DQA not found.")
        } else {
            toast.error("Failed to update DQA.")
        }
    }

    if (loading || !formData) return <div>Loading...</div>

    return (
        <Form onSubmit={handleSubmit}>
            <Card style={{ padding: '20px' }}>
                <CardTitle tag="h3" style={{ textAlign: 'center' }}>Edit DQA Form</CardTitle>
                <Nav tabs>
                    <NavItem>
                        <NavLink className={classnames({ active: activeTab === "1" })} onClick={() => toggleTab("1")}>Facility Information</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: activeTab === "2" })} onClick={() => toggleTab("2")}>General Assessment</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: activeTab === "3" })} onClick={() => toggleTab("3")}>Structures</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: activeTab === "4" })} onClick={() => toggleTab("4")}>Documentation Review</NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={activeTab} className="mt-3">
                    {/* Tab 1: Facility Information */}
                    <TabPane tabId="1">
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="state">State</Label>
                                    <Input onChange={handleChange} type="select" id="state" name="state" value={formData.state || ""} >
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
                                    <Input
                                        type="select"
                                        id="lga"
                                        name="lga"
                                        value={formData.lga || ""}
                                        onChange={handleChange}
                                        disabled={!formData.state}
                                    >
                                        <option value="">Select LGA</option>
                                        {formData.state && lgaOptions[formData.state]?.map((lga, idx) => (
                                            <option key={idx} value={lga}>{lga}</option>
                                        ))}
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <hr style={{ backgroundColor: 'darkblue' }} />
                        <Row>
                            <Col md="12">
                                <FormGroup>
                                    <Label for="facilityName">Facility Name</Label>
                                    <Input
                                        type="select"
                                        id="facilityName"
                                        name="facilityName"
                                        value={formData.facilityName || ""}
                                        onChange={handleFacilityChange}
                                        required
                                    >
                                        <option value="">Select Facility</option>
                                        {facilities.map((facility, index) => (
                                            <option key={index} value={facility.facilityName}>{facility.facilityName}</option>
                                        ))}
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Input type="hidden" id="datimCode" name="datimCode" value={formData.datimCode || ""} readOnly />
                            <Input type="hidden" id="orgUnit" name="orgUnit" value={formData.orgUnit || ""} onChange={handleChange} />
                        </Row>
                        <hr style={{ backgroundColor: 'darkblue' }} />
                        <Row>
                            <Col md="3">
                                <FormGroup>
                                    <Label for="fromMonth">From Month</Label>
                                    <Input type="select" id="fromMonth" name="fromMonth" value={formData.fromMonth || ""} onChange={handleChange} required>
                                        <option value="">Select Month</option>
                                        {months.map(month => (
                                            <option key={month.value} value={month.value}>{month.label}</option>
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
                                        value={formData.fromYear || ""}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Year</option>
                                        {generateYearOptions().map((year) => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md="3">
                                <FormGroup>
                                    <Label for="toMonth">To Month</Label>
                                    <Input type="select" id="toMonth" name="toMonth" value={formData.toMonth || ""} onChange={handleChange} required>
                                        <option value="">Select Month</option>
                                        {months.map(month => (
                                            <option key={month.value} value={month.value}>{month.label}</option>
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
                                        value={formData.toYear || ""}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Year</option>
                                        {generateYearOptions().map((year) => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <hr style={{ backgroundColor: 'darkblue' }} />
                        <Button color="primary" onClick={handleNext} style={{ float: 'right' }}>Next</Button>
                    </TabPane>
                    {/* Tab 2: General Assessment */}
                    <TabPane tabId="2">
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="facilityMe">Name of Facility M&E</Label>
                                    <Input type="text" id="facilityMe" name="facilityMe" value={formData.facilityMe || ""} onChange={handleChange} placeholder="Name of Facility M&E" />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="facilityEsm">Name of Facility ESM Lead</Label>
                                    <Input type="text" id="facilityEsm" name="facilityEsm" value={formData.facilityEsm || ""} onChange={handleChange} placeholder="Name of Facility ESM Lead" />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="facilityBackstop">Name of Facility IHVN SI Backstop</Label>
                                    <Input type="text" id="facilityBackstop" name="facilityBackstop" value={formData.facilityBackstop || ""} onChange={handleChange} placeholder="Name of Facility IHVN SI Backstop" />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="personReporting">Name of Person Responsible for Collating and Submitting Facility Report</Label>
                                    <Input type="text" id="personReporting" name="personReporting" value={formData.personReporting || ""} onChange={handleChange} placeholder="Name of Person Responsible for Collating and Submitting Facility Report" />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="personDataEntry">Name of Person Responsible for Entering Data into IHVN IR and DHIS2</Label>
                                    <Input type="text" id="personDataEntry" name="personDataEntry" value={formData.personDataEntry || ""} onChange={handleChange} placeholder="Name of Person Responsible for Entering Data into IHVN IR and DHIS2" />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="personRadet">Name of person responsible for generating RADET</Label>
                                    <Input type="text" id="personRadet" name="personRadet" value={formData.personRadet || ""} onChange={handleChange} placeholder="Name of person responsible for generating RADET" />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="satelliteSites">Number of satellite sites and/or community pharmacy served/reached</Label>
                                    <Input type="number" id="satelliteSites" name="satelliteSites" value={formData.satelliteSites || ""} onChange={handleChange} placeholder="Number of satellite sites" />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="dqa">Has site ever had a Comprehensive DQA before now?</Label>
                                    <Input onChange={handleChange} type="select" id="dqa" name="dqa" value={formData.dqa || ""}>
                                        <option value="">Select...</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="dqaLastTime">When was the last time such an assessment was done?</Label>
                                    <Input type="date" id="dqaLastTime" name="dqaLastTime" value={formData.dqaLastTime || ""} onChange={handleChange} />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="dqaFrequency">How often is the assessment done at this site?</Label>
                                    <Input type="select" id="dqaFrequency" name="dqaFrequency" value={formData.dqaFrequency || ""} onChange={handleChange}>
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
                                    <Input onChange={handleChange} type="select" id="dqaFeedback" name="dqaFeedback" value={formData.dqaFeedback || ""}>
                                        <option value="">Select...</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="gonReport">Do you report to the GON?</Label>
                                    <Input onChange={handleChange} type="select" id="gonReport" name="gonReport" value={formData.gonReport || ""}>
                                        <option value="">Select...</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="gonLevel">At what level do you report?</Label>
                                    <Input type="select" id="gonLevel" onChange={handleChange} name="gonLevel" value={formData.gonLevel || ""}>
                                        <option value="">Select Level</option>
                                        <option value="LACA">LACA</option>
                                        <option value="SACA">SACA</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="gonFrequency">How often do you report?</Label>
                                    <Input type="text" id="gonFrequency" name="gonFrequency" value={formData.gonFrequency || ""} onChange={handleChange} placeholder="Reporting frequency" />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="gonReportsSent">How are the reports sent?</Label>
                                    <Input type="text" id="gonReportsSent" name="gonReportsSent" value={formData.gonReportsSent || ""} onChange={handleChange} placeholder="Reports sending method" />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="ndrUpload">Last NDR Upload (DD/MM/YY)</Label>
                                    <Input type="date" id="ndrUpload" name="ndrUpload" value={formData.ndrUpload || ""} onChange={handleChange} />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="ndrPerson">Name and designation of person responsible for NDR upload</Label>
                                    <Input type="text" id="ndrPerson" name="ndrPerson" value={formData.ndrPerson || ""} onChange={handleChange} placeholder="Person responsible for NDR upload" />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="ndrUploadLevel">At what level do you upload from?</Label>
                                    <Input type="text" id="ndrUploadLevel" name="ndrUploadLevel" value={formData.ndrUploadLevel || ""} onChange={handleChange} placeholder="Level of upload" />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="ndrUploadFrequency">How often is report uploaded on NDR?</Label>
                                    <Input type="text" id="ndrUploadFrequency" name="ndrUploadFrequency" value={formData.ndrUploadFrequency || ""} onChange={handleChange} placeholder="Frequency of upload" />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="ndhisReport">Last NDHIS Report (DD/MM/YY)</Label>
                                    <Input type="date" id="ndhisReport" name="ndhisReport" value={formData.ndhisReport || ""} onChange={handleChange} />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="ndhisPerson">Name and designation of person responsible for NDHIS upload</Label>
                                    <Input type="text" id="ndhisPerson" name="ndhisPerson" value={formData.ndhisPerson || ""} onChange={handleChange} placeholder="Person responsible for NDHIS upload" />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="ndhisFrequency">How often is report uploaded on NDHIS?</Label>
                                    <Input type="text" id="ndhisFrequency" name="ndhisFrequency" value={formData.ndhisFrequency || ""} onChange={handleChange} placeholder="Frequency of upload" />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="ndhisLastEntry">When was the last data entry on NDHIS?</Label>
                                    <Input type="date" id="ndhisLastEntry" name="ndhisLastEntry" value={formData.ndhisLastEntry || ""} onChange={handleChange} />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="meArchive">Are previous reports archived in the M&E unit?</Label>
                                    <Input onChange={handleChange} type="select" id="meArchive" name="meArchive" value={formData.meArchive || ""}>
                                        <option value="">Select...</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <hr style={{ backgroundColor: 'darkblue' }} />
                        <Button color="primary" onClick={handlePrevious} style={{ float: 'left' }}>Previous</Button>
                        <Button color="primary" onClick={handleNext} style={{ float: 'right' }}>Next</Button>
                    </TabPane>
                    {/* Tab 3: Structures */}
                    <TabPane tabId="3">
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="facilityMeStaff">Number of dedicated facility M&E staff</Label>
                                    <Input type="number" id="facilityMeStaff" name="facilityMeStaff" value={formData.facilityMeStaff || ""} onChange={handleChange} placeholder="Number of Dedicated Facility M&E Staff" />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="dataAssistants">Number of Data Assistants</Label>
                                    <Input type="number" id="dataAssistants" name="dataAssistants" value={formData.dataAssistants || ""} onChange={handleChange} placeholder="Number of Data Assistants" />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="functionalComputers">Are there functional computers in the M&E unit(Classmate Inclusive)? How many</Label>
                                    <Input type="select" id="functionalComputers" name="functionalComputers" value={formData.functionalComputers || ""} onChange={handleChange}>
                                        <option value="">Select...</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="functionalComputersCount">Are there functional computers in the M&E unit(Classmate Inclusive)? How many</Label>
                                    <Input type="number" id="functionalComputerCount" name="functionalComputerCount" value={formData.functionalComputerCount || ""} onChange={handleChange} placeholder="Number of functional computers" />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="currentNmrs">Are you using current NMRS?</Label>
                                    <Input onChange={handleChange} type="select" id="currentNmrs" name="currentNmrs" value={formData.currentNmrs || ""}>
                                        <option value="">Select...</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="lastNmrsEntry">When was the Last Entry on NMRS (DD/MM/YY)</Label>
                                    <Input type="date" id="lastNmrsEntry" name="lastNmrsEntry" value={formData.lastNmrsEntry || ""} onChange={handleChange} />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="pocSite">Is this facility a POC site?</Label>
                                    <Input onChange={handleChange} type="select" id="pocSite" name="pocSite" value={formData.pocSite || ""}>
                                        <option value="">Select...</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="internetFacility">Do you have internet facility? If yes, fill 6. If No, go to 7</Label>
                                    <Input onChange={handleChange} type="select" id="internetFacility" name="internetFacility" value={formData.internetFacility || ""}>
                                        <option value="">Select...</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="trainingReceived">Have personnel working in data management processes trained?</Label>
                                    <Input onChange={handleChange} type="select" id="trainingReceived" name="trainingReceived" value={formData.trainingReceived || ""}>
                                        <option value="">Select...</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="canExtractData">Can the facility DA demonstrate how to extract data or run queries required by service providers?</Label>
                                    <Input onChange={handleChange} type="select" id="canExtractData" name="canExtractData" value={formData.canExtractData || ""}>
                                        <option value="">Select...</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="canValidateData">Can the facility DA demonstrate how to validate data or run queries required by service providers?</Label>
                                    <Input onChange={handleChange} type="select" id="canValidateData" name="canValidateData" value={formData.canValidateData || ""}>
                                        <option value="">Select...</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="canUseExtractedData">Can the facility DA demonstrate how to verify, validate and correct data extracted from the NMRS?</Label>
                                    <Input onChange={handleChange} type="select" id="canUseExtractedData" name="canUseExtractedData" value={formData.canUseExtractedData || ""}>
                                        <option value="">Select...</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="dataValidationProtocol">Do you have a data validation protocol ?</Label>
                                    <Input onChange={handleChange} type="select" id="dataValidationProtocol" name="dataValidationProtocol" value={formData.dataValidationProtocol || ""}>
                                        <option value="">Select...</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <hr style={{ backgroundColor: 'darkblue' }} />
                        <Button color="primary" onClick={handlePrevious} style={{ float: 'left' }}>Previous</Button>
                        <Button color="primary" onClick={handleNext} style={{ float: 'right' }}>Next</Button>
                    </TabPane>
                    <TabPane tabId='4'>
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="generalAncRegister">General ANC Register</Label>
                                    <Input onChange={handleChange} type="select" id="generalAncRegister" name="generalAncRegister" value={formData.generalAncRegister || ""}>
                                        <option value="">Select...</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="pmtctHtsRegister">PMTCT HTS Register</Label>
                                    <Input onChange={handleChange} type="select" id="pmtctHtsRegister" name="pmtctHtsRegister" value={formData.pmtctHtsRegister || ""}>
                                        <option value="">Select...</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="maternalCohortRegister">Maternal Cohort Register</Label>
                                    <Input onChange={handleChange} type="select" id="maternalCohortRegister" name="maternalCohortRegister" value={formData.maternalCohortRegister || ""}>
                                        <option value="">Select...</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="htsRegister">HTS Register</Label>
                                    <Input onChange={handleChange} type="select" id="htsRegister" name="htsRegister" value={formData.htsRegister || ""}>
                                        <option value="">Select...</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="artRegister">ART Register</Label>
                                    <Input onChange={handleChange} type="select" id="artRegister" name="artRegister" value={formData.artRegister || ""}>
                                        <option value="">Select...</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <hr style={{ backgroundColor: 'darkblue' }} />
                        <Button color="primary" onClick={handlePrevious} style={{ float: 'left' }}>Previous</Button>
                        <Button color="success" type="submit" style={{ float: 'right' }}>Save & Continue</Button>
                    </TabPane>
                </TabContent>
            </Card>
        </Form>
    )
}

export default EditDQA