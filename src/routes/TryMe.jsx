import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const TryMe = () => {
  const [manufacturerRange, setManufacturerRange] = useState("");
  const [currentPercent, setCurrentPercent] = useState("");
  const [currentRange, setCurrentRange] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [result, setResult] = useState(null);

  const calculate = (e) => {
    e.preventDefault();

    const mfr = parseFloat(manufacturerRange);
    const percent = parseFloat(currentPercent);
    const current = parseFloat(currentRange);
    const year = parseInt(vehicleYear);
    const currentYear = new Date().getFullYear();
    const batteryAge = currentYear - year;

    const estFull = (current / percent) * 100;
    const lost = mfr - estFull;
    const lostPercent = (lost / mfr) * 100;

    let health = "Good";
    if (lostPercent > 10 && lostPercent <= 20) health = "Fair";
    else if (lostPercent > 20) health = "Poor";

    // Age commentary
    let ageComment = "";
    if (batteryAge <= 1)
      ageComment = "Very new — you should see minimal degradation.";
    else if (batteryAge <= 3)
      ageComment = "Battery should still be in great shape.";
    else if (batteryAge <= 5) ageComment = "Mild degradation is common.";
    else ageComment = "Battery aging may now significantly impact performance.";

    // Benchmark comparison
    let benchmark = "within the expected range";
    if (lostPercent > 20 && batteryAge <= 3)
      benchmark = "higher than expected for this age";
    else if (lostPercent < 5 && batteryAge >= 5)
      benchmark = "better than average for its age";

    // Warranty insight
    let warrantyNote =
      batteryAge >= 8
        ? "⚠️ Your battery may be outside typical warranty coverage (8 years)."
        : `Your battery is approximately ${batteryAge} years old and may still be under warranty.`;

    // Recommendation
    let recommendation = "";
    if (health === "Good")
      recommendation = "✅ Keep up the good charging habits.";
    else if (health === "Fair")
      recommendation =
        "⚠️ Consider reducing fast-charging and avoid deep discharges.";
    else
      recommendation = "❗ We recommend a professional battery checkup soon.";

    setResult({
      estFull: estFull.toFixed(2),
      lost: lost.toFixed(2),
      lostPercent: lostPercent.toFixed(2),
      health,
      vehicleYear: year,
      batteryAge,
      ageComment,
      benchmark,
      warrantyNote,
      recommendation,
    });
  };

  const healthColor = {
    Good: "success",
    Fair: "warning",
    Poor: "danger",
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-3">🔋 Try the RangeKeeper Estimator</h1>
        <p className="text-muted">
          Enter your EV details to estimate battery health and range
          degradation.
        </p>
      </div>

      <div className="row justify-content-center align-items-start g-5">
        {/* FORM */}
        <div className="col-lg-5">
          <div className="card border-0 shadow rounded-4 p-4">
            <h4 className="mb-4 text-center fw-semibold">
              Enter Your Battery Info
            </h4>
            <form onSubmit={calculate}>
              <div className="form-floating mb-3">
                <input
                  type="number"
                  className="form-control"
                  id="manufacturerRange"
                  value={manufacturerRange}
                  onChange={(e) => setManufacturerRange(e.target.value)}
                  placeholder="Manufacturer Full Range"
                  required
                />
                <label htmlFor="manufacturerRange">
                  Manufacturer Full Range (mi/km)
                </label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="number"
                  className="form-control"
                  id="currentPercent"
                  value={currentPercent}
                  onChange={(e) => setCurrentPercent(e.target.value)}
                  placeholder="Current Battery %"
                  max={100}
                  min={1}
                  required
                />
                <label htmlFor="currentPercent">Current Battery %</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="number"
                  className="form-control"
                  id="currentRange"
                  value={currentRange}
                  onChange={(e) => setCurrentRange(e.target.value)}
                  placeholder="Current Range"
                  required
                />
                <label htmlFor="currentRange">
                  Current Estimated Range (mi/km)
                </label>
              </div>

              <div className="form-floating mb-4">
                <input
                  type="number"
                  className="form-control"
                  id="vehicleYear"
                  value={vehicleYear}
                  onChange={(e) => setVehicleYear(e.target.value)}
                  placeholder="Vehicle Year"
                  min="2000"
                  max={new Date().getFullYear()}
                  required
                />
                <label htmlFor="vehicleYear">Vehicle Year</label>
              </div>

              <button
                className="btn btn-primary w-100 fw-bold py-2"
                type="submit"
              >
                🚗 Calculate
              </button>
            </form>
          </div>
        </div>

        {/* RESULTS */}
        {result && (
          <div className="col-lg-5">
            <div
              className="card border-0 shadow rounded-4 p-4 animate__animated animate__fadeIn"
              style={{ background: "#f8f9fa" }}
            >
              <h4 className="mb-4 text-center fw-semibold">
                📊 Your Battery Snapshot
              </h4>

              <h6 className="text-muted">Your Input</h6>
              <ul className="list-unstyled mb-3">
                <li>🔹 Manufacturer Range: {manufacturerRange} mi/km</li>
                <li>🔹 Battery %: {currentPercent}%</li>
                <li>🔹 Current Range: {currentRange} mi/km</li>
                <li>🚙 Vehicle Year: {result.vehicleYear}</li>
              </ul>

              <h6 className="text-muted">Calculated Results</h6>
              <ul className="list-unstyled">
                <li>
                  ✅ Estimated 100% Range:{" "}
                  <strong>{result.estFull} mi/km</strong>
                </li>
                <li>
                  📉 Range Lost: <strong>{result.lost} mi/km</strong>
                </li>
                <li>
                  🧪 Degradation:{" "}
                  <span className={`badge bg-${healthColor[result.health]}`}>
                    {result.lostPercent}% ({result.health})
                  </span>
                </li>
              </ul>

              <div className="alert alert-info mt-4">{result.ageComment}</div>
              <div className="alert alert-light border-start border-4 ps-3 mb-2">
                📊 You are <strong>{result.benchmark}</strong> for a{" "}
                {result.batteryAge}-year-old battery.
              </div>
              <div className="alert alert-secondary mb-2">
                🛡️ {result.warrantyNote}
              </div>
              <div className="alert alert-success">{result.recommendation}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TryMe;
