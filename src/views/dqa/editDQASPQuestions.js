import { useState, useEffect } from 'react'
import { Form, FormGroup, Label, Input, Button, Card, CardBody, CardTitle, CardText, Row, Col } from 'reactstrap'
import jwtConfig from "../../api/jwtConfig"
import 'bootstrap/dist/css/bootstrap.min.css'
import { useHistory, useParams } from "react-router-dom"
import { toast } from "react-toastify"

const editDQASPQuestions = () => {
    const { dqaId } = useParams()
    const [questions, setQuestions] = useState([])
    const [answers, setAnswers] = useState({})
    const history = useHistory()

    // Preload answers if available
    useEffect(() => {
        let dqaData = {}
        try {
            dqaData = JSON.parse(localStorage.getItem("dqaData") || "{}")
        } catch (e) {
            dqaData = {}
        }
        const preloadedAnswers = dqaData?.questionsAnswers || []
        if (preloadedAnswers.length > 0) {
            const mapped = {}
            preloadedAnswers.forEach(ans => {
                mapped[ans.dqaQuestions.id] = {
                    id: ans.id, // <-- Store the answer id
                    answer: ans.answer,
                    reviewersComment: ans.reviewersComment
                }
            })
            setAnswers(mapped)
        }
    }, []) // Only run once on mount


    // Fetch questions
    useEffect(() => {
        fetch(`${jwtConfig.dqaUrl}/questions-group/SP`, {
            headers: {
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
    }, [])

    const handleChange = (e, questionId) => {
        const { name, value } = e.target
        setAnswers({
            ...answers,
            [questionId]: {
                ...answers[questionId],
                [name]: value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem(`${jwtConfig.storageTokenKeyName}`)

        const payload = Object.keys(answers).map(questionId => ({
            id: answers[questionId].id,
            dqaId,
            questionId,
            answer: answers[questionId].answer,
            reviewersComment: answers[questionId].reviewersComment
        }))

        console.log(JSON.stringify(payload))

        try {
            const response = await fetch(`${jwtConfig.dqaUrl}/update-questions-answers/${dqaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })

            if (response.ok) {
                // const text = await response.text()
                try {
                    // const data = text ? JSON.parse(text) : {}
                    // console.log('Updated answers:', data)
                    toast.success('Answers updated successfully!')
                } catch (jsonError) {
                    console.error('Failed to parse JSON response:', jsonError)
                    toast.error('Answers updated, but failed to parse server response.')
                }
                // localStorage.setItem("dqaData", JSON.stringify(formData))
                history.push(`/edit-dqa-dv-questions/${dqaId}`)
            } else {
                const text = await response.text()
                const error = text ? JSON.parse(text) : {}
                console.error('Error response:', error)
                alert('Failed to update answers. Please try again.')
            }
        } catch (error) {
            console.error('Network error:', error)
            alert('A network error occurred. Please check your connection and try again.')
        }
    }

    const categorizedQuestions = questions.reduce((acc, question) => {
        if (!acc[question.category]) {
            acc[question.category] = []
        }
        acc[question.category].push(question)
        return acc
    }, {})

    return (
        <div>
            <h1>Edit DQA System Processes Questions</h1>
            <Form onSubmit={handleSubmit}>
                <Input type="hidden" name="dqaId" value={dqaId} />
                {Object.keys(categorizedQuestions).map(category => (

                    <Card key={category} className="mb-3">
                        <CardBody>
                            <CardTitle tag="h5">{category}</CardTitle>
                            {categorizedQuestions[category].map(question => (
                                <div key={question.id}>
                                    <CardText>{question.question}</CardText>
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for={`answer-${question.id}`}>Answer</Label>
                                                <Input
                                                    type="select"
                                                    name="answer"
                                                    id={`answer-${question.id}`}
                                                    value={answers[question.id]?.answer || ''}
                                                    onChange={(e) => handleChange(e, question.id)}
                                                    style={{ minWidth: 200, width: "100%" }}
                                                >
                                                    <option value="">Select an answer</option>
                                                    <option value="Yes-completely">Yes-completely</option>
                                                    <option value="Partly">Partly</option>
                                                    <option value="No - not at all">No - not at all</option>
                                                    <option value="N/A">N/A</option>
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for={`reviewersComment-${question.id}`}>Reviewer's Comment</Label>
                                                <Input
                                                    type="text"
                                                    name="reviewersComment"
                                                    id={`reviewersComment-${question.id}`}
                                                    value={answers[question.id]?.reviewersComment || ''}
                                                    onChange={(e) => handleChange(e, question.id)}
                                                    style={{ minWidth: 200, width: "100%" }}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </div>
                            ))}


                        </CardBody>
                    </Card>
                ))}
                <Card className="mb-3">
                    <CardBody>
                        <Button type="submit" color="success" style={{ float: 'right' }}>Update and Continue</Button>
                    </CardBody>
                </Card>
            </Form>
        </div>
    )
}

export default editDQASPQuestions