import React, { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import jwtConfig from "../../api/jwtConfig"

const DqaComments = () => {
    const { dqaId } = useParams()
    const history = useHistory()
    const [form, setForm] = useState({
        score: '',
        status: '',
        comments: ''
    })
    const [loading, setLoading] = useState(false)

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleCommentsChange = value => {
        setForm({ ...form, comments: value })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await fetch(`${jwtConfig.dqaUrl}/save-dqa-comments/${dqaId}`, {

                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            })
            if (!response.ok) throw new Error('Failed to save comments')
            toast.success('Comments saved!')
            history.push(`/dqa-details/${dqaId}`)
        } catch (err) {
            toast.error('Error saving comments')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h2>DQA Comments</h2>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="score">Score</Label>
                    <Input
                        type="text"
                        name="score"
                        id="score"
                        value={form.score}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="status">Status</Label>
                    <Input
                        type="select"
                        name="status"
                        id="status"
                        value={form.status}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select status</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="comments">Comments</Label>
                    <ReactQuill
                        theme="snow"
                        value={form.comments}
                        onChange={handleCommentsChange}
                        style={{ minHeight: 150, marginBottom: 30 }}
                    />
                </FormGroup>
                <Button color="primary" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                </Button>
            </Form>
        </div>
    )
}

export default DqaComments