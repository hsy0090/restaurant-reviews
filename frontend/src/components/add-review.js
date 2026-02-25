import React, { useState } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link, useParams, useLocation } from "react-router-dom";

const AddReview = (props) => {
  const { id } = useParams();
  const location = useLocation();

  const currentReview = location.state?.currentReview;
  const editing = !!currentReview;

  const [review, setReview] = useState(editing ? currentReview.text : "");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const saveReview = () => {
    if (!review.trim()) return;
    setSaving(true);

    const data = {
      text: review,
      restaurant_id: id,
    };

    const request = editing
      ? RestaurantDataService.updateReview({ ...data, review_id: currentReview._id })
      : RestaurantDataService.createReview(data);

    request
      .then(() => setSubmitted(true))
      .catch((e) => console.log(e))
      .finally(() => setSaving(false));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) saveReview();
  };

  return (
    <div>
      {props.user ? (
        <div className="page form-page">
          {submitted ? (
            <div className="form-card" style={{ textAlign: "center", maxWidth: 420 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "var(--success-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.25rem",
                  fontSize: "1.5rem",
                  color: "var(--success)",
                }}
              >
                &#10003;
              </div>
              <h4 style={{ fontFamily: '"Playfair Display", serif', marginBottom: "0.5rem" }}>
                Review {editing ? "updated" : "submitted"}!
              </h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                Thanks for sharing your experience.
              </p>
              <Link to={`/restaurants/${id}`} className="btn btn-primary">
                Back to Restaurant
              </Link>
            </div>
          ) : (
            <div className="form-split">
              <div className="form-card">
                <p className="eyebrow">{editing ? "Update" : "Share"}</p>
                <h1>{editing ? "Edit your review" : "Write a review"}</h1>
                <p className="subhead">
                  Be specific and helpful. Your words guide the next visitor.
                </p>
                <div className="form-group">
                  <label className="field-label" htmlFor="text">
                    Your review
                  </label>
                  <textarea
                    className="form-control"
                    id="text"
                    required
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    onKeyDown={handleKeyDown}
                    name="text"
                    placeholder="What did you enjoy? How was the food, service, and atmosphere?"
                    rows={5}
                  />
                </div>
                <button
                  onClick={saveReview}
                  className="btn btn-primary"
                  disabled={saving || !review.trim()}
                  style={{ width: "100%" }}
                >
                  {saving ? "Submitting..." : editing ? "Update review" : "Submit review"}
                </button>
              </div>

              <aside className="form-aside">
                <h3>Review tips</h3>
                <p>
                  Mention atmosphere, standout dishes, and service. Concrete
                  details help others decide.
                </p>
                <div className="aside-tiles">
                  <div className="aside-tile">Highlight a favorite dish</div>
                  <div className="aside-tile">Describe the atmosphere</div>
                  <div className="aside-tile">Share value for money</div>
                </div>
              </aside>
            </div>
          )}
        </div>
      ) : (
        <div className="page form-page">
          <div className="form-card" style={{ textAlign: "center", maxWidth: 420 }}>
            <p className="eyebrow">Authentication required</p>
            <h4 style={{ fontFamily: '"Playfair Display", serif', marginBottom: "0.5rem" }}>
              Please log in to write a review
            </h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              You need an account to share reviews.
            </p>
            <Link to="/login" className="btn btn-primary">
              Go to Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddReview;
