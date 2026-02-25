import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth";

const Login = (props) => {
  const navigate = useNavigate();

  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") login();
  };

  const login = async () => {
    if (!user.email || !user.password) return;
    setError("");
    setLoading(true);
    try {
      const data = await AuthService.login({
        email: user.email,
        password: user.password,
      });
      localStorage.setItem("auth_access_token", data.accessToken);
      localStorage.setItem("auth_refresh_token", data.refreshToken);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      props.login(data.user);
      navigate("/");
    } catch (e) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page form-page">
      <div className="form-split">
        <div className="form-card">
          <p className="eyebrow">Welcome back</p>
          <h1>Log in</h1>
          <p className="subhead">Sign in to manage your reviews.</p>

          <div className="form-group">
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              required
              value={user.email}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              required
              value={user.password}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button
            onClick={login}
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="form-foot">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </div>

        <aside className="form-aside">
          <h3>Why create an account?</h3>
          <p>
            Save your favorites, edit your reviews, and keep your food journey
            organized.
          </p>
          <div className="aside-tiles">
            <div className="aside-tile">Share honest reviews</div>
            <div className="aside-tile">Keep a personal history</div>
            <div className="aside-tile">Find new cuisines</div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Login;
