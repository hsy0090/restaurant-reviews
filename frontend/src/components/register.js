import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth";

const Register = (props) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") register();
  };

  const register = async () => {
    if (!form.name || !form.email || !form.password) return;
    setError("");
    setLoading(true);
    try {
      const data = await AuthService.register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("auth_access_token", data.accessToken);
      localStorage.setItem("auth_refresh_token", data.refreshToken);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      props.login(data.user);
      navigate("/");
    } catch (e) {
      setError("Registration failed. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page form-page">
      <div className="form-split">
        <div className="form-card">
          <p className="eyebrow">Get started</p>
          <h1>Create account</h1>
          <p className="subhead">
            Join to save reviews and manage your profile.
          </p>

          <div className="form-group">
            <label className="field-label" htmlFor="name">
              Full name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              required
              value={form.name}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              name="name"
              placeholder="John Doe"
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              required
              value={form.email}
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
              value={form.password}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              name="password"
              placeholder="Create a password"
              autoComplete="new-password"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button
            onClick={register}
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="form-foot">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>

        <aside className="form-aside">
          <h3>What you get</h3>
          <p>
            Track reviews, revisit your favorites, and share trusted
            recommendations.
          </p>
          <div className="aside-tiles">
            <div className="aside-tile">Personal review history</div>
            <div className="aside-tile">Edit or delete reviews</div>
            <div className="aside-tile">Curated suggestions</div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Register;
