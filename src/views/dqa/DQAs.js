import React, { useState, useEffect } from 'react'
import { Table, ButtonGroup, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
// import SPQuestionsForm from './SPQuestionsForm' // Ensure the correct import path and name
import jwtConfig from "../../api/jwtConfig"
// import { toast } from 'react-toastify'
import './systemsProcesses.css'
import { useHistory } from 'react-router-dom'

const DQAs = () => {
  const [dqas, setDQAs] = useState([])
  const [refreshTable, setRefreshTable] = useState(false)
  const [modal, setModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [dqaToDelete, setDQAToDelete] = useState(null)

  const toggleModal = () => setModal(!modal)
  const toggleDeleteModal = () => setDeleteModal(!deleteModal)
  const history = useHistory()

  const editDQA = (dqas) => {
    setSelectedDQA(dqas)
    toggleModal()
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
        toast.success("The DQA has been successfully deleted!")
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
        <div className='button-container'>
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
            <th>Status</th>
            <th>Score</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dqas.map((dqa, index) => (
            <tr key={dqa.id}>
              <th scope="row">{index + 1}</th>
              <td>{dqa.facilityMe}</td>
              <td>{dqa.facilityEsm}</td>
              <td>{dqa.facilityBackstop}</td>
              <td>{dqa.dqaFrequency}</td>
              <td>
                <ButtonGroup>
                  <Button color="primary" onClick={() => editDQA(dqa)}>Edit</Button>
                  <Button color="info" onClick={() => editDQA(dqa)}>Dashboard</Button>
                  <Button color="danger" onClick={() => confirmDeleteDQA(dqa)}>Delete</Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default DQAs