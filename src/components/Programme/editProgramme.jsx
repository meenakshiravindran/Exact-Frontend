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

const EditProgramme = () => {
  const { programmeId } = useParams();
  const [formData, setFormData] = useState({
    programme_name: "",
    dept: "",
    no_of_pos: "",
    level: "",
    duration: "",
  });
  const [departments, setDepartments] = useState([]);
  const [levels, setLevels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { 
    // Fetch the current programme details
    axios
      .get(`http://localhost:8000/programme/${programmeId}/`)
      .then((response) => {
        setFormData({
          programme_name: response.data.programme_name,
          dept: response.data.department, // Current department ID
          no_of_pos: response.data.no_of_pos,
          level: response.data.level, // Current level ID
          duration: response.data.duration,
        });
      })
      .catch((error) => {
        console.error("Error fetching programme data:", error);
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

    // Fetch level list
    axios
      .get("http://localhost:8000/get-level/") // Assuming there's an endpoint for levels
      .then((response) => {
        setLevels(response.data);
      })
      .catch((error) => {
        console.error("Error fetching levels:", error);
      });
  }, [programmeId]);

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
      .put(`http://localhost:8000/programme/edit/${programmeId}/`, formData)
      .then(() => {
        navigate("/manage-programmes");
      })
      .catch((error) => {
        console.error("Error updating programme:", error);
      });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <h2>Edit Programme</h2>
      <form onSubmit={handleSubmit}>
        {/* Programme Name Input */}
        <TextField
          fullWidth
          label="Programme Name"
          name="programme_name"
          value={formData.programme_name}
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

        {/* Number of Positions Input */}
        <TextField
          fullWidth
          label="Number of Positions"
          name="no_of_pos"
          type="number"
          value={formData.no_of_pos}
          onChange={handleChange}
          required
          margin="normal"
        />

        {/* Level Dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="level-label">Level</InputLabel>
          <Select
            labelId="level-label"
            label="Level"
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            required
          >
            <MenuItem value="">
              <em>Select Level</em>
            </MenuItem>
            {levels.map((level) => (
              <MenuItem key={level.level_id} value={level.level_name}>
                {level.level_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Duration Input */}
        <TextField
          fullWidth
          label="Duration (in years)"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          required
          margin="normal"
        />

        {/* Buttons */}
        <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/manage-programmes")}
          >
            Back
          </Button>
          <Button variant="contained" type="submit">
            Update Programme
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default EditProgramme;
