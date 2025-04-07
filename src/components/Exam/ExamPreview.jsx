import React, { useMemo } from "react";
import {
  Root,
  Pages,
  Page,
  CanvasLayer,
  TextLayer,
} from "@anaralabs/lector";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Paper,
} from "@mui/material";
import { GlobalWorkerOptions } from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";

// Set up the PDF.js worker
GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

const ExamPreview = ({ previewData, examDetails }) => {
  const blobUrl = useMemo(() => {
    if (!previewData) return null;
    const binary = atob(previewData);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return URL.createObjectURL(new Blob([bytes.buffer], { type: "application/pdf" }));
  }, [previewData]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${previewData}`;
    link.download = `${examDetails.exam_name} - ${examDetails.course_name} .pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!previewData) return <CircularProgress />;

  return (
    <Box p={2}>
      <Box
        mb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h6">Preview</Typography>
        <Button variant="contained" onClick={handleDownload}>
          Download PDF
        </Button>
      </Box>

      <Paper
        elevation={3}
        sx={{
          width: "100%",
          height: "auto",
          overflow: "hidden",
          bgcolor: "background.paper",
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
        }}
      >
        <Root
          source={blobUrl}
          loader={
            <Box p={2}>
              <Typography>Loading PDF...</Typography>
            </Box>
          }
          onError={() => (
            <Box p={2}>
              <Typography color="error">
                Oops! Failed to load PDF 😬
              </Typography>
            </Box>
          )}
        >
          <Pages>
            <Page>
              <CanvasLayer />
              <TextLayer />
            </Page>
          </Pages>
        </Root>
      </Paper>
    </Box>
  );
};

export default ExamPreview;
