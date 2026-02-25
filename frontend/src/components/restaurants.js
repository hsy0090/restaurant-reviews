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
    reviews: []
  };

  const [restaurant, setRestaurant] = useState(initialRestaurantState);

  const getRestaurant = (id) => {
    RestaurantDataService.get(id)
      .then((response) => {
        setRestaurant(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (id) {
      getRestaurant(id);
    }
  }, [id]);

  const deleteReview = (reviewId, index) => {
    RestaurantDataService.deleteReview(reviewId, props.user.id)
      .then(() => {
        setRestaurant((prev) => ({
          ...prev,
          reviews: prev.reviews.filter((_, i) => i !== index)
        }));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="page">
      {restaurant ? (
        <div>
          <header className="detail-header">
            <div>
              <p className="eyebrow">Restaurant</p>
              <h1>{restaurant.name}</h1>
              <p className="subhead">
                <span className="pill">{restaurant.cuisine}</span>
                <span className="address">
                  {restaurant.address.building} {restaurant.address.street}, {restaurant.address.zipcode}
                </span>
              </p>
            </div>
            <Link
              to={`/restaurants/${id}/review`}
              className="btn btn-primary"
            >
              Add Review
            </Link>
          </header>

          <section className="detail-grid">
            <div className="detail-summary">
              <h4>At a glance</h4>
              <p className="subhead">
                Explore recent feedback and see how this place stacks up.
              </p>
              <div className="summary-card">
                <div>
                  <span className="metric-value">{restaurant.reviews.length}</span>
                  <span className="metric-label">Reviews</span>
                </div>
                <div>
                  <span className="metric-value">Open</span>
                  <span className="metric-label">Status</span>
                </div>
              </div>
            </div>

            <div className="detail-reviews">
              <h4 className="section-title">Reviews</h4>
              <div className="row card-grid">
            {restaurant.reviews.length > 0 ? (
              restaurant.reviews.map((review, index) => (
                <div className="col-lg-4 pb-1" key={index}>
                  <div className="card review-card">
                    <div className="card-body">
                      <p className="card-text">
                        {review.text}<br />
                        <strong>User: </strong>{review.name}<br />
                        <strong>Date: </strong>{review.date}
                      </p>

                      {props.user && props.user.id === review.user_id && (
                        <div className="row restaurant-actions">
                          <button
                            onClick={() => deleteReview(review._id, index)}
                            className="btn btn-primary col-lg-5 mx-1 mb-1"
                          >
                            Delete
                          </button>

                          <Link
                            to={`/restaurants/${id}/review`}
                            state={{ currentReview: review }}
                            className="btn btn-primary col-lg-5 mx-1 mb-1"
                          >
                            Edit
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-sm-4">
                <p>No reviews yet.</p>
              </div>
            )}
          </div>
            </div>
          </section>
        </div>
      ) : (
        <div>
          <br />
          <p>No restaurant selected.</p>
        </div>
      )}
    </div>
  );
};

export default Restaurant;
