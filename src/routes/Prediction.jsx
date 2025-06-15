import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
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

const Prediction = () => {
  const [predictionData, setPredictionData] = useState([]);
  const userId = localStorage.getItem("userId");
  const chartRefs = useRef({});

  const fetchPredictions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_LINK}/getpredictions/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPredictionData(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch predictions:", error);
    }
  };

  const refreshPredictionData = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_PYTHON}/forecast/${userId}`);
      fetchPredictions();
    } catch (error) {
      console.error("Failed to refresh prediction data:", error);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, [userId]);

  const formatDate = (dateStr) => new Date(dateStr).toISOString().split("T")[0];

  const generateChartData = (dataSlice, color = "#4bc0c0") => ({
    labels: dataSlice.map((entry) => formatDate(entry.date)),
    datasets: [
      {
        label: "Predicted Range",
        data: dataSlice.map((entry) => entry.predictedRange),
        fill: false,
        borderColor: color,
        tension: 0.3,
      },
    ],
  });

  const downloadChartAsPNG = (refName) => {
    const chartNode = chartRefs.current[refName];
    if (!chartNode) return;

    html2canvas(chartNode).then((canvas) => {
      canvas.toBlob((blob) => {
        if (blob) saveAs(blob, `${refName}.png`);
      });
    });
  };

  const downloadCSV = () => {
    const headers = ["date", "predictedRange"];
    const rows = predictionData.map((d) => [
      formatDate(d.date),
      d.predictedRange,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "prediction_data.csv");
  };

  return (
    <div className="container my-5">
      <div className="card shadow p-4 mb-4">
        <h2 className="mb-3">AI Forecasts</h2>
        <p className="text-muted" style={{ fontSize: "0.9rem" }}>
          As more data is entered, the accuracy of predictions will improve as
          the AI becomes more familiar with your unique EV usage patterns.
        </p>
        <div className="mb-3">
          <button
            className="btn btn-outline-primary me-2"
            onClick={() => downloadChartAsPNG("overallChart")}
          >
            Download Overall Chart PNG
          </button>
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => downloadChartAsPNG("recentChart")}
          >
            Download Recent Chart PNG
          </button>
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => downloadChartAsPNG("snapshotChart")}
          >
            Download Snapshot Chart PNG
          </button>
          <button
            className="btn btn-outline-success me-2"
            onClick={downloadCSV}
          >
            Download CSV
          </button>
          <button
            className="btn btn-outline-info"
            onClick={refreshPredictionData}
          >
            Refresh Prediction Data
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-12 mb-4">
          <div
            className="card shadow p-4"
            ref={(el) => (chartRefs.current.overallChart = el)}
          >
            <h5 className="mb-3">Overall Predicted Range</h5>
            <Line data={generateChartData(predictionData)} />
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div
            className="card shadow p-4"
            ref={(el) => (chartRefs.current.recentChart = el)}
          >
            <h6 className="mb-3">Recent 7 Days Forecast</h6>
            <Line
              data={generateChartData(predictionData.slice(0, 7), "#ff6384")}
            />
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div
            className="card shadow p-4"
            ref={(el) => (chartRefs.current.snapshotChart = el)}
          >
            <h6 className="mb-3">Upcoming Forecast Snapshot</h6>
            <Line
              data={generateChartData(predictionData.slice(-7), "#36a2eb")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prediction;
