import * as React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { Login } from "./login";

export default function LoginPage() {
  return (
    <Box sx={{ height: "100vh", width: "100vw", backgroundColor: "#f5f7fa" }}>
      {/* Header Section */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "white",
          padding: "1rem 2rem",
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          sx={{
            fontFamily: "sans-serif",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          EXACT
        </Typography>
      </Box>

      {/* Main Content Section */}
      <Box
        sx={{
          display: "flex",
          height: "calc(100vh - 64px)", // Adjust for header height
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" }, // Responsive layout
            justifyContent: "center",
            alignItems: "center",
            width: "80%", // Adjust width to control spacing
          }}
        >
          {/* Left Section */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              display:{sm:"none",md:"block"},//Dont displa tehis text on mobile screen
              mb: { xs: 4, md: 0 }, // Add margin for smaller screens
            }}
          >
            <Typography
              sx={{
                fontFamily: "sans-serif",
                fontSize: "50px",
                textAlign: "left",
              }}
            >
              Crafting Questions, Shaping Minds
              <br />
              <span style={{ color: "purple", fontSize: "48px"}}>
              where exams meet precision. 
              </span>
            </Typography>
          </Box>

          {/* Right Section */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Login />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
