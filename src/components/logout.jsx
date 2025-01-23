import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../stores/store";
import axios from "axios";
export const Logout = () => {
  const dispatch = useDispatch(); // Use dispatch to interact with Redux
  useEffect(() => {
    (async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const { data } = await axios.post(
          "http://localhost:8000/logout/",
          {
            refresh_token: localStorage.getItem("refresh_token"),
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        );
        dispatch(logout());
        localStorage.clear();
        axios.defaults.headers.common["Authorization"] = null;
        window.location.href = "/login";
      } catch (e) {
        console.log("logout not working", e);
      }
    })();
  }, []);
  return <div></div>;
};
