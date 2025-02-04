import React, { useState, useEffect } from "react";
import { Button, Typography, Card, IconButton, Box } from "@mui/material";
import { Add, Edit, Delete, ArrowUpward } from "@mui/icons-material";
import { useParams } from "react-router-dom"; // Get exam ID from route
import AddSectionDialog from "./AddSection";
import axios from "axios";

const ExamSectionPage = () => {
  const { int_exam_id } = useParams(); // Get the internal exam ID from URL
  const [examDetails, setExamDetails] = useState(null);
  const [sections, setSections] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/exam-details/${int_exam_id}/`);
        setExamDetails(response.data);
      } catch (err) {
        console.error("Error fetching exam details:", err);
        setError("Failed to load exam details.");
      }
    };
    fetchExamDetails();
  }, [int_exam_id]);

  const handleAddSection = (newSection) => {
    setSections([...sections, newSection]);
    setOpenDialog(false);
  };

  const deleteSection = (id) => {
    setSections(sections.filter((section) => section.id !== id));
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div style={{ padding: "20px" }}>
      {examDetails ? (
        <>
          {/* Exam Heading in the center */}
          <Typography variant="h5" align="center" style={{ marginBottom: "20px" }}>
            {examDetails.exam_name} - {examDetails.course_name}
          </Typography>

          {/* Layout for Date, Faculty, Max Marks, and Duration */}
          <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
            {/* Left: Date and Faculty */}
            <Box>
              <Typography variant="body1">Date: {examDetails.date}</Typography>
              <Typography variant="body1">Faculty: {examDetails.faculty_name}</Typography>
            </Box>

            {/* Right: Max Marks and Duration */}
            <Box>
              <Typography variant="body1">Max Marks: {examDetails.max_marks}</Typography>
              <Typography variant="body1">Duration: {examDetails.duration} mins</Typography>
            </Box>
          </Box>

          {/* Questions/Sections Display */}
          <Typography variant="subtitle1" align="center">Questions added: {sections.length} / 20</Typography>

          {sections.map((section) => (
            <Card key={section.id} style={{ padding: "10px", marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6">{section.name}</Typography>
                <div>
                  <IconButton><Edit color="primary" /></IconButton>
                  <IconButton onClick={() => deleteSection(section.id)}><Delete color="error" /></IconButton>
                  <IconButton><ArrowUpward /></IconButton>
                </div>
              </div>
              <Typography variant="body2" color="textSecondary">
                No Questions Found in {section.name}
              </Typography>
            </Card>
          ))}

          {/* Add Section Button */}
          <div style={{ marginTop: "10px" }}>
            <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
              Add Section
            </Button>
          </div>

          <AddSectionDialog open={openDialog} onClose={() => setOpenDialog(false)} onAdd={handleAddSection} />
        </>
      ) : (
        <Typography align="center">Loading exam details...</Typography>
      )}
    </div>
  );
};

export default ExamSectionPage;
