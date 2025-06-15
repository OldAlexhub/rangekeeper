import { Outlet, Link } from "react-router-dom";
import logo from "../Images/logo.png";
import { useAuth } from "../components/AuthContext";

const Layout = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img
              src={logo}
              alt="RangeKeeper Logo"
              style={{ height: "40px", marginRight: "10px" }}
            />
            RangeKeeper
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/tryme">
                  Try Me
                </Link>
              </li>
              {isLoggedIn && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/dataentry">
                      Data Entry
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="container my-4 flex-grow-1">
        <Outlet />
      </div>

      {/* FOOTER */}
      <footer className="bg-dark text-white text-center py-3">
        <div className="container">
          <small>
            © {new Date().getFullYear()} RangeKeeper by Olahverse Systems. All
            rights reserved.
          </small>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
