import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Card,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { Add, Edit, Delete, ArrowUpward } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import AddSectionDialog from "./AddSection";
import axios from "axios";
import SelectQuestion from "../Questions/selectQuestion";
import katex from "katex";
import "katex/dist/katex.min.css";

const ExamSectionPage = () => {
  const { int_exam_id } = useParams();
  const [examDetails, setExamDetails] = useState(null);
  const [sections, setSections] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 

  // Fetch exam details on component mount
  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/exam-details/${int_exam_id}/`
        );
        setExamDetails(response.data);
      } catch (err) {
        console.error("Error fetching exam details:", err);
        setError("Failed to load exam details.");
      }
    };

    fetchExamDetails();
  }, [int_exam_id]);

  // Fetch sections of the exam
  const fetchExamSections = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/exam-sections/${int_exam_id}/`
      );
      const sectionsWithQuestions = await Promise.all(
        response.data.sections.map(async (section) => {
          const questionsResponse = await axios.get(
            `http://localhost:8000/exam/${int_exam_id}/sections/${section.id}/questions/`
          );
          return { ...section, selectedQuestions: questionsResponse.data };
        })
      );
      setSections(sectionsWithQuestions);
      console.log("Sections with questions,", sectionsWithQuestions);
    } catch (err) {
      console.error("Error fetching sections or questions:", err);
      setError("Failed to load exam sections.");
    }
  };

  // Fetch sections when component mounts
  useEffect(() => {
    fetchExamSections();
  }, [int_exam_id]);

  const deleteSection = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/exam-sections/delete/${id}/`);
      setSections(sections.filter((section) => section.id !== id));
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  const handleOpenSelectQuestion = (section) => {
    setSelectedSection(section);
    setOpenQuestionDialog(true);
  };

  const handleSelectQuestions = async (sectionId, selectedQuestions) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId ? { ...section, selectedQuestions } : section
      )
    );
  };

  // Handle add section with refetching
  const handleAddSection = (newSection) => {
    setLoading(true); // Set loading to true when adding the section

    // Optimistic UI update: immediately add the new section
    const updatedSections = [
      ...sections,
      { ...newSection, selectedQuestions: [] },
    ];

    setSections(updatedSections);
    setOpenDialog(false);

    // Simulate delay for loading effect
    setTimeout(() => {
      setLoading(false); // Hide the loading indicator after the delay
      // Refetch the sections from the backend
      fetchExamSections(); // This will refetch the updated sections from the server
    }, 1000); // 1 second delay to simulate server-side processing
  };

  const renderQuestionText = (text) => {
    const latexMatches = text.match(/\$.*?\$/g);
    let renderedText = text.replace(/\\/g, "<br>");

    if (latexMatches) {
      latexMatches.forEach((latex) => {
        const renderedLatex = katex.renderToString(latex.replace(/\$/g, ""));
        renderedText = renderedText.replace(
          latex,
          `<span class="katex">${renderedLatex}</span>`
        );
      });
    }

    return <span dangerouslySetInnerHTML={{ __html: renderedText }} />;
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div style={{ padding: "20px" }}>
      {examDetails ? (
        <>
          <Typography
            variant="h5"
            align="center"
            style={{ marginBottom: "20px" }}
          >
            {examDetails.exam_name} - {examDetails.course_name}
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress /> {/* Show loading spinner while adding section */}
            </Box>
          ) : (
            sections.map((section) => (
              <Card
                key={section.id}
                style={{ padding: "15px", marginBottom: "15px" }}
              >
                <Typography variant="h6">{section.name}</Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {section.description}
                </Typography>

                {section.selectedQuestions &&
                  section.selectedQuestions.length > 0 && (
                    <List>
                      {section.selectedQuestions.map((q, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={
                              <div>
                                {index + 1}.<span> {renderQuestionText(q.question_text)}</span>
                              </div>
                            }
                            secondary={`Marks: ${q.marks}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <IconButton>
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton onClick={() => deleteSection(section.id)}>
                      <Delete color="error" />
                    </IconButton>
                    <IconButton>
                      <ArrowUpward />
                    </IconButton>
                  </div>

                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Add />}
                    color="secondary"
                    onClick={() => handleOpenSelectQuestion(section)}
                  >
                    Add Question
                  </Button>
                </div>
              </Card>
            ))
          )}

          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
          >
            Add Section
          </Button>

          <AddSectionDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            onAdd={handleAddSection}
          />

          {selectedSection && (
            <SelectQuestion
              open={openQuestionDialog}
              onClose={() => setOpenQuestionDialog(false)}
              section={selectedSection}
              onSelectQuestions={handleSelectQuestions}
            />
          )}
        </>
      ) : (
        <Typography align="center">Loading exam details...</Typography>
      )}
    </div>
  );
};

export default ExamSectionPage;
