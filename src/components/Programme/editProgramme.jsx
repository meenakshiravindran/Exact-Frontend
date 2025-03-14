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
  Drawer,
  Typography,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";

const EditProgramme = ({ open, onClose, programmeId, refreshProgrammes }) => {
  // const { programmeId } = useParams();
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
    if (!programmeId) return;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8000/programme/edit/${programmeId}/`,
        formData
      );
      alert("Programme updated successfully.");
      onClose();
      refreshProgrammes();
    } catch (error) {
      console.error("Error updating programme:", error);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 600, p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Edit Programme</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Programme Name"
            name="programme_name"
            value={formData.programme_name}
            onChange={handleChange}
            required
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="dept_label">Department</InputLabel>
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

          <TextField
            fullWidth
            label="Number of PO's"
            name="no_of_pos"
            type="number"
            value={formData.no_of_pos}
            onChange={handleChange}
            required
            margin="normal"
          />

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

          <TextField
            fullWidth
            label="Duration (in years)"
            name="duration"
            type="number"
            required
            value={formData.duration}
            onChange={handleChange}
            margin="normal"
          />

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" type="submit">
              Update Programme
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
};

export default EditProgramme;
