import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
} from "@mui/material";
import CreateInternalExam from "./addInternalExam";

export const InternalExamList = () => {
  const [exams, setExams] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openCreateExamDialog, setOpenCreateExamDialog] = useState(false); // Manage the state for Create Exam dialog
  const [batchForCreateExam, setBatchForCreateExam] = useState(null); // To store the selected batch for creating exam
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");

  // Fetch faculty batches on initial render
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/faculty-batches/",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setBatches(data);
      } catch (error) {
        console.error("Error fetching faculty batches:", error);
      }
    };

    fetchBatches();

    // Fetch internal exams only when faculty batches are already fetched
    const fetchExams = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/get-internal-exams/",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setExams(data);
      } catch (error) {
        console.error("Error fetching internal exams:", error);
      }
    };

    fetchExams();
  }, [accessToken]); // Only trigger fetches on initial render

  // Fetch faculty batches when dialog opens
  const handleOpenDialog = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/faculty-batches/",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setBatches(data);
      setOpenDialog(true);
    } catch (error) {
      console.error("Error fetching faculty batches:", error);
    }
  };

  // Handle selecting a batch and opening the create exam dialog
  const handleProceed = () => {
    if (selectedBatch) {
      setBatchForCreateExam(selectedBatch); // Set the selected batch
      setOpenDialog(false); // Close the current dialog
      setOpenCreateExamDialog(true); // Open the Create Exam dialog
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Header Section with Button on the Right */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">My Internal Exams</Typography>
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          Create Question Paper
        </Button>
      </Box>

      {/* Grid for displaying exams */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 2,
        }}
      >
        {exams.map((exam) => (
          <Card key={exam.int_exam_id} sx={{ minHeight: 140 }}>
            <CardContent>
              <Typography variant="h6">{exam.exam_name}</Typography>
              <Typography>Duration: {exam.duration} mins</Typography>
              <Typography>Max Marks: {exam.max_marks}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Dialog for selecting batch */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Select a Batch</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: "500px", p: 2 }}>
            <Select
              fullWidth
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
            >
              {batches.map((batch) => (
                <MenuItem key={batch.batch_id} value={batch.batch_id}>
                  {batch.course__title} - {batch.year} (Part {batch.part})
                </MenuItem>
              ))}
            </Select>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleProceed} // Open the next dialog on proceed
            variant="contained"
            disabled={!selectedBatch}
          >
            Proceed
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Internal Exam Dialog */}
      <CreateInternalExam
        open={openCreateExamDialog}
        onClose={() => setOpenCreateExamDialog(false)} // Close the dialog
        batchId={batchForCreateExam} // Pass the selected batch ID
      />
    </Box>
  );
};
