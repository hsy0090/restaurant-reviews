import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth";

const Login = (props) => {
  const navigate = useNavigate();

  const initialUserState = {
    email: "",
    password: "",
  };

  const [user, setUser] = useState(initialUserState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const login = async () => {
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
          <p className="subhead">Use your name and ID to continue reviewing.</p>

          <div className="form-group">
          <label className="field-label" htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            required
            value={user.email}
            onChange={handleInputChange}
            name="email"
          />
        </div>

        <div className="form-group">
          <label className="field-label" htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            required
            value={user.password}
            onChange={handleInputChange}
            name="password"
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button onClick={login} className="btn btn-success" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="form-foot">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>

      <aside className="form-aside">
          <h3>Why create an account?</h3>
          <p>
            Save your favorite restaurants, edit your reviews, and keep your food journey organized.
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
