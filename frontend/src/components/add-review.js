import React, { useState } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link, useParams, useLocation } from "react-router-dom";

const AddReview = (props) => {
  const { id } = useParams();
  const location = useLocation();

  const currentReview = location.state?.currentReview;

  const editing = !!currentReview;

  const [review, setReview] = useState(
    editing ? currentReview.text : ""
  );
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (event) => {
    setReview(event.target.value);
  };

  const saveReview = () => {
    const data = {
      text: review,
      name: props.user.name,
      user_id: props.user.id,
      restaurant_id: id,
    };

    if (editing) {
      data.review_id = currentReview._id;

      RestaurantDataService.updateReview(data)
        .then((response) => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      RestaurantDataService.createReview(data)
        .then((response) => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <div>
      {props.user ? (
        <div className="page form-page">
          {submitted ? (
            <div className="form-card">
              <p className="eyebrow">All set</p>
              <h4>You submitted successfully!</h4>
              <Link
                to={`/restaurants/${id}`}
                className="btn btn-success"
              >
                Back to Restaurant
              </Link>
            </div>
          ) : (
            <div className="form-split">
              <div className="form-card">
                <p className="eyebrow">{editing ? "Update" : "Share"}</p>
                <h1>{editing ? "Edit your review" : "Write a review"}</h1>
                <p className="subhead">Be specific and helpful. Your words guide the next visit.</p>
                <div className="form-group">
                  <label className="field-label" htmlFor="text">
                    {editing ? "Edit" : "Create"} Review
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="text"
                    required
                    value={review}
                    onChange={handleInputChange}
                    name="text"
                  />
                </div>
                <button onClick={saveReview} className="btn btn-success">
                  Submit
                </button>
              </div>

              <aside className="form-aside">
                <h3>Review tips</h3>
                <p>
                  Mention atmosphere, standout dishes, and service. Concrete details help others decide.
                </p>
                <div className="aside-tiles">
                  <div className="aside-tile">Highlight a favorite dish</div>
                  <div className="aside-tile">Note the vibe</div>
                  <div className="aside-tile">Share value for money</div>
                </div>
              </aside>
            </div>
          )}
        </div>
      ) : (
        <div className="page form-page">
          <div className="form-card">
            <p className="eyebrow">Heads up</p>
            <h4>Please log in.</h4>
            <Link to="/login" className="btn btn-success">
              Go to Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddReview;
