import React from "react";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

const ExamPreview = ({ previewData }) => {
  if (!previewData) {
    return <CircularProgress />;
  }
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <Box mt={3}>
      <Box sx={{display:"flex", justifyContent:"space-between"}}>
        <Typography variant="h6">Exam Preview</Typography>
        <Button onClick={() => reactToPrintFn()}>Print</Button>
      </Box>

      <img
        ref={contentRef}
        src={`data:image/png;base64,${previewData}`}
        alt="Exam Preview"
        style={{ width: "100%", border: "1px solid #ddd" }}
      />
    </Box>
  );
};

export default ExamPreview;
