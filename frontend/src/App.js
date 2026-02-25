import React from "react";
import { Routes, Route, Link } from "react-router-dom";
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

  return (
    <div className="app-root">
      <nav className="navbar navbar-expand topbar">
        <Link to="/restaurants" className="navbar-brand brand">
          Restaurant Reviews
        </Link>

        <div className="navbar-nav nav-links">
          <li className="nav-item">
            <Link to="/restaurants" className="nav-link">
              Restaurants
            </Link>
          </li>

          <li className="nav-item">
            {user ? (
              <button type="button" onClick={logout} className="nav-link btn-link">
                Logout {user.name}
              </button>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </>
            )}
          </li>
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

          <Route
            path="/login"
            element={<Login login={login} />}
          />
          <Route
            path="/register"
            element={<Register login={login} />}
          />

        </Routes>
      </main>
    </div>
  );
}

export default App;
