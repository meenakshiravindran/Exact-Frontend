// import axios from "axios";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Container,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Button,
//   Alert,
// } from "@mui/material";

// // Define the Login component
// export const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null); // Handle error messages
//   const navigate = useNavigate();

//   // Handle form submission
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError(null); // Reset error state

//     const user = { username, password };

//     try {
//       // Send POST request for authentication
//       const { data } = await axios.post("http://localhost:8000/token/", user, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//         withCredentials: true, // Include credentials (cookies)
//       });

//       // Store tokens in localStorage
//       localStorage.clear();
//       localStorage.setItem("access_token", data.access);
//       localStorage.setItem("refresh_token", data.refresh);
//       axios.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;

//       // Redirect after successful login
//       navigate("/");
//     } catch (error) {
//       console.error("Error during login:", error);
//       setError("Invalid username or password. Please try again.");
//     }
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         minHeight: "90vh", // Full screen height
//         padding: 2, // Padding for small screens
//       }}
//     >
//       <Container maxWidth="xs">
//         <Card
//           elevation={1}
//         >
//           <CardContent>
//             <Typography variant="h5" component="h1" align="center" gutterBottom>
//               Sign In
//             </Typography>

//             {error && (
//               <Alert severity="error" sx={{ marginBottom: 2 }}>
//                 {error}
//               </Alert>
//             )}

//             <form onSubmit={handleLogin}>
//               {/* Username Field */}
//               <TextField
//                 id="username"
//                 label="Username"
//                 variant="outlined"
//                 fullWidth
//                 margin="normal"
//                 value={username}
//                 required
//                 onChange={(e) => setUsername(e.target.value)}
//               />

//               {/* Password Field */}
//               <TextField
//                 id="password"
//                 label="Password"
//                 type="password"
//                 variant="outlined"
//                 fullWidth
//                 margin="normal"
//                 value={password}
//                 required
//                 onChange={(e) => setPassword(e.target.value)}
//               />

//               {/* Submit Button */}
//               <Button
//                 type="submit"
//                 variant="contained"
//                 color="primary"
//                 fullWidth
//               >
//                 Sign In
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </Container>
//     </Box>
//   );
// };

// export default Login;
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../stores/store"; // Import login action
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Use dispatch to interact with Redux

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const user = { username, password };

    try {
      const { data } = await axios.post("http://localhost:8000/token/", user, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      // Store tokens in localStorage
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;

      // Update isAuth in Redux store
      dispatch(login());

      // Redirect to home page
      navigate("/");
    } catch (error) {
      console.error("Error during login:", error);
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "90vh",
        padding: 2,
      }}
    >
      <Container maxWidth="xs">
        <Card elevation={1}>
          <CardContent>
            <Typography variant="h5" component="h1" align="center" gutterBottom>
              Sign In
            </Typography>

            {error && (
              <Alert severity="error" sx={{ marginBottom: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleLogin}>
              <TextField
                id="username"
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
              />

              <TextField
                id="password"
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit" variant="contained" color="primary" fullWidth>
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
