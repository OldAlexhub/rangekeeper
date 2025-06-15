import React from "react";
import RouteManager from "./RouteManager/RouteManager";
import { AuthProvider } from "./components/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <RouteManager />
    </AuthProvider>
  );
};

export default App;
