import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Card, CardContent, IconButton, Tooltip } from "@mui/material";
import { AssignmentTurnedIn } from "@mui/icons-material"; 
import CreateInternalExam from "../Questions/addInternalExam";

export const TeacherDashboard = () => {
  const [batches, setBatches] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBatchId, setCurrentBatchId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    (async () => {
      try {
        const batchResponse = await axios.get("http://localhost:8000/faculty-batches/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setBatches(batchResponse.data);
      } catch (error) {
        console.error("Error fetching assigned batches:", error);
      }
    })();
  }, []);

  const handleOpenDialog = (batchId) => {
    setCurrentBatchId(batchId);
    setOpenDialog(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog
  };

  return (
    <>
      <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
        Assigned Batches
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 2,
        }}
      >
        {batches.map((batch) => (
          <Card
            key={batch.batch_id}
            sx={{
              minHeight: 150,
              display: "flex",
              flexDirection: "column",
              position: "relative", // Needed for absolute positioning
            }}
          >
            {/* Conduct Exam Button (Subtle) */}
            <Tooltip title="Conduct Internal Exam">
              <IconButton
                onClick={() => handleOpenDialog(batch.batch_id)}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  color: "primary.main",
                  backgroundColor: "rgba(0, 0, 0, 0.04)", // Light background
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.1)", // Darker hover effect
                  },
                }}
              >
                <AssignmentTurnedIn />
              </IconButton>
            </Tooltip>

            <CardContent>
              <Typography variant="h6">{batch.course__title}</Typography>
              <Typography>Year: {batch.year}</Typography>
              <Typography>Part: {batch.part}</Typography>
              <Typography>Status: {batch.active ? "Active" : "Inactive"}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Dialog for Creating Internal Exam */}
      <CreateInternalExam
        open={openDialog}
        onClose={handleCloseDialog}
        batchId={currentBatchId}
      />
    </>
  );
};
