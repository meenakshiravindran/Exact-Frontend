// ManageFaculties.js or ManageFaculties.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Table, Container, Row, Col } from 'react-bootstrap';

const ManageFaculties = () => {
  const [faculties, setFaculties] = useState([]);

  useEffect(() => {
    // Fetch all faculties
    axios.get('http://localhost:8000/get-faculty')
      .then(response => {
        setFaculties(response.data);
      })
      .catch(error => {
        console.error('Error fetching faculty data:', error);
      });
  }, []);

  const handleDelete = (facultyId) => {
    console.log(faculties)
    // Delete a faculty
    axios.delete(`http://localhost:8000/faculties/delete/${facultyId}/`)
      .then(() => {
        // After deletion, fetch updated faculty list
        setFaculties(faculties.filter(faculty => faculty.faculty_id !== facultyId));
      })
      .catch(error => {
        console.error('Error deleting faculty:', error);
      });
  };

  return (
    <Container className="mt-5">
      <Row className="mb-3">
        <Col>
          <h2>Manage Faculties</h2>
        </Col>
        <Col className="text-end">
          <Link to="/add-faculty">
            <Button variant="success">Add New Faculty</Button>
          </Link>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {faculties.map((faculty) => (
            <tr key={faculty.faculty_id}>
              <td>{faculty.name}</td>
              <td>
                <Link to={`/edit-faculty/${faculty.faculty_id}`}>
                  <Button variant="warning" className="me-2">Edit</Button>
                </Link>
                <Button variant="danger" onClick={() => handleDelete(faculty.faculty_id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ManageFaculties;

