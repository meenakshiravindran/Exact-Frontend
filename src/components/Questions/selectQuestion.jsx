import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
} from "@mui/material";
import axios from "axios";
import katex from "katex";
import "katex/dist/katex.min.css";

const SelectQuestion = ({ open, onClose, section, onSelectQuestions, existingSelectedQuestions }) => {
    const [questions, setQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState(existingSelectedQuestions || []);
    const [marksPerQuestion, setMarksPerQuestion] = useState(null);

    useEffect(() => {
      if (!open) return; // Fetch only when dialog opens
  
      const calculateMarksPerQuestion = () => {
        if (section.ceilingMark && section.numToAnswer) {
          return section.ceilingMark / section.numToAnswer;
        } else {
          return null;
        }
      };

      const fetchQuestions = async () => {
        const calculatedMarksPerQuestion = calculateMarksPerQuestion();
        if (!calculatedMarksPerQuestion) {
          console.error("Invalid ceilingMark or numToAnswer");
          return; // Handle error if invalid
        }

        setMarksPerQuestion(calculatedMarksPerQuestion);
        try {
          console.log("Fetching questions for section:", section.id);
          const response = await axios.get("http://localhost:8000/questions/by-marks", {
            params: { marks: calculatedMarksPerQuestion },
          });
          setQuestions(response.data);
        } catch (error) {
          console.error("Error fetching questions:", error);
        }
      };
  
      fetchQuestions();
    }, [open, section]);

    useEffect(() => {
      // Reset selected questions when the section changes
      setSelectedQuestions(existingSelectedQuestions || []);
    }, [section, open]);

    const handleToggle = (question) => {
        setSelectedQuestions((prev) => {
          if (prev.some((q) => q.question_id === question.question_id)) {
            // Remove if already selected
            return prev.filter((q) => q.question_id !== question.question_id);
          } else {
            // Prevent selection if the limit is reached
            if (prev.length >= section.numQuestions) {
              alert(`You can only select up to ${section.numQuestions} questions.`);
              return prev;
            }
            return [...prev, question]; // Add if not selected
          }
        });
      };
      
  
    const handleSubmit = async () => {
      try {
        // Get the list of selected question IDs
        const selectedIds = selectedQuestions.map((q) => q.question_id);
  
        // Send the list to the backend
        await axios.post("http://localhost:8000/add-exam-questions/", {
          section_id: section.id,
          question_ids: selectedIds, // Only send the selected questions' IDs
        });
  
        // Also update the section with selected questions
        onSelectQuestions();
        onClose();
      } catch (error) {
        console.error("Error adding questions:", error);
      }
    };
  
    const renderLatex = (latex) => {
      try {
        return katex.renderToString(latex.replace(/\$/g, ""));
      } catch (e) {
        console.error("Error rendering LaTeX:", e);
        return latex;
      }
    };
  
    const renderQuestionText = (text) => {
      const latexMatches = text.match(/\$.*?\$/g);
      let renderedText = text;
  
      if (latexMatches) {
        latexMatches.forEach((latex) => {
          const renderedLatex = renderLatex(latex);
          renderedText = renderedText.replace(latex, `<span class="katex">${renderedLatex}</span>`);
        });
      }
  
      return <span dangerouslySetInnerHTML={{ __html: renderedText }} />;
    };
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Select Questions for {section.name}</DialogTitle>
        <DialogContent>
          <List>
            {questions.map((question) => (
              <ListItem key={question.question_id} button onClick={() => handleToggle(question)}>
                <Checkbox
                  checked={selectedQuestions.some((q) => q.question_id === question.question_id)}
                  onChange={() => handleToggle(question)}
                />
                <ListItemText
                  primary={renderQuestionText(question.question_text)}
                  secondary={`Marks: ${question.marks}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default SelectQuestion;
