// // Import the React JS packages
// import { useEffect, useState } from "react";
// import axios from "axios";

// // Define the Home function
// export const Home = () => {
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     // Check if the access token is available in localStorage
//     const accessToken = localStorage.getItem("access_token");

//     if (!accessToken) {
//       // Redirect to login page if no access token is found
//       window.location.href = "/login";
//     } else {
//       // Make an authenticated API request
//       (async () => {
//         try {
//           const { data } = await axios.get("http://localhost:8000/home/", {
//             headers: {
//               "Content-Type": "application/json",
//               "Authorization": `Bearer ${accessToken}`, // Add Authorization header
//             },
//           });
//           setMessage(data.message); // Set the message received from the API
//         } catch (error) {
//           console.error("User not authenticated or token invalid:", error);
//           // Redirect to login if there's an authentication issue
//           window.location.href = "/login";
//         }
//       })();
//     }
//   }, []);

//   return (
//     <div className="form-signin mt-5 text-center">
//       <h3>Hi {message}</h3>
//     </div>
//   );
// };

import { useEffect, useState } from "react";
import axios from "axios";

export const Home = () => {
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      window.location.href = "/login"; // Redirect to login page if no access token
    } else {
      // First, get the home message or greeting (optional)
      (async () => {
        try {
          const { data } = await axios.get("http://localhost:8000/user-profile/", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setMessage(`Hi ${data.username}`); // Display the username
          setRole(data.role);
        } catch (error) {
          console.error("Error fetching home message:", error);
        }
      })();
    }
  }, []);

  return (
    <div className="form-signin mt-5 text-center">
      <h3>{message}</h3> {/* Display the greeting message */}
      {role && <p>Your role is: {role}</p>} {/* Display the user's role */}
    </div>
  );
};
