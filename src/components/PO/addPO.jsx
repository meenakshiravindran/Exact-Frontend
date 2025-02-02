import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, TextField, Button, Box, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AddProgrammeOutcome = () => {
  const [formData, setFormData] = useState({
    po_number: "",
    description: "",
    level:""
  });
  const [errors, setErrors] = useState({});
  const [levels, setLevels] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // Fetch levels
        const levelResponse = await axios.get("http://localhost:8000/get-level/");
        setLevels(levelResponse.data);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/add-pos/", formData);
      alert("Programme Outcome added successfully.");
      navigate("/manage-pos");
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ p: 3, border: "1px solid #ccc", borderRadius: "8px" }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Add Programme Outcome
        </Typography>

        <TextField
          fullWidth
          label="PO Number"
          name="po_number"
          value={formData.po_number}
          onChange={handleChange}
          error={!!errors.po_number}
          helperText={errors.po_number}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Description"
          name="description"
          multiline
          rows={4}
          value={formData.description}
          onChange={handleChange}
          error={!!errors.description}
          helperText={errors.description}
          margin="normal"
        />
        <FormControl fullWidth margin="normal" error={!!errors.level}>
          <InputLabel id="level-label">Level</InputLabel>
          <Select
            labelId="level-label"
            label="Level"
            name="level"
            value={formData.level}
            onChange={handleChange}
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
          {errors.level && (
            <Typography variant="caption" color="error">
              {errors.level}
            </Typography>
          )}
        </FormControl>

        <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
          <Button variant="outlined" color="secondary" onClick={() => navigate("/manage-pos")}>Back</Button>
          <Button variant="contained" type="submit">Submit</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddProgrammeOutcome;
