import React, { useState } from 'react';
import { Button, TextField, Typography, Box, IconButton, Switch, FormControlLabel } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { MathJaxContext, MathJax } from 'better-react-mathjax';  // Import MathJaxContext and MathJax
import { InsertPhotoOutlined, FormatBold, FormatItalic, FormatUnderlined } from '@mui/icons-material';

const QuestionForm = () => {
  const [question, setQuestion] = useState('');
  const [preview, setPreview] = useState(false);
  const [image, setImage] = useState(null);
  const [isLatexMode, setIsLatexMode] = useState(true); // State for LaTeX mode toggle

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const togglePreview = () => {
    setPreview(!preview);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));  // Display the image
    }
  };

  const handleLatexToggle = () => {
    setIsLatexMode(!isLatexMode);  // Toggle LaTeX mode
  };

  return (
    <Box sx={{ padding: 2 }}>
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
      <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item>
          <IconButton onClick={() => setQuestion(question + '\\textbf{}')}><FormatBold /></IconButton>
        </Grid>
        <Grid item>
          <IconButton onClick={() => setQuestion(question + '\\textit{}')}><FormatItalic /></IconButton>
        </Grid>
        <Grid item>
          <IconButton onClick={() => setQuestion(question + '\\underline{}')}><FormatUnderlined /></IconButton>
        </Grid>
        <Grid item>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            id="image-upload"
            onChange={handleImageUpload}
          />
          <label htmlFor="image-upload">
            <IconButton component="span"><InsertPhotoOutlined /></IconButton>
          </label>
        </Grid>
      </Grid>

      {/* Text Area for Question */}
      <TextField
        label={isLatexMode ? "Enter Question (Use LaTeX for formulas)" : "Enter Question (Plain Text)"}
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
          <img src={image} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '300px' }} />
        </Box>
      )}

      {/* Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" onClick={togglePreview}>
          {preview ? 'Edit' : 'Preview'}
        </Button>
        <Button variant="contained" color="primary">
          Submit Question
        </Button>
      </Box>

      {/* Preview */}
      {preview && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6">Preview:</Typography>
          
          {/* Conditional Rendering of LaTeX or Plain Text */}
          {isLatexMode ? (
            <MathJaxContext version={1}>
              <MathJax>
                {question}  {/* Render LaTeX here */}
              </MathJax>
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
