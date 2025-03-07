import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Container,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";

const EditFaculty = () => {
  const { facultyId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    dept: "",
    email: "",
    phone: "",
  });
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current faculty details
    axios
      .get(`http://localhost:8000/faculties/${facultyId}/`)
      .then((response) => {
        setFormData({
          name: response.data.name,
          dept: response.data.dept, // Current department ID
          email: response.data.email,
          phone: response.data.phone,
        });
      })
      .catch((error) => {
        console.error("Error fetching faculty data:", error);
      });

    // Fetch department list
    axios
      .get("http://localhost:8000/get-department/")
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      });
  }, [facultyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:8000/faculties/edit/${facultyId}/`, formData)
      .then(() => {
        navigate("/manage-faculties");
      })
      .catch((error) => {
        console.error("Error updating faculty:", error);
      });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <h2>Edit Faculty</h2>
      <form onSubmit={handleSubmit}>
        {/* Name Input */}
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          margin="normal"
        />

        {/* Department Dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="dept-label">Department</InputLabel>
          <Select
            labelId="dept-label"
            label="Department"
            id="dept"
            name="dept"
            value={formData.dept}
            onChange={handleChange}
            required
          >
            <MenuItem value="">
              <em>Select Department</em>
            </MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept.dept_id} value={dept.dept_name}>
                {dept.dept_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Email Input */}
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          margin="normal"
        />

        {/* Phone Input */}
        <TextField
          fullWidth
          label="Phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
          margin="normal"
        />

        {/* Buttons */}
        <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/manage-faculties")}
          >
            Back
          </Button>
          <Button variant="contained" type="submit">
            Update Faculty
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default EditFaculty;
