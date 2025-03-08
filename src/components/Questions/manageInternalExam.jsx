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
  const [exams, setExams] = useState([]);
  const [batches, setBatches] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openCreateExamDialog, setOpenCreateExamDialog] = useState(false);
  const [batchForCreateExam, setBatchForCreateExam] = useState(null);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examRes, batchRes] = await Promise.all([
          axios.get("http://localhost:8000/get-internal-exams/", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get("http://localhost:8000/faculty-batches/", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);

        setExams(examRes.data);
        setBatches(batchRes.data);

        const combined = examRes.data.map((exam, index) => ({
          ...exam,
          batch: batchRes.data[index % batchRes.data.length],
        }));

        setCombinedData(combined);
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
      await axios.delete(`http://localhost:8000/delete-internal-exam/${examId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCombinedData(combinedData.filter((exam) => exam.int_exam_id !== examId));
    } catch (error) {
      console.error("Error deleting exam:", error);
    }
  };

  return (
    <Container maxWidth="100vw" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
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

      {combinedData.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="100%"
          py={6}
        >
          <NoDataIcon sx={{ fontSize: 80, color: "gray" }} /> {/* No data icon */}
          <Typography variant="h6" color="text.secondary" mt={2}>
            No internal exams found.
          </Typography>
        </Box>
      ) : (
        <Box display="flex" flexWrap="wrap" gap={3}>
          {combinedData.map((exam) => (
            <Card
              key={exam.int_exam_id}
              sx={{
                width: "100%",
                maxWidth: 345,
                display: "flex",
                flexDirection: "column",
                transition: "0.3s",
                "&:hover": { transform: "translateY(-5px)", boxShadow: 4 },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>{exam.exam_name}</Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {exam.batch.course__title}
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                  <SchoolIcon fontSize="small" sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body2">Year: {exam.batch.year}, Part: {exam.batch.part}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: "secondary.main" }} />
                  <Typography variant="body2">Duration: {exam.duration} mins</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <GradeIcon fontSize="small" sx={{ mr: 1, color: "success.main" }} />
                  <Typography variant="body2">Max Marks: {exam.max_marks}</Typography>
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
          ))}
        </Box>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Select a Batch</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: "100%", p: 2 }}>
            <Select fullWidth value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
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
          <Button onClick={handleProceed} variant="contained" disabled={!selectedBatch}>
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
