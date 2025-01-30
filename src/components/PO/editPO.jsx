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

const EditPO = () => {
  const { poId } = useParams();
  const [formData, setFormData] = useState({
    po_label: "",
    pos_description: "",
    level: "",
  });
  const [levels, setLevels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current PO details
    axios
      .get(`http://localhost:8000/pos/${poId}/`)
      .then((response) => {
        setFormData({
          po_label: response.data.po_label,
          pos_description: response.data.pos_description,
          level: response.data.level, // Level ID
        });
      })
      .catch((error) => {
        console.error("Error fetching PO data:", error);
      });

    // Fetch available levels
    axios
      .get("http://localhost:8000/get-level/")
      .then((response) => {
        setLevels(response.data);
      })
      .catch((error) => {
        console.error("Error fetching levels:", error);
      });
  }, [poId]);

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
      .put(`http://localhost:8000/pos/edit/${poId}/`, formData)
      .then(() => {
        alert("Programme Outcome updated successfully!");
        navigate("/manage-pos");
      })
      .catch((error) => {
        console.error("Error updating PO:", error);
      });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <h2>Edit Programme Outcome</h2>
      <form onSubmit={handleSubmit}>
        {/* PO Label Input */}
        <TextField
          fullWidth
          label="PO Label"
          name="po_label"
          value={formData.po_label}
          onChange={handleChange}
          required
          margin="normal"
        />

        {/* PO Description Input */}
        <TextField
          fullWidth
          label="PO Description"
          name="pos_description"
          value={formData.pos_description}
          onChange={handleChange}
          required
          margin="normal"
          multiline
          rows={4}
        />

        {/* Level Dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="level-label">Select Level</InputLabel>
          <Select
            labelId="level-label"
            label="Select Level"
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
              <MenuItem key={level.level_id} value={level.level_id}>
                {level.level_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Buttons */}
        <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/manage-pos")}
          >
            Back
          </Button>
          <Button variant="contained" type="submit">
            Update PO
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default EditPO;
