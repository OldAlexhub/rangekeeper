import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Toast } from "bootstrap";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const DataEntry = () => {
  const toastRef = useRef();
  const [toastMessage, setToastMessage] = useState("");
  const [toastClass, setToastClass] = useState("bg-success");
  const [dataEntries, setDataEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const userId = localStorage.getItem("userId");
  const fullRange = localStorage.getItem("fullRange");

  const [formData, setFormData] = useState({
    userId: userId || "",
    fullRange: fullRange || "",
    currentRange: "",
    currentPercent: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_PYTHON}/submit`,
        {
          userId: formData.userId,
          fullRange: formData.fullRange,
          currentRange: formData.currentRange.trim(),
          currentPercent: formData.currentPercent.trim(),
        }
      );

      if (response.status === 200) {
        setToastMessage("Data submitted successfully.");
        setToastClass("bg-success");
        new Toast(toastRef.current).show();
        setFormData({ ...formData, currentRange: "" });
        fetchData();
      }
    } catch (error) {
      console.error("Submission error:", error);
      setToastMessage("Failed to submit data.");
      setToastClass("bg-danger");
      new Toast(toastRef.current).show();
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_LINK}/getData/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDataEntries(response.data.data || []);
    } catch (error) {
      console.error("Data fetch error:", error);
    }
  };

  const handleDelete = async (entryId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_LINK}/deleteDataById/${entryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setToastMessage("Entry deleted.");
        setToastClass("bg-warning");
        new Toast(toastRef.current).show();
        fetchData();
      }
    } catch (error) {
      console.error("Delete error:", error);
      setToastMessage("Failed to delete entry.");
      setToastClass("bg-danger");
      new Toast(toastRef.current).show();
    }
  };

  const exportData = (format = "xlsx") => {
    const worksheet = XLSX.utils.json_to_sheet(
      dataEntries.map((entry) => ({
        Date: new Date(entry.date).toLocaleString(),
        "Current Range": entry.currentRange,
        "Full Range": entry.fullRange,
        "Adjusted Full Range": entry.currentFullRange,
        "Lost Miles": entry.lostMiles,
        "Battery Health %": entry.batteryHealth,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Battery Data");

    const fileBuffer = XLSX.write(workbook, {
      bookType: format,
      type: "array",
    });

    const fileType =
      format === "csv"
        ? "text/csv;charset=utf-8;"
        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

    const file = new Blob([fileBuffer], { type: fileType });
    saveAs(file, `battery_data.${format}`);
  };

  const filteredEntries = dataEntries.filter((entry) =>
    Object.values(entry)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const currentRows = filteredEntries.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredEntries.length / rowsPerPage);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="container my-5">
      <div className="card p-4 shadow mb-5">
        <h4 className="mb-3">Enter Your Current Battery Range & Percentage</h4>
        <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
          Only one entry per day is allowed to ensure cleaner and more accurate
          data inputs.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Current Range (mi)</label>
            <input
              type="number"
              name="currentRange"
              value={formData.currentRange}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. 240"
              required
            />
            <label className="form-label mt-3">Current Percentage</label>
            <input
              type="number"
              name="currentPercent"
              value={formData.currentPercent}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. 85"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Submit
          </button>
        </form>
      </div>

      {dataEntries.length > 0 && (
        <div className="card p-4 shadow">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Your Submitted Entries</h5>
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                onClick={() => exportData("csv")}
                className="btn btn-outline-secondary btn-sm"
              >
                Download CSV
              </button>
              <button
                onClick={() => exportData("xlsx")}
                className="btn btn-outline-success btn-sm"
              >
                Download Excel
              </button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-striped text-center">
              <thead className="table-dark text-center">
                <tr>
                  <th>Date</th>
                  <th>Current Range</th>
                  <th>Full Range</th>
                  <th>Adjusted Full Range</th>
                  <th>Lost Miles</th>
                  <th>Battery Health %</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {currentRows.map((entry, index) => (
                  <tr key={index}>
                    <td>{new Date(entry.date).toLocaleString()}</td>
                    <td>{entry.currentRange}</td>
                    <td>{entry.fullRange}</td>
                    <td>{entry.currentFullRange}</td>
                    <td>{entry.lostMiles}</td>
                    <td>{entry.batteryHealth}%</td>
                    <td>
                      <button
                        onClick={() => handleDelete(entry._id)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <nav className="mt-3">
                <ul className="pagination justify-content-center">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i}
                      className={`page-item ${
                        currentPage === i + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </div>
      )}

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
    </div>
  );
};

export default DataEntry;
