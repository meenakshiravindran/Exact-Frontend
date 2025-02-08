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
import {
  Add,
  Edit,
  Delete,
  ArrowUpward,
  Visibility,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import AddSectionDialog from "./AddSection";
import axios from "axios";
import SelectQuestion from "../Questions/selectQuestion";
import katex from "katex";
import "katex/dist/katex.min.css";
import ExamPreview from "./ExamPreview";

const ExamSectionPage = () => {
  const { int_exam_id } = useParams();
  const [examDetails, setExamDetails] = useState(null);
  const [sections, setSections] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [latexPreview, setLatexPreview] = useState("");
  const [renderedLatex, setRenderedLatex] = useState("");
  const [previewData, setPreviewData] = useState(null);

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
    } catch (err) {
      console.error("Error fetching sections or questions:", err);
      setError("Failed to load exam sections.");
    }
  };

  // Fetch sections when component mounts
  useEffect(() => {
    fetchExamSections();
  }, [int_exam_id]);

  // Delete a section
  const deleteSection = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/exam-sections/delete/${id}/`);
      setSections(sections.filter((section) => section.id !== id));
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  // Open question selection dialog
  const handleOpenSelectQuestion = (section) => {
    setSelectedSection(section);
    setOpenQuestionDialog(true);
  };

  // Handle question selection
  const handleSelectQuestions = async (sectionId, selectedQuestions) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId ? { ...section, selectedQuestions } : section
      )
    );
  };

  // Handle adding a new section
  const handleAddSection = (newSection) => {
    setLoading(true);

    const updatedSections = [
      ...sections,
      { ...newSection, selectedQuestions: [] },
    ];

    setSections(updatedSections);
    setOpenDialog(false);

    setTimeout(() => {
      setLoading(false);
      fetchExamSections();
    }, 1000);
  };

  // Render question text with LaTeX support
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

  const generateLatex = async () => {
    try {
      const previewData = {
        exam_name: examDetails.exam_name,
        course_name: examDetails.course_name,
        date: examDetails.date,
        faculty_name: examDetails.faculty_name,
        max_marks: examDetails.max_marks,
        duration: examDetails.duration,
        sections: sections.map((section) => ({
          name: section.name,
          description: section.description,
          questions: section.selectedQuestions.map((q) => ({
            text: q.question_text,
            marks: q.marks,
            co: q.co,
          })),
        })),
      };

      const response = await axios.post(
        "http://localhost:8000/exam-preview/",
        previewData
      );
      setPreviewData(response.data.image);
    } catch (error) {
      console.error("Error generating preview:", error);
    }
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom="20px"
          >
            <Box>
              <Typography variant="body1">Date: {examDetails.date}</Typography>
              <Typography variant="body1">
                Faculty: {examDetails.faculty_name}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1">
                Max Marks: {examDetails.max_marks}
              </Typography>
              <Typography variant="body1">
                Duration: {examDetails.duration} mins
              </Typography>
            </Box>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
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
                        <ListItemText
                          primary={
                            <div>
                              {index + 1}.{" "}
                              <span>{renderQuestionText(q.question_text)}</span>
                            </div>
                          }
                          secondary={
                            <div>
                              <Typography variant="body2">
                                Marks: {q.marks}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                [{q.co}]
                              </Typography>
                            </div>
                          }
                        />
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

                  {section.selectedQuestions.length < section.numQuestions && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Add />}
                      color="secondary"
                      onClick={() => handleOpenSelectQuestion(section)}
                    >
                      Add Question
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}

          <Box display="flex" alignItems="center" gap={2} marginTop={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
            >
              Add Section
            </Button>
            <IconButton onClick={generateLatex}>
              <Visibility color="action" />
            </IconButton>
          </Box>

          {previewData && <ExamPreview previewData={previewData} />}

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
