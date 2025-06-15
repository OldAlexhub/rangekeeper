import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Line } from "react-chartjs-2";
import html2canvas from "html2canvas";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [dataEntries, setDataEntries] = useState([]);
  const [filters, setFilters] = useState({});
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const token = localStorage.getItem("token");

    if (!storedName) {
      navigate("/");
    } else {
      setName(storedName);
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_LINK}/getData/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDataEntries(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [navigate, userId]);

  const filterDataBy = (key) => {
    const grouped = {};
    const filter = filters[key] || "all";

    for (let entry of dataEntries) {
      const date = new Date(entry.date);
      let groupKey = "";

      if (filter === "month") {
        groupKey = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
      } else if (filter === "year") {
        groupKey = `${date.getFullYear()}`;
      } else if (filter === "day") {
        groupKey = date.toISOString().split("T")[0];
      } else {
        groupKey = date.toISOString().split("T")[0];
      }

      if (!grouped[groupKey]) grouped[groupKey] = [];
      grouped[groupKey].push(entry[key]);
    }

    return Object.entries(grouped).map(([label, values]) => ({
      label,
      value: values.reduce((a, b) => a + b, 0) / values.length,
    }));
  };

  const metrics = [
    { key: "currentRange", label: "Current Range" },
    { key: "fullRange", label: "Full Range" },
    { key: "currentFullRange", label: "Adjusted Full Range" },
    { key: "lostMiles", label: "Lost Miles" },
    { key: "batteryHealth", label: "Battery Health %" },
  ];

  const createChartData = (key, label) => {
    const filtered = filterDataBy(key);
    return {
      labels: filtered.map((entry) => entry.label),
      datasets: [
        {
          label,
          data: filtered.map((entry) => entry.value),
          fill: false,
          borderColor: "#4bc0c0",
          tension: 0.3,
        },
      ],
    };
  };

  const downloadChart = (id) => {
    const chart = document.getElementById(id);
    if (!chart) return;
    html2canvas(chart).then((canvas) => {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = `${id}.png`;
      link.click();
    });
  };

  const handleForecastRedirect = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.get(`${process.env.REACT_APP_PYTHON}/forecast/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/prediction");
    } catch (error) {
      console.error("Forecast fetch failed:", error);
      navigate("/prediction");
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow p-4 mb-4">
        <h2 className="mb-3">Welcome, {name || "there"} 👋</h2>
        <p className="lead">
          Track your EV battery health and insights over time.
        </p>
        <Link to="/dataentry" className="btn btn-primary me-2">
          Update Battery Data
        </Link>
        <button
          onClick={handleForecastRedirect}
          className="btn btn-outline-secondary"
        >
          Go to AI Forecasts
        </button>
      </div>

      <div className="row">
        {metrics.map(({ key, label }) => (
          <div className="col-md-6 mb-4" key={key}>
            <div className="card shadow p-3 h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">{label}</h6>
                <button
                  className="btn btn-sm btn-outline-dark"
                  onClick={() => downloadChart(`${key}Chart`)}
                >
                  Download
                </button>
              </div>
              <div className="mb-2">
                {[
                  ["day", "Daily"],
                  ["month", "Monthly"],
                  ["year", "Yearly"],
                  ["all", "All"],
                ].map(([f, labelText]) => (
                  <button
                    key={f}
                    className={`btn btn-sm me-1 ${
                      filters[key] === f
                        ? "btn-primary"
                        : "btn-outline-secondary"
                    }`}
                    onClick={() => setFilters({ ...filters, [key]: f })}
                  >
                    {labelText}
                  </button>
                ))}
              </div>
              <div
                className="chart-container"
                style={{
                  height: "300px",
                  overflowX: "auto",
                  overflowY: "hidden",
                }}
              >
                <Line id={`${key}Chart`} data={createChartData(key, label)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
