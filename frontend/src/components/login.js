import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const navigate = useNavigate();

  const initialUserState = {
    name: "",
    id: "",
  };

  const [user, setUser] = useState(initialUserState);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const login = () => {
    props.login(user);
    navigate("/");
  };

  return (
    <div className="page form-page">
      <div className="form-split">
        <div className="form-card">
          <p className="eyebrow">Welcome back</p>
          <h1>Log in</h1>
          <p className="subhead">Use your name and ID to continue reviewing.</p>

          <div className="form-group">
            <label className="field-label" htmlFor="name">Username</label>
            <input
              type="text"
              className="form-control"
              id="name"
              required
              value={user.name}
              onChange={handleInputChange}
              name="name"
            />
          </div>

          <div className="form-group">
            <label className="field-label" htmlFor="id">ID</label>
            <input
              type="text"
              className="form-control"
              id="id"
              required
              value={user.id}
              onChange={handleInputChange}
              name="id"
            />
          </div>

          <button onClick={login} className="btn btn-success">
            Login
          </button>
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
