import React, { useState, useEffect } from 'react'
import { Table, ButtonGroup, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import SPQuestionsForm from './SPQuestionsForm' // Ensure the correct import path and name
import jwtConfig from "../../api/jwtConfig"
import { toast } from 'react-toastify'
import './systemsProcesses.css'

const SystemsProcessesQuestions = () => {
  const [questions, setQuestions] = useState([])
  const [refreshTable, setRefreshTable] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [modal, setModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [questionToDelete, setQuestionToDelete] = useState(null)

  const toggleModal = () => setModal(!modal)
  const toggleDeleteModal = () => setDeleteModal(!deleteModal)

  const handleSubmit = async (newQuestion) => {
    const token = localStorage.getItem(`${jwtConfig.storageTokenKeyName}`)
    const method = newQuestion.id ? 'PUT' : 'POST'
    const url = newQuestion.id ? `${jwtConfig.dqaUrl}/questions/${newQuestion.id}` : `${jwtConfig.baseUrl}/questions`
    console.log('newQuestion:', JSON.stringify(newQuestion))
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newQuestion)
      })

      if (response.ok) {
        toast.success("The Question has been saved successfully!")
      } else {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setRefreshTable(!refreshTable)
      setSelectedQuestion(null) // Clear the form after submission
      toggleModal() // Close the modal after submission
    } catch (error) {
      console.error("Error saving question:", error)
    }
  }

  const editQuestion = (question) => {
    setSelectedQuestion(question)
    toggleModal()
  }

  const confirmDeleteQuestion = (question) => {
    setQuestionToDelete(question)
    toggleDeleteModal()
  }

  const deleteQuestion = async () => {
    const token = localStorage.getItem(`${jwtConfig.storageTokenKeyName}`)
    const url = `${jwtConfig.dqaUrl}/questions/${questionToDelete.id}`

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success("The Question has been successfully deleted!")
      } else {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setRefreshTable(!refreshTable)
      toggleDeleteModal()
    } catch (error) {
      console.error("Error deleting question:", error)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem(`${jwtConfig.storageTokenKeyName}`)

    fetch(`${jwtConfig.dqaUrl}/questions`, {
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
      .then(data => setQuestions(data))
      .catch(error => console.error("Error fetching questions:", error))
  }, [refreshTable])

  return (
    <div>
      <div className='button-container'>
        <Button color="primary" onClick={() => { setSelectedQuestion(null); toggleModal() }}>Create Question</Button>

        </div>
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>{selectedQuestion ? "Edit Question" : "Create Question"}</ModalHeader>
        <ModalBody>
          <SPQuestionsForm onSubmit={handleSubmit} existingQuestion={selectedQuestion} />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this question?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={deleteQuestion}>Delete</Button>
          <Button color="secondary" onClick={toggleDeleteModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
      <h3>Questions</h3>
      <Table striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Question</th>
            <th>Category</th>
            <th>Group</th>
            <th>Remarks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question, index) => (
            <tr key={question.id}>
              <th scope="row">{index + 1}</th>
              <td>{question.question}</td>
              <td>{question.category}</td>
              <td>{question.group}</td>
              <td>{question.remarks}</td>
              <td>
                <ButtonGroup>
                  <Button color="primary" onClick={() => editQuestion(question)}>Edit</Button>
                  <Button color="danger" onClick={() => confirmDeleteQuestion(question)}>Delete</Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default SystemsProcessesQuestions