import React, { useState, useEffect } from 'react'
import { Form, FormGroup, Label, Input, Button, Col, Row } from 'reactstrap'

const SPQuestionsForm = ({ onSubmit, existingQuestion }) => {
    const [question, setQuestion] = useState({ question: '', category: '', remarks: '', group: '' })

    useEffect(() => {
        if (existingQuestion) {
            setQuestion(existingQuestion)
        }
    }, [existingQuestion])

    const handleChange = (e) => {
        const { name, value } = e.target
        setQuestion(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(question)
    }

    return (
        <div>
            <h3>{existingQuestion ? "Edit Question" : "Create Question"}</h3>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="question">Question</Label>
                    <Input
                        type="text"
                        name="question"
                        id="question"
                        value={question.question}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="category">Category</Label>
                            <Input
                                type="text"
                                name="category"
                                id="category"
                                value={question.category}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="group">Group</Label>
                            <Input
                                type="select"
                                name="group"
                                id="group"
                                value={question.group}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Group</option>
                                {["SP", "DV", "OTHERS"].map(type => (
                                <option key={type} value={type}>{type}</option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>
                
                <FormGroup>
                    <Label for="remarks">Remarks</Label>
                    <Input
                        type="text"
                        name="remarks"
                        id="remarks"
                        value={question.remarks}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>
                <Button type="submit" color="primary">{existingQuestion ? "Update" : "Create"}</Button>
            </Form>
        </div>
    )
}

export default SPQuestionsForm