import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { AssignmentTurnedIn } from "@mui/icons-material"; // MUI Icon

export const TeacherDashboard = () => {
  const [batches, setBatches] = useState([]);
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

  // Function to handle navigation
  const handleConductExam = (batchId) => {
    navigate(`/internal-exam/${batchId}`);
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
          <Card key={batch.batch_id} sx={{ minHeight: 150, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <CardContent>
              <Typography variant="h6">{batch.course__title}</Typography>
              <Typography>Year: {batch.year}</Typography>
              <Typography>Part: {batch.part}</Typography>
              <Typography>Status: {batch.active ? "Active" : "Inactive"}</Typography>
            </CardContent>
            <Button
              variant="contained"
              startIcon={<AssignmentTurnedIn />} 
              sx={{ m: 2 }}
              onClick={() => handleConductExam(batch.batch_id)}
            >
              Conduct Internal Exam
            </Button>
          </Card>
        ))}
      </Box>
    </>
  );
};
