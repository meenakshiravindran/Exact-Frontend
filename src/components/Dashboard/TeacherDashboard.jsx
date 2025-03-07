"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Container,
  CircularProgress,
  Paper,
  useTheme,
  alpha,
} from "@mui/material"
import { AssignmentTurnedIn, School, Class as ClassIcon } from "@mui/icons-material"
import CreateInternalExam from "../Questions/addInternalExam"

export const TeacherDashboard = () => {
  const [batches, setBatches] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [currentBatchId, setCurrentBatchId] = useState(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const theme = useTheme()

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token")

    const fetchBatches = async () => {
      try {
        setLoading(true)
        const batchResponse = await axios.get("http://localhost:8000/faculty-batches/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        setBatches(batchResponse.data)
      } catch (error) {
        console.error("Error fetching assigned batches:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBatches()
  }, [])

  const handleOpenDialog = (batchId) => {
    setCurrentBatchId(batchId)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    )
  }

  return (
    <Container maxWidth="xl" >
      <Box
      >
        <Typography
          variant="h3"
          sx={{
            mb: 4,
            color: "primary.main",
          }}
        >
          Assigned Batches
        </Typography>

        {batches.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            py={8}
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              borderRadius: 2,
            }}
          >
            <School sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" color="text.secondary">
              No batches assigned yet
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 3,
            }}
          >
            {batches.map((batch) => (
              <Card
                key={batch.batch_id}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ClassIcon sx={{ fontSize: 24, color: "primary.main", mr: 1 }} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: "primary.main",
                    }}
                  >
                    {batch.course__title}
                  </Typography>
                </Box>
                <CardContent sx={{ flex: 1, p: 3 }}>
                  <Box sx={{ color: "text.secondary", mb: 2 }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      Year: {batch.year}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      Part: {batch.part}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: batch.active ? "success.main" : "error.main",
                        fontWeight: "medium",
                      }}
                    >
                      Status: {batch.active ? "Active" : "Inactive"}
                    </Typography>
                  </Box>

                  <Tooltip title="Conduct Internal Exam" placement="top">
                    <IconButton
                      onClick={() => handleOpenDialog(batch.batch_id)}
                      sx={{
                        position: "absolute",
                        bottom: 16,
                        right: 16,
                        color: "primary.main",
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        "&:hover": {
                          backgroundColor: alpha(theme.palette.primary.main, 0.2),
                          transform: "scale(1.1)",
                        },
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      <AssignmentTurnedIn />
                    </IconButton>
                  </Tooltip>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      <CreateInternalExam open={openDialog} onClose={handleCloseDialog} batchId={currentBatchId} />
    </Container>
  )
}

