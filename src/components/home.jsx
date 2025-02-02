"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Fade,
  useTheme,
  alpha,
} from "@mui/material";
import { TeacherDashboard } from "./Dashboard/TeacherDashboard";
import { Person as PersonIcon } from "@mui/icons-material";

export const Home = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const initializeUser = () => {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        window.location.href = "/login";
        return;
      }

      setRole(localStorage.getItem("role"));
      setName(localStorage.getItem("full_name"));
      setLoading(false);
    };

    initializeUser();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor={theme.palette.background.default}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Fade in={!loading} timeout={800}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: theme.palette.background.default,
          pt: { xs: 2, sm: 3, md: 4 },
          pb: { xs: 4, sm: 5, md: 6 },
        }}
      >
        <Container maxWidth="xl">
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              mb: 4,
              borderRadius: 2,
              backgroundColor: "sienna",
              display: "flex",
              backgroundImage: "linear-gradient(to bottom, #360235, #210122)",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  color: "primary.main",
                  mb: 1,
                  fontSize: {
                    xs: "2rem",
                    sm: "2.5rem",
                    md: "3rem",
                  },
                }}
              >
                Welcome Back,
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: "white",
                  fontWeight: 500,
                  fontSize: {
                    xs: "1.5rem",
                    sm: "1.75rem",
                    md: "2rem",
                  },
                }}
              >
                {name}
              </Typography>
            </Box>
            <Box
              sx={{
                mt: { xs: 3, sm: 0 },
                bgcolor: alpha(theme.palette.background.paper, 0.8),
                borderRadius: "50%",
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PersonIcon
                sx={{
                  fontSize: { xs: 40, sm: 50, md: 60 },
                  color: "primary.main",
                }}
              />
            </Box>
          </Paper>

          <Fade in={true} timeout={1200}>
            <Box>
              {role === "teacher" ? (
                <TeacherDashboard />
              ) : (
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 2,
                    bgcolor: theme.palette.background.paper,
                  }}
                >
                  <Typography
                    variant="h5"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    No dashboard available for this role
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Please contact your administrator for more information.
                  </Typography>
                </Paper>
              )}
            </Box>
          </Fade>
        </Container>
      </Box>
    </Fade>
  );
};
