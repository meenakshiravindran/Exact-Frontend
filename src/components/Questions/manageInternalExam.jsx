import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
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
  useTheme,
  useMediaQuery,
} from "@mui/material"
import {
  Add as AddIcon,
  School as SchoolIcon,
  AccessTime as AccessTimeIcon,
  Grade as GradeIcon,
} from "@mui/icons-material"
import CreateInternalExam from "./addInternalExam"

export const InternalExamList = () => {
  const [exams, setExams] = useState([])
  const [batches, setBatches] = useState([])
  const [combinedData, setCombinedData] = useState([])
  const [selectedBatch, setSelectedBatch] = useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const [openCreateExamDialog, setOpenCreateExamDialog] = useState(false)
  const [batchForCreateExam, setBatchForCreateExam] = useState(null)
  const navigate = useNavigate()
  const accessToken = localStorage.getItem("access_token")

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // Fetch exams and batches
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
        ])

        setExams(examRes.data)
        setBatches(batchRes.data)

        // Combine exams with batch data (assuming each exam has a batch_id field)
        const combined = examRes.data.map((exam, index) => ({
          ...exam,
          batch: batchRes.data[index % batchRes.data.length], // Distribute exams among batches
        }))

        setCombinedData(combined)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [accessToken])

  // Open batch selection dialog
  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  // Handle selecting a batch and opening the create exam dialog
  const handleProceed = () => {
    if (selectedBatch) {
      setBatchForCreateExam(selectedBatch)
      setOpenDialog(false)
      setOpenCreateExamDialog(true)
    }
  }

  return (
    <Container maxWidth="100vw" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          My Internal Exams
        </Typography>
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

      {/* Box for Exam Cards */}
      <Box display="flex" flexWrap="wrap" gap={3}>
        {combinedData.map((exam) => (
          <Card
            key={exam.int_exam_id}
            sx={{
              width: "100%",
              maxWidth: 345,
              height: "auto",
              display: "flex",
              flexDirection: "column",
              transition: "0.3s",
              "&:hover": { transform: "translateY(-5px)", boxShadow: 4 },
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="h2" gutterBottom>
                {exam.exam_name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {exam.batch.course__title}
              </Typography>
              <Box display="flex" alignItems="center" mb={1}>
                <SchoolIcon fontSize="small" sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="body2">
                  Year: {exam.batch.year}, Part: {exam.batch.part}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: "secondary.main" }} />
                <Typography variant="body2">Duration: {exam.duration} mins</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <GradeIcon fontSize="small" sx={{ mr: 1, color: "success.main" }} />
                <Typography variant="body2">Max Marks: {exam.max_marks}</Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Batch Selection Dialog */}
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

      {/* Create Internal Exam Dialog */}
      <CreateInternalExam
        open={openCreateExamDialog}
        onClose={() => setOpenCreateExamDialog(false)}
        batchId={batchForCreateExam}
      />
    </Container>
  )
}
