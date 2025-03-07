import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Card,
  IconButton,
  Box,
  List,
  ListItemText,
  CircularProgress,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
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
  const [previewData, setPreviewData] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false); // State for drawer
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editNoOfQuestions, setEditNoOfQuestions] = useState(0);
  const [editNoOfQuestionsToBeAnswered, setEditNoOfQuestionsToBeAnswered] =
    useState(0);
  const [editCeilingMark, setEditCeilingMark] = useState(0);

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
  const handleOpenEditDialog = (section) => {
    setEditSection(section);
    setEditName(section.name);
    setEditDescription(section.description);
    setEditNoOfQuestions(section.numQuestions);
    setEditNoOfQuestionsToBeAnswered(section.numToAnswer);
    setEditCeilingMark(section.ceilingMark);
    setOpenEditDialog(true);
  };

  const handleUpdateSection = async () => {
    if (!editSection) return;

    try {
      const updatedSection = {
        section_name: editName,
        description: editDescription,
        no_of_questions: editNoOfQuestions,
        no_of_questions_to_be_answered: editNoOfQuestionsToBeAnswered,
        ceiling_mark: editCeilingMark,
      };

      await axios.put(
        `http://localhost:8000/exam-sections/update/${editSection.id}/`,
        updatedSection
      );

      setOpenEditDialog(false);
      fetchExamSections(); // Refresh sections after update
    } catch (error) {
      console.error("Error updating section:", error);
    }
  };

  // Handle question selection
  const handleSelectQuestions = async (sectionId, selectedQuestions) => {
    await fetchExamSections();
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

  // Generate LaTeX preview
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
      setIsPreviewOpen(true); // Open the drawer
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom="20px"
          >
            <Typography variant="h5" align="center">
              {examDetails.exam_name} - {examDetails.course_name}
            </Typography>
            <IconButton onClick={generateLatex}>
              <Visibility color="action" />
            </IconButton>
          </Box>

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
                          key={q.id}
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
                    <IconButton onClick={() => handleOpenEditDialog(section)}>
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton onClick={() => deleteSection(section.id)}>
                      <Delete color="error" />
                    </IconButton>
                  </div>

                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Add />}
                    color="secondary"
                    onClick={() => handleOpenSelectQuestion(section)}
                  >
                    {section.selectedQuestions.length > 0
                      ? "Edit Questions"
                      : "Add Questions"}
                  </Button>
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
          </Box>

          {/* Drawer for Preview */}
          <Drawer
            anchor="right"
            open={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
          >
            <Box sx={{ width: "50vw", padding: "20px" }}>
              {previewData && <ExamPreview previewData={previewData} />}
            </Box>
          </Drawer>

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
          <Dialog
            open={openEditDialog}
            onClose={() => setOpenEditDialog(false)}
          >
            <DialogTitle>Edit Section</DialogTitle>
            <DialogContent>
              <TextField
                label="Section Name"
                fullWidth
                margin="normal"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <TextField
                label="Description"
                fullWidth
                margin="normal"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
              <TextField
                label="Number of Questions"
                fullWidth
                margin="normal"
                type="number"
                value={editNoOfQuestions}
                onChange={(e) => setEditNoOfQuestions(e.target.value)}
              />
              <TextField
                label="Questions to be Answered"
                fullWidth
                margin="normal"
                type="number"
                value={editNoOfQuestionsToBeAnswered}
                onChange={(e) =>
                  setEditNoOfQuestionsToBeAnswered(e.target.value)
                }
              />
              <TextField
                label="Ceiling Mark"
                fullWidth
                margin="normal"
                type="number"
                value={editCeilingMark}
                onChange={(e) => setEditCeilingMark(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
              <Button onClick={handleUpdateSection} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Typography align="center">Loading exam details...</Typography>
      )}
    </div>
  );
};

export default ExamSectionPage;
