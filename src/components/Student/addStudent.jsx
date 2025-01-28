import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const StudentForm = () => {
  const [formData, setFormData] = useState({
    register_no: "",
    name: "",
    programme: "",
    year_of_admission: "",
    phone_number: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [programmes, setProgrammes] = useState([]);

  // Fetch programmes on component mount
  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const response = await axios.get("http://localhost:8000/get-programme/");
        setProgrammes(response.data);
      } catch (error) {
        console.error("Error fetching programmes:", error);
      }
    };

    fetchProgrammes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/add-student/", formData);
      alert("Student created successfully.");
      setFormData({
        register_no: "",
        name: "",
        programme: "",
        year_of_admission: "",
        phone_number: "",
        email: "",
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
      <h2 className="text-center mb-4">Add Student</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        <div className="mb-3">
          <label htmlFor="register_no" className="form-label">
            Register Number
          </label>
          <input
            type="text"
            className={`form-control ${errors.register_no ? "is-invalid" : ""}`}
            id="register_no"
            name="register_no"
            value={formData.register_no}
            onChange={handleChange}
          />
          {errors.register_no && <div className="invalid-feedback">{errors.register_no}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
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
              <option key={prog.programme_id} value={prog.programme_name}>
                {prog.programme_name}
              </option>
            ))}
          </select>
          {errors.programme && <div className="invalid-feedback">{errors.programme}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="year_of_admission" className="form-label">
            Year of Admission
          </label>
          <input
            type="number"
            className={`form-control ${errors.year_of_admission ? "is-invalid" : ""}`}
            id="year_of_admission"
            name="year_of_admission"
            value={formData.year_of_admission}
            onChange={handleChange}
          />
          {errors.year_of_admission && <div className="invalid-feedback">{errors.year_of_admission}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="phone_number" className="form-label">
            Phone Number
          </label>
          <input
            type="text"
            className={`form-control ${errors.phone_number ? "is-invalid" : ""}`}
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />
          {errors.phone_number && <div className="invalid-feedback">{errors.phone_number}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
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

export default StudentForm;
