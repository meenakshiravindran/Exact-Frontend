import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  TextField,
  Input,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import { CloudUpload, SmartToy } from "@mui/icons-material";

const PDFQuestionGenerator = () => {
  const [file, setFile] = useState(null);
  const [marks, setMarks] = useState(5);
  const [noOfQuestions, setNoOfQuestions] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError("");
  };

  const handleMarksChange = (event) => {
    setMarks(event.target.value);
  };

  const handleNoOfQuestionsChange = (event) => {
    setNoOfQuestions(event.target.value);
  };

  const handleGenerateQuestions = async () => {
    if (!file) {
      setError("Please upload a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("marks", marks);
    formData.append("no_of_questions", noOfQuestions);

    setLoading(true);
    setError("");
    setQuestions([]);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/upload_pdf/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        setQuestions(response.data.questions.split("\n"));
      } else {
        setError("Error generating questions. Please try again.");
      }
    } catch (error) {
      setError("Error generating questions. Please try again.");
    }
    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight={600} textAlign="center">
        PDF Question Generator
      </Typography>
      <Typography
        variant="subtitle1"
        color="textSecondary"
        textAlign="center"
        gutterBottom
      >
        <SmartToy sx={{ verticalAlign: "middle", fontSize: 24 }} /> AI-Powered
        Question Generator
      </Typography>
      <Paper sx={{ padding: 3, textAlign: "center" }}>
        <Input
          type="file"
          onChange={handleFileChange}
          accept=".pdf"
          sx={{ display: "none" }}
          id="upload-pdf"
        />
        <label htmlFor="upload-pdf">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUpload />}
            sx={{ marginBottom: 2 }}
          >
            Upload PDF
          </Button>
        </label>
        {file && <Typography variant="body1">Selected: {file.name}</Typography>}

        <TextField
          fullWidth
          type="number"
          label="Marks per Question"
          variant="outlined"
          value={marks}
          onChange={handleMarksChange}
          sx={{ marginTop: 2 }}
        />

        <TextField
          fullWidth
          type="number"
          label="Number of Questions"
          variant="outlined"
          value={noOfQuestions}
          onChange={handleNoOfQuestionsChange}
          sx={{ marginTop: 2 }}
        />

        <Button
          variant="contained"
          color="primary"
          startIcon={loading ? <CircularProgress size={20} /> : <SmartToy />}
          onClick={handleGenerateQuestions}
          sx={{ marginTop: 2, width: "100%" }}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Questions"}
        </Button>
      </Paper>
      {error && (
        <Alert severity="error" sx={{ marginTop: 2 }}>
          {error}
        </Alert>
      )}
      {questions.length > 0 && (
        <Paper sx={{ marginTop: 3, padding: 2 }}>
          <Typography variant="h6">Generated Questions:</Typography>
          <Box sx={{ maxHeight: "300px", overflowY: "auto", paddingRight: 1 }}>
            {questions.map((q, index) => (
              <Typography key={index} variant="body1" gutterBottom>
                {q}
              </Typography>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default PDFQuestionGenerator;
