import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { MathJaxContext, MathJax } from "better-react-mathjax";
import {
  InsertPhotoOutlined,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
} from "@mui/icons-material";

const QuestionForm = () => {
  const [question, setQuestion] = useState("");
  const [preview, setPreview] = useState(false);
  const [image, setImage] = useState(null);
  const [isLatexMode, setIsLatexMode] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const togglePreview = () => {
    setPreview(!preview);
    if (!preview && isLatexMode) {
      generateLatexImage();
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleLatexToggle = () => {
    setIsLatexMode(!isLatexMode);
  };

  const generateLatexImage = async () => {
    setLoading(true);
    try {
      const latexDocument = `
        \\documentclass{article}
        \\usepackage{amsmath}
        \\begin{document}
        ${question}
        \\end{document}
      `;

      const response = await fetch("https://latexonline.cc/compile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ source: latexDocument, format: "pdf" }),
      });

      if (!response.ok) throw new Error("Failed to compile LaTeX");

      const pdfBlob = await response.blob();
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Convert PDF to an image (using a client-side approach)
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const pdfImage = new Image();
      pdfImage.src = pdfUrl;
      pdfImage.onload = () => {
        canvas.width = pdfImage.width;
        canvas.height = pdfImage.height;
        ctx.drawImage(pdfImage, 0, 0);
        setImage(canvas.toDataURL("image/png"));
      };
    } catch (error) {
      console.error("Error generating LaTeX image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 2, padding: 2, height: "100%" }}>
      {/* Left Side - Question Form */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h5" gutterBottom>
          Add Question
        </Typography>

        {/* LaTeX Mode Toggle */}
        <FormControlLabel
          control={<Switch checked={isLatexMode} onChange={handleLatexToggle} />}
          label="Use LaTeX Mode"
          sx={{ marginBottom: 2 }}
        />

        {/* Text Formatting Options */}
        <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
          <IconButton onClick={() => setQuestion(question + "\\textbf{}")}>
            <FormatBold />
          </IconButton>
          <IconButton onClick={() => setQuestion(question + "\\textit{}")}>
            <FormatItalic />
          </IconButton>
          <IconButton onClick={() => setQuestion(question + "\\underline{}")}>
            <FormatUnderlined />
          </IconButton>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="image-upload"
            onChange={handleImageUpload}
          />
          <label htmlFor="image-upload">
            <IconButton component="span">
              <InsertPhotoOutlined />
            </IconButton>
          </label>
        </Box>

        {/* Text Area for Question */}
        <TextField
          label={
            isLatexMode
              ? "Enter Question (Use LaTeX for formulas)"
              : "Enter Question (Plain Text)"
          }
          multiline
          fullWidth
          rows={6}
          value={question}
          onChange={handleQuestionChange}
          variant="outlined"
          sx={{ marginBottom: 2 }}
        />

        {/* Image Preview */}
        {image && (
          <Box sx={{ marginBottom: 2 }}>
            <img
              src={image}
              alt="Generated LaTeX"
              style={{ maxWidth: "100%", maxHeight: "300px" }}
            />
          </Box>
        )}

        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="contained" onClick={togglePreview}>
            {preview ? "Edit" : "Preview"}
          </Button>
          <Button variant="contained" color="primary">
            Submit Question
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
          }}
        >
          <Typography variant="h6">Preview:</Typography>
          {isLatexMode ? (
            <MathJaxContext version={1}>
              <MathJax>{question}</MathJax>
            </MathJaxContext>
          ) : (
            <Typography>{question}</Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default QuestionForm;
