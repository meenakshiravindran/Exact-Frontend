import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { TeacherDashboard } from "./Dashboard/TeacherDashboard";

export const Home = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    setRole(localStorage.getItem("role"));
    setName(localStorage.getItem("full_name"));

    if (!accessToken) {
      window.location.href = "/login"; // Redirect to login page if no access token
    } else {
      
    }
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome Back, {name}
      </Typography>

      {/* Render different dashboards based on role */}
      {role === "teacher" ? <TeacherDashboard /> : ""}
    </Box>
  );
};

