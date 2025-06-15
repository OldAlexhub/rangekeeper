import React from "react";
import Layout from "../components/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../routes/Home";
import Signup from "../routes/Signup";
import Tryme from "../routes/TryMe";
import Dashboard from "../routes/Dashboard";
import DataEntry from "../routes/DataEntry";
import Prediction from "../routes/Prediction";
import ProtectedRoute from "../components/ProtectedRoute";

const RouteManager = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="signup" element={<Signup />} />
          <Route path="tryme" element={<Tryme />} />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="dataentry"
            element={
              <ProtectedRoute>
                <DataEntry />
              </ProtectedRoute>
            }
          />
          <Route
            path="prediction"
            element={
              <ProtectedRoute>
                <Prediction />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RouteManager;
