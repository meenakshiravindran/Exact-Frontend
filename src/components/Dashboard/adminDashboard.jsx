import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Class as ClassIcon,
  Group as GroupIcon,
  Layers as LayersIcon,
  Business as BusinessIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const AdminDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    faculty: 0,
    courses: 0,
    batches: 0,
    students: 0,
    levels: 0,
    programmes: 0,
  });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/dashboard-stats/")
      .then((response) => response.json())
      .then((data) => setStats(data))
      .catch((error) => console.error("Error fetching stats:", error));
  }, []);

  const dashboardItems = [
    {
      title: "Faculty Members",
      count: stats.faculty,
      icon: PersonIcon,
      color: "#2196f3",
      description: "Manage teaching staff",
      link: "/manage-faculties",
    },
    {
      title: "Courses",
      count: stats.courses,
      icon: SchoolIcon,
      color: "#4caf50",
      description: "View and edit courses",
      link: "/manage-courses",
    },
    {
      title: "Batches",
      count: stats.batches,
      icon: ClassIcon,
      color: "#ff9800",
      description: "Manage student batches",
      link: "/manage-batches",
    },
    {
      title: "Students",
      count: stats.students,
      icon: GroupIcon,
      color: "#f44336",
      description: "Student administration",
      link: "/manage-students",
    },
    {
      title: "Levels",
      count: stats.levels,
      icon: LayersIcon,
      color: "#673ab7",
      description: "Academic levels available",
      link: null, // No add button for Levels
    },
    {
      title: "Programmes",
      count: stats.programmes,
      icon: BusinessIcon,
      color: "#009688",
      description: "List of academic programmes",
      link: "/manage-programmes",
    },
  ];

  return (
    <Box>
      <Box display="flex" flexWrap="wrap" gap={3} justifyContent="center">
        {dashboardItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Box
              key={item.title}
              sx={{
                width: { xs: "100%", sm: "48%", md: "30%" },
                display: "flex",
              }}
            >
              <Card
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: theme.shadows[3],
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: alpha(item.color, 0.1),
                        borderRadius: "50%",
                        p: 1,
                        display: "flex",
                      }}
                    >
                      <IconComponent sx={{ fontSize: 32, color: item.color }} />
                    </Box>
                    {item.link && (
                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor: alpha(item.color, 0.1),
                          "&:hover": {
                            backgroundColor: alpha(item.color, 0.2),
                          },
                        }}
                        onClick={() => navigate(item.link)}
                      >
                        <AddIcon sx={{ color: item.color }} />
                      </IconButton>
                    )}
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                    {item.count}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};