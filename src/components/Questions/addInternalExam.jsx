import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateInternalExam = ({ open, onClose, batchId }) => {
  const navigate = useNavigate();

  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState(null);
  const [duration, setDuration] = useState("");
  const [maxMarks, setMaxMarks] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const accessToken = localStorage.getItem("access_token");
    const examData = {
      batch: batchId,
      exam_name: examName,
      exam_date: examDate ? examDate.format("YYYY-MM-DD") : "",
      duration,
      max_marks: maxMarks,
    };

    try {
      await axios.post("http://localhost:8000/add-internal-exam/", examData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      onClose(); // Close the dialog after submission
      navigate("/");
    } catch (err) {
      console.error("Error creating internal exam:", err);
      setError("Failed to create the internal exam. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Internal Exam</DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Internal Exam Name (e.g., IA1, IA2)"
            fullWidth
            variant="outlined"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            required
            sx={{ mb: 2, mt: 2 }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Exam Date"
              fullWidth
              sx={{
                marginBottom:"15px"
              }}
              value={examDate}
              onChange={(newDate) => setExamDate(newDate)}
              renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
              required
            />
          </LocalizationProvider>
          <TextField
            label="Duration (minutes)"
            fullWidth
            variant="outlined"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Maximum Marks"
            fullWidth
            variant="outlined"
            type="number"
            value={maxMarks}
            onChange={(e) => setMaxMarks(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary" variant="contained">
              Create Exam
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInternalExam;
