import axios from "axios";

let refresh = false;

// Axios interceptor to handle token refresh
axios.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    if (error.response && error.response.status === 401 && !refresh) {
      refresh = true; // Set the refresh flag to avoid multiple refresh calls

      try {
        // Refresh the token
        const response = await axios.post(
          "http://localhost:8000/token/refresh/",
          {
            refresh: localStorage.getItem("refresh_token"),
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          // Update the tokens in localStorage and Axios headers
          const newAccessToken = response.data.access;
          const newRefreshToken = response.data.refresh;

          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          localStorage.setItem("access_token", newAccessToken);
          localStorage.setItem("refresh_token", newRefreshToken);

          // Retry the original request with the new token
          return axios(error.config);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Handle token refresh failure (e.g., log out the user)
        localStorage.clear();
        window.location.href = "/login";
      } finally {
        refresh = false; // Reset the refresh flag
      }
    }

    refresh = false; // Reset the refresh flag if the error isn't handled
    return Promise.reject(error); // Reject the error to handle it elsewhere
  }
);
