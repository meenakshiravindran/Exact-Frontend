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

const EditStudent = () => {
  const { studentId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    register_no: "",
    programme: "",
    year_of_admission: "",
    phone_number: "",
    email: "",
  });
  const [programmes, setProgrammes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current student details
    axios
      .get(`http://localhost:8000/students/${studentId}/`)
      .then((response) => {
        setFormData({
          name: response.data.name,
          register_no: response.data.register_no,
          programme: response.data.programme, // Current programme ID
          year_of_admission: response.data.year_of_admission,
          phone_number: response.data.phone_number,
          email: response.data.email,
        });
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
      });

    // Fetch programme list
    axios
      .get("http://localhost:8000/get-programme/")
      .then((response) => {
        setProgrammes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching programmes:", error);
      });
  }, [studentId]);

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
      .put(`http://localhost:8000/students/edit/${studentId}/`, formData)
      .then(() => {
        alert("Updated Successfully!")
        navigate("/manage-students");
      })
      .catch((error) => {
        console.error("Error updating student:", error);
      });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <h2>Edit Student</h2>
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

        {/* Register Number Input */}
        <TextField
          fullWidth
          label="Register Number"
          name="register_no"
          value={formData.register_no}
          onChange={handleChange}
          required
          margin="normal"
        />

        {/* Programme Dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="programme-label">Programme</InputLabel>
          <Select
            labelId="programme-label"
            label="Programme"
            id="programme"
            name="programme"
            value={formData.programme}
            onChange={handleChange}
            required
          >
            <MenuItem value="">
              <em>Select Programme</em>
            </MenuItem>
            {programmes.map((prog) => (
              <MenuItem key={prog.programme_id} value={prog.programme_name}>
                {prog.programme_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Year of Admission Input */}
        <TextField
          fullWidth
          label="Year of Admission"
          name="year_of_admission"
          type="number"
          value={formData.year_of_admission}
          onChange={handleChange}
          required
          margin="normal"
        />

        {/* Phone Number Input */}
        <TextField
          fullWidth
          label="Phone Number"
          name="phone_number"
          type="tel"
          value={formData.phone_number}
          onChange={handleChange}
          required
          margin="normal"
        />

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

        {/* Buttons */}
        <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/manage-students")}
          >
            Back
          </Button>
          <Button variant="contained" type="submit">
            Update Student
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default EditStudent;
