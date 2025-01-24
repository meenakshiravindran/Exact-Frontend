// EditFaculty.js or EditFaculty.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Form, Row, Col } from 'react-bootstrap';

const EditFaculty = () => {
  const { facultyId } = useParams();
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current faculty details
    axios.get(`http://localhost:8000/faculties/${facultyId}/`)
      .then(response => {
        setName(response.data.name);
      })
      .catch(error => {
        console.error('Error fetching faculty data:', error);
      });
  }, [facultyId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.put(`http://localhost:8000/faculties/edit/${facultyId}/`, { name })
      .then(response => {
        navigate('/manage-faculties');
      })
      .catch(error => {
        console.error('Error updating faculty:', error);
      });
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h2>Edit Faculty</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter faculty name"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Update Faculty
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditFaculty;
