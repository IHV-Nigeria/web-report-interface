import React, { useEffect, useState, useRef } from "react"
import { Collapse, Button, Spinner } from "reactstrap"
import DataTable from "react-data-table-component"
import { useParams } from "react-router-dom"
import jwtConfig from "../../api/jwtConfig"
import * as powerbi from "powerbi-client"

const DqaDetails = () => {
  const { dqaId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [spOpen, setSpOpen] = useState(true) // SP Questions section open by default
  const [dvOpen, setDvOpen] = useState(false)
  const [vaOpen, setVaOpen] = useState(false)
  const [powerBIOpen, setPowerBIOpen] = useState(false) // Power BI section toggle

  const [accessToken, setAccessToken] = useState(null) // Store the fetched access token

  const powerBIRef = useRef(null) // Reference for Power BI container

  const fetchAccessToken = async () => {
    try {
      const response = await fetch("http://localhost:2222/api/v1/get-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json" // Ensure the Content-Type is set
        }
      })
  
      if (!response.ok) {
        throw new Error(`Failed to fetch access token: ${response.statusText}`)
      }
  
      const result = await response.json()
      setAccessToken(result.access_token) // Store the access token
      console.log("Access token fetched successfully:", result.access_token)
    } catch (error) {
      console.error("Error fetching access token:", error)
    }
  }
  
  useEffect(() => {
    fetchAccessToken() // Fetch the access token on component mount
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${jwtConfig.dqaUrl}/dqa-details/${dqaId}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json()

        // Ensure default values for questionsAnswers and variableAssessments
        setData({
          ...result,
          facility: {
            ...result.facility,
            questionsAnswers: result.facility.questionsAnswers || [],
            variableAssessment: result.facility.variableAssessment || []
          }
        })
      } catch (error) {
        console.error("Error fetching DQA details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dqaId])


  useEffect(() => {
    if (powerBIOpen && powerBIRef.current && data && accessToken) {
      // Configure Power BI embed dynamically based on dqaId
      const embedConfig = {
        type: "report",
        id: "533f78ba-5100-43f4-b73e-375bc6ec9114", // Your Power BI Report ID
        embedUrl: `https://app.powerbi.com/reportEmbed?reportId=533f78ba-5100-43f4-b73e-375bc6ec9114`,
        accessToken, // Use the fetched access token
        tokenType: powerbi.models.TokenType.Aad,
        settings: {
          panes: {
            filters: { visible: false },
            pageNavigation: { visible: true }
          }
        }
      }
  
      // Initialize the Power BI service
      const powerBIService = new powerbi.service.Service(
        powerbi.factories.hpmFactory,
        powerbi.factories.wpmpFactory,
        powerbi.factories.routerFactory
      )
  
      // Embed the report
      const report = powerBIService.embed(powerBIRef.current, embedConfig)
  
      report.on("loaded", async () => {
        const filter = {
          $schema: "http://powerbi.com/product/schema#basic",
          target: {
            table: "dqa_facility",
            column: "id"
          },
          operator: "In",
          values: [dqaId] // Use dqaId to filter the report
        }
  
        try {
          await report.setFilters([filter])
          console.log("dqaId filter applied successfully")
        } catch (error) {
          console.error("Error applying dqaId filter:", error)
        }
      })
  
      return () => {
        powerBIService.reset(powerBIRef.current)
      }
    }
  }, [powerBIOpen, dqaId, data, accessToken])

  if (loading) {
    return (
      <div className="loading-overlay">
        <Spinner color="primary" />
        <p>Loading DQA details...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div>
        <p>Error: Unable to load DQA details. Please try again later.</p>
      </div>
    )
  }

  // Separate questionsAnswers into SP and DV groups
  const spQuestions = data.facility.questionsAnswers.filter(
    (qa) => qa.dqaQuestions.group === "SP"
  )
  const dvQuestions = data.facility.questionsAnswers.filter(
    (qa) => qa.dqaQuestions.group === "DV"
  )

  // Columns for DataTables
  const spColumns = [
    { name: "Question", selector: (row) => row.dqaQuestions?.question || "-", sortable: true },
    { name: "Answer", selector: (row) => row.answer || "-", sortable: true }
  ]

  const dvColumns = [
    { name: "Category", selector: (row) => row.dqaQuestions?.category || "-", sortable: true },
    { name: "Question", selector: (row) => row.dqaQuestions?.question || "-", sortable: true },
    { name: "Answer", selector: (row) => row.answer || "-", sortable: true },
    { name: "Answer Type", selector: (row) => row.answerType || "-", sortable: true },
    { name: "Month", selector: (row) => row.month || "-", sortable: true },
    { name: "Reviewer's Comment", selector: (row) => row.reviewersComment || "-", sortable: true }
  ]

  const vaColumns = [
    { name: "Patient ID", selector: (row) => row.patientId || "N/A", sortable: true },
    { name: "Date of Birth", selector: (row) => row.dateOfBirth || "N/A", sortable: true },
    { name: "Sex", selector: (row) => row.sex || "N/A", sortable: true },
    { name: "Folder ART Start Date", selector: (row) => row.folderArtStartDate || "N/A", sortable: true },
    { name: "RADET ART Start Date", selector: (row) => row.radetArtStartDate || "N/A", sortable: true },
    { name: "XML ART Start Date", selector: (row) => row.xmlArtStartDate || "N/A", sortable: true },
    { name: "NDR ART Start Date", selector: (row) => row.ndrArtStartDate || "N/A", sortable: true },
    { name: "Folder Last Drug Pickup Date", selector: (row) => row.folderLastDrugPickupDate || "N/A", sortable: true },
    { name: "RADET Last Drug Pickup Date", selector: (row) => row.radetLastDrugPickupDate || "N/A", sortable: true },
    { name: "XML Last Drug Pickup Date", selector: (row) => row.xmlLastDrugPickupDate || "N/A", sortable: true },
    { name: "NDR Last Drug Pickup Date", selector: (row) => row.ndrLastDrugPickupDate || "N/A", sortable: true },
    { name: "Folder Days of ARV Refill", selector: (row) => row.folderDaysOfArvRefill || "N/A", sortable: true },
    { name: "RADET Days of ARV Refill", selector: (row) => row.radetDaysOfArvRefill || "N/A", sortable: true },
    { name: "XML Days of ARV Refill", selector: (row) => row.xmlDaysOfArvRefill || "N/A", sortable: true },
    { name: "NDR Days of ARV Refill", selector: (row) => row.ndrDaysOfArvRefill || "N/A", sortable: true },
    { name: "Folder Current Regimen", selector: (row) => row.folderCurrentRegimen || "N/A", sortable: true },
    { name: "RADET Current Regimen", selector: (row) => row.radetCurrentRegimen || "N/A", sortable: true },
    { name: "XML Current Regimen", selector: (row) => row.xmlCurrentRegimen || "N/A", sortable: true },
    { name: "NDR Current Regimen", selector: (row) => row.ndrCurrentRegimen || "N/A", sortable: true },
    { name: "RADET Current Viral Load", selector: (row) => row.radetCurrentViralLoad || "N/A", sortable: true },
    { name: "XML Current Viral Load", selector: (row) => row.xmlCurrentViralLoad || "N/A", sortable: true },
    { name: "NDR Current Viral Load", selector: (row) => row.ndrCurrentViralLoad || "N/A", sortable: true },
    { name: "Folder Viral Load Sample Collection Date", selector: (row) => row.folderViralLoadSampleCollectionDate || "N/A", sortable: true },
    { name: "RADET Viral Load Sample Collection Date", selector: (row) => row.radetViralLoadSampleCollectionDate || "N/A", sortable: true },
    { name: "XML Viral Load Sample Collection Date", selector: (row) => row.xmlViralLoadSampleCollectionDate || "N/A", sortable: true },
    { name: "NDR Viral Load Sample Collection Date", selector: (row) => row.ndrViralLoadSampleCollectionDate || "N/A", sortable: true },
    { name: "Folder Current ART Status", selector: (row) => row.folderCurrentArtStatus || "N/A", sortable: true },
    { name: "RADET Current ART Status", selector: (row) => row.radetCurrentArtStatus || "N/A", sortable: true },
    { name: "XML Current ART Status", selector: (row) => row.xmlCurrentArtStatus || "N/A", sortable: true },
    { name: "NDR Current ART Status", selector: (row) => row.ndrCurrentArtStatus || "N/A", sortable: true },
    { name: "Folder Pregnancy Status", selector: (row) => row.folderPregnancyStatus || "N/A", sortable: true },
    { name: "RADET Pregnancy Status", selector: (row) => row.radetPregnancyStatus || "N/A", sortable: true },
    { name: "XML Pregnancy Status", selector: (row) => row.xmlPregnancyStatus || "N/A", sortable: true },
    { name: "NDR Pregnancy Status", selector: (row) => row.ndrPregnancyStatus || "N/A", sortable: true },
    { name: "Folder Pregnancy Status Date", selector: (row) => row.folderPregnancyStatusDate || "N/A", sortable: true },
    { name: "RADET Pregnancy Status Date", selector: (row) => row.radetPregnancyStatusDate || "N/A", sortable: true },
    { name: "XML Pregnancy Status Date", selector: (row) => row.xmlPregnancyStatusDate || "N/A", sortable: true },
    { name: "NDR Pregnancy Status Date", selector: (row) => row.ndrPregnancyStatusDate || "N/A", sortable: true },
    { name: "Folder TB Screen", selector: (row) => row.folderTbScreen || "N/A", sortable: true },
    { name: "RADET TB Screen", selector: (row) => row.radetTbScreen || "N/A", sortable: true },
    { name: "XML TB Screen", selector: (row) => row.xmlTbScreen || "N/A", sortable: true },
    { name: "NDR TB Screen", selector: (row) => row.ndrTbScreen || "N/A", sortable: true },
    { name: "Folder TB Screen Date", selector: (row) => row.folderTbScreenDate || "N/A", sortable: true },
    { name: "RADET TB Screen Date", selector: (row) => row.radetTbScreenDate || "N/A", sortable: true },
    { name: "XML TB Screen Date", selector: (row) => row.xmlTbScreenDate || "N/A", sortable: true },
    { name: "NDR TB Screen Date", selector: (row) => row.ndrTbScreenDate || "N/A", sortable: true },
    { name: "Comments", selector: (row) => row.comments || "N/A", sortable: true }
  ]

  return (
    <div>
      <h1>DQA Details</h1>
      <h2>Facility Information</h2>
      <p>{data.facility.facilityName || "Facility name not available"}</p>

      {/* Power BI Analytics Section */}
      <Button color="primary" onClick={() => setPowerBIOpen(!powerBIOpen)} style={{ marginBottom: "1rem" }}>
        {powerBIOpen ? "Hide Power BI Analytics" : "Show Power BI Analytics"}
      </Button>
      <Collapse isOpen={powerBIOpen}>
        <div
          ref={powerBIRef}
          style={{ height: "600px", border: "1px solid #ccc", marginTop: "1rem" }}
        ></div>
        <iframe title="DQAPowerBI" width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=533f78ba-5100-43f4-b73e-375bc6ec9114&autoAuth=true&ctid=995c8049-bfb4-4df7-a971-0330afa808c9" frameborder="0" allowFullScreen="true"></iframe>
      </Collapse>

      {/* SP Questions Section */}
      <Button color="primary" onClick={() => setSpOpen(!spOpen)} style={{ marginBottom: "1rem" }}>
        {spOpen ? "Hide SP Questions" : "Show SP Questions"}
      </Button>
      <Collapse isOpen={spOpen}>
        <DataTable
          title="Questions and Answers (Group SP)"
          columns={spColumns}
          data={spQuestions}
          pagination
          responsive
          highlightOnHover
        />
      </Collapse>

      {/* DV Questions Section */}
      <Button color="primary" onClick={() => setDvOpen(!dvOpen)} style={{ marginBottom: "1rem" }}>
        {dvOpen ? "Hide DV Questions" : "Show DV Questions"}
      </Button>
      <Collapse isOpen={dvOpen}>
        <DataTable
          title="Questions and Answers (Group DV)"
          columns={dvColumns}
          data={dvQuestions}
          pagination
          responsive
          highlightOnHover
        />
      </Collapse>

      {/* Variable Assessments Section */}
      <Button color="primary" onClick={() => setVaOpen(!vaOpen)} style={{ marginBottom: "1rem" }}>
        {vaOpen ? "Hide Variable Assessments" : "Show Variable Assessments"}
      </Button>
      <Collapse isOpen={vaOpen}>
        <DataTable
          title="Variable Assessments"
          columns={vaColumns}
          data={data.facility.variableAssessment}
          pagination
          responsive
          highlightOnHover
        />
      </Collapse>
    </div>
  )
}

export default DqaDetails