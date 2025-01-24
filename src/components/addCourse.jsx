import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const CourseForm = () => {
  const [formData, setFormData] = useState({
    course_code: "",
    dept: "",
    semester: "",
    credits: "",
    no_of_cos: "",
    programme: "",
    syllabus_year: "",
  });

  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [programmes, setProgrammes] = useState([]);

  // Fetch departments and programmes on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:8000/get-department/");
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    const fetchProgrammes = async () => {
      try {
        const response = await axios.get("http://localhost:8000/get-programme/");
        setProgrammes(response.data);
      } catch (error) {
        console.error("Error fetching programmes:", error);
      }
    };

    fetchDepartments();
    fetchProgrammes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/add-course/", formData);
      alert("Course created successfully.");
      setFormData({
        course_code: "",
        dept: "",
        semester: "",
        credits: "",
        no_of_cos: "",
        programme: "",
        syllabus_year: "",
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
      <h2 className="text-center mb-4">Add Course</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        <div className="mb-3">
          <label htmlFor="course_code" className="form-label">
            Course Code
          </label>
          <input
            type="text"
            className={`form-control ${errors.course_code ? "is-invalid" : ""}`}
            id="course_code"
            name="course_code"
            value={formData.course_code}
            onChange={handleChange}
          />
          {errors.course_code && <div className="invalid-feedback">{errors.course_code}</div>}
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
          <label htmlFor="semester" className="form-label">
            Semester
          </label>
          <input
            type="number"
            className={`form-control ${errors.semester ? "is-invalid" : ""}`}
            id="semester"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
          />
          {errors.semester && <div className="invalid-feedback">{errors.semester}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="credits" className="form-label">
            Credits
          </label>
          <input
            type="number"
            className={`form-control ${errors.credits ? "is-invalid" : ""}`}
            id="credits"
            name="credits"
            value={formData.credits}
            onChange={handleChange}
          />
          {errors.credits && <div className="invalid-feedback">{errors.credits}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="no_of_cos" className="form-label">
            Number of COs
          </label>
          <input
            type="number"
            className={`form-control ${errors.no_of_cos ? "is-invalid" : ""}`}
            id="no_of_cos"
            name="no_of_cos"
            value={formData.no_of_cos}
            onChange={handleChange}
          />
          {errors.no_of_cos && <div className="invalid-feedback">{errors.no_of_cos}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="programme" className="form-label">
            Programme
          </label>
          <select
            className={`form-select ${errors.programme ? "is-invalid" : ""}`}
            id="programme"
            name="programme"
            value={formData.programme}
            onChange={handleChange}
          >
            <option value="">Select Programme</option>
            {programmes.map((prog) => (
              <option key={prog.programme_id} value={prog.programme_id}>
                {prog.programme_name}
              </option>
            ))}
          </select>
          {errors.programme && <div className="invalid-feedback">{errors.programme}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="syllabus_year" className="form-label">
            Syllabus Year
          </label>
          <input
            type="number"
            className={`form-control ${errors.syllabus_year ? "is-invalid" : ""}`}
            id="syllabus_year"
            name="syllabus_year"
            value={formData.syllabus_year}
            onChange={handleChange}
          />
          {errors.syllabus_year && <div className="invalid-feedback">{errors.syllabus_year}</div>}
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

export default CourseForm;
