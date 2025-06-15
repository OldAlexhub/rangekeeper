import { useState, useRef } from "react";
import logo from "../Images/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toast } from "bootstrap";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fullRange: "",
    modelYear: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const toastRef = useRef();
  const [toastMessage, setToastMessage] = useState("");
  const [toastClass, setToastClass] = useState("bg-success");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_LINK}/signup`,
        formData
      );
      if (response.status === 201) {
        setToastMessage("Signup successful! Redirecting...");
        setToastClass("bg-success");
        new Toast(toastRef.current).show();

        setTimeout(() => navigate("/"), 3000);
      }
    } catch (error) {
      setToastMessage("Signup failed. Please try again.");
      setToastClass("bg-danger");
      new Toast(toastRef.current).show();

      console.error("Signup error:", error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow rounded"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <form onSubmit={handleSignup}>
          <div className="text-center mb-4">
            <img
              src={logo}
              alt="RangeKeeper logo"
              style={{ width: "150px", borderRadius: "10%" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="firstName"
              className="form-control"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="lastName"
              className="form-control"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Full Range (miles)</label>
            <input
              type="number"
              name="fullRange"
              className="form-control"
              value={formData.fullRange}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Model Year</label>
            <input
              type="number"
              name="modelYear"
              className="form-control"
              value={formData.modelYear}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>
        </form>
        <div
          className="position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 11 }}
        >
          <div
            ref={toastRef}
            className={`toast align-items-center text-white ${toastClass}`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="d-flex">
              <div className="toast-body">{toastMessage}</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                data-bs-dismiss="toast"
                aria-label="Close"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
