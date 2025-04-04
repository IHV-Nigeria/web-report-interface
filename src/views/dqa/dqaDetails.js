import React, { useEffect, useState } from "react"
import { Collapse, Button, Spinner } from "reactstrap"
import DataTable from "react-data-table-component"
import { useParams } from "react-router-dom"
import jwtConfig from "../../api/jwtConfig"

const DqaDetails = () => {
  const { dqaId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [spOpen, setSpOpen] = useState(true) // SP Questions section open by default
  const [dvOpen, setDvOpen] = useState(false)
  const [vaOpen, setVaOpen] = useState(false)

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