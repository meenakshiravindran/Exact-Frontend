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

const EditPSO = () => {
  const { psoId } = useParams();
  const [formData, setFormData] = useState({
    pso_label: "",
    pso_desc: "",
    programme: "",
  });
  const [programmes, setProgrammes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current PSO details
    axios
      .get(`http://localhost:8000/pso/${psoId}/`)
      .then((response) => {
        setFormData({
          pso_label: response.data.pso_name,
          pso_desc: response.data.description,
          programme: response.data.programme, // Current programme ID
        });
      })
      .catch((error) => {
        console.error("Error fetching PSO data:", error);
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
  }, [psoId]);

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
      .put(`http://localhost:8000/pso/edit/${psoId}/`, formData)
      .then(() => {
        navigate("/manage-pso");
      })
      .catch((error) => {
        console.error("Error updating PSO:", error);
      });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <h2>Edit PSO</h2>
      <form onSubmit={handleSubmit}>
        {/* PSO Label Input */}
        <TextField
          fullWidth
          label="PSO Label"
          name="pso_label"
          value={formData.pso_label}
          onChange={handleChange}
          required
          margin="normal"
        />

        {/* PSO Description Input */}
        <TextField
          fullWidth
          label="PSO Description"
          name="pso_desc"
          value={formData.pso_desc}
          onChange={handleChange}
          required
          margin="normal"
          multiline
          rows={4}
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

        {/* Buttons */}
        <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/manage-pso")}
          >
            Back
          </Button>
          <Button variant="contained" type="submit">
            Update PSO
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default EditPSO;
