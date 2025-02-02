import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, TextField, Button, Typography, Card, CardContent } from "@mui/material";

export const CreateInternalExam = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();

  const [examName, setExamName] = useState("");
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
      duration,
      max_marks: maxMarks,
    };

    try {
      await axios.post("http://localhost:8000/add-internal-exam/", examData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      navigate("/");
    } catch (err) {
      console.error("Error creating internal exam:", err);
      setError("Failed to create the internal exam. Please try again.");
    }
  };

  return (
    <Box display="flex" sx={{justifyContent:"center", alignItems:"center"}} >
      <Card sx={{ minWidth: { md: "500px", sm: "400px" }, width: "50%", padding: "2rem", boxShadow: 3}}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Create Internal Exam
          </Typography>

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
              sx={{ mb: 2 }}
            />
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
            <Button type="submit" fullWidth variant="contained">
              Create Exam
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
