import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const ExamPreview = ({ previewData }) => {
  if (!previewData) {
    return <CircularProgress />;
  }

  return (
    <Box mt={3}>
      <Typography variant="h6">Exam Preview</Typography>
      <img 
        src={`data:image/png;base64,${previewData}`} 
        alt="Exam Preview" 
        style={{ width: '100%', border: '1px solid #ddd' }}
      />
    </Box>
  );
};

export default ExamPreview;