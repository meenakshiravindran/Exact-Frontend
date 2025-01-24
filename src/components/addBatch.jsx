import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const BatchForm = () => {
  const [formData, setFormData] = useState({
    course: "",
    faculty_id: "",
    year: "",
    part: "",
    active: false,
  });

  const [errors, setErrors] = useState({});
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);

  // Fetch faculties and courses on component mount
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await axios.get("http://localhost:8000/get-faculty/");
        setFaculties(response.data);
      } catch (error) {
        console.error("Error fetching faculties:", error);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8000/get-courses/");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchFaculties();
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/add-batch/", formData);
      alert("Batch created successfully.");
      setFormData({
        course: "",
        faculty_id: "",
        year: "",
        part: "",
        active: false,
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
      <h2 className="text-center mb-4">Add Batch</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        <div className="mb-3">
          <label htmlFor="course" className="form-label">
            Course
          </label>
          <select
            className={`form-select ${errors.course ? "is-invalid" : ""}`}
            id="course"
            name="course"
            value={formData.course}
            onChange={handleChange}
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.course_id} value={course.course_id}>
                {course.course_code}
              </option>
            ))}
          </select>
          {errors.course && <div className="invalid-feedback">{errors.course}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="faculty_id" className="form-label">
            Faculty
          </label>
          <select
            className={`form-select ${errors.faculty_id ? "is-invalid" : ""}`}
            id="faculty_id"
            name="faculty_id"
            value={formData.faculty_id}
            onChange={handleChange}
          >
            <option value="">Select Faculty</option>
            {faculties.map((faculty) => (
              <option key={faculty.faculty_id} value={faculty.faculty_id}>
                {faculty.name}
              </option>
            ))}
          </select>
          {errors.faculty_id && <div className="invalid-feedback">{errors.faculty_id}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="year" className="form-label">
            Year
          </label>
          <input
            type="number"
            className={`form-control ${errors.year ? "is-invalid" : ""}`}
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
          />
          {errors.year && <div className="invalid-feedback">{errors.year}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="part" className="form-label">
            Part
          </label>
          <input
            type="text"
            className={`form-control ${errors.part ? "is-invalid" : ""}`}
            id="part"
            name="part"
            value={formData.part}
            onChange={handleChange}
          />
          {errors.part && <div className="invalid-feedback">{errors.part}</div>}
        </div>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="active"
            name="active"
            checked={formData.active}
            onChange={handleChange}
          />
          <label htmlFor="active" className="form-check-label">
            Active
          </label>
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

export default BatchForm;
