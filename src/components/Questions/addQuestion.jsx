import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Button, TextField, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import axios from "axios";
import katex from "katex";
import "katex/dist/katex.min.css"; // Make sure KaTeX styles are imported

const QuestionForm = () => {
  const [question, setQuestion] = useState("");
  const [course, setCourse] = useState("");
  const [co, setCo] = useState("");
  const [courses, setCourses] = useState([]);
  const [cos, setCos] = useState([]);
  const [preview, setPreview] = useState(false);
  const previewRef = useRef(null);

  // Fetch courses on initial load
  useEffect(() => {
    axios.get("http://localhost:8000/get-courses/")
      .then((response) => setCourses(response.data))
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  // Fetch COs when a course is selected
  useEffect(() => {
    if (course) {
      axios.get(`http://localhost:8000/cos/by-course/${course}/`)
        .then((response) => setCos(response.data))
        .catch((error) => console.error("Error fetching COs:", error));
    }
  }, [course]);

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleCourseChange = (event) => {
    setCourse(event.target.value);
  };

  const handleCoChange = (event) => {
    setCo(event.target.value);
  };

  const handleSubmit = () => {
    let formattedQuestion = question.trim();

    // Automatically wrap plain text in LaTeX syntax
    if (!formattedQuestion.includes("$")) {
      formattedQuestion = `$${formattedQuestion}$`;
    }

    const data = {
      course: course,
      co: co,
      question_text: formattedQuestion,
    };

    axios.post("http://localhost:8000/add-question/", data)
      .then((response) => {
        alert("Question added successfully!");
        setQuestion(""); // Clear the input fields
        setCourse("");
        setCo("");
      })
      .catch((error) => {
        console.error("Error adding question:", error);
        alert("Failed to add question.");
      });
  };

  const togglePreview = () => {
    setPreview(!preview);
  };

  // Use KaTeX to render LaTeX when previewing
  useEffect(() => {
    if (previewRef.current && question) {
      const latexContent = question.match(/\$.*?\$/g);
      let renderedContent = question;

      // Replace newlines with <br> tags for plain text
      renderedContent = renderedContent.replace(/\n/g, "<br>");

      if (latexContent) {
        latexContent.forEach((latex) => {
          const renderedLatex = katex.renderToString(latex.replace(/\$/g, ""));
          renderedContent = renderedContent.replace(latex, `<span class="katex">${renderedLatex}</span>`);
        });
      }

      previewRef.current.innerHTML = renderedContent;
    }
  }, [question, preview]);

  return (
    <Box sx={{ display: "flex", gap: 2, padding: 2, height: "100%" }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h5" gutterBottom>
          Add Question
        </Typography>

        {/* Course Dropdown */}
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Course</InputLabel>
          <Select
            value={course}
            onChange={handleCourseChange}
            label="Course"
          >
            {courses.map((course) => (
              <MenuItem key={course.course_id} value={course.course_id}>
                {course.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* CO Dropdown */}
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>CO</InputLabel>
          <Select
            value={co}
            onChange={handleCoChange}
            label="CO"
            disabled={!course}
          >
            {cos.map((co) => (
              <MenuItem key={co.co_id} value={co.co_id}>
                {co.co_label} : {co.co_description}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Question Text Field */}
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

        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="contained" onClick={handleSubmit}>
            Add Question
          </Button>
          <Button variant="contained" onClick={togglePreview}>
            {preview ? "Edit" : "Preview"}
          </Button>
        </Box>
      </Box>

      {/* Right Side - Preview */}
      {preview && (
        <Box
          sx={{
            flex: 1,
            padding: 2,
            border: "1px solid #ccc",
            borderRadius: "8px",
            minHeight: "200px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "'KaTeX Main', sans-serif", // Apply KaTeX font to normal text
          }}
        >
          <Typography variant="h6" sx={{justifySelf:"left", alignSelf:"flex-start"}}>Preview:</Typography>
          <div ref={previewRef}></div>
        </Box>
      )}
    </Box>
  );
};

export default QuestionForm;


// Evaluate the following definite integral: 
// $I = \int_0^1 \left( 3x^2 - 2x + 1 \right) \, dx$

// This integral represents the area under the curve $ 3x^2 - 2x + 1 $ between the points $ x = 0 $ and $ x = 1 $.