import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link, useParams } from "react-router-dom";

const Restaurant = (props) => {
  const { id } = useParams();

  const initialRestaurantState = {
    id: null,
    name: "",
    address: {},
    cuisine: "",
    reviews: [],
  };

  const [restaurant, setRestaurant] = useState(initialRestaurantState);
  const [loading, setLoading] = useState(true);

  const getRestaurant = (id) => {
    setLoading(true);
    RestaurantDataService.get(id)
      .then((response) => {
        setRestaurant(response.data);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (id) getRestaurant(id);
  }, [id]);

  const deleteReview = (reviewId, index) => {
    if (!window.confirm("Delete this review?")) return;
    RestaurantDataService.deleteReview(reviewId)
      .then(() => {
        setRestaurant((prev) => ({
          ...prev,
          reviews: prev.reviews.filter((_, i) => i !== index),
        }));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="page">
        <div className="empty-state">
          <p>Loading restaurant...</p>
        </div>
      </div>
    );
  }

  if (!restaurant || !restaurant.name) {
    return (
      <div className="page">
        <div className="empty-state">
          <h4>Restaurant not found</h4>
          <p>This restaurant doesn't exist or has been removed.</p>
          <Link to="/restaurants" className="btn btn-primary" style={{ marginTop: "1rem" }}>
            Back to Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Detail Hero */}
      <div className="detail-hero">
        <div className="detail-hero-inner">
          <div>
            <p className="eyebrow">Restaurant</p>
            <h1>{restaurant.name}</h1>
            <div className="detail-meta">
              <span className="pill">{restaurant.cuisine}</span>
              <span className="address">
                {restaurant.address.building} {restaurant.address.street},{" "}
                {restaurant.address.zipcode}
              </span>
            </div>
          </div>
          <Link to={`/restaurants/${id}/review`} className="btn btn-primary">
            Write a Review
          </Link>
        </div>
      </div>

      {/* Content Grid */}
      <section className="detail-grid">
        <div className="detail-summary">
          <h4>At a glance</h4>
          <p className="subhead">
            Quick stats about this restaurant.
          </p>
          <div className="summary-card">
            <div>
              <span className="metric-label">Reviews</span>
              <span className="metric-value">{restaurant.reviews.length}</span>
            </div>
            <div>
              <span className="metric-label">Status</span>
              <span className="metric-value" style={{ color: "var(--success)" }}>
                Open
              </span>
            </div>
          </div>
        </div>

        <div className="detail-reviews">
          <h4 className="section-title">
            Reviews ({restaurant.reviews.length})
          </h4>

          {restaurant.reviews.length > 0 ? (
            <div className="card-grid">
              {restaurant.reviews.map((review, index) => (
                <div className="review-card" key={review._id || index}>
                  <div className="review-card-header">
                    <div className="review-avatar">
                      {getInitials(review.name)}
                    </div>
                    <div>
                      <div className="review-author">{review.name}</div>
                      <div className="review-date">
                        {formatDate(review.date)}
                      </div>
                    </div>
                  </div>
                  <p className="review-text">{review.text}</p>

                  {props.user && props.user.id === review.user_id && (
                    <div className="review-actions">
                      <Link
                        to={`/restaurants/${id}/review`}
                        state={{ currentReview: review }}
                        className="btn btn-ghost"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteReview(review._id, index)}
                        className="btn btn-danger-ghost"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h4>No reviews yet</h4>
              <p>Be the first to share your experience.</p>
              <Link
                to={`/restaurants/${id}/review`}
                className="btn btn-primary"
                style={{ marginTop: "1rem" }}
              >
                Write the first review
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Restaurant;
