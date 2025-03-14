import { useEffect, useState } from "react";
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
  Container,
} from "@mui/material";
import {
  Add as AddIcon,
  School as SchoolIcon,
  AccessTime as AccessTimeIcon,
  Grade as GradeIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  SentimentDissatisfied as NoDataIcon,
} from "@mui/icons-material";
import CreateInternalExam from "./addInternalExam";

export const InternalExamList = () => {
  const [data, setData] = useState([]); // Combined API response
  const [selectedBatch, setSelectedBatch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openCreateExamDialog, setOpenCreateExamDialog] = useState(false);
  const [batchForCreateExam, setBatchForCreateExam] = useState(null);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/faculty-batches-exams/",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [accessToken]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleProceed = () => {
    if (selectedBatch) {
      setBatchForCreateExam(selectedBatch);
      setOpenDialog(false);
      setOpenCreateExamDialog(true);
    }
  };

  const handleViewExam = (examId) => {
    navigate(`/exam-section/${examId}`);
  };

  const handleDeleteExam = async (examId) => {
    try {
      await axios.delete(
        `http://localhost:8000/delete-internal-exam/${examId}/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setData((prevData) =>
        prevData.map((batch) => ({
          ...batch,
          exams: batch.exams.filter((exam) => exam.int_exam_id !== examId),
        }))
      );
    } catch (error) {
      console.error("Error deleting exam:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">My Internal Exams</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenDialog}
          startIcon={<AddIcon />}
          sx={{ borderRadius: 20 }}
        >
          Create Question Paper
        </Button>
      </Box>

      {data.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="100%"
          py={6}
        >
          <NoDataIcon sx={{ fontSize: 80, color: "gray" }} />
          <Typography variant="h6" color="text.secondary" mt={2}>
            No internal exams found.
          </Typography>
        </Box>
      ) : (
        data.map((batch) => (
          <Box key={batch.batch_id} mb={4}>
            <Typography variant="h6" gutterBottom>
              {batch.course_title} - {batch.year} (Part {batch.part})
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={3}>
              {batch.exams.length === 0 ? (
                <Typography color="text.secondary">No exams found</Typography>
              ) : (
                batch.exams.map((exam) => (
                  <Card
                    key={exam.int_exam_id}
                    sx={{
                      width: "100%",
                      maxWidth: 345,
                      display: "flex",
                      flexDirection: "column",
                      transition: "0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {exam.exam_name}
                      </Typography>
                      <Box display="flex" alignItems="center" mb={1}>
                        <AccessTimeIcon
                          fontSize="small"
                          sx={{ mr: 1, color: "secondary.main" }}
                        />
                        <Typography variant="body2">
                          Duration: {exam.duration} mins
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mb={2}>
                        <GradeIcon
                          fontSize="small"
                          sx={{ mr: 1, color: "success.main" }}
                        />
                        <Typography variant="body2">
                          Max Marks: {exam.max_marks}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="flex-start" gap={0.5}>
                        <Button
                          variant="text"
                          color="secondary"
                          onClick={() => handleViewExam(exam.int_exam_id)}
                          sx={{ minWidth: "40px", padding: "8px" }}
                        >
                          <VisibilityIcon />
                        </Button>
                        <Button
                          variant="text"
                          color="error"
                          onClick={() => handleDeleteExam(exam.int_exam_id)}
                          sx={{ minWidth: "40px", padding: "4px" }}
                        >
                          <DeleteIcon />
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))
              )}
            </Box>
          </Box>
        ))
      )}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Select a Batch</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: "100%", p: 2 }}>
            <Select
              fullWidth
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
            >
              {data.map((batch) => (
                <MenuItem key={batch.batch_id} value={batch.batch_id}>
                  {batch.course_title} - {batch.year} (Part {batch.part})
                </MenuItem>
              ))}
            </Select>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleProceed}
            variant="contained"
            disabled={!selectedBatch}
          >
            Proceed
          </Button>
        </DialogActions>
      </Dialog>

      <CreateInternalExam
        open={openCreateExamDialog}
        onClose={() => setOpenCreateExamDialog(false)}
        batchId={batchForCreateExam}
      />
    </Container>
  );
};

export default InternalExamList;
