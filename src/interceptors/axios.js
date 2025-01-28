import axios from "axios";
axios.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config; // Save the original request

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Avoid infinite retries

      try {
        console.log("Refreshing token...");

        // Refresh the access token
        const response = await axios.post(
          "http://localhost:8000/token/refresh/",
          {
            refresh: localStorage.getItem("refresh_token"),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          console.log("Token refresh successful");

          // Update the access token in localStorage and Axios headers
          const newAccessToken = response.data.access;
          const newRefreshToken = response.data.refresh;

          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          localStorage.setItem("access_token", newAccessToken);
          localStorage.setItem("refresh_token", newRefreshToken);


          // Retry the original request with the new token
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Handle token refresh failure (e.g., log out the user)
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
