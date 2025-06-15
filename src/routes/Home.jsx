import { Link, useNavigate } from "react-router-dom";
import imageOne from "../Images/1.jpg";
import imageTwo from "../Images/2.png";
import imageThree from "../Images/3.jpg";
import imageFour from "../Images/4.webp";
import imageFive from "../Images/5.jpg";
import axios from "axios";
import { useState, useRef } from "react";
import { Toast } from "bootstrap";
import { useAuth } from "../components/AuthContext"; // ✅ use context

const Home = () => {
  const navigate = useNavigate();
  const toastRef = useRef();
  const [toastMessage, setToastMessage] = useState("");
  const [toastClass, setToastClass] = useState("bg-success");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { isLoggedIn, setIsLoggedIn } = useAuth(); // ✅ context values

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const payload = {
      email: formData.email.trim(),
      password: formData.password.trim(),
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_LINK}/login`,
        payload
      );

      if (response.status === 200) {
        const { name, token, userId, range } = response.data;
        localStorage.setItem("name", name);
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("fullRange", range);

        setToastMessage("Login successful! Redirecting...");
        setToastClass("bg-success");
        new Toast(toastRef.current).show();
        setIsLoggedIn(true); // ✅ update context

        setTimeout(() => navigate("/dashboard"), 3000);
      }
    } catch (error) {
      setToastMessage("Login failed. Check your credentials.");
      setToastClass("bg-danger");
      new Toast(toastRef.current).show();
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false); // ✅ update context
    setToastMessage("You have been logged out.");
    setToastClass("bg-info");
    new Toast(toastRef.current).show();
  };

  return (
    <main className="container-fluid px-4">
      {/* HERO SECTION */}
      <div className="row align-items-center mt-5 mb-5">
        <div className="col-lg-7">
          <h1 className="display-4 fw-bold">Welcome to RangeKeeper</h1>
          <p className="lead">
            Track, Predict, and Extend the Range of Your Electric Vehicle with
            AI-Powered Insights.
          </p>
          <p>
            RangeKeeper uses advanced Machine Learning to monitor your EV’s
            battery performance over time. Whether you're keeping tabs on lost
            range, predicting degradation, or ensuring warranty compliance,
            we've got you covered.
          </p>
          <img
            src={imageFour}
            alt="EV monitoring dashboard"
            className="img-fluid rounded shadow mt-3"
            style={{ borderRadius: "10%" }}
          />
        </div>

        {/* LOGIN OR LOGOUT CARD */}
        <div className="col-lg-5 mt-4 mt-lg-0">
          {!isLoggedIn ? (
            <div className="card shadow p-4">
              <h4 className="mb-4 text-center">Login to Your Account</h4>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-dark w-100">
                  Login
                </button>
              </form>
              <div className="mt-3 text-center">
                <small>
                  Don’t have an account? <Link to="/signup">Sign up</Link>
                </small>
              </div>
            </div>
          ) : (
            <div className="card shadow p-4 text-center">
              <h5 className="mb-3">
                You are logged in as {localStorage.getItem("name")}
              </h5>
              <button onClick={handleLogout} className="btn btn-danger w-100">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="row text-center py-5 bg-light">
        <div className="col-md-4 mb-4">
          <img
            src={imageOne}
            alt="Battery Insights"
            className="mb-3"
            style={{ width: "120px", height: "100px", borderRadius: "10%" }}
          />
          <h5>Battery Health Insights</h5>
          <p>
            Track battery health using AI models trained on real-world
            degradation patterns.
          </p>
        </div>
        <div className="col-md-4 mb-4">
          <img
            src={imageTwo}
            alt="Range Forecasting"
            className="mb-3"
            style={{ width: "120px", height: "100px", borderRadius: "10%" }}
          />
          <h5>Range Forecasting</h5>
          <p>
            Use ML to forecast your range based on driving behavior, charging
            habits, and environmental factors.
          </p>
        </div>
        <div className="col-md-4 mb-4">
          <img
            src={imageThree}
            alt="Warranty Monitoring"
            className="mb-3"
            style={{ width: "120px", height: "100px", borderRadius: "10%" }}
          />
          <h5>Warranty Monitoring</h5>
          <p>
            Compare current battery performance to manufacturer warranty
            thresholds.
          </p>
        </div>
      </div>

      {/* AI/ML SECTION */}
      <div className="row justify-content-center align-items-center my-5">
        <div className="col-lg-6 mb-4 mb-lg-0">
          <img
            src={imageFive}
            alt="Role of AI in EV Battery Technology"
            className="img-fluid rounded-4 shadow"
            style={{ maxHeight: "450px", objectFit: "cover", width: "100%" }}
          />
        </div>
        <div className="col-lg-6">
          <h3 className="fw-bold mb-3">How We Use AI/ML</h3>
          <p className="mb-3">
            Our system uses supervised learning models to detect early signs of
            battery wear. With historical training data and user-specific
            inputs, we build predictive curves for:
          </p>
          <ul className="list-unstyled">
            <li className="mb-2">• Daily and seasonal range fluctuations</li>
            <li className="mb-2">• Loss of range per charging cycle</li>
            <li className="mb-2">• Probability of future performance drops</li>
            <li className="mb-2">• Abnormal degradation triggers</li>
          </ul>
          <div className="mt-4">
            <p className="text-muted">
              Curious how it works? Try our free battery health calculator — no
              login needed.
            </p>
            <Link
              to="/tryme"
              className="btn btn-outline-primary fw-semibold mt-2"
            >
              🔍 Try It Without an Account
            </Link>
          </div>
        </div>
      </div>

      {/* MAIN CTA */}
      <div className="text-center my-5">
        <h4>Want full access to personalized tracking & AI insights?</h4>
        <p className="text-muted">
          Sign up to unlock the full dashboard experience.
        </p>
        <Link to="/signup" className="btn btn-primary mt-2">
          Create Your Account
        </Link>
      </div>

      {/* TOAST FEEDBACK */}
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
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
    </main>
  );
};

export default Home;
