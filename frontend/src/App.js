import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AddReview from "./components/add-review";
import Login from "./components/login";
import Register from "./components/register";
import RestaurantsList from "./components/restaurants-list";
import Restaurant from "./components/restaurants";

function App() {
  const [user, setUser] = React.useState(() => {
    const raw = localStorage.getItem("auth_user");
    return raw ? JSON.parse(raw) : null;
  });

  const location = useLocation();

  function login(user = null) {
    setUser(user);
  }

  function logout() {
    setUser(null);
    const refreshToken = localStorage.getItem("auth_refresh_token");
    if (refreshToken) {
      import("./services/auth").then(({ default: AuthService }) => {
        AuthService.logout(refreshToken).catch(() => {});
      });
    }
    localStorage.removeItem("auth_access_token");
    localStorage.removeItem("auth_refresh_token");
    localStorage.removeItem("auth_user");
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <div className="app-root">
      <nav className="topbar">
        <Link to="/restaurants" className="brand">
          Restaurant Reviews
        </Link>

        <div className="nav-links">
          <Link
            to="/restaurants"
            className={`nav-link ${isActive("/restaurants") || location.pathname === "/" ? "active" : ""}`}
            style={
              isActive("/restaurants") || location.pathname === "/"
                ? { color: "var(--text-primary)", background: "var(--gray-100)" }
                : {}
            }
          >
            Restaurants
          </Link>

          {user ? (
            <div className="nav-user">
              <div className="nav-avatar">{getInitials(user.name)}</div>
              <button
                type="button"
                onClick={logout}
                className="nav-link btn-link"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Log in
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
                style={{ padding: "0.4rem 1rem", fontSize: "0.825rem" }}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="app-container">
        <Routes>
          <Route path="/" element={<RestaurantsList />} />
          <Route path="/restaurants" element={<RestaurantsList />} />
          <Route
            path="/restaurants/:id/review"
            element={<AddReview user={user} />}
          />
          <Route
            path="/restaurants/:id"
            element={<Restaurant user={user} />}
          />
          <Route path="/login" element={<Login login={login} />} />
          <Route path="/register" element={<Register login={login} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
