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
  Typography,
  Tooltip,
} from "@mui/material";

const EditQuestion = () => {
  const { questionId } = useParams();
  const [formData, setFormData] = useState({
    question_text: "",
    course: "",
    co: null,
    marks: "",
  });
  const [courses, setCourses] = useState([]);
  const [cos, setCos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/question/${questionId}/`)
      .then((response) => {
        setFormData({
          question_text: response.data.question_text,
          course: response.data.course,
          co: response.data.co,
          marks: response.data.marks,
        });
      })
      .catch((error) => console.error("Error fetching question data:", error));

    axios
      .get("http://localhost:8000/get-courses/")
      .then((response) => setCourses(response.data))
      .catch((error) => console.error("Error fetching courses:", error));
  }, [questionId]);

  useEffect(() => {
    if (formData.course) {
      axios
        .get(`http://localhost:8000/cos/by-course/${formData.course}/`)
        .then((response) => setCos(response.data))
        .catch((error) => console.error("Error fetching COs:", error));
    }
  }, [formData.course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCoSelect = (coId) => {
    setFormData({ ...formData, co: coId });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:8000/question/edit/${questionId}/`, formData)
      .then(() => navigate("/manage-question"))
      .catch((error) => console.error("Error updating question:", error));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Edit Question
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Course</InputLabel>
          <Select
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
          >
            {courses.map((course) => (
              <MenuItem key={course.course_id} value={course.course_id}>
                {course.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {formData.course && cos.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              marginBottom: 2,
              justifyContent: "flex-start",
            }}
          >
            {cos.map((coItem) => (
              <Tooltip
                key={coItem.co_id}
                title={coItem.co_description}
                placement="top"
                arrow
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: formData.co === coItem.co_id ? "#007BFF" : "white",
                    color: formData.co === coItem.co_id ? "white" : "#007BFF",
                    border: "2px solid #007BFF",
                    transition: "all 0.3s ease",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    "&:hover": {
                      backgroundColor: "#007BFF",
                      color: "white",
                      boxShadow: "0px 4px 8px rgba(0, 123, 255, 0.3)",
                    },
                  }}
                  onClick={() => handleCoSelect(coItem.co_id)}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                    {coItem.co_label}
                  </Typography>
                </Box>
              </Tooltip>
            ))}
          </Box>
        )}

        <TextField
          fullWidth
          label="Marks"
          type="number"
          name="marks"
          value={formData.marks}
          onChange={handleChange}
          required
          margin="normal"
        />

        <TextField
          fullWidth
          label="Enter Question"
          multiline
          rows={6}
          name="question_text"
          value={formData.question_text}
          onChange={handleChange}
          required
          margin="normal"
        />

        <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/manage-question")}
          >
            Back
          </Button>
          <Button variant="contained" type="submit">
            Update Question
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default EditQuestion;
