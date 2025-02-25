import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Visibility as VisibilityIcon, Psychology as AIGenerateIcon } from "@mui/icons-material";
import axios from "axios";
import katex from "katex";
import "katex/dist/katex.min.css";
import PDFQuestionGenerator from "./generateQuestion"; // Importing AI PDF generator

const QuestionForm = () => {
  const [question, setQuestion] = useState("");
  const [course, setCourse] = useState("");
  const [co, setCo] = useState(null);
  const [marks, setMarks] = useState("");
  const [courses, setCourses] = useState([]);
  const [cos, setCos] = useState([]);
  const [preview, setPreview] = useState(false);
  const previewRef = useRef(null);
  const [aiPanel, setAiPanel] = useState(false); // State for AI panel

  useEffect(() => {
    axios
      .get("http://localhost:8000/get-courses/")
      .then((response) => setCourses(response.data))
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  useEffect(() => {
    if (course) {
      axios
        .get(`http://localhost:8000/cos/by-course/${course}/`)
        .then((response) => setCos(response.data))
        .catch((error) => console.error("Error fetching COs:", error));
    }
  }, [course]);

  const handleQuestionChange = (event) => setQuestion(event.target.value);
  const handleCourseChange = (event) => {
    setCourse(event.target.value);
    setCo(null);
  };
  const handleMarksChange = (event) => setMarks(event.target.value);
  const handleCoSelect = (coId) => setCo(coId);

  const handleSubmit = () => {
    if (!co) {
      alert("Please select a CO.");
      return;
    }

    const formattedQuestion = question.replace(/\n/g, " \\\\ ");

    const data = {
      course: Number(course),
      co: co,
      question_text: formattedQuestion,
      marks: Number(marks),
    };

    axios
      .post("http://localhost:8000/add-question/", data)
      .then(() => {
        alert("Question added successfully!");
        setQuestion("");
        setCourse("");
        setCo(null);
        setMarks("");
      })
      .catch(() => alert("Failed to add question."));
  };

  const togglePreview = () => setPreview(!preview);
  const toggleAiPanel = () => setAiPanel(!aiPanel); // Toggle AI Panel

  useEffect(() => {
    if (preview && previewRef.current && question) {
      const latexContent = question.match(/\$.*?\$/g);
      let renderedContent = question.replace(/\n/g, "<br>");

      if (latexContent) {
        latexContent.forEach((latex) => {
          const renderedLatex = katex.renderToString(latex.replace(/\$/g, ""));
          renderedContent = renderedContent.replace(
            latex,
            `<span class="katex">${renderedLatex}</span>`
          );
        });
      }

      previewRef.current.innerHTML = renderedContent;
    }
  }, [question, preview, previewRef]);

  return (
    <Box sx={{ display: "flex", gap: 2, padding: 2, height: "100%" }}>
      <Box sx={{ flex: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" gutterBottom>
            Add Question
          </Typography>

          {/* Icons for Preview & AI Question Generator */}
          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip title={preview ? "Hide Preview" : "Show Preview"} arrow>
              <IconButton onClick={togglePreview} color={preview ? "primary" : "default"}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Generate Questions with AI" arrow>
              <IconButton onClick={toggleAiPanel} color={aiPanel ? "primary" : "default"}>
                <AIGenerateIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Course</InputLabel>
          <Select value={course} onChange={handleCourseChange} label="Course">
            {courses.map((course) => (
              <MenuItem key={course.course_id} value={course.course_id}>
                {course.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Marks"
          type="number"
          fullWidth
          value={marks}
          onChange={handleMarksChange}
          variant="outlined"
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label="Enter Question"
          multiline
          fullWidth
          rows={6}
          value={question}
          onChange={handleQuestionChange}
          variant="outlined"
          sx={{ marginBottom: 2 }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={handleSubmit} sx={{ marginRight: 2 }}>
            Add Question
          </Button>
        </Box>
      </Box>

      {/* Preview Section */}
      {preview && (
        <Box
          sx={{
            flex: 1,
            padding: 2,
            border: "1px solid #ccc",
            borderRadius: "8px",
            minHeight: "200px",
          }}
        >
          <Typography variant="h6">Preview:</Typography>
          <div ref={previewRef}></div>
        </Box>
      )}

      {/* AI Question Generator Section */}
      {aiPanel && (
        <Box
          sx={{
            flex: 1,
            padding: 2,
            border: "1px solid #ccc",
            borderRadius: "8px",
            minHeight: "200px",
          }}
        >
          <Typography variant="h6" gutterBottom>
            AI Question Generator
          </Typography>
          <PDFQuestionGenerator />
        </Box>
      )}
    </Box>
  );
};

export default QuestionForm;
