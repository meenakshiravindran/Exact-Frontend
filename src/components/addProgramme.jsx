import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ProgrammeForm = () => {
  const [formData, setFormData] = useState({
    programme_name: "",
    dept: "",
    no_of_pos: "",
    level: "",
    duration: "",
  });

  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [levels, setLevels] = useState([]);

  // Fetch departments and levels on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:8000/get-department/");
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    const fetchLevels = async () => {
      try {
        const response = await axios.get("http://localhost:8000/get-level/");
        setLevels(response.data);
      } catch (error) {
        console.error("Error fetching levels:", error);
      }
    };

    fetchDepartments();
    fetchLevels();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/add-programme/", formData);
      alert("Programme created successfully.");
      setFormData({
        programme_name: "",
        dept: "",
        no_of_pos: "",
        level: "",
        duration: "",
      });
      setErrors({});
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Add Programme</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        <div className="mb-3">
          <label htmlFor="programme_name" className="form-label">
            Programme Name
          </label>
          <input
            type="text"
            className={`form-control ${errors.programme_name ? "is-invalid" : ""}`}
            id="programme_name"
            name="programme_name"
            value={formData.programme_name}
            onChange={handleChange}
          />
          {errors.programme_name && <div className="invalid-feedback">{errors.programme_name}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="dept" className="form-label">
            Department
          </label>
          <select
            className={`form-select ${errors.dept ? "is-invalid" : ""}`}
            id="dept"
            name="dept"
            value={formData.dept}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.dept_id} value={dept.dept_id}>
                {dept.dept_name}
              </option>
            ))}
          </select>
          {errors.dept && <div className="invalid-feedback">{errors.dept}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="no_of_pos" className="form-label">
            Number of POs
          </label>
          <input
            type="number"
            className={`form-control ${errors.no_of_pos ? "is-invalid" : ""}`}
            id="no_of_pos"
            name="no_of_pos"
            value={formData.no_of_pos}
            onChange={handleChange}
          />
          {errors.no_of_pos && <div className="invalid-feedback">{errors.no_of_pos}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="level" className="form-label">
            Level
          </label>
          <select
            className={`form-select ${errors.level ? "is-invalid" : ""}`}
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
          >
            <option value="">Select Level</option>
            {levels.map((level) => (
              <option key={level.level_id} value={level.level_name}>
                {level.level_name}
              </option>
            ))}
          </select>
          {errors.level && <div className="invalid-feedback">{errors.level}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="duration" className="form-label">
            Duration (in years)
          </label>
          <input
            type="number"
            className={`form-control ${errors.duration ? "is-invalid" : ""}`}
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
          />
          {errors.duration && <div className="invalid-feedback">{errors.duration}</div>}
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProgrammeForm;
