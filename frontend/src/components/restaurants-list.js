import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link } from "react-router-dom";

const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchZip, setSearchZip] = useState("");
  const [searchCuisine, setSearchCuisine] = useState("");
  const [cuisines, setCuisines] = useState(["All Cuisines"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    retrieveRestaurants();
    retrieveCuisines();
  }, []);

  const retrieveRestaurants = () => {
    setLoading(true);
    RestaurantDataService.getAll()
      .then((response) => {
        setRestaurants(response.data.restaurants);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => setLoading(false));
  };

  const retrieveCuisines = () => {
    RestaurantDataService.getCuisines()
      .then((response) => {
        setCuisines(["All Cuisines"].concat(response.data));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const find = (query, by) => {
    setLoading(true);
    RestaurantDataService.find(query, by)
      .then((response) => {
        setRestaurants(response.data.restaurants);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => setLoading(false));
  };

  const findByName = () => {
    if (searchName.trim()) find(searchName, "name");
  };

  const findByZip = () => {
    if (searchZip.trim()) find(searchZip, "zipcode");
  };

  const findByCuisine = () => {
    if (searchCuisine === "All Cuisines" || !searchCuisine) {
      retrieveRestaurants();
    } else {
      find(searchCuisine, "cuisine");
    }
  };

  const handleKeyDown = (e, searchFn) => {
    if (e.key === "Enter") searchFn();
  };

  const resetFilters = () => {
    setSearchName("");
    setSearchZip("");
    setSearchCuisine("");
    retrieveRestaurants();
  };

  return (
    <div className="page">
      {/* Hero with integrated search */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <h1>Discover your next favorite place to eat.</h1>
            <p className="subhead">
              Browse trusted reviews, filter by cuisine or location, and find the perfect restaurant.
            </p>
            <div className="hero-metrics">
              <div className="metric">
                <span className="metric-value">{restaurants.length}</span>
                <span className="metric-label">Restaurants</span>
              </div>
              <div className="metric">
                <span className="metric-value">{cuisines.length - 1}</span>
                <span className="metric-label">Cuisines</span>
              </div>
            </div>
          </div>

          <div className="hero-panel">
            <h3>Search</h3>
            <p className="subhead">Find by name, zip, or cuisine</p>
            <div className="search-stack">
              <div className="search-field">
                <label className="field-label" htmlFor="search-name">
                  Restaurant name
                </label>
                <div className="input-group">
                  <input
                    id="search-name"
                    type="text"
                    className="form-control"
                    placeholder="e.g. Pasta Palace"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, findByName)}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn"
                      type="button"
                      onClick={findByName}
                    >
                      Go
                    </button>
                  </div>
                </div>
              </div>

              <div className="search-field">
                <label className="field-label" htmlFor="search-zip">
                  Zip code
                </label>
                <div className="input-group">
                  <input
                    id="search-zip"
                    type="text"
                    className="form-control"
                    placeholder="e.g. 10023"
                    value={searchZip}
                    onChange={(e) => setSearchZip(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, findByZip)}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn"
                      type="button"
                      onClick={findByZip}
                    >
                      Go
                    </button>
                  </div>
                </div>
              </div>

              <div className="search-field">
                <label className="field-label" htmlFor="search-cuisine">
                  Cuisine
                </label>
                <div className="input-group">
                  <select
                    id="search-cuisine"
                    className="form-control"
                    value={searchCuisine}
                    onChange={(e) => setSearchCuisine(e.target.value)}
                  >
                    {cuisines.map((cuisine) => (
                      <option key={cuisine} value={cuisine}>
                        {cuisine.length > 22
                          ? cuisine.substring(0, 22) + "..."
                          : cuisine}
                      </option>
                    ))}
                  </select>
                  <div className="input-group-append">
                    <button
                      className="btn"
                      type="button"
                      onClick={findByCuisine}
                    >
                      Go
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="results">
        <div className="results-header">
          <div>
            <h2>Results</h2>
            <p className="results-count">
              {restaurants.length} {restaurants.length === 1 ? "place" : "places"} found
            </p>
          </div>
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={resetFilters}
          >
            Reset filters
          </button>
        </div>

        {loading ? (
          <div className="empty-state">
            <p>Loading restaurants...</p>
          </div>
        ) : (
          <div className="card-grid">
            {restaurants.length === 0 ? (
              <div className="empty-state">
                <h4>No restaurants found</h4>
                <p>Try a different search or reset your filters.</p>
              </div>
            ) : (
              restaurants.map((restaurant) => {
                const address = `${restaurant.address.building} ${restaurant.address.street}, ${restaurant.address.zipcode}`;
                return (
                  <div className="restaurant-card" key={restaurant._id}>
                    <div className="card-top">
                      <h5>{restaurant.name}</h5>
                      <span className="pill">{restaurant.cuisine}</span>
                    </div>
                    <p className="card-address">{address}</p>
                    <div className="restaurant-actions">
                      <Link
                        to={`/restaurants/${restaurant._id}`}
                        className="btn btn-primary"
                      >
                        View Reviews
                      </Link>
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={`https://www.google.com/maps/place/${encodeURIComponent(address)}`}
                        className="btn btn-outline-secondary"
                      >
                        Map
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default RestaurantsList;
