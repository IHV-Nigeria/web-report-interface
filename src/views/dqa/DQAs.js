import React, { useState, useEffect } from 'react'
import { Table, ButtonGroup, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import jwtConfig from "../../api/jwtConfig"
import { useHistory } from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css'

const DQAs = () => {
  const [dqas, setDQAs] = useState([])
  const [refreshTable, setRefreshTable] = useState(false)
  // const [modal, setModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [dqaToDelete, setDQAToDelete] = useState(null)

  // const toggleModal = () => setModal(!modal)
  const toggleDeleteModal = () => setDeleteModal(!deleteModal)
  const history = useHistory() // Use history for navigation

  const editDQA = (dqas) => {
    // setSelectedDQA(dqas)
    // toggleModal()
    history.push(`/edit-dqa/${dqas.id}`)
  }

  const confirmDeleteDQA = (dqas) => {
    setDQAToDelete(dqas)
    toggleDeleteModal()
  }

  const deleteDQA = async () => {
    const token = localStorage.getItem(`${jwtConfig.storageTokenKeyName}`)
    const url = `${jwtConfig.baseUrl}/dqa/${dqaToDelete.id}`

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        console.log("The DQA has been successfully deleted!")
      } else {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setRefreshTable(!refreshTable)
      toggleDeleteModal()
    } catch (error) {
      console.error("Error deleting DQA:", error)
    }
  }

  const newDQA = async (e) => {
    e.preventDefault()
    history.push('/dqa')
  }

  const goToVA = (dqaId) => {
    history.push(`/edit-dqa-dv-questions/${dqaId}`) // Navigate to the dqa-details page with the dqaId
  }

  const goToFeedback = (dqaId) => {
    history.push(`/save-dqa-comments/${dqaId}`) // Navigate to the dqa-details page with the dqaId
  }
  const goToDashboard = (dqaId) => {
    history.push(`/dqa-details/${dqaId}`) // Navigate to the dqa-details page with the dqaId
  }

  useEffect(() => {
    const token = localStorage.getItem(`${jwtConfig.storageTokenKeyName}`)

    fetch(`${jwtConfig.dqaUrl}/dqa-facilities-list`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then(data => setDQAs(data))
      .catch(error => console.error("Error fetching questions:", error))
  }, [refreshTable])

  return (
    <div>
      <div className='button-container' style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button color="primary" onClick={newDQA}>Start New DQA</Button>
      </div>
      <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this DQA?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={deleteDQA}>Delete</Button>
          <Button color="secondary" onClick={toggleDeleteModal}>Cancel</Button>
        </ModalFooter>
      </Modal>

      <h3>DQA RECORDS</h3>
      <Table striped>
        <thead>
          <tr>
            <th>#</th>
            <th>DQA Period</th>
            <th>Facility</th>
            <th>Score</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dqas.map((dqa, index) => (
            <tr key={dqa.id}>
              <th scope="row">{index + 1}</th>
              <td>{dqa.fromMonth}, {dqa.fromYear} to {dqa.toMonth}, {dqa.toYear} </td>
              <td>{dqa.facilityName}</td>
              <td>{dqa.score}</td>
              <td>{dqa.status}</td>
              <td>
                <ButtonGroup>
                  <Button color="primary" style={{ borderColor: 'white', marginRight: '3px' }} size="sm" onClick={() => goToDashboard(dqa.id)} title="Dashboard"><i className="fas fa-dashboard"></i></Button>
                  <Button color="primary" style={{ borderColor: 'white', marginRight: '3px' }} size="sm" onClick={() => editDQA(dqa)} title="Edit"><i className="fas fa-edit"></i></Button>
                  <Button color="primary" style={{ borderColor: 'white', marginRight: '3px' }} size="sm" onClick={() => goToVA(dqa.id)}>Variable Assemments</Button>
                  <Button color="primary" style={{ borderColor: 'white', marginRight: '3px' }} size="sm" onClick={() => goToFeedback(dqa.id)} title="Feedback"><i className="fas fa-comment-dots"></i></Button>
                  <Button color="primary" size="sm" onClick={() => confirmDeleteDQA(dqa)} title="Delete"><i className="fas fa-remove"></i></Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div >
  )
}

export default DQAs