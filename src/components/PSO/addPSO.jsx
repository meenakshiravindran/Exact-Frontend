import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AddPSOForm = () => {
  const [formData, setFormData] = useState({
    pso_label: "",
    pso_desc: "",
    programme: "",
  });

  const [errors, setErrors] = useState({});
  const [programmes, setProgrammes] = useState([]);
  const navigate = useNavigate();

  // Fetch programmes on component mount
  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const response = await axios.get("http://localhost:8000/get-programme/");
        setProgrammes(response.data);
      } catch (error) {
        console.error("Error fetching programmes:", error);
      }
    };

    fetchProgrammes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/add-pso/", formData);
      alert("PSO created successfully.");
      setFormData({
        pso_label: "",
        pso_desc: "",
        programme: "",
      });
      navigate('/manage-pso');
      setErrors({});
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
        sx={{
          p: 3,
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Add PSO
        </Typography>

        {/* PSO Label Input */}
        <TextField
          fullWidth
          label="PSO Label"
          name="pso_label"
          value={formData.pso_label}
          onChange={handleChange}
          error={!!errors.pso_label}
          helperText={errors.pso_label}
          margin="normal"
        />

        {/* PSO Description Input */}
        <TextField
          fullWidth
          label="PSO Description"
          name="pso_desc"
          value={formData.pso_desc}
          onChange={handleChange}
          error={!!errors.pso_desc}
          helperText={errors.pso_desc}
          margin="normal"
          multiline
          rows={4}
        />

        {/* Programme Dropdown */}
        <FormControl fullWidth margin="normal" error={!!errors.programme}>
          <InputLabel id="programme-label">Programme</InputLabel>
          <Select
            labelId="programme-label"
            label="Programme"
            name="programme"
            value={formData.programme}
            onChange={handleChange}
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
          {errors.programme && (
            <Typography variant="caption" color="error">
              {errors.programme}
            </Typography>
          )}
        </FormControl>

        {/* Submit Button */}
        <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/manage-pso")}
          >
            Back
          </Button>
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddPSOForm;
