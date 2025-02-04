import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";
import katex from "katex";
import "katex/dist/katex.min.css"; // Import KaTeX styles

const QuestionForm = () => {
  const [question, setQuestion] = useState("");
  const [course, setCourse] = useState("");
  const [co, setCo] = useState("");
  const [marks, setMarks] = useState("");
  const [courses, setCourses] = useState([]);
  const [cos, setCos] = useState([]);
  const [preview, setPreview] = useState(false);
  const previewRef = useRef(null);

  // Fetch courses on initial load
  useEffect(() => {
    axios
      .get("http://localhost:8000/get-courses/")
      .then((response) => {
        console.log("Courses fetched:", response.data);
        setCourses(response.data);
      })
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  // Fetch COs when a course is selected
  useEffect(() => {
    if (course) {
      axios
        .get(`http://localhost:8000/cos/by-course/${course}/`)
        .then((response) => {
          console.log("Fetched COs:", response.data); // Debugging
          setCos(response.data);
        })
        .catch((error) => console.error("Error fetching COs:", error));
    }
  }, [course]);

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleCourseChange = (event) => {
    setCourse(event.target.value);
    setCo(""); // Reset CO selection when course changes
  };

  const handleMarksChange = (event) => {
    setMarks(event.target.value);
  };

  const handleCoSelect = (coId) => {
    setCo(coId);
  };

  const handleSubmit = () => {
    if (!co) {
      alert("Please select a CO.");
      return;
    }
    const data = {
      course: Number(course),  
      co: Number(co),
      question_text: question,
      marks: Number(marks),
    };

    axios
      .post("http://localhost:8000/add-question/", data)
      .then((response) => {
        alert("Question added successfully!");
        setQuestion(""); // Clear the input fields
        setCourse("");
        setCo("");
        setMarks("");
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
          <Select value={course} onChange={handleCourseChange} label="Course">
            {courses.map((course) => (
              <MenuItem key={course.course_id} value={course.course_id}>
                {course.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* COs as Cards */}
        {course && cos.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              marginBottom: 2,
              justifyContent: "center", // Center cards horizontally
            }}
          >
            {cos.map((coItem) => (
              <Card
                key={coItem.co_id}
                sx={{
                  width: 200,
                  height: 200,
                  borderRadius: "50%", // Makes the cards circular
                  cursor: "pointer",
                  padding: 2,
                  border: co === coItem.co_id ? "2px solid #007BFF" : "1px solid #ddd", // Standard blue color
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow for a more professional look
                  "&:hover": {
                    boxShadow: "0px 6px 18px rgba(0, 123, 255, 0.2)", // Hover effect with a soft blue shadow
                    backgroundColor: "#f5f7fa", // Light hover background color
                  },
                }}
                onClick={() => handleCoSelect(coItem.co_id)}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: co === coItem.co_id ? 1 : 0.8, // Highlight selected card
                    transition: "opacity 0.3s ease",
                  }}
                >
                  <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold" }}>
                    {coItem.co_label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: "center",
                      opacity: 0, // Initially hidden description
                      transition: "opacity 0.3s ease",
                      position: "absolute", // Position description inside card
                      bottom: "10px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "80%",
                      fontSize: "14px",
                      backgroundColor: "#ffffff",
                      padding: "8px",
                      borderRadius: "5px",
                      boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                      zIndex: 10,
                    }}
                  >
                    {coItem.co_description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {/* Marks Input Field */}
        <TextField
          label="Marks"
          type="number"
          fullWidth
          value={marks}
          onChange={handleMarksChange}
          variant="outlined"
          sx={{ marginBottom: 2 }}
        />

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
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography variant="h6">Preview:</Typography>
          <div ref={previewRef}></div>
        </Box>
      )}
    </Box>
  );
};

export default QuestionForm;
