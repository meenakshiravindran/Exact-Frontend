import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom"; // Get exam ID from route

const AddSectionDialog = ({ open, onClose, onAdd }) => {
  const { int_exam_id } = useParams(); // Get exam ID from URL params
  const [sectionName, setSectionName] = useState("");
  const [numQuestions, setNumQuestions] = useState("");
  const [numToAnswer, setNumToAnswer] = useState("");
  const [ceilingMark, setCeilingMark] = useState("");
  const [description, setDescription] = useState("");
  const accessToken = localStorage.getItem("access_token");

  const handleSubmit = async () => {
    if (!sectionName || !numQuestions || !numToAnswer || !ceilingMark) {
      alert("Please fill in all required fields.");
      return;
    }

    const newSection = {
      section_name: sectionName,
      no_of_questions: parseInt(numQuestions),
      no_of_questions_to_be_answered: parseInt(numToAnswer),
      ceiling_mark: parseInt(ceilingMark),
      description: description || "",
    };
  
    try {
      const response = await axios.post( `http://localhost:8000/add-exam-sections/${int_exam_id}/`, newSection, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      onAdd({
        id: response.data.id, // Ensure the ID is included
        section_name: response.data.section_name,
        description: response.data.description,
        no_of_questions: response.data.no_of_questions,
        no_of_questions_to_be_answered: response.data.no_of_questions_to_be_answered,
        ceiling_mark: response.data.ceiling_mark,
      });
  
      handleClose();
    } catch (error) {
      console.error("Error adding section:", error.response?.data || error);
      alert("Failed to add section. Please try again.");
    }
  };
  

  const handleClose = () => {
    setSectionName("");
    setNumQuestions("");
    setNumToAnswer("");
    setCeilingMark("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Section</DialogTitle>
      <DialogContent>
        <TextField label="Section Name" fullWidth value={sectionName} onChange={(e) => setSectionName(e.target.value)} sx={{ mb: 2 }} />
        <TextField label="Number of Questions" type="number" fullWidth value={numQuestions} onChange={(e) => setNumQuestions(e.target.value)} sx={{ mb: 2 }} />
        <TextField label="Number to Answer" type="number" fullWidth value={numToAnswer} onChange={(e) => setNumToAnswer(e.target.value)} sx={{ mb: 2 }} />
        <TextField label="Ceiling Mark" type="number" fullWidth value={ceilingMark} onChange={(e) => setCeilingMark(e.target.value)} sx={{ mb: 2 }} />
        <TextField label="Description (Optional)" fullWidth multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} sx={{ mb: 2 }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSectionDialog;
